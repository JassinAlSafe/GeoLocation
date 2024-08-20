import { useRef, useState } from "react";
import "../styles/CameraPage.css";

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error accessing the camera", error);
      }
    } else {
      console.error("Camera is not supported by this browser");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();

      tracks.forEach((track) => {
        track.stop();
      });

      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL("image/png");
        setCapturedImage(image);
      }
    }
  };

  return (
    <div className="camera-main">
      <h1>Camera App</h1>
      {!isCameraOn ? (
        <button onClick={startCamera}>Start Camera</button>
      ) : (
        <button onClick={stopCamera}>Stop Camera</button>
      )}
      <div>
        <video ref={videoRef} style={{ width: "100%", maxHeight: "400px" }} />
      </div>
      {isCameraOn && (
        <button onClick={captureImage} style={{ marginTop: "10px" }}>
          Capture Image
        </button>
      )}
      <canvas
        ref={canvasRef}
        style={{ display: "none" }}
        width="400"
        height="800"
      />
      {capturedImage && (
        <div>
          <h2>Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured"
            style={{ width: "100%", maxHeight: "800px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraPage;
