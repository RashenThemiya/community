import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Skeleton } from "../components/Skeleton";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import toast, { Toaster } from "react-hot-toast";

const DailyPriceCard = ({ item, navigate, t }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out">
      {item.product?.image ? (
        <img
          src={item.product.image}
          alt={item.product?.name || "Product"}
          className="h-32 w-full object-cover mb-4 rounded"
        />
      ) : (
        <div className="h-32 w-full bg-gray-100 flex items-center justify-center mb-4 rounded text-gray-400 text-sm">
          {t("dailyPrices.noImage", "No Image")}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-800 truncate">
        {item.product?.name || "Unnamed Product"}
      </h2>
      <p className="text-gray-500 text-sm">{item.product?.type || "N/A"}</p>

      <p className="mt-2 font-bold text-green-700">
        {t("dailyPrices.priceRange", "Price Range")}: Rs. {item.min_price} - Rs. {item.max_price}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        {t("dailyPrices.date", "Date")}: {item.date}
      </p>

      <button
        onClick={() => navigate(`/product/${item.product?.id}/chart`)}
        className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
      >
        {t("dailyPrices.history", "View Price History")}
      </button>
    </div>
  );
};

const DailyPrice = () => {
  const { t } = useTranslation();
  const [dailyPrices, setDailyPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const navigate = useNavigate();

  const fetchPrices = useCallback(async () => {
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
  }, [date]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`Daily Product Prices`, 105, 20, { align: "center" });

    // Subtitle (date)
    doc.setFontSize(12);
    doc.text(`Date: ${date}`, 105, 30, { align: "center" });

    // Table
    const tableColumn = ["Product Name", "Type", "Min Price (Rs.)", "Max Price (Rs.)"];
    const tableRows = [];

    dailyPrices.forEach((item) => {
      tableRows.push([
        item.product?.name || "Unnamed",
        item.product?.type || "N/A",
        item.min_price,
        item.max_price
      ]);
    });

    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 10,
      },
      headStyles: {
        fillColor: [52, 152, 219], // Blue Header
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240], // Light grey rows
      },
      margin: { top: 40 },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Downloaded on ${new Date().toLocaleString()}`, 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 195, 290, { align: "right" });
    }

    doc.save(`Daily_Prices_${date}.pdf`);

    // Show toast after saving
    toast.success("PDF downloaded successfully!");
  };

  return (
    <div>
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />

      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("dailyPrices.title", "Daily Product Prices")}
        </h1>

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!loading && dailyPrices.length > 0 && (
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
        ) : dailyPrices.length === 0 ? (
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
            {dailyPrices.map((item) => (
              <DailyPriceCard key={item.id} item={item} navigate={navigate} t={t} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyPrice;
