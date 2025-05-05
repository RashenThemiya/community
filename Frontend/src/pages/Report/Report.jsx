import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";

const Report = () => {
    const today = new Date();
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [year, setYear] = useState(today.getFullYear());

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const handleDownloadReport1 = () => {
        const url = `${baseUrl}/api/report/monthly-income?month=${month}&year=${year}`;
        window.open(url, "_blank");
    };

    const handleDownloadReport2 = () => {
        const url = `${baseUrl}/api/report2/monthly-income?month=${month}&year=${year}`;
        window.open(url, "_blank");
    };

    const handleDownloadReport3 = () => {
        const url = `${baseUrl}/api/report3/monthly-income?month=${month}&year=${year}`;
        window.open(url, "_blank");
    };

    const getMonthOptions = () => {
        return Array.from({ length: 12 }, (_, i) => {
            const value = i + 1;
            const name = new Date(0, value - 1).toLocaleString("default", { month: "long" });
            return <option key={value} value={value}>{name}</option>;
        });
    };

    const getYearOptions = () => {
        const currentYear = today.getFullYear();
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 2; i++) {
            years.push(i);
        }
        return years.map((yr) => <option key={yr} value={yr}>{yr}</option>);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
           <div><Sidebar /></div> 

            <div className="flex justify-center items-center flex-1 p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-4 text-center">Download Monthly Income Report</h2>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Select Month:</label>
                        <select
                            value={month}
                            onChange={(e) => setMonth(parseInt(e.target.value))}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            {getMonthOptions()}
                        </select>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-1">Select Year:</label>
                        <select
                            value={year}
                            onChange={(e) => setYear(parseInt(e.target.value))}
                            className="w-full border rounded-md px-3 py-2"
                        >
                            {getYearOptions()}
                        </select>
                    </div>

                    {/* Download Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleDownloadReport1}
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Download Report 1
                        </button>

                        <button
                            onClick={handleDownloadReport2}
                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-300"
                        >
                            Download Report 2
                        </button>

                        <button
                            onClick={handleDownloadReport3}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                        >
                            Download Report 3
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Report;
