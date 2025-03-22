import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddShop = () => {
    const navigate = useNavigate();
    const [shop, setShop] = useState({ name: "", owner: "", location: "", rent: "" });

    const handleChange = (e) => {
        setShop({ ...shop, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Shop added:", shop); // Here you can integrate API call
        navigate("/shop-management"); // Redirect back to Shop Management after adding
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Shop</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Shop Name"
                        value={shop.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <input
                        type="text"
                        name="owner"
                        placeholder="Owner Name"
                        value={shop.owner}
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
                        name="rent"
                        placeholder="Rent Amount"
                        value={shop.rent}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                    >
                        Add Shop
                    </button>
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
