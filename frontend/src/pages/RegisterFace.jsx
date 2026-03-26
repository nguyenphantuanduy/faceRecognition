import Webcam from "react-webcam";
import { useRef } from "react";

import { detectFacesAPI, saveFacesAPI } from "../services/api";

function RegisterFace() {
  const webcamRef = useRef(null);

  const capture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();

    const blob = await fetch(imageSrc).then((r) => r.blob());

    try {
      const faces = await detectFacesAPI(blob);

      if (faces.length === 0) {
        alert("No faces detected");
        return;
      }

      let payload = [];

      for (let face of faces) {
        let name = prompt("Enter name");

        if (!name) continue;

        payload.push({
          face_id: face.face_id,
          name: name,
          cam_server_id: "server1",
        });
      }

      const result = await saveFacesAPI(payload);

      alert("Saved IDs: " + result.saved_ids);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Register Face</h2>

      <Webcam ref={webcamRef} screenshotFormat="image/jpeg" />

      <button onClick={capture}>Capture Face</button>
    </div>
  );
}

export default RegisterFace;
