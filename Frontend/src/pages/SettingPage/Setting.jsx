import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const Setting = () => {
    const navigate = useNavigate();

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

                {/* Settings Management Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {/* Update VAT Rate */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Update VAT Rate</h2>
                        <p className="text-gray-700 mb-4">Modify the VAT rate applied to all shops.</p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
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
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/manage-roles")}
                        >
                            Manage Roles
                        </button>
                    </div>

                    {/* System Logs */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">View System Logs</h2>
                        <p className="text-gray-700 mb-4">Monitor activity logs for security and compliance.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
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
