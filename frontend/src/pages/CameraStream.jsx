import { useState, useEffect } from "react";
import axios from "axios";

function CameraStream() {
  const [locations, setLocations] = useState({});
  const [selectedLocation, setSelectedLocation] = useState("");
  const [rooms, setRooms] = useState({});
  const [selectedRoom, setSelectedRoom] = useState("");

  const backendUrl = localStorage.getItem("backendUrl");

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    const res = await axios.get(`${backendUrl}/cameras`);

    let cams = res.data.cameras;

    let locMap = {};

    cams.forEach((cam) => {
      if (!locMap[cam.location]) {
        locMap[cam.location] = [];
      }

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
    <div>
      <h2>Camera Stream</h2>

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

      {selectedRoom && (
        <img src={rooms[selectedRoom]?.stream_url} width="500" />
      )}
    </div>
  );
}

export default CameraStream;
