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
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/prices/by-date/${date}`);
      setDailyPrices(Array.isArray(response.data) ? response.data : []);
    } catch {
      setDailyPrices([]);
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const filteredPrices = dailyPrices.filter(item =>
    item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Prepare UI translations
  const uiTranslations = {
    title: t("ui.title"),
    center: t("ui.center"),
    tel: t("ui.tel"),
    dateLabel: t("ui.dateLabel"),
    emailLabel: t("ui.emailLabel"),
    inquiry: t("ui.inquiry"),
    manager: t("ui.manager"),
    contact: t("ui.contact"),
    tableHeaders: {
      number: t("ui.tableHeaders.number"),
      item: t("ui.tableHeaders.item"),
      minPrice: t("ui.tableHeaders.minPrice"),
      maxPrice: t("ui.tableHeaders.maxPrice"),
    },
    noPrices: t("ui.noPrices"),
    popupBlocked: t("ui.popupBlocked"),
    uncategorized: t("ui.uncategorized"),
  };

  // Product names translation map
  const productNamesTranslations = {};
  filteredPrices.forEach(item => {
    const name = item.product?.name;
    if (name && !productNamesTranslations[name]) {
      productNamesTranslations[name] = t(name, name);
    }
  });

  // Types translation map
  const typesTranslations = t("types", { returnObjects: true });

  // Translate product names only; keep original type for grouping
  const translatedPrices = filteredPrices.map(item => ({
    ...item,
    product: {
      ...item.product,
      name: productNamesTranslations[item.product?.name] || item.product?.name
    }
  }));

  const downloadPDF = () => {
    printDailyPrices({
      prices: translatedPrices,
      date,
      ui: uiTranslations,
      productNames: productNamesTranslations,
      types: typesTranslations
    });
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
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder={t("dailyPrices.searchPlaceholder", " 🔍︎ Search Products")}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
          />
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
          <div className="text-center text-gray-500">
            {t("dailyPrices.noData", "No prices available for this date.")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredPrices.map(item => (
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
