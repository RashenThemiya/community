import { useState } from "react";
import api from "../../../utils/axiosInstance";

const GenerateInvoiceForm = ({ shopId, onInvoiceGenerated }) => {
  const [monthYear, setMonthYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateInvoice = async () => {
    if (!shopId || !monthYear) {
      setError("Please provide shop ID and month/year.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/systemsetting/generate", {
        shop_id: shopId,
        month_year: monthYear,
      });

      if (response.status === 201) {
        onInvoiceGenerated(response.data.invoice);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Generate Invoice</h3>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={monthYear}
          onChange={(e) => setMonthYear(e.target.value)}
          placeholder="Enter Month/Year (e.g., 2025-05)"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleGenerateInvoice}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Generating..." : "Generate Invoice"}
        </button>
      </div>

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
};

export default GenerateInvoiceForm;
