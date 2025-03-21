import React from "react";
import Navbar from "../components/Navbar"; // Ensure correct import

const Home = () => {
  return (
    <div>
      <Navbar />  {/* Ensure Navbar is correctly imported and exists */}
      <div className="container text-center mt-5">
        <h1 className="text-3xl font-bold text-blue-600">Welcome to the Home Page</h1>
        <p className="text-gray-600">This is the starting point of your application.</p>
      </div>
    </div>
  );
};

export default Home;
