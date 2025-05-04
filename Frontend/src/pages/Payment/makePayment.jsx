import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/axiosInstance";

const MakePayment = () => {
    const navigate = useNavigate();
    const { name } = useAuth();

    const [paymentData, setPaymentData] = useState({
        referenceId: "",
        amountPaid: "",
        paymentMethod: "Cash",
        type: "shop",
        paymentDate: "",
        paymentTime: "",
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

        const { referenceId, amountPaid, paymentMethod, type, paymentDate, paymentTime } = paymentData;

        if (!referenceId.trim() || !amountPaid || !paymentDate || !paymentTime) {
            setError("Please fill all fields before submitting.");
            return;
        }

        setLoading(true);

        const endpoint =
            type === "shop"
                ? `api/payments/by-shop/${referenceId.trim()}`
                : `api/payments/by-invoice/${referenceId.trim()}`;

        const combinedDateTime = new Date(`${paymentDate}T${paymentTime}`);
        const isoPaymentDate = combinedDateTime.toISOString();

        try {
            const response = await api.post(endpoint, {
                amountPaid: parseFloat(amountPaid),
                paymentMethod,
                paymentDate: isoPaymentDate,
                adminName: name,
            });

            setMessage("✅ Payment processed successfully!");
            setPaymentData({
                referenceId: "",
                amountPaid: "",
                paymentMethod: "Cash",
                type: "shop",
                paymentDate: "",
                paymentTime: "",
            });
        } catch (err) {
            setError(err.response?.data?.message || "❌ Failed to process payment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (message || error) {
            const timer = setTimeout(() => {
                setMessage(null);
                setError(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [message, error]);

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Make a Payment</h2>
                <p className="text-lg mb-4 text-center text-gray-700">Admin: {name}</p>

                {/* Success Message */}
                {message && (
                    <div className="flex items-center bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4" role="alert">
                        <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-4l-3-3 1.4-1.4L9 11.2l4.6-4.6L15 8l-6 6z" />
                        </svg>
                        <span className="font-medium">{message}</span>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="flex items-center bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4" role="alert">
                        <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13H9v6h2V5zm0 8H9v2h2v-2z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Date</label>
                        <input
                            type="date"
                            name="paymentDate"
                            value={paymentData.paymentDate}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Payment Time</label>
                        <input
                            type="time"
                            name="paymentTime"
                            value={paymentData.paymentTime}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

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