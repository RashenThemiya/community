import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const ViewPayments = () => {
    const navigate = useNavigate();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get("api/payments/payments"); 
                setPayments(response.data.payments);
                setFilteredPayments(response.data.payments); // Initially show all payments
            } catch (err) {
                setError("Failed to fetch payments. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    // Search filter function
    useEffect(() => {
        const filtered = payments.filter(payment => 
            payment.payment_id.toString().includes(searchQuery) ||
            (payment.shop_id && payment.shop_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.invoice_id && payment.invoice_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (payment.payment_method && payment.payment_method.toLowerCase().includes(searchQuery.toLowerCase()))
        );
        setFilteredPayments(filtered);
    }, [searchQuery, payments]);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl">
                <h2 className="text-2xl font-bold mb-4 text-center">All Payments</h2>

                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Search by Payment ID, Shop ID, Invoice ID, or Payment Method..."
                    className="w-full p-2 border border-gray-300 rounded-lg mb-4"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {loading && <p className="text-blue-500 text-center">Loading payments...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}

                {!loading && !error && filteredPayments.length === 0 && (
                    <p className="text-gray-600 text-center">No matching payments found.</p>
                )}

                {!loading && !error && filteredPayments.length > 0 && (
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                        <table className="min-w-full border-collapse border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200 sticky top-0">
                                    <th className="border border-gray-300 px-4 py-2">Payment ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Shop ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Invoice ID</th>
                                    <th className="border border-gray-300 px-4 py-2">Amount Paid</th>
                                    <th className="border border-gray-300 px-4 py-2">Payment Method</th>
                                    <th className="border border-gray-300 px-4 py-2">Payment Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.payment_id} className="text-center">
                                        <td className="border border-gray-300 px-4 py-2">{payment.payment_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{payment.shop_id}</td>
                                        <td className="border border-gray-300 px-4 py-2">{payment.invoice_id || "N/A"}</td>
                                        <td className="border border-gray-300 px-4 py-2">LKR {parseFloat(payment.amount_paid).toFixed(2)}</td>
                                        <td className="border border-gray-300 px-4 py-2">{payment.payment_method}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(payment.payment_date).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button
                    onClick={() => navigate(-1)}
                    className="w-full mt-4 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                    Back
                </button>
            </div>
        </div>
    );
};

export default ViewPayments;
