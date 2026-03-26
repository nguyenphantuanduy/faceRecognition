import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../services/api";

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
    <div>
      <h2>SmartHome Login</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
