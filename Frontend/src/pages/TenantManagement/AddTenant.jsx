import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper"; // ✅ added ConfirmWrapper import

const AddTenant = () => {
    const navigate = useNavigate();
    const [tenant, setTenant] = useState({
        name: "",
        contact: "",
        email: "",
        address: "",
        shop_id: ""
    });
    const [availableShops, setAvailableShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false); // ✅ added confirm state

    // Fetch available shop IDs
    useEffect(() => {
        const fetchAvailableShops = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                alert("Unauthorized! Please log in first.");
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/shops/without-tenants`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    setAvailableShops(data);
                } else {
                    console.error("Error fetching shops:", await response.text());
                }
            } catch (err) {
                console.error("Error fetching shops:", err);
            }
        };

        fetchAvailableShops();
    }, [navigate]);

    const handleChange = (e) => {
        setTenant({ ...tenant, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized! Please log in first.");
            navigate("/login");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tenants`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(tenant),
            });

            if (response.ok) {
                alert("Tenant added successfully");
                navigate("/tenant-management");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unknown error occurred.");
            }
        } catch (error) {
            console.error("Error adding tenant:", error);
            setError("An error occurred while adding the tenant.");
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowConfirm(true); // ✅ open confirm popup first
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Tenant</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder="Full Name" value={tenant.name} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                    <input type="text" name="contact" placeholder="Contact Number" value={tenant.contact} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                    <input type="email" name="email" placeholder="Email Address" value={tenant.email} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />
                    <input type="text" name="address" placeholder="Address" value={tenant.address} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required />

                    {/* Shop ID Dropdown */}
                    <select name="shop_id" value={tenant.shop_id} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-lg" required>
                        <option value="">Select a Shop</option>
                        {availableShops.length > 0 ? (
                            availableShops.map((shop) => (
                                <option key={shop.shop_id} value={shop.shop_id}>
                                    {shop.shop_name} (ID: {shop.shop_id})
                                </option>
                            ))
                        ) : (
                            <option disabled>No available shops</option>
                        )}
                    </select>

                    {/* ✅ ConfirmWrapper wrapping Add Tenant button */}
                    <ConfirmWrapper
                        open={showConfirm}
                        message="Are you sure you want to add this tenant?"
                        onConfirm={() => {
                            setShowConfirm(false);
                            handleSubmit();
                        }}
                        onCancel={() => setShowConfirm(false)}
                    >
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add Tenant"}
                        </button>
                    </ConfirmWrapper>

                    {/* Cancel button (✅ unchanged) */}
                    <button
                        type="button"
                        onClick={() => navigate("/tenant-management")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddTenant;
