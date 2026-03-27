import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate
import Webcam from "react-webcam";
import { detectFacesAPI, saveFacesAPI } from "../services/api";
import "../styles/RegisterFace.css"; // import CSS

function RegisterFace() {
  const webcamRef = useRef(null);
  const navigate = useNavigate(); // hook navigate

  const [detectedFaces, setDetectedFaces] = useState([]);
  const [currentFaceIdx, setCurrentFaceIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [successMsg, setSuccessMsg] = useState(""); // thông báo đăng ký thành công

  // Capture webcam frame và gửi request
  const handleCapture = async () => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then((r) => r.blob());
    setLoading(true);
    setSuccessMsg(""); // reset thông báo

    try {
      const faces = await detectFacesAPI(blob);

      if (faces.length === 0) {
        alert("No faces detected");
        setDetectedFaces([]);
        return;
      }

      const facesWithName = faces.map((f) => ({ ...f, name: "" }));
      setDetectedFaces(facesWithName);
      setCurrentFaceIdx(0);
      setNameInput("");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Register face hiện tại
  const handleRegister = async () => {
    if (!detectedFaces.length) return;

    const face = { ...detectedFaces[currentFaceIdx], name: nameInput.trim() };
    if (!face.name) {
      alert("Please enter a name first!");
      return;
    }

    try {
      await saveFacesAPI([face]); // chỉ gọi API
      setSuccessMsg("Đăng ký thành công!"); // hiển thị thông báo xanh
    } catch (err) {
      alert(err.message);
      return;
    }

    handleNextFace();
  };

  // Skip face hiện tại
  const handleSkip = () => {
    handleNextFace();
  };

  // Hiển thị face tiếp theo hoặc reset
  const handleNextFace = () => {
    const remaining = [...detectedFaces];
    remaining.splice(currentFaceIdx, 1); // remove current face
    setDetectedFaces(remaining);

    if (remaining.length > 0) {
      setCurrentFaceIdx(0);
      setNameInput("");
    } else {
      setCurrentFaceIdx(0);
      setNameInput("");
    }
  };

  // face hiện tại
  const currentFace =
    detectedFaces.length > 0 ? detectedFaces[currentFaceIdx] : null;

  return (
    <div className="register-face-container">
      {/* Nút Back to Dashboard */}
      <button
        className="btn-back"
        onClick={() => navigate("/dashboard")}
        style={{ marginBottom: "15px" }}
      >
        &larr; Back to Dashboard
      </button>

      {/* Screen 1 */}
      <div className="screen screen-1">
        <h2>Camera</h2>
        <Webcam
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width="100%"
          videoConstraints={{ facingMode: "user" }}
        />
        <button onClick={handleCapture} disabled={loading}>
          {loading ? "Detecting..." : "Capture"}
        </button>
      </div>

      {/* Screen 2 */}
      <div
        className={`screen screen-2 ${
          detectedFaces.length === 0 ? "disabled" : ""
        }`}
      >
        <h2>Detected Face</h2>

        <div className="face-preview">
          {currentFace ? (
            <img
              src={`data:image/jpeg;base64,${currentFace.image}`}
              alt="Detected"
            />
          ) : (
            <div className="face-placeholder">No face</div>
          )}
        </div>

        {/* Controls */}
        <div className="face-controls">
          <input
            type="text"
            placeholder="Enter Name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            disabled={!detectedFaces.length}
          />
          <button
            onClick={handleRegister}
            disabled={!detectedFaces.length}
            className="btn-primary"
          >
            Register
          </button>
          <button
            onClick={handleSkip}
            disabled={!detectedFaces.length}
            className="btn-secondary"
          >
            Skip
          </button>
        </div>

        {/* Success Message */}
        {successMsg && <div className="success-msg">{successMsg}</div>}
      </div>
    </div>
  );
}

export default RegisterFace;
