import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/Location.css"; // Import the CSS file

export default function Location() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting user location", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );

      // Cleanup function to stop watching the position when the component unmounts
      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
      console.error("Geolocation is not supported by this browser");
    }
  }, []);

  return (
    <div>
      <h1>Live Geolocation App</h1>
      {userLocation ? (
        <div>
          <h2>Latitude: {userLocation.latitude}</h2>
          <h2>Longitude: {userLocation.longitude}</h2>
          <MapContainer
            center={[userLocation.latitude, userLocation.longitude]}
            zoom={13}
            className="map-container" // Apply the CSS class
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
              <Popup>
                You are here: {userLocation.latitude}, {userLocation.longitude}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p>Getting location...</p>
      )}
    </div>
  );
}