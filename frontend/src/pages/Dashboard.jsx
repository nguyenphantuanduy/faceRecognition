import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; // <-- import đúng đường dẫn

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      <div className="dashboard-card card">
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="dashboard-buttons">
          <button
            className="btn-primary dashboard-btn"
            onClick={() => navigate("/register")}
          >
            Register Face
          </button>

          <button
            className="btn-primary dashboard-btn"
            onClick={() => navigate("/stream")}
          >
            Cam Server Stream
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
