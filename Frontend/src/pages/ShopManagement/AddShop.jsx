import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmWrapper from "../../components/ConfirmWrapper";

const AddShop = () => {
  const navigate = useNavigate();
  const [shop, setShop] = useState({
    shop_id: "",
    shop_name: "",
    location: "",
    rent_amount: "",
    vat_rate: "",
    operation_fee: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);  // State to track confirmation

  const handleChange = (e) => {
    setShop({ ...shop, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Only submit if confirmed
    if (!isConfirmed) {
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized! Please log in first.");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/shops`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(shop),
      });

      if (response.ok) {
        alert("Shop added successfully");
        navigate("/shop-management");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("Error adding shop:", error);
      setError("An error occurred while adding the shop.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true); // Set confirmed to true on confirmation
    handleSubmit();
  };

  const handleCancel = () => {
    setIsConfirmed(false); // Reset confirmed if canceled
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Add New Shop</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="shop_id"
            placeholder="Shop ID"
            value={shop.shop_id}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="shop_name"
            placeholder="Shop Name"
            value={shop.shop_name}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Shop Location"
            value={shop.location}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="number"
            name="rent_amount"
            placeholder="Rent Amount"
            value={shop.rent_amount}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="number"
            name="vat_rate"
            placeholder="VAT Rate"
            value={shop.vat_rate}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          <input
            type="number"
            name="operation_fee"
            placeholder="Operation Fee"
            value={shop.operation_fee}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
          
          <ConfirmWrapper onConfirm={handleConfirm} onCancel={handleCancel}>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Shop"}
            </button>
          </ConfirmWrapper>
          <button
            type="button"
            onClick={() => navigate("/shop-management")}
            className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddShop;
