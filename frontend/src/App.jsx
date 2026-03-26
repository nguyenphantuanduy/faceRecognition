import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import RegisterFace from "./pages/RegisterFace";
import CameraStream from "./pages/CameraStream";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/register" element={<RegisterFace />} />

        <Route path="/stream" element={<CameraStream />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
