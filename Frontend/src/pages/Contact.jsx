import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      {/* Back to Home Link */}
      <Link to="/" className="absolute top-4 left-4 font-medium">
        &lt; Back to Home Page
      </Link>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">Contact</h1>

      <div className="bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center max-w-sm w-full">
        <img
          src="https://via.placeholder.com/150"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover mb-6 border-4 border-blue-500"
        />

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold">Chris Wijerathna</h2>
          <p className="font-medium">Manager</p>
          <div className="mt-4 text-gray-600 text-sm space-y-1">
            <p>Email: <a href="mailto:dambulladec@gmail.com" className="text-blue-500 hover:underline">dambulladec@gmail.com</a></p>
            <p>Phone: <a href="tel:+94662285181" className="text-blue-500 hover:underline">+94 66 228 5181</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
