import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const AdminDashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [role, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <p className="fs-5 text-secondary">Checking access...</p>
      </div>
    );
  }

  return (
    <div className="d-flex vh-100 bg-light">
      {/* Sidebar */}
      <Sidebar isExpanded={isSidebarExpanded} setIsExpanded={setIsSidebarExpanded} />

      {/* Main Content (Shifts Right When Sidebar Expands) */}
      <div
        className="p-4 flex-grow-1"
        style={{
          marginLeft: isSidebarExpanded ? "250px" : "60px", // Shift content when sidebar expands
          width: isSidebarExpanded ? "calc(100% - 250px)" : "calc(100% - 60px)", // Adjust width dynamically
          transition: "all 0.3s ease-in-out",
        }}
      >
        <h1 className="fw-bold text-success">Admin Dashboard</h1>
        <p className="mt-2 text-secondary">Welcome to the admin dashboard!</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
