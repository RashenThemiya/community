import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const ViewTenants = () => {
    const navigate = useNavigate();
    const [tenants, setTenants] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all tenants from the backend
    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await api.get("/api/tenants");
                setTenants(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch tenants.");
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    // Filtered tenants based on search query (by Tenant ID)
    const filteredTenants = tenants.filter((tenant) =>
        tenant.tenant_id.toString().includes(searchQuery.toLowerCase())
    );

    // Handle edit tenant action
    const handleEditTenant = (tenantId) => {
        navigate(`/edit-tenant/${tenantId}`);
    };

    // Handle delete tenant action
    const handleDeleteTenant = async (tenantId) => {
        const confirmation = window.confirm("Are you sure you want to delete this tenant?");
        if (confirmation) {
            try {
                await api.delete(`/api/tenants/${tenantId}`);
                setTenants(tenants.filter((tenant) => tenant.tenant_id !== tenantId));
            } catch (err) {
                setError(err.response?.data?.message || "Failed to delete tenant.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">View All Tenants</h2>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by Tenant ID"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-700"
                    />
                </div>
                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : (
                    <div className="overflow-x-auto shadow-lg rounded-lg">
                        <table className="min-w-full table-auto">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Tenant ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Contact</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Email</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Shop ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredTenants.map((tenant) => (
                                    <tr key={tenant.tenant_id} className="hover:bg-gray-50 border-b">
                                        <td className="px-6 py-4 text-sm">{tenant.tenant_id}</td>
                                        <td className="px-6 py-4 text-sm">{tenant.name}</td>
                                        <td className="px-6 py-4 text-sm">{tenant.contact}</td>
                                        <td className="px-6 py-4 text-sm">{tenant.email}</td>
                                        <td className="px-6 py-4 text-sm">{tenant.shop_id}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <button
                                                onClick={() => handleEditTenant(tenant.tenant_id)}
                                                className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none transition duration-200"
                                            >
                                                Edit
                                            </button>

                                            <button
                                                onClick={() => handleDeleteTenant(tenant.tenant_id)}
                                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none transition duration-200 ml-2"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-6">
                    <button
                        onClick={() => navigate("/tenant-management")}
                        className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                        Back to Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTenants;
