import React, { useEffect, useState } from "react";
import { FaChartBar, FaClock, FaMoneyBillWave, FaStore, FaUsers } from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import api from "../utils/axiosInstance";

const AdminDashboard = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await api.get("/api/summery/summary");
                setSummary(response.data);
            } catch (error) {
                console.error("Error fetching summary:", error);
                setError("Failed to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen text-gray-700 text-lg">Loading...</div>;
    }

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500 text-lg">{error}</div>;
    }

    // Calculate Pending Collection
    const pendingCollection = parseFloat(summary.rentSums.total_rent_amount) - parseFloat(summary.rentSums.total_rent_paid);

    // Invoice Data for Pie Chart
    const invoiceData = [
        { name: "Paid", value: parseInt(summary.invoiceCounts.paid_count), color: "#4CAF50" },
        { name: "Unpaid", value: parseInt(summary.invoiceCounts.unpaid_count), color: "#F44336" },
        { name: "Partially Paid", value: parseInt(summary.invoiceCounts.partial_count), color: "#2196F3" },
        { name: "Arrest", value: parseInt(summary.invoiceCounts.arrest_count), color: "#FF9800" }
    ];

    // Summary Stats
    const stats = [
        { title: "Total Tenants", value: summary.tenantCount, icon: <FaUsers className="text-3xl text-blue-500" /> },
        { title: "Total Shops", value: summary.shopCount, icon: <FaStore className="text-3xl text-green-500" /> },
        { title: "Total Rent Amount", value: `LKR ${summary.rentSums.total_rent_amount}`, icon: <FaMoneyBillWave className="text-3xl text-purple-500" /> },
        { title: "Total Rent Paid", value: `LKR ${summary.rentSums.total_rent_paid}`, icon: <FaChartBar className="text-3xl text-orange-500" /> },
        { title: "Total VAT Amount", value: `LKR ${summary.vatSums.total_vat_amount}`, icon: <FaChartBar className="text-3xl text-blue-500" /> },
        { title: "Total VAT Paid", value: `LKR ${summary.vatSums.total_vat_paid}`, icon: <FaChartBar className="text-3xl text-indigo-500" /> },
        { title: "Total Fines", value: `LKR ${summary.fineSums.total_fine_amount}`, icon: <FaClock className="text-3xl text-red-500" /> },
        { title: "Total Fine Paid", value: `LKR ${summary.fineSums.total_fine_paid}`, icon: <FaClock className="text-3xl text-orange-500" /> },
        { title: "Pending Collection", value: `LKR ${pendingCollection.toFixed(2)}`, icon: <FaClock className="text-3xl text-yellow-500" /> },
        { title: "Total Shop Balance", value: `LKR ${summary.shopBalanceSum.total_shop_balance}`, icon: <FaMoneyBillWave className="text-3xl text-green-500" /> }
    ];

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar (Sliding without Scroll) */}
            <Sidebar className="w-64 flex-shrink-0" />
            
            {/* Main Content */}
            <div className="flex-1 p-6 overflow-y-auto">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600 mt-2">Track and manage financial performance.</p>

                {/* Summary Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
                            {stat.icon}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">{stat.value}</h2>
                                <p className="text-gray-600">{stat.title}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invoice Summary Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={invoiceData}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {invoiceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
