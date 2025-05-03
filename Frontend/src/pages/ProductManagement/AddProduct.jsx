import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name: "",
        type: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        if (e.target.name === "image") {
            setImage(e.target.files[0]);
        } else {
            setProduct({ ...product, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append("name", product.name);
        formData.append("type", product.type);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Product added successfully");
                navigate("/view-products");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unknown error occurred.");
            }
        } catch (error) {
            console.error("Error adding product:", error);
            setError("An error occurred while adding the product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Product</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={product.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />

                <select
                    name="type"
                    value={product.type}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    required
                >
                    <option value="">Select Product Type</option>
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="rice">Rice</option>
                    <option value="potatoes">Potatoes</option>
                    <option value="Leaf Vegetable">Leaf Vegetable</option>
                    <option value="Grain">Grain</option>
                </select>


                    <input
                        type="file"
                        name="image"
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Product"}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/product-management")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
