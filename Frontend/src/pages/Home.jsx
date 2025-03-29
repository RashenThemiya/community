// src/pages/Home.jsx

import React from "react";
import { useTranslation } from "react-i18next";  // Import the i18next hook
import Navbar from "../components/Navbar";

const Home = () => {
    const { t } = useTranslation(); // Use translation hook

    return (
        <div>
            <Navbar />
            <div className="container mx-auto text-center py-10">
                <h1 className="text-3xl font-bold">{t("home.welcomeMessage")}</h1>
                <p className="text-lg text-gray-700 mt-4">{t("home.description")}</p>
            </div>
        </div>
    );
};

export default Home;
