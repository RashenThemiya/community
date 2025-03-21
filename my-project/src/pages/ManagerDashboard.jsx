import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ManagerDashboard = () => {
  const { role } = useAuth();
  const navigate = useNavigate();

  // Use useEffect for conditional redirection
  useEffect(() => {
    if (role !== "superadmin") {
      navigate("/"); // Redirect to the home page if not superadmin
    }
  }, [role, navigate]);

  return (
    <div>
      <h1>Manager Dashboard</h1>
      <p>Welcome to the manager dashboard!</p>
    </div>
  );
};

export default ManagerDashboard;
