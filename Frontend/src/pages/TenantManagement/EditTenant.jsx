import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

const EditTenant = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tenant, setTenant] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchTenant = async () => {
            try {
                const response = await api.get(`/api/tenants/${id}`);
                setTenant(response.data);
            } catch (err) {
                setError("Failed to load tenant details.");
            } finally {
                setLoading(false);
            }
        };
        fetchTenant();
    }, [id]);

    const handleChange = (e) => {
        setTenant((prevTenant) => ({
            ...prevTenant,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/api/tenants/${id}`, tenant);
            setSuccess("Tenant updated successfully! Redirecting...");
            setTimeout(() => {
                navigate("/view-tenants");
            }, 2000);
        } catch (err) {
            setError("Failed to update tenant.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Editing Tenant Id- {id} - Current Name-{tenant.name || "Loading..."}
                </h2>

                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tenant Name</label>
                        <input
                            type="text"
                            name="name"
                            value={tenant.name || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tenant Contact</label>
                        <input
                            type="text"
                            name="contact"
                            value={tenant.contact || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tenant Address</label>
                        <input
                            type="text"
                            name="address"
                            value={tenant.address || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tenant Email</label>
                        <input
                            type="email"
                            name="email"
                            value={tenant.email || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* ✅ Show Shop ID but make it read-only */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shop ID</label>
                        <input
                            type="text"
                            name="shop_id"
                            value={tenant.shop_id || ""}
                            className="w-full p-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                            disabled
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/view-tenants")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditTenant;
