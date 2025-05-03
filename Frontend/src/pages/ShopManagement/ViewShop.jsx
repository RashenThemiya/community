import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { toast } from "react-hot-toast"; // ✅ Assuming you have react-hot-toast installed

const ITEMS_PER_PAGE = 10; // ✅ Pagination: 10 shops per page

const ViewShops = () => {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDeleteShopId, setConfirmDeleteShopId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

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

    const handleDeleteShop = async (shopId) => {
        try {
            await api.delete(`/api/shops/${shopId}`);
            setShops(prev => prev.filter((shop) => shop.shop_id !== shopId));
            toast.success("Shop deleted successfully!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to delete shop.");
        } finally {
            setConfirmDeleteShopId(null);
        }
    };

    const filteredShops = shops.filter((shop) =>
        shop.shop_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.shop_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        shop.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredShops.length / ITEMS_PER_PAGE);
    const currentShops = filteredShops.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 py-8 relative">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">View All Shops</h2>

                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search by Shop ID, Name, or Location"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // Reset to first page on search
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-700"
                    />
                </div>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : filteredShops.length === 0 ? (
                    <div className="text-center text-gray-500 py-10">
                        No shops found.
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg">
                        <table className="min-w-full">
                            <thead className="bg-teal-600 text-white">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Shop ID</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Shop Name</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Location</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Rent</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">VAT</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Operation Fee</th>
                                    <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {currentShops.map((shop) => (
                                    <tr key={shop.shop_id} className="hover:bg-gray-50">
                                        <td
                                            className="px-6 py-4 text-blue-600 text-sm cursor-pointer underline"
                                            onClick={() => navigate(`/shop-summary/${shop.shop_id}`)}
                                        >
                                            {highlight(shop.shop_id, searchQuery)}
                                        </td>
                                        <td className="px-6 py-4 text-sm">{highlight(shop.shop_name, searchQuery)}</td>
                                        <td className="px-6 py-4 text-sm">{highlight(shop.location, searchQuery)}</td>
                                        <td className="px-6 py-4 text-sm">Rs. {shop.rent_amount}</td>
                                        <td className="px-6 py-4 text-sm">{shop.vat_rate}%</td>
                                        <td className="px-6 py-4 text-sm">Rs. {shop.operation_fee}</td>
                                        <td className="px-6 py-4 text-sm flex flex-wrap gap-2">
                                            <button
                                                onClick={() => navigate(`/edit-shop/${shop.shop_id}`)}
                                                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm"
                                            >
                                                Edit
                                            </button>

                                            <ConfirmWrapper onConfirm={() => handleDeleteShop(shop.shop_id)}>
                                                <button
                                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </ConfirmWrapper>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination Controls */}
                        <div className="flex justify-center items-center mt-6 gap-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((prev) => prev - 1)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Floating "Back to Management" Button */}
            <button
                onClick={() => navigate("/shop-management")}
                className="fixed bottom-8 right-8 bg-gray-800 text-white py-3 px-6 rounded-full shadow-lg hover:bg-gray-900 transition duration-200"
            >
                Back to Management
            </button>
        </div>
    );
};

// Helper to highlight search text
function highlight(text, query) {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
            <mark key={index} className="bg-yellow-200">
                {part}
            </mark>
        ) : (
            part
        )
    );
}

export default ViewShops;
