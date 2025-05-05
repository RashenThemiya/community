import { BellAlertIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import EconomicCenterNews from "../components/EconomicCenterNews";
import FeatureCards from "../components/FeatureCards";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewsWidget from "../components/NewsWidget";
import ServiceSection from "../components/ServiceSection";
import WelcomeSection from "../components/WelcomeSection";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Example: Determine if there's any news to display
  const hasNews = true; // Replace this with real logic or prop from EconomicCenterNews

  return (
    <div>
      <Navbar />
      <WelcomeSection />
      <FeatureCards />
      <ServiceSection />
      <EconomicCenterNews />
      <Footer />
       

      {/* 🔽 Slide-out News Panel */}
{/* 🔽 Slide-out News Panel */}
<div className={`fixed top-1/4 left-0 z-50 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
  <div className="bg-white shadow-2xl border-l-4 border-green-600 rounded-r-xl w-80 p-4">
    <div className="flex items-center gap-2 mb-2">
      <BellAlertIcon className="h-5 w-5 text-green-700 animate-bounce" />
      <h3 className="text-green-800 font-semibold text-lg">Center News</h3>
    </div>
    <NewsWidget />
  </div>
</div>


      {/* 🟢 Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-1/3 left-0 z-50 bg-green-600 text-white p-2 rounded-r-lg shadow-md transition-all duration-300 hover:bg-green-700 ${
          hasNews && !isOpen ? "animate-pulse" : ""
        }`}
      >
        <div className="relative">
          {isOpen ? (
            <ChevronLeftIcon className="h-6 w-6" />
          ) : (
            <ChevronRightIcon className="h-6 w-6" />
          )}
          {/* 🔴 Notification Dot */}
          {hasNews && !isOpen && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
          )}
        </div>
      </button>
    </div>
  );
};

export default Home;
