import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CameraStream.css"; // import CSS

function CameraStream() {
  const [locations, setLocations] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("");
  const [rooms, setRooms] = useState({});
  const [selectedRoom, setSelectedRoom] = useState("");

  const backendUrl = localStorage.getItem("backendUrl");
  const navigate = useNavigate(); // hook navigate

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    const res = await axios.get(`${backendUrl}/cameras`);
    let cams = res.data.cameras;

    let locMap = {};
    cams.forEach((cam) => {
      if (!locMap[cam.location]) locMap[cam.location] = [];
      locMap[cam.location].push(cam);
    });

    setLocations(locMap);

    let first = Object.keys(locMap)[0];
    setSelectedLocation(first);
    updateRooms(first, locMap);
  };

  const updateRooms = (loc, map = locations) => {
    let roomMap = {};
    map[loc].forEach((cam) => {
      roomMap[cam.room] = cam;
    });
    setRooms(roomMap);

    let first = Object.keys(roomMap)[0];
    setSelectedRoom(first);
  };

  return (
    <div className="camera-stream-container">
      <h2>Camera Stream</h2>

      {/* Nút quay lại Dashboard */}
      <button
        className="btn-back"
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "15px" }}
      >
        &larr; Back to Dashboard
      </button>

      <div className="camera-controls">
        <select
          value={selectedLocation}
          onChange={(e) => {
            setSelectedLocation(e.target.value);
            updateRooms(e.target.value);
          }}
        >
          {Object.keys(locations).map((loc) => (
            <option key={loc}>{loc}</option>
          ))}
        </select>

        <select
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          {Object.keys(rooms).map((room) => (
            <option key={room}>{room}</option>
          ))}
        </select>
      </div>

      {selectedRoom && (
        <img src={rooms[selectedRoom]?.stream_url} alt="Camera Stream" />
      )}
    </div>
  );
}

export default CameraStream;
