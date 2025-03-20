import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar"; // Import Navbar

const Home = () => {
  return (
    <div>
      <Navbar /> {/* Include Navbar here */}
      <h1>Welcome to the Admin Dashboard</h1>
      <p>Click below to log in:</p>
      <Link to="/login">
        <button>Login</button>
      </Link>
    </div>
  );
};

export default Home;
