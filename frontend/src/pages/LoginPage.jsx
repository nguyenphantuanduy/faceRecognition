import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api";
import "../styles/Login.css";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (username !== "TuanDuy" || password !== "12345") {
      alert("Invalid account");
      return;
    }

    try {
      const servers = await loginAPI(username);

      if (servers.length === 0) {
        alert("No camera servers");
        return;
      }

      localStorage.setItem("backendUrl", servers[0].url);

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card card">
        <h2 className="login-title">SmartHome Login</h2>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-primary login-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
