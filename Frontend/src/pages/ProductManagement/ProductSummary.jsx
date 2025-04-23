import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";

// Register chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const ProductSummary = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [priceChart, setPriceChart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [productRes, chartRes] = await Promise.all([
          api.get(`/api/products/${productId}`),
          api.get(`/api/prices/product/${productId}/chart`),
        ]);

        setProduct(productRes.data);

        // Ensure chart data is an array
        if (Array.isArray(chartRes.data)) {
          setPriceChart(chartRes.data);
        } else {
          console.error("Unexpected chart data format:", chartRes.data);
          setPriceChart([]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch product data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  const chartData = {
    labels: Array.isArray(priceChart)
      ? priceChart.map((p) => new Date(p.date).toLocaleDateString())
      : [],
    datasets: [
      {
        label: "Price Over Time",
        data: Array.isArray(priceChart) ? priceChart.map((p) => p.price) : [],
        borderColor: "#3e95cd",
        backgroundColor: "rgba(62, 149, 205, 0.1)",
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Price History Chart",
      },
    },
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-6xl p-8">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Product Summary: {product.name}
        </h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Price History</h3>
          {priceChart.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <p className="text-gray-600">No price data available.</p>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Product Details</h3>
          <div className="text-sm">
            <p><strong>Type:</strong> {product.type}</p>
            <p><strong>Description:</strong> {product.description || "No description available."}</p>
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="w-48 h-auto rounded-lg shadow mt-4"
              />
            )}
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => navigate("/view-products")}
            className="w-full bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Back to Product List
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSummary;
