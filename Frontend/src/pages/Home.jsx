// src/pages/Home.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import EconomicCenterNews from "../components/EconomicCenterNews";

// Optional: slick-carousel styles (can be removed if no longer needed)
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Home = () => {
    const { t } = useTranslation();

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

            <EconomicCenterNews />
            <Footer />
        </div>
    );
};

export default Home;
