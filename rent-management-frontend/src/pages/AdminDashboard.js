import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // Import Sidebar
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role, navigate]);

  if (role !== "admin") {
    return null;
  }

  return (
    <div className="dashboard-container">
      <Sidebar /> {/* Sidebar Added */}
      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>
        <p>Welcome to the admin dashboard!</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
