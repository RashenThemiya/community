import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/axiosInstance";

const EditShop = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the shop ID from the URL
    const [shop, setShop] = useState({}); // ✅ Start as an empty object
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Fetch the shop details when the page loads
    useEffect(() => {
        const fetchShop = async () => {
            try {
                const response = await api.get(`/api/shops/${id}`);
                setShop(response.data); // ✅ Ensure correct data is set
            } catch (err) {
                setError("Failed to load shop details.");
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [id]);

    // Handle input field changes
    const handleChange = (e) => {
        setShop((prevShop) => ({
            ...prevShop,
            [e.target.name]: e.target.value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/api/shops/${id}`, shop);
            setSuccess("Shop updated successfully! Redirecting...");

            setTimeout(() => {
                navigate("/view-shops"); // Redirect after success
            }, 2000);
        } catch (err) {
            setError("Failed to update shop.");
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
                    Editing Shop Id- {id} - Current Name-{shop.shop_name || "Loading..."}
                </h2>


                {/* Show success message */}
                {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                        <input
                            type="text"
                            name="shop_name"
                            value={shop.shop_name || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Shop Location</label>
                        <input
                            type="text"
                            name="location"
                            value={shop.location || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
                        <input
                            type="number"
                            name="rent_amount"
                            value={shop.rent_amount || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">VAT Rate</label>
                        <input
                            type="number"
                            name="vat_rate"
                            value={shop.vat_rate || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Operation Fee</label>
                        <input
                            type="number"
                            name="operation_fee"
                            value={shop.operation_fee || ""}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
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
                        onClick={() => navigate("/view-shops")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditShop;
