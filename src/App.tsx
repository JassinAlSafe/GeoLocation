import "./index.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Location from "./pages/Location";
import CameraPage from "./pages/camerapage";
import ShuiWrite from "./pages/ShuiWrite";
import MessagePage from "./pages/MessagePage";
import TrafikLab from "./pages/TrafikLab"

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/location" element={<Location />} />
        <Route path="/camera" element={<CameraPage />} />
        <Route path="/shuiwrite" element={<ShuiWrite />} />
        <Route path="/message" element={<MessagePage />} />
        <Route path="/trafiklab" element={<TrafikLab />} />

      </Routes>
    </div>
  );
}

export default App;
