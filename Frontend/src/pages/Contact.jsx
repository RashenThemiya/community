import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Contact = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = "1f680c87a76ad7a1a04a4c6df65afa97";
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Dambulla&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
        setError(null);
      } catch (error) {
        setError(t("weather.error"));
        console.error("Error fetching weather:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [t]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />

      {/* Contact Header */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800">{t("contact.title")}</h1>
        <p className="text-gray-500 mt-2">{t("contact.breadcrumb")}</p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row justify-center items-start px-4 lg:px-20 py-8 gap-12">
        {/* Left: Contact Info */}
        <div className="bg-white shadow-lg rounded-xl p-8 w-full lg:w-[600px] h-[450px]">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t("contact.talkToUs")}</h2>
          <p className="text-gray-600 mb-6">{t("contact.subText")}</p>
          <ul className="space-y-4 text-gray-700">
            <li><strong>📍 {t("contact.address")}:</strong> {t("contact.addressDetails")}</li>
            <li><strong>✉️ {t("contact.email")}:</strong> <a href="mailto:tmb.dec@gmail.com" className="text-blue-600">dambulladec@gmail.com</a></li>
            <li><strong>📞 {t("contact.phone")}:</strong> <a href="tel:0252275171" className="text-blue-600">066-2285181</a></li>

          </ul>
        </div>

        {/* Right: Embedded Google Map */}
        <div className="w-full lg:w-[600px] h-[450px] rounded-xl overflow-hidden shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-2">{t("contact.mapTitle")}</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.277423359984!2d80.64919217568517!3d7.8660103061068485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3afca5432c8b3317%3A0x7def86b17389191e!2sDambulla%20Dedicated%20Economic%20Center!5e0!3m2!1sen!2slk!4v1745987171143!5m2!1sen!2slk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Dambulla Economic Centre Map"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-start gap-12">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <img src="/images/logo.jpg" alt="Gov Logo" className="w-10 h-10" />
            <p className="font-semibold text-center">
              {t("footer.center")}<br />{t("footer.city")}
            </p>
          </div>

          <div className="mt-4 flex gap-4 text-gray-600 text-xl justify-center">
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-square"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter-square"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
          </div>

          {/* Weather Section */}
          <div className="mt-6 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg pt-5 pb-8 mb-5">
            <h3 className="text-xl font-bold text-gray-700 mb-3">{t("weather.title")}</h3>
            {loading ? (
              <p className="text-sm text-gray-500">{t("weather.loading")}</p>
            ) : error ? (
              <p className="text-sm text-red-500">{error}</p>
            ) : weather ? (
              <div className="flex items-center space-x-4">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt="Weather Icon"
                  className="w-14 h-14"
                />
                <div>
                  <p className="text-2xl font-semibold text-gray-800">{weather.main.temp}°C</p>
                  <p className="capitalize text-sm text-gray-500">{weather.weather[0].description}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Right Column */}
        <div className="grid grid-cols-2 gap-12 text-base text-gray-700">
          <div>
            <h3 className="font-bold text-lg mb-3">{t("footer.mainCenters")}</h3>
            <ul className="space-y-2">
              <li>{t("footer.thambuththegama")} - <span className="text-red-500">0252 275 171</span></li>
              <li>{t("footer.nuwaraEliya")} - <span className="text-red-500">0522 223 176</span></li>
              <li>{t("footer.narahenpita")} - <span className="text-red-500">0112 369 626</span></li>
              <li>{t("footer.welisara")} - <span className="text-red-500">0112 981 896</span></li>
              <li>{t("footer.veyangoda")} - <span className="text-red-500">0332 296 914</span></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-3">{t("footer.regionalCenters")}</h3>
            <ul className="space-y-2">
              <li>{t("footer.ratmalana")} - <span className="text-red-500">0112 709 800</span></li>
              <li>{t("footer.meegoda")} - <span className="text-red-500">0112 830 816</span></li>
              <li>{t("footer.kandeketiya")} - <span className="text-red-500">0717 453 193</span></li>
              <li>{t("footer.kepptipola")} - <span className="text-red-500">0572 280 208</span></li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;