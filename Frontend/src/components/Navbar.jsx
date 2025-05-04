import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="shadow-lg">
            {/* Top ribbon bar for hotline/announcement */}
            <div className="bg-lime-300 text-gray-900 text-sm py-1 px-4 flex justify-between items-center font-medium">
                <div>
                    📢 Hotline: <span className="font-semibold">1919</span> | eGov Services Portal
                </div>
                <div className="space-x-4 flex">
                    <button onClick={() => handleLanguageChange('en')} className="hover:underline">EN</button>
                    <button onClick={() => handleLanguageChange('si')} className="hover:underline">සිං</button>
                    <button onClick={() => handleLanguageChange('ta')} className="hover:underline">தமிழ்</button>
                </div>
            </div>

            {/* Main navbar */}
            <nav className="bg-green-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo and title */}
                    <div className="flex items-center space-x-3">
                        <img
                            src="/images/logo.jpg"
                            alt="Gov Logo"
                            className="w-10 h-10"
                        />
                        <Link to="/" className="text-xl font-bold tracking-wide text-white">
                            දඹුල්ල විශේෂිත ආර්ථික මධ්‍යස්ථානය
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center font-medium">
                        <Link to="/" className="hover:text-lime-300">Home</Link>
                        <Link to="/home-dailyprice" className="hover:text-lime-300">Daily Price</Link>
                        <Link to="/contact" className="hover:text-lime-300">Contact</Link>
                        <Link
                            to="/login"
                            className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-lime-200 font-semibold transition"
                        >
                            Login
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 font-medium text-white">
                        <Link to="/" className="block hover:text-lime-300">Home</Link>
                        <Link to="/home-dailyprice" className="block hover:text-lime-300">Daily Price</Link>
                        <Link to="/contact" className="block hover:text-lime-300">Contact</Link>
                        <Link
                            to="/login"
                            className="block bg-white text-green-700 text-center px-4 py-2 rounded-full font-semibold mt-2"
                        >
                            Login
                        </Link>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
