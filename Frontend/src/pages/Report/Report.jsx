import React from "react";
import Sidebar from "../../components/Sidebar";

const Report = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-8 w-full overflow-auto">
        <div className="text-3xl font-semibold mb-8">
          <h1>Reports</h1>
          <p className="text-lg text-gray-500">Manage system reports</p>
        </div>

       
      </div>
    </div>
  );
};

export default Report;
