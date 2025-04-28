import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

const EditShop = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [shop, setShop] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const response = await api.get(`/api/shops/${id}`);
                setShop(response.data);
            } catch (err) {
                setError("Failed to load shop details.");
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, [id]);

    const handleChange = (e) => {
        setShop((prevShop) => ({
            ...prevShop,
            [e.target.name]: e.target.value
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const confirmUpdate = async () => {
        setShowConfirmModal(false);
        setLoading(true);

        try {
            await api.put(`/api/shops/${id}`, shop);
            setSuccess("Shop updated successfully! Redirecting...");
            setTimeout(() => {
                navigate("/view-shops");
            }, 2000);
        } catch (err) {
            setError("Failed to update shop.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !success) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-gray-100">
            {/* Transparent background overlay */}
            {showConfirmModal && (
                <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex justify-center items-center z-40">
                    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-sm z-50">
                        <h3 className="text-xl font-bold mb-4 text-center">Confirm Update</h3>
                        <p className="text-gray-600 mb-6 text-center">Are you sure you want to update this shop?</p>
                        <div className="flex justify-around">
                            <button
                                onClick={confirmUpdate}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                            >
                                Yes, Update
                            </button>
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className={`bg-white p-8 rounded-lg shadow-lg w-full max-w-md ${showConfirmModal ? "blur-sm" : ""}`}>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Editing Shop Id- {id} - Current Name- {shop.shop_name || "Loading..."}
                </h2>

                {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}

                <form onSubmit={handleFormSubmit} className="space-y-4">
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
