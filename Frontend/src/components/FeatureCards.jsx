import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const FeatureCards = () => {
    const [clickedIndex, setClickedIndex] = useState(null);
    const { t } = useTranslation();

    const handleCardClick = (index) => {
        setClickedIndex(index);
    };

    const features = t("features", { returnObjects: true });

    return (
        <div className="bg-gradient-to-br from-green-50 to-green-100 py-14">
            <div className="container mx-auto px-6 text-center">
                {/* Open Time Highlight */}
                <div className="mb-10 flex justify-center">
                    <button className="bg-green-600 text-white font-semibold px-6 py-3 rounded-full shadow-md hover:bg-green-700 transition">
                        {t("openTime")}
                    </button>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {features.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleCardClick(index)}
                            className={`cursor-pointer bg-white p-6 rounded-2xl border hover:shadow-lg transition duration-300 transform hover:scale-105 ${clickedIndex === index ? "bg-green-100 border-green-500" : "border-gray-200"
                                }`}
                        >
                            <div
                                className={`text-5xl mb-3 transition-all ${clickedIndex === index ? "text-green-700" : "text-green-800"
                                    }`}
                            >
                                {item.icon || "🌿"}
                            </div>
                            <h3 className="text-2xl font-extrabold text-green-900 mb-1">{item.value}</h3>
                            <p className="text-sm text-gray-700 font-medium">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeatureCards;
