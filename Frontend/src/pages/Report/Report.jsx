import React from "react";
import Sidebar from "../../components/Sidebar";

const Report = () => {
    const handleDownload = () => {
        window.open(`${import.meta.env.VITE_API_BASE_URL}/api/report/current-month-income`, "_blank");
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex justify-center items-center flex-1 p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Download Report</h2>
                    <p className="text-gray-600 text-center mb-6">Download current month's income report as Excel</p>

                    <button
                        onClick={handleDownload}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Download Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Report;
