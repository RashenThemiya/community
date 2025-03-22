import { Link } from "react-router-dom";
import { useState } from "react";


const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

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
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
