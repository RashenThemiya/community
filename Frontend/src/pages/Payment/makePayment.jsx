import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import ConfirmWrapper from "../../components/ConfirmWrapper"; // ✅ import ConfirmWrapper

const MakePayment = () => {
    const navigate = useNavigate();
    const [paymentData, setPaymentData] = useState({
        referenceId: "",
        amountPaid: "",
        paymentMethod: "Cash",
        type: "shop",
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        const { referenceId, amountPaid, paymentMethod, type } = paymentData;

        // Basic validation
        if (!referenceId.trim() || !amountPaid) {
            setError("Please fill all fields before submitting.");
            return;
        }

        setLoading(true);

        const endpoint = type === "shop"
            ? `api/payments/by-shop/${referenceId.trim()}`
            : `api/payments/by-invoice/${referenceId.trim()}`;

        try {
            const response = await api.post(endpoint, {
                amountPaid: parseFloat(amountPaid), 
                paymentMethod,
            });

            setMessage("Payment processed successfully!");
            setPaymentData({
                referenceId: "",
                amountPaid: "",
                paymentMethod: "Cash",
                type: "shop",
            });
        } catch (err) {
            setError(err.response?.data?.message || "Failed to process payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Make a Payment</h2>

                {message && <p className="text-green-500 text-sm mb-4">{message}</p>}
                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Type</label>
                        <select
                            name="type"
                            value={paymentData.type}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="shop">By Shop ID</option>
                            <option value="invoice">By Invoice ID</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reference ID</label>
                        <input
                            type="text"
                            name="referenceId"
                            value={paymentData.referenceId}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount Paid</label>
                        <input
                            type="number"
                            name="amountPaid"
                            value={paymentData.amountPaid}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                            min="1"
                            step="0.01"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                        <select
                            name="paymentMethod"
                            value={paymentData.paymentMethod}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cheque">Cheque</option>
                            <option value="Correction Made">Correction Made</option>
                        </select>
                    </div>

                    {/* ✅ Wrap just the button inside ConfirmWrapper */}
                    <ConfirmWrapper message="Are you sure you want to process this payment?">
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Process Payment"}
                        </button>
                    </ConfirmWrapper>
                </form>

                <button
                    onClick={() => navigate(-1)}
                    className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default MakePayment;
