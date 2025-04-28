import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ConfirmWrapper from "../../components/ConfirmWrapper"; // ✅ Import ConfirmWrapper

const ViewShops = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDeleteShopId, setConfirmDeleteShopId] = useState(null); // ✅ For tracking which shop to delete

    // Fetch all shops from the backend
    useEffect(() => {
        const fetchShops = async () => {
            try {
                const response = await api.get("/api/shops");
                setShops(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch shops.");
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    // Filtered shops based on search query
    const filteredShops = shops.filter((shop) =>
        shop.shop_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Handle delete shop action
    const handleDeleteShop = async (shopId) => {
        try {
            await api.delete(`/api/shops/${shopId}`);
            setShops(shops.filter((shop) => shop.shop_id !== shopId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete shop.");
        } finally {
            setConfirmDeleteShopId(null);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
                <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">View All Shops</h2>
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by Shop ID"
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
                                    <th className="px-6 py-4 text-left text-sm font-medium">Shop ID</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Shop Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Rent</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">VAT</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Operation Fee</th>
                                    <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredShops.map((shop) => (
                                    <tr key={shop.shop_id} className="hover:bg-gray-50 border-b">
                                        <td
                                            className="px-6 py-4 text-sm text-blue-600 cursor-pointer underline"
                                            onClick={() => navigate(`/shop-summary/${shop.shop_id}`)}
                                        >
                                            {shop.shop_id}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{shop.shop_name}</td>
                                        <td className="px-6 py-4 text-sm">{shop.location}</td>
                                        <td className="px-6 py-4 text-sm">{shop.rent_amount}</td>
                                        <td className="px-6 py-4 text-sm">{shop.vat_rate}</td>
                                        <td className="px-6 py-4 text-sm">{shop.operation_fee}</td>
                                        <td className="px-6 py-4 text-sm text-center">
                                            <button
                                                onClick={() => navigate(`/edit-shop/${shop.shop_id}`)}
                                                className="bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 focus:outline-none transition duration-200"
                                            >
                                                Edit
                                            </button>

                                            <ConfirmWrapper onConfirm={() => handleDeleteShop(shop.shop_id)}>
                                                <button
                                                    className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 focus:outline-none transition duration-200 ml-2"
                                                >
                                                    Delete
                                                </button>
                                            </ConfirmWrapper>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="mt-6">
                    <button
                        onClick={() => navigate("/shop-management")}
                        className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200"
                    >
                        Back to Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewShops;
