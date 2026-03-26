import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Dashboard</h2>

      <button onClick={() => navigate("/register")}>Register Face</button>

      <button onClick={() => navigate("/stream")}>Cam Server Stream</button>
    </div>
  );
}

export default Dashboard;
