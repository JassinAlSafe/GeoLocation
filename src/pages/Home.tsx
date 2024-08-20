import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLocationClick = () => {
    navigate("./location");
  };

  const handleCameraClick = () => {
    navigate("/camera");
  };

  const handleShuiWriteClick = () => {
    navigate("/shuiwrite");
  };

  const handleTrafikLabClick = () => {
    navigate("/trafiklab");
  };

  return (
    <div className="home">
      <h1 className="title">Web Api</h1>
      <div className="button-links">
        <button className="location-button" onClick={handleLocationClick}>
          Get Location
        </button>
        <button className="camera-button" onClick={handleCameraClick}>
          Get Camera
        </button>
        <button className="shuiwrite-button" onClick={handleShuiWriteClick}>
          Shui Write
        </button>
        <button className="trafiklab-button" onClick={handleTrafikLabClick}>
          TrafikLab
        </button>
      </div>
    </div>
  );
};

export default Home;
