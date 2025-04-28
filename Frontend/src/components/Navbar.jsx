import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { i18n } = useTranslation();

    const handleLanguageChange = (lng) => {
        i18n.changeLanguage(lng);
        setDropdownOpen(false);
    };

    return (
        <div className="shadow-lg">
            {/* Top ribbon bar for hotline/announcement */}
            <div className="bg-yellow-400 text-gray-900 text-sm py-1 px-4 flex justify-between items-center font-medium">
                <div>
                    📢 Hotline: <span className="font-semibold">1919</span> | eGov Services Portal
                </div>
                <div className="space-x-4 hidden md:flex">
                    <button onClick={() => handleLanguageChange('en')} className="hover:underline">EN</button>
                    <button onClick={() => handleLanguageChange('si')} className="hover:underline">සිං</button>
                    <button onClick={() => handleLanguageChange('ta')} className="hover:underline">தமிழ்</button>
                </div>
            </div>

            {/* Main navbar */}
            <nav className="bg-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/images/logo.jpg"
                            alt="Gov Logo"
                            className="w-10 h-10"
                        />
                        <Link to="/" className="text-xl font-bold tracking-wide">
                        දඹුල්ල විශේෂිත ආර්ථික මධ්‍යස්ථානය
                        </Link>
                    </div>

                    <div className="hidden md:flex space-x-6 items-center font-medium">
                        <Link to="/" className="hover:text-yellow-400">Home</Link>
                        <Link to="/home-dailyprice" className="hover:text-yellow-400">Daily Price</Link>
                        <Link to="/contact" className="hover:text-yellow-400">Contact</Link>
                        <Link to="/login" className="hover:text-yellow-400">Login</Link>
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)} className="hover:text-yellow-400">
                                Language
                            </button>
                            {dropdownOpen && (
                                <div className="absolute z-10 right-0 mt-2 w-40 bg-white text-gray-900 rounded shadow-md">
                                    <button
                                        onClick={() => handleLanguageChange('en')}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                                    >
                                        English
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange('si')}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                                    >
                                        සිංහල
                                    </button>
                                    <button
                                        onClick={() => handleLanguageChange('ta')}
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-200"
                                    >
                                        தமிழ்
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile menu toggle */}
                    <div className="md:hidden">
                        <button onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                                viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden px-4 pb-4 space-y-2 font-medium">
                        <Link to="/" className="block hover:text-yellow-400">Home</Link>
                        <Link to="/home-dailyprice" className="block hover:text-yellow-400">Daily Price</Link>
                        <Link to="/contact" className="block hover:text-yellow-400">Contact</Link>
                        <Link to="/login" className="block hover:text-yellow-400">Login</Link>
                        <div>
                            <p className="text-sm text-gray-300 mb-1">Language</p>
                            <div className="flex space-x-3">
                                <button onClick={() => handleLanguageChange('en')} className="hover:underline">EN</button>
                                <button onClick={() => handleLanguageChange('si')} className="hover:underline">සිං</button>
                                <button onClick={() => handleLanguageChange('ta')} className="hover:underline">தமிழ்</button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
