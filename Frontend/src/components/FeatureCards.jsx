import React, { useState } from "react";

const FeatureCards = () => {
    const [clickedIndex, setClickedIndex] = useState(null);

    const handleIconClick = (index) => {
        setClickedIndex(index);
    };

    const features = [
        { icon: "👨‍🌾", value: "10,000+", label: "Traders & Farmers Visit Daily" },
        { icon: "🚗", value: "1,500+", label: "Vehicles Recieved per Day" },
        { icon: "🥦", value: "2,500+", label: "Tons of Vegetables Exchanged Daily" },
        { icon: "⏰", value: "5AM - 12MN", label: "Open Daily" },
    ];

    return (
        <div className="bg-green-50 py-10">
            <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {features.map((item, index) => (
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
    );
};

export default FeatureCards;
