// src/pages/Home.jsx

import React from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Slider from "react-slick";

// Import slick-carousel styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

            {/* Full-Width Carousel at the Top */}
            <div className="w-full">
                <Slider {...settings}>
                    <div>
                        <img
                            src="1.jpg"
                            alt="Slide 1"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div>
                        <img
                            src="2.jpg"
                            alt="Slide 2"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div>
                        <img
                            src="3.jpg"
                            alt="Slide 3"
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                </Slider>
            </div>

            {/* Welcome Section with Text on Left and Image on Right */}
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Welcome Text */}
                <div className="text-left space-y-6">
                    <h1 className="text-3xl font-bold">{t("home.welcomeMessage")}</h1>
                    <p className="text-lg text-gray-700 text-justify">{t("home.description")}</p>
                </div>

                {/* Right Side: Image */}
                <div>
                    <img
                        src="logo.jpg"
                        alt="Illustration"
                        className="rounded-3xl w-full h-[350px] object-contain"
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Home;
