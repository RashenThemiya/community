import axios from "axios";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const DailyPrice = () => {
  const { t } = useTranslation();
  const [dailyPrices, setDailyPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/prices/by-date/${date}`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          setDailyPrices(data);
        } else {
          console.error("Expected an array but got:", data);
          setDailyPrices([]);
        }
      } catch (error) {
        console.error("Error fetching prices:", error);
        setDailyPrices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, [date]);

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          {t("dailyPrices.title", "Daily Product Prices")}
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500">
            {t("dailyPrices.loading", "Loading...")}
          </p>
        ) : dailyPrices.length === 0 ? (
          <p className="text-center text-red-500">
            {t("dailyPrices.noData", "No prices available for this date.")}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dailyPrices.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded shadow hover:shadow-md transition duration-200"
              >
                {item.product?.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-32 w-full object-cover mb-4 rounded"
                  />
                )}
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.product?.name || "Unnamed Product"}
                </h2>
                <p className="text-gray-600">{item.product?.type || "N/A"}</p>
                <p className="mt-2 font-bold text-green-700">
                  {t("dailyPrices.price", "Price")}: Rs. {item.amount}
                </p>
                <p className="text-sm text-gray-500">
                  {t("dailyPrices.date", "Date")}: {item.date}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPrice;
