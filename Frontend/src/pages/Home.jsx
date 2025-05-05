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
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleIconClick = (index) => {
        setClickedIndex(index);
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
                        { icon: "👨‍🌾", value: "10,000+", label: "Traders & Farmers Visit Daily" },
                        { icon: "🚗", value: "1,500+", label: "Vehicles Recieved per Day" },
                        { icon: "🥦", value: "2,500+", label: "Tons of Vegetables Exchanged Daily" },
                        { icon: "⏰", value: "5AM - 12MN", label: "Open Daily" },
                    ].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleIconClick(index)}
                            className={`cursor-pointer p-6 rounded-xl transform transition duration-300 hover:scale-105 active:scale-95 border border-gray-200 ${
                                clickedIndex === index ? "bg-green-100" : "bg-white"
                            }`}
                            style={{
                                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                                perspective: "1000px",
                            }}
                        >
                            <div
                                className={`text-4xl mb-2 transition-all duration-300 ${
                                    clickedIndex === index ? "text-green-700" : ""
                                }`}
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

            {/* Our Objectives Section - Title Aligned at Top and Justified */}
            <div className="py-16 bg-white">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    {/* Left Side Image */}
                    <div>
                        <img
                            src="/images/farmer1.jpg"
                            alt="Farmer Working"
                            className="w-full h-auto rounded-3xl"
                        />
                    </div>

                    {/* Right Side Objectives */}
                    <div className="space-y-6">
                        {/* Title moved to top */}
                        <div>
                            <h2 className="text-3xl font-bold text-green-800 mb-4 text-justify">
                                Our Objectives
                            </h2>
                        </div>
                        <div className="space-y-6">
                            {[
                                { icon: "💰", text: "Decide prices of vegetables." },
                                { icon: "🥬", text: "Produce high quality vegetables." },
                                { icon: "🏭", text: "Establishment of small scale industries." },
                                { icon: "🤝", text: "Avoid price haggling." },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start space-x-4 p-4 bg-green-100 rounded-xl shadow-sm hover:shadow-md transition"
                                >
                                    <div className="text-2xl">{item.icon}</div>
                                    <p className="text-lg text-gray-700">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <EconomicCenterNews />
            <Footer />
        </div>
    );
};

export default Home;
