import React, { useState } from "react";
import { FaBars, FaChartBar, FaCog, FaFileInvoice, FaHome, FaMoneyBill, FaStore, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const menuItems = [
    { path: "/admin-dashboard", icon: <FaHome />, label: "Dashboard" },
    { path: "/shop-management", icon: <FaStore />, label: "Shop Management" },
    { path: "/tenant-management", icon: <FaUser />, label: "Tenant Management" },
    { path: "/payments", icon: <FaMoneyBill />, label: "Payments" },
    { path: "/invoices", icon: <FaFileInvoice />, label: "Invoices" },
    { path: "/reports", icon: <FaChartBar />, label: "Reports" },
    { path: "/settings", icon: <FaCog />, label: "Settings" },
];

const Sidebar = () => {
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleSidebar = () => {
        setIsExpanded((prev) => !prev);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className={`bg-gray-900 text-white transition-all duration-300 ${isExpanded ? "w-64" : "w-16"} fixed md:relative top-0 left-0 h-full z-50 flex flex-col`}>
                {/* Sidebar Toggle Button */}
                <button
                    className="text-white p-4 focus:outline-none hover:bg-gray-700 transition md:flex items-center justify-center"
                    onClick={toggleSidebar}
                >
                    {isExpanded ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>

                {/* Sidebar Menu Items */}
                <ul className="mt-4 space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.path}>
                            <Link to={item.path} className="flex items-center p-2 hover:bg-gray-700 transition rounded-lg">
                                <span className="text-xl ml-4 mr-4">{item.icon}</span>
                                <span className={`transition-all duration-300 ${isExpanded ? "opacity-100" : "opacity-0 hidden"}`}>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>


        </div>
    );
};

export default Sidebar;
