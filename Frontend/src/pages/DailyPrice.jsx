import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Skeleton } from "../components/Skeleton";
import DailyPriceCard from './DailyPriceCard';
import Footer from '../components/Footer';
import { printDailyPrices } from '../utils/printDailyPrice';

const DailyPrice = () => {
  const { t } = useTranslation();
  const [dailyPrices, setDailyPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/prices/by-date/${date}`
      );
      const data = response.data;
      setDailyPrices(Array.isArray(data) ? data : []);
    } catch (error) {
      setDailyPrices([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const filteredPrices = dailyPrices.filter((item) =>
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // FIX: Map filteredPrices to use translated product names before printing PDF
  const downloadPDF = () => {
    const translatedPrices = filteredPrices.map(item => ({
      ...item,
      product: {
        ...item.product,
        // Use the product name as the translation key
        name: t(item.product?.name, item.product?.name)
      }
    }));
    printDailyPrices({ prices: translatedPrices, date });
  };

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("dailyPrices.title", "Daily Product Prices")}
        </h1>
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 flex-wrap">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
  type="text"
  placeholder={t("dailyPrices.searchPlaceholder", " 🔍︎ Search products")}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
/>

          </div>
          {!loading && filteredPrices.length > 0 && (
            <button
              onClick={downloadPDF}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-200"
            >
              {t("dailyPrices.downloadPdf", "Download PDF")}
            </button>
          )}
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <Skeleton key={idx} />
            ))}
          </div>
        ) : filteredPrices.length === 0 ? (
          <div className="flex flex-col items-center text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mb-4 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M9 16h6M9 12h6m-7 8h8a2 2 0 002-2V8a2 2 0 00-2-2h-2l-2-3h-4l-2 3H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            {t("dailyPrices.noData", "No prices available for this date.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPrices.map((item) => (
              <DailyPriceCard key={item.id} item={item} navigate={navigate} t={t} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default DailyPrice;
