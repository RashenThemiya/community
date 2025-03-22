import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance"; // Import axios instance

const EditShop = () => {
    const navigate = useNavigate();
    const [shopId, setShopId] = useState("");
    const [shop, setShop] = useState({
        shop_name: "",
        location: "",
        rent_amount: "",
        vat_rate: "",
        operation_fee: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle the shop ID input change
    const handleShopIdChange = (e) => {
        setShopId(e.target.value);
    };

    // Fetch shop data based on the shop ID
    const handleSearch = async () => {
        if (!shopId) {
            setError("Please enter a valid shop ID.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await api.get(`/api/shops/${shopId}`); // Axios automatically includes token
            setShop(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch shop details.");
        } finally {
            setLoading(false);
        }
    };

    // Handle the input changes in the form fields
    const handleChange = (e) => {
        setShop({ ...shop, [e.target.name]: e.target.value });
    };

    // Handle the form submission to update the shop
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.put(`/api/shops/${shopId}`, shop); // Axios instance sends token
            navigate("/shop-management");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update shop.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Edit Shop</h2>

                {/* Search shop by ID */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Enter Shop ID"
                        value={shopId}
                        onChange={handleShopIdChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Search Shop
                    </button>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>

                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <>
                        {shop.shop_name && (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Shop Name</label>
                                    <input
                                        type="text"
                                        name="shop_name"
                                        value={shop.shop_name}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Shop Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={shop.location}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Rent Amount</label>
                                    <input
                                        type="number"
                                        name="rent_amount"
                                        value={shop.rent_amount}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">VAT Rate</label>
                                    <input
                                        type="number"
                                        name="vat_rate"
                                        value={shop.vat_rate}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700">Operation Fee</label>
                                    <input
                                        type="number"
                                        name="operation_fee"
                                        value={shop.operation_fee}
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
                                    onClick={() => navigate("/shop-management")}
                                    className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default EditShop;
