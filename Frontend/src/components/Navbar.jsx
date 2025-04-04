import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // Import i18next hook

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
    const { i18n } = useTranslation(); // Use i18next hook to handle language change

    // Function to change the language
    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);  // Change language to the selected one
        setDropdownOpen(false);  // Close dropdown after selection
    };

    return (
        <nav className="bg-gray-900 text-white p-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link className="text-xl font-bold text-white" to="/">Brand</Link>
                <button
                    className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                    aria-label="Toggle navigation"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
                <div className={`absolute md:static top-16 left-0 w-full md:w-auto bg-gray-900 md:bg-transparent md:flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 p-4 md:p-0 transition-all duration-300 ease-in-out ${isOpen ? 'block' : 'hidden'}`}>
                    <Link className="block md:inline text-white hover:text-gray-300" to="/">Home</Link>
                    <Link className="block md:inline text-white hover:text-gray-300" to="/dailyprice">Daily Price</Link>
                    <Link className="block md:inline text-white hover:text-gray-300" to="/contact">Contact</Link>
                    <Link className="block md:inline text-white hover:text-gray-300" to="/login">Login</Link>

                    {/* Language Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            className="text-white hover:text-gray-300"
                        >
                            Language
                        </button>
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-gray-800 text-white rounded shadow-lg">
                                <button
                                    onClick={() => handleLanguageChange('en')}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('si')}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                                >
                                    සිංහල
                                </button>
                                <button
                                    onClick={() => handleLanguageChange('ta')}
                                    className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                                >
                                    தமிழ்
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
