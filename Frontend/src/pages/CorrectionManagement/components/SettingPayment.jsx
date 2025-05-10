import { useState } from "react";
import api from "../../../utils/axiosInstance";

const SettingPayment = ({ shopId, onSuccess }) => {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || !paymentMethod) {
      setError("Amount and payment method are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post(`/api/payments/by-shop/${shopId}`, {
        amountPaid: parseFloat(amount),
        paymentDate: paymentDate,
        paymentMethod: paymentMethod,
        
           
      });
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-center text-gray-700">Make Payment</h2>
      {error && <div className="text-red-500 text-sm text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Amount (LKR)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          >
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Card">Card</option>
            <option value="Online">Online</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Payment Date</label>
          <input
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-500"
            rows={3}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Processing..." : "Submit Payment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingPayment;
