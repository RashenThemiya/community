import axios from "axios";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ContactWeather = () => {
  const { t } = useTranslation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const API_KEY = "1f680c87a76ad7a1a04a4c6df65afa97";
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=Dambulla&appid=${API_KEY}&units=metric`);
        setWeather(res.data);
        setError(null);
      } catch (err) {
        setError(t("weather.error"));
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, [t]);

  return (
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
  );
};

export default ContactWeather;
