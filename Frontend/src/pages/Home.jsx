// src/pages/Home.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import Slider from "react-slick";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import EconomicCenterNews from "../components/EconomicCenterNews";

// Import slick-carousel styles
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const Home = () => {
    const { t } = useTranslation();

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <div>
            <Navbar />

            {/* Carousel */}
            <div className="w-full">
                <Slider {...settings}>
                    <div>
                        <img
                            src="/images/1.jpg"
                            alt="Slide 1"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div>
                        <img
                            src="/images/2.jpg"
                            alt="Slide 2"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div>
                        <img
                            src="/images/3.jpg"
                            alt="Slide 3"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                </Slider>
            </div>

            {/* Welcome Section */}
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-6">
                    <h1 className="text-4xl font-bold text-blue-800">
                        {t("home.welcomeMessage")}
                    </h1>
                    <p className="text-lg text-gray-700 text-justify">
                        {t("home.description")}
                    </p>
                </div>

                <div>
                    <img
                        src="/images/logo.jpg"
                        alt="Illustration"
                        className="rounded-3xl w-full h-[350px] object-contain"
                    />
                </div>
            </div>

            <EconomicCenterNews />

            <Footer />
        </div>
    );
};

export default Home;
