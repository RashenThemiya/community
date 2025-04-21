import { useState } from "react";
import api from "../../utils/axiosInstance"; // Ensure this points to your axios setup

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validate required fields
        if (!formData.shop_id || !formData.actual_amount || !formData.admin_put_amount) {
            setError("Shop ID, Actual Amount, and Admin Input Amount are required.");
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token"); // Get token from local storage
            if (!token) {
                setError("Unauthorized: Please log in first.");
                setLoading(false);
                return;
            }

            // Construct request body without invoice_id if it's empty
            const { invoice_id, ...payload } = formData;
            if (invoice_id.trim() !== "") {
                payload.invoice_id = invoice_id;
            }

            const response = await api.post(
                "api/paymentscorrection/correct-payment/",
                payload,  // Send only the required fields
                {
                    headers: {
                        Authorization: `Bearer ${token}`,  // Include Bearer token
                    },
                }
            );

            if (response.data.success) {
                setSuccess("Payment correction applied successfully!");
                setFormData({
                    invoice_id: "",
                    shop_id: "",
                    actual_amount: "",
                    admin_put_amount: "",
                    edit_reason: "",
                }); // Reset form
            } else {
                setError(response.data.message || "Payment correction failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Correct Payment</h2>

                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
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
                    
                    <button
                        type="submit"
                        className={`w-full py-2 rounded-lg transition duration-300 ${
                            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 text-white"
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Processing..." : "Submit Correction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CorrectPayment;
