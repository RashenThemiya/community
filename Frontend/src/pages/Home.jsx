import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import EconomicCenterNews from "../components/EconomicCenterNews";

// Optional: slick-carousel styles (can be removed if no longer needed)
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Home = () => {
    const { t } = useTranslation();
    const [clicked, setClicked] = useState(null);

    const handleClick = (index) => {
        setClicked(index);
    };

    return (
        <div>
            <Navbar />

            {/* Welcome Section - With White Background */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="text-left space-y-6">
                        <h1 className="text-4xl font-bold text-green-800">
                            {t("home.welcomeMessage")}
                        </h1>
                        <p className="text-lg text-gray-700 text-justify">
                            {t("home.description")}
                        </p>
                    </div>

                    <div>
                        <img
                            src="/images/top.jpg"
                            alt="Top Illustration"
                            className="rounded-3xl w-full h-[350px] object-contain"
                        />
                    </div>
                </div>
            </div>

            {/* Feature Section with 3D Pop and Click Highlight */}
            <div className="bg-green-50 py-10">
                <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[ 
                        { icon: "👨‍🌾", value: "10,000+", label: "Farmers" },
                        { icon: "🚗", value: "1,500+", label: "Vehicle Parking" },
                        { icon: "🥦", value: "2,500+", label: "Tons of Vegetables" },
                        { icon: "⏰", value: "5AM - 12MN", label: "Open Daily" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleClick(index)}  // Handle click
                            className={`bg-white p-6 rounded-xl shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 active:ring-4 active:ring-green-400 border border-gray-200 ${
                                clicked === index ? "bg-lightgreen-500" : ""
                            }`} // Apply light green on click
                            style={{
                                perspective: "1000px",
                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                backgroundColor: clicked === index ? "#d4edda" : "", // Light green when clicked
                            }}
                        >
                            <div
                                className={`text-4xl mb-2 transition-all duration-300 ${clicked === index ? "text-green-600" : ""}`} // Change icon color on click
                                style={{ transform: "translateZ(10px)" }}
                            >
                                {item.icon}
                            </div>
                            <h2 className="text-xl font-bold text-green-900">{item.value}</h2>
                            <p className="text-sm text-gray-700">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <EconomicCenterNews />
            <Footer />
        </div>
    );
};

export default Home;
