import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const darkGreenBlack = "#145214";

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
    <div className="relative bg-gray-50 min-h-screen overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage: 'url("/images/Contact Bg.jpg")',
          filter: "brightness(0.5)",
        }}
      ></div>

      <div className="absolute inset-0 bg-white/10 z-10"></div>

      <div className="relative z-20">
        <Navbar />

        <div className="text-center py-12 px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{t("contact.title")}</h1>
          <p className="text-gray-500 mt-2">{t("contact.breadcrumb")}</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start px-4 sm:px-6 lg:px-20 py-8 gap-12">
          <div className="relative w-full max-w-xl lg:max-w-[600px] h-[500px] rounded-xl overflow-hidden shadow-lg">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url('/images/talk.jpg')",
                opacity: 0.5,
                zIndex: 0,
                filter: "blur(2px) brightness(0.8)",
              }}
            />
            <div className="relative z-10 p-8 sm:p-9 h-full w-full">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-6">{t("contact.talkToUs")}</h2>
              <p className="text-base sm:text-lg text-gray-700 mb-10">{t("contact.subText")}</p>

             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
  <div className="bg-white/90 p-2 sm:p-4 rounded-lg shadow-md text-center hover:shadow-xl transition h-full flex flex-col justify-between">
    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📍</div>
    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 break-words">
      {t("contact.address")}
    </h3>
    <p className="text-gray-700 text-xs sm:text-sm break-words">
      {t("Kandy - Jaffna Highway, Dambulla")}
    </p>
  </div>

  <div className="bg-white/90 p-2 sm:p-4 rounded-lg shadow-md text-center hover:shadow-xl transition h-full flex flex-col justify-between">
    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">✉️</div>
    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 break-words">
      {t("contact.email")}
    </h3>
    <a
      href="mailto:dambulladec@gmail.com"
      className="text-blue-700 text-xs sm:text-sm hover:underline break-words"
    >
      dambulladec@gmail.com
    </a>
  </div>

  <div className="bg-white/90 p-2 sm:p-4 rounded-lg shadow-md text-center hover:shadow-xl transition h-full flex flex-col justify-between">
    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">📞</div>
    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 break-words">
      {t("contact.phone")}
    </h3>
    <a
      href="tel:0662285181"
      className="text-blue-700 text-xs sm:text-sm hover:underline break-words"
    >
      066-2285181
    </a>
  </div>

              </div>
            </div>
          </div>

          <div className="w-full max-w-xl lg:max-w-[600px] h-[500px] rounded-xl overflow-hidden shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">{t("contact.mapTitle")}</h2>
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

        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row justify-between items-start gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img src="/images/logo.jpg" alt="Gov Logo" className="w-10 h-10" />
              <p className="font-semibold text-center">
                {t("footer.center")}<br />{t("footer.city")}
              </p>
            </div>

            <div className="mt-4 flex gap-4 text-gray-600 text-xl justify-center lg:justify-start">
              <a href="https://www.facebook.com/100027588023825" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-square"></i></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter-square"></i></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-linkedin"></i></a>
            </div>

            <div className="mt-6 w-full max-w-xs rounded-lg border border-gray-200 bg-white p-4 shadow-lg pt-5 pb-8 mb-5">
              <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-3">{t("weather.title")}</h3>
              {loading ? (
                <p className="text-sm text-gray-500">{t("weather.loading")}</p>
              ) : error ? (
                <p className="text-sm text-red-500">{error}</p>
              ) : weather ? (
                <div className="flex items-center space-x-4">
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                    className="w-12 h-12"
                  />
                  <div>
                    <p className="text-lg font-semibold text-gray-800">{weather.main.temp}°C</p>
                    <p className="capitalize text-sm text-gray-500">{weather.weather[0].description}</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <a
            href="tel:+0662285181"
            className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 hover:bg-green-700 transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a2 2 0 011.94 1.52l.58 2.32a2 2 0 01-.45 1.86L8.1 10.9a11.05 11.05 0 005.01 5.01l2.2-2.2a2 2 0 011.86-.45l2.32.58A2 2 0 0121 17.72V21a2 2 0 01-2 2h-.28C9.95 23 1 14.05 1 3.28V3a2 2 0 012-2z"
              />
            </svg>
            Call Center
          </a>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
            <div>
              <h3
                tabIndex={0}
                className="font-extrabold text-2xl sm:text-3xl mb-4 border-b-4 pb-1 cursor-pointer"
                style={{ borderColor: darkGreenBlack, color: darkGreenBlack }}
              >
                {t("footer.mainCenters")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm font-semibold text-green-900">
                {[{ label: t("footer.thambuththegama"), phone: "0252 275 171" },
                  { label: t("footer.nuwaraEliya"), phone: "0522 223 176" },
                  { label: t("footer.narahenpita"), phone: "0112 369 626" },
                  { label: t("footer.welisara"), phone: "0112 981 896" },
                  { label: t("footer.veyangoda"), phone: "0332 296 914" }].map(({ label, phone }) => (
                    <li key={phone} className="hover:text-green-700 cursor-pointer">
                      {label} - <span className="font-bold text-red-600 text-xs">{phone}</span>
                    </li>
                ))}
              </ul>
            </div>

            <div>
              <h3
                tabIndex={0}
                className="font-extrabold text-2xl sm:text-3xl mb-4 border-b-4 pb-1 cursor-pointer"
                style={{ borderColor: darkGreenBlack, color: darkGreenBlack }}
              >
                {t("footer.regionalCenters")}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm font-semibold text-green-900">
                {[{ label: t("footer.ratmalana"), phone: "0112 709 800" },
                  { label: t("footer.meegoda"), phone: "0112 830 816" },
                  { label: t("footer.kandeketiya"), phone: "0717 453 193" },
                  { label: t("footer.kepptipola"), phone: "0572 280 208" }].map(({ label, phone }) => (
                    <li key={phone} className="hover:text-green-700 cursor-pointer">
                      {label} - <span className="font-bold text-red-600 text-xs">{phone}</span>
                    </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Contact;
