import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance"; // <-- Use your axios instance

const Setting = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Handle invoice generation
    const handleGenerateInvoices = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Unauthorized! Please log in.");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            // API call to generate invoices
            const response = await api.post("/api/generateInvoices/generate-all", {}, {
                headers: {
                    Authorization: `Bearer ${token}` // Pass token in headers
                }
            });
            toast.success(response.data.message || "Invoices generated successfully!");
            console.log("Generated invoices:", response.data.results);
        } catch (error) {
            console.error("Error generating invoices:", error);
            toast.error(error.response?.data?.message || "Failed to generate invoices.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="p-8 w-full overflow-auto">
                <div className="text-3xl font-semibold mb-8">
                    <h1>Settings</h1>
                    <p className="text-lg text-gray-500">Manage system settings</p>
                </div>

                {/* Settings Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {/* Update VAT Rate */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Update VAT Rate</h2>
                        <p className="text-gray-700 mb-4">Modify the VAT rate applied to all shops.</p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full"
                            onClick={() => navigate("/update-vat-rate")}
                        >
                            Update VAT
                        </button>
                    </div>

                    {/* Manage User Roles */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Manage User Roles</h2>
                        <p className="text-gray-700 mb-4">Assign roles and permissions for users.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full"
                            onClick={() => navigate("/manage-roles")}
                        >
                            Manage Roles
                        </button>
                    </div>

                    {/* Generate Invoices */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Generate Invoices</h2>
                        <p className="text-gray-700 mb-4">Generate monthly invoices for all shops.</p>
                        <button
                            className={`py-2 px-4 rounded-lg text-white w-full ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
                            }`}
                            onClick={handleGenerateInvoices}
                            disabled={loading}
                        >
                            {loading ? "Generating..." : "Generate Invoices"}
                        </button>
                    </div>

                    {/* System Logs */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">View System Logs</h2>
                        <p className="text-gray-700 mb-4">Monitor activity logs for security and compliance.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full"
                            onClick={() => navigate("/system-logs")}
                        >
                            View Logs
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;
