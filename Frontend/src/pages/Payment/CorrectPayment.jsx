import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const CorrectPayment = () => {
    const [formData, setFormData] = useState({
        invoice_id: "",
        shop_id: "",
        actual_amount: "",
        admin_put_amount: "",
        edit_reason: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate(); // For back navigation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        if (!formData.shop_id || !formData.actual_amount || !formData.admin_put_amount) {
            setError("Shop ID, Actual Amount, and Admin Input Amount are required.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Unauthorized: Please log in first.");
                setLoading(false);
                return;
            }

            const { invoice_id, ...payload } = formData;
            if (invoice_id.trim() !== "") {
                payload.invoice_id = invoice_id;
            }

            const response = await api.post(
                "api/paymentscorrection/correct-payment/",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.success) {
                setSuccess("✅ Payment correction applied successfully!");
                setFormData({
                    invoice_id: "",
                    shop_id: "",
                    actual_amount: "",
                    admin_put_amount: "",
                    edit_reason: "",
                });
            } else {
                setError(response.data.message || "Payment correction failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (error || success) {
            const timer = setTimeout(() => {
                setError(null);
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [error, success]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Correct Payment</h2>

                {/* Back to Main Button */}
                <button
                    onClick={() => navigate(-1)} // You can change -1 to a specific route like "/admin/dashboard"
                    className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-600 bg-blue-100 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-colors duration-200"
                >
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    Back to Main
                </button>


                {success && (
                    <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
                        <FaCheckCircle className="mr-2 text-green-600 text-xl" />
                        <span className="font-medium">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                        <FaTimesCircle className="mr-2 text-red-600 text-xl" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <input
                        type="text"
                        name="invoice_id"
                        placeholder="Invoice ID (Optional)"
                        value={formData.invoice_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="shop_id"
                        placeholder="Shop ID *"
                        value={formData.shop_id}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        name="actual_amount"
                        placeholder="Actual Amount *"
                        value={formData.actual_amount}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="number"
                        name="admin_put_amount"
                        placeholder="Admin Input Amount *"
                        value={formData.admin_put_amount}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <textarea
                        name="edit_reason"
                        placeholder="Reason for Correction"
                        value={formData.edit_reason}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />

                    <ConfirmWrapper message="Are you sure you want to apply this correction? This action is irreversible." onConfirm={handleSubmit}>
                        <button
                            type="button"
                            className={`w-full py-2 rounded-lg transition duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                                }`}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Submit Correction"}
                        </button>
                    </ConfirmWrapper>
                </form>
            </div>
        </div>
    );
};

export default CorrectPayment;
