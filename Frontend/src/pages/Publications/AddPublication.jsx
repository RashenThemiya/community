import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPublication = () => {
    const navigate = useNavigate();
    const [publication, setPublication] = useState({
        type: "",
        topic: "",
        description: "",
        image: null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPublication({ ...publication, [name]: value });
    };

    const handleFileChange = (e) => {
        setPublication({ ...publication, image: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Unauthorized! Please log in first.");
            navigate("/login");
            return;
        }

        const formData = new FormData();
        formData.append("type", publication.type);
        formData.append("topic", publication.topic);
        formData.append("description", publication.description);
        if (publication.image) {
            formData.append("image", publication.image);
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/publications`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (response.ok) {
                alert("Publication added successfully");
                navigate("/publication");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Unknown error occurred.");
            }
        } catch (error) {
            console.error("Error adding publication:", error);
            setError("An error occurred while adding the publication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Add New Publication</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <select
                        name="type"
                        value={publication.type}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    >
                        <option value="">Select Type</option>
                        <option value="notice">Notice</option>
                        <option value="news">News</option>
                        <option value="announcement">Announcement</option>
                        <option value="event">Event</option>
                    </select>

                    <input
                        type="text"
                        name="topic"
                        placeholder="Topic"
                        value={publication.topic}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={publication.description}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        required
                    />

                    <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Publication"}
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/publication")}
                        className="w-full mt-2 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition duration-300"
                    >
                        Cancel
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPublication;
