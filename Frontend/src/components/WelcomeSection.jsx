import React from "react";
import { useTranslation } from "react-i18next";

const WelcomeSection = () => {
    const { t } = useTranslation();

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="text-left space-y-6 pl-6">
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
    );
};

export default WelcomeSection;
