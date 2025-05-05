import React from "react";
import EconomicCenterNews from "../components/EconomicCenterNews";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ServiceSection from "../components/ServiceSection";
import WelcomeSection from "../components/WelcomeSection";

const Home = () => {
    return (
        <div>
            <Navbar />
            <WelcomeSection />
            <FeatureCards />
            <ServiceSection />
            <EconomicCenterNews />
            <Footer />
        </div>
    );
};

export default Home;
