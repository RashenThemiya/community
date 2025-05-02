// src/pages/Contact.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Contact = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Contact Page Content */}
      <div className="flex justify-center items-center min-h-screen py-10">
        <div className="bg-white shadow-xl rounded-3xl p-8 max-w-lg w-full mx-auto flex flex-col items-center space-y-8">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Contact Us</h1>

          {/* Profile Image */}
          <img
            src="https://via.placeholder.com/150"
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-blue-500"
          />

          <div className="text-center space-y-4">
            <h2 className="text-3xl font-semibold text-gray-800">Chris Wijerathna</h2>
            <p className="text-lg font-medium text-gray-600">Manager</p>

            <div className="space-y-2">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-blue-500">+94 66 228 5181</span>
              </p>
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Email:</span>{" "}
                <span className="text-blue-500">dambulladec@gmail.com</span>
              </p>
            </div>

            {/* Address Section */}
            <div className="space-y-4 mt-8">
              <p className="text-lg text-gray-700">
                <span className="font-semibold">Office Address:</span>
                <span className="text-gray-600"> 123 Business St., City, Country</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-white py-4 text-center w-full">
        <p>&copy; 2025 Precious Center. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Contact;
