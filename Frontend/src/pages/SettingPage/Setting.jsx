import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import api from "../../utils/axiosInstance";

const Setting = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");

    const handleApiCall = async (endpoint, successMsg, errorMsg) => {
        if (!token) {
            toast.error("Unauthorized! Please log in.");
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(endpoint, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success(response.data.message || successMsg);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateInvoices = () =>
        handleApiCall("/api/generateInvoices/generate-all", "Invoices generated!", "Failed to generate invoices.");

    const handleApplyFines = () =>
        handleApiCall("/api/settings/apply-fines", "Fines applied successfully!", "Failed to apply fines.");

    const handleFineArrest = () =>
        handleApiCall("/api/settings/fine-arrest-action", "Fine arrest applied!", "Failed to apply fine arrest.");

    const handleInvoiceArrest = () =>
        handleApiCall("/api/settings/invoice-arrest-action", "Invoice arrest applied!", "Failed to apply invoice arrest.");

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

                {/* Settings Grid */}
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

                    {/* Apply Fines */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Apply Fines</h2>
                        <p className="text-gray-700 mb-4">Automatically apply fines for overdue invoices.</p>
                        <button
                            className={`py-2 px-4 rounded-lg text-white w-full ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-yellow-500 hover:bg-yellow-600"
                            }`}
                            onClick={handleApplyFines}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Apply Fines"}
                        </button>
                    </div>

                    {/* Fine Arrest Action */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Fine Arrest Action</h2>
                        <p className="text-gray-700 mb-4">Mark overdue fines as Arrest after 30 days.</p>
                        <button
                            className={`py-2 px-4 rounded-lg text-white w-full ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
                            }`}
                            onClick={handleFineArrest}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Apply Fine Arrest"}
                        </button>
                    </div>

                    {/* Invoice Arrest Action */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Invoice Arrest Action</h2>
                        <p className="text-gray-700 mb-4">Mark invoices and related records as Arrest if overdue.</p>
                        <button
                            className={`py-2 px-4 rounded-lg text-white w-full ${
                                loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-500 hover:bg-purple-600"
                            }`}
                            onClick={handleInvoiceArrest}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Apply Invoice Arrest"}
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
