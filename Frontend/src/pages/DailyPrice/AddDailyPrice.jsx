import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const AddDailyPrice = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data);
      } catch (err) {
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handlePriceChange = (productId, value) => {
    setPrices((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    // Prepare data: only include products with entered prices
    const dataToSubmit = Object.entries(prices)
      .filter(([_, price]) => price !== "")
      .map(([product_id, price]) => ({
        product_id,
        price,
        date,
      }));

    if (dataToSubmit.length === 0) {
      setError("Please enter at least one price.");
      setSubmitting(false);
      return;
    }

    try {
      await api.post("/api/prices/update-multiple", dataToSubmit);
      setSuccess("Prices added/updated successfully!");
      setPrices({});

      setTimeout(() => navigate("/daily-price"), 2000);
    } catch (err) {
      setError("Failed to update prices.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Daily Prices</h2>

        {success && <p className="text-green-500 text-sm mb-4 text-center">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Product</th>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">Price (Rs.)</th>
                </tr>
              </thead>
              <tbody className="bg-white text-sm">
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-2">{product.name}</td>
                    <td className="px-4 py-2">{product.type}</td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={prices[product.id] || ""}
                        onChange={(e) => handlePriceChange(product.id, e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            {submitting ? "Saving..." : "Save All Prices"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/daily-price")}
            className="w-full mt-2 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddDailyPrice;
