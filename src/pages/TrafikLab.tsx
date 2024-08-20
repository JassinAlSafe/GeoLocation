import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "../styles/TrafikLab.css";

const API_KEY = "70a6113a-82a3-4733-a2e7-fdc01bbe4245";

interface Location {
  latitude: number;
  longitude: number;
}

interface Stop {
  extId: string;
  name: string;
  latitude: number;
  longitude: number;
}

interface StopLocation {
  extId: string;
  name: string;
  lat: number;
  lon: number;
}

interface StopLocationOrCoordLocation {
  StopLocation?: StopLocation;
}

interface ApiResponse {
  stopLocationOrCoordLocation: StopLocationOrCoordLocation[];
}

interface TimetableEntry {
  journeyNumber: string;
  name: string;
  direction: string;
  time: string;
  operator: string;
}

interface TimetableResponse {
  Departure: {
    journeyNumber: string;
    name: string;
    time: string;
  }[];
}

const TrafikLab: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [nearbyStops, setNearbyStops] = useState<Stop[]>([]);
  const [selectedStop, setSelectedStop] = useState<Stop | null>(null);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
          fetchNearbyStops(latitude, longitude);
        },
        (error) => {
          console.error("Error getting user location", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []);

  const fetchNearbyStops = async (latitude: number, longitude: number) => {
    const url = `https://api.resrobot.se/v2.1/location.nearbystops?originCoordLat=${latitude}&originCoordLong=${longitude}&format=json&accessId=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      console.log("Nearby stops", data);

      setNearbyStops(
        data.stopLocationOrCoordLocation
          .filter((stop) => stop.StopLocation)
          .map((stop) => ({
            extId: stop.StopLocation!.extId,
            name: stop.StopLocation!.name,
            latitude: stop.StopLocation!.lat,
            longitude: stop.StopLocation!.lon,
          }))
      );
    } catch (error) {
      console.error("Error fetching nearby stops", error);
    }
  };

  const fetchTimetable = async (stopId: string) => {
    const url = `https://api.resrobot.se/v2.1/departureBoard?id=${stopId}&format=json&accessId=${API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TimetableResponse = await response.json();
      console.log("Timetable", data);

      if (!data.Departure || !Array.isArray(data.Departure)) {
        console.error("No valid timetable data available.");
        setTimetable([]); // Clear previous timetables if no data is available
        return;
      }

      // Get the current time
      const currentTime = new Date();

      // Filter entries for the next 30 minutes
      const filteredTimetable = data.Departure.filter((entry) => {
        const entryTime = new Date(); // Create a new Date object for the current day
        const [hours, minutes, seconds] = entry.time.split(":").map(Number);
        entryTime.setHours(hours, minutes, seconds || 0);

        // Calculate the time difference in minutes
        const timeDifference =
          (entryTime.getTime() - currentTime.getTime()) / (1000 * 60);

        // Return true if the entry is within the next 30 minutes
        return timeDifference >= 0 && timeDifference <= 30;
      });

      setTimetable(
        filteredTimetable.map((entry) => ({
          journeyNumber: entry.journeyNumber,
          name: entry.name,
          time: entry.time,
          operator: "", 
          direction: entry.direction, 
        }))
      );
    } catch (error) {
      console.error("Error fetching timetable", error);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title-app">Pendlaren</h1>
      {userLocation ? (
        <MapContainer
          center={[userLocation.latitude, userLocation.longitude]}
          zoom={13}
          className="map"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
            icon={L.icon({
              iconUrl:
                "https://leafletjs.com/examples/custom-icons/leaf-green.png",
              iconSize: [38, 95],
              iconAnchor: [22, 94],
              popupAnchor: [-3, -76],
              shadowUrl:
                "https://leafletjs.com/examples/custom-icons/leaf-shadow.png",
              shadowSize: [50, 64],
              shadowAnchor: [4, 62],
            })}
          >
            <Popup>You are here</Popup>
          </Marker>
          {nearbyStops.map((stop) => (
            <Marker
              key={stop.extId}
              position={[stop.latitude, stop.longitude]}
              eventHandlers={{
                click: () => {
                  setSelectedStop(stop);
                  fetchTimetable(stop.extId);
                },
              }}
            >
              <Popup>{stop.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Getting location...</p>
      )}
      {selectedStop && timetable.length > 0 && (
        <div className="timetable">
          <h3 className="timetable-title">Timetable for {selectedStop.name} (Next 30 Minutes)</h3>
          <ul>
            {timetable.map((entry, index) => (
              <li key={`${entry.journeyNumber || index}-${entry.time}`}>
                {entry.name} - {entry.direction} - {entry.time} 
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TrafikLab;
