import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const TenantManagement = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="p-8 w-full overflow-auto">
                <div className="text-3xl font-semibold mb-8">
                    <h1>Tenant Management</h1>
                    <p className="text-lg text-gray-500">Manage tenants efficiently</p>
                </div>

                {/* Tenant Management Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    
                    {/* Add New Tenant */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Add New Tenant</h2>
                        <p className="text-gray-700 mb-4">Register a new tenant and assign them to a shop.</p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                            onClick={() => navigate("/add-tenant")}
                        >
                            Add Tenant
                        </button>
                    </div>

                    {/* Edit Tenant Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Edit Tenant</h2>
                        <p className="text-gray-700 mb-4">Modify tenant information.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/edit-tenants")}
                        >
                            Edit Tenant
                        </button>
                    </div>

                    {/* View All Tenants */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">View All Tenants</h2>
                        <p className="text-gray-700 mb-4">See the complete list of tenants and their assigned shops.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/view-tenants")}
                        >
                            View Tenants
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantManagement;
