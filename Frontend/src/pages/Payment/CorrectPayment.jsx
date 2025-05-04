import { useEffect, useState } from "react";
import api from "../../utils/axiosInstance";

const CorrectPayment = () => {
    const [formData, setFormData] = useState({
        invoice_id: "",
        shop_id: "",
        actual_amount: "",
        admin_put_amount: "",
        edit_reason: "",
        payment_date: "",
    });

    const [searchDate, setSearchDate] = useState("");
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchPayments = async () => {
        setError(null);
        setSuccess(null);
        setPayments([]);

        try {
            const token = localStorage.getItem("token");
            const response = await api.get(`/api/paymentscorrection/payments-by-date`, {
                headers: { Authorization: `Bearer ${token}` },
                params: {
                    shop_id: formData.shop_id,
                    payment_date: searchDate,
                },
            });

            if (response.data.success && response.data.data?.length > 0) {
                setPayments(response.data.data);
            } else {
                setError("No payments found.");
            }
        } catch (err) {
            console.error(err);
            setError("Error fetching payments.");
        }
    };

    const handlePaymentClick = (payment) => {
        setFormData({
            invoice_id: payment.invoice_id || "",
            shop_id: payment.shop_id || "",
            actual_amount: "",
            admin_put_amount: payment.amount_paid?.toString() || "",
            edit_reason: "",
            payment_date: payment.payment_date?.split("T")[0] || "",
        });
        setSearchDate(payment.payment_date?.split("T")[0] || "");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const { invoice_id, shop_id, actual_amount, admin_put_amount, edit_reason, payment_date } = formData;

        if (!shop_id || !actual_amount || !admin_put_amount || !payment_date) {
            setError("All required fields must be filled.");
            setLoading(false);
            return;
        }

        const payload = {
            shop_id,
            actual_amount: parseFloat(actual_amount),
            admin_put_amount: parseFloat(admin_put_amount),
            edit_reason,
            payment_date,
        };

        if (invoice_id?.trim()) {
            payload.invoice_id = invoice_id;
        }

        try {
            const token = localStorage.getItem("token");
            const response = await api.post(
                "/api/paymentscorrection/correct-payment/",
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setSuccess("✅ Payment correction applied successfully!");
                setFormData({
                    invoice_id: "",
                    shop_id,
                    actual_amount: "",
                    admin_put_amount: "",
                    edit_reason: "",
                    payment_date,
                });
                fetchPayments();
            } else {
                setError(response.data.message || "Payment correction failed.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "An unexpected error occurred.");
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

    const isSearchDisabled = !formData.shop_id || !searchDate;

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4 text-center">Correct Payment</h2>

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Search Section */}
                <div className="mb-4 space-y-2">
                <h3 className="text-lg font-semibold">Find Payments (Optional)</h3>
                <input
                        type="text"
                        placeholder="Shop ID *"
                        value={formData.shop_id}
                        onChange={(e) => setFormData({ ...formData, shop_id: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="date"
                        value={searchDate}
                        onChange={(e) => setSearchDate(e.target.value)}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={fetchPayments}
                        disabled={isSearchDisabled}
                        className={`w-full py-2 rounded ${isSearchDisabled ? "bg-gray-300 cursor-not-allowed text-gray-600" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                    >
                        Search Payments
                    </button>
                </div>

                {/* List of Payments */}
                {payments.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-semibold mb-2">Payments on {searchDate}:</h4>
                        <ul className="space-y-2 max-h-60 overflow-y-auto border p-2 rounded">
                            {payments.map((pmt) => (
                                <li
                                    key={pmt.payment_id || pmt.invoice_id || Math.random()}
                                    className="p-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
                                    onClick={() => handlePaymentClick(pmt)}
                                >
                                    <strong>Invoice:</strong> {pmt.invoice_id || "N/A"} |{" "}
                                    <strong>Amount:</strong> {pmt.amount_paid} |{" "}
                                    <strong>Method:</strong> {pmt.payment_method}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Correction Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="invoice_id"
                        placeholder="Invoice ID (Optional)"
                        value={formData.invoice_id}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <input
                        type="number"
                        name="actual_amount"
                        placeholder="Actual Amount *"
                        value={formData.actual_amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="number"
                        name="admin_put_amount"
                        placeholder="Admin Input Amount *"
                        value={formData.admin_put_amount}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <input
                        type="date"
                        name="payment_date"
                        value={formData.payment_date}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                        required
                    />
                    <textarea
                        name="edit_reason"
                        placeholder="Reason for Correction"
                        value={formData.edit_reason}
                        onChange={handleChange}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded ${loading ? "bg-gray-400 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
                    >
                        {loading ? "Processing..." : "Submit Correction"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CorrectPayment;
