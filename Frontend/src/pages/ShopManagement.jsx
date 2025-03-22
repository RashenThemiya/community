import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const ShopManagement = () => {
    const navigate = useNavigate();

    return (
        <div className="flex">
            {/* Sidebar */}
            <div> <Sidebar isExpanded={true} setIsExpanded={() => { }} /> </div>

            {/* Main Content */}
            <div className="p-8 w-full">
                <div className="text-3xl font-semibold mb-8">
                    <h1>Shop Management</h1>
                    <p className="text-lg text-gray-500">Manage your shops efficiently</p>
                </div>

                {/* Shop Management Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {/* Add New Shop */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Add New Shop</h2>
                        <p className="text-gray-700 mb-4">Create a new shop and add all the details for smooth management.</p>
                        <button
                            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 w-full sm:w-auto"
                            onClick={() => navigate("/add-shop")}
                        >
                            Add Shop
                        </button>
                    </div>

                    {/* Edit Shop Details */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">Edit Shop</h2>
                        <p className="text-gray-700 mb-4">Edit Shop Details.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/edit-shops")}
                        >
                            Edit Shop
                        </button>
                    </div>

                    {/* View All Shops */}
                    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
                        <h2 className="text-xl font-semibold mb-4">View All Shops</h2>
                        <p className="text-gray-700 mb-4">View the list of all the shops you've added for easy management.</p>
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 w-full sm:w-auto"
                            onClick={() => navigate("/view-shops")}
                        >
                            View Shops
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopManagement;
