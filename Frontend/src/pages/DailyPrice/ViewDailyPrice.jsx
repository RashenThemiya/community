import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";

const ViewDailyPrice = () => {
  const navigate = useNavigate();
  const [dailyPrices, setDailyPrices] = useState([]);
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchItem, setSearchItem] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyPrices = async () => {
      setLoading(true);
      try {
        // Use the correct endpoint
        const response = await api.get(`/api/prices/by-date/${searchDate}`);
        setDailyPrices(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch daily prices.");
      } finally {
        setLoading(false);
      }
    };

    fetchDailyPrices();
  }, [searchDate]);

  const handleEdit = (date, productId) => {
    navigate(`/edit-dailyprice/${date}/${productId}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this daily price?");
    if (confirmed) {
      try {
        // Use the correct delete endpoint
        await api.delete(`/api/dailyprice/${id}`);
        setDailyPrices(dailyPrices.filter((price) => price.id !== id));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete.");
      }
    }
  };

  const handleNavigateToProductSummary = (productId) => {
    navigate(`/product-summary/${productId}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">View Daily Prices</h2>

        <div className="mb-4">
          <input
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by item name"
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value.toLowerCase())}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
          />
        </div>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600">{error}</div>
        ) : (
          <div className="overflow-x-auto shadow-lg rounded-lg">
            <table className="min-w-full table-auto">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Item</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {dailyPrices
                  .filter((price) =>
                    price.product?.name?.toLowerCase().includes(searchItem)
                  )
                  .map((price) => (
                    <tr key={price.id} className="hover:bg-gray-50 border-b">
                      <td className="px-6 py-4 text-sm">{price.id}</td>
                      <td className="px-6 py-4 text-sm">{price.date}</td>
                      <td
                        className="px-6 py-4 text-sm text-blue-600 cursor-pointer"
                        onClick={() => handleNavigateToProductSummary(price.product.id)}
                      >
                        {price.product?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-sm">{price.amount}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleEdit(price.date, price.product.id)}
                          className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                        >
                          Edit
                        </button>

                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6">
          <button
            onClick={() => navigate("/daily-price")}
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Back to Management
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDailyPrice;
