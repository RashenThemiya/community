import axios from 'axios';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ProductPriceChart = () => {
  const { id } = useParams();
  const [priceData, setPriceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('daily');
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/prices/product/${id}/chart`);
        setPriceData(res.data);
        setProductName(res.data?.[0]?.Product?.name || 'Product');
      } catch (error) {
        console.error('Error fetching price chart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [id]);

  useEffect(() => {
    const groupData = () => {
      if (!priceData) return [];

      if (filter === 'weekly') {
        return priceData.filter((_, i) => i % 7 === 0);
      } else if (filter === 'monthly') {
        const map = new Map();
        priceData.forEach((d) => {
          const month = d.date.slice(0, 7); // "YYYY-MM"
          if (!map.has(month)) map.set(month, d);
        });
        return Array.from(map.values());
      }

      return priceData; // daily
    };

    setFilteredData(groupData());
  }, [priceData, filter]);

  if (loading) return <p className="text-center mt-10 text-lg font-medium text-gray-600">Loading chart...</p>;
  if (filteredData.length === 0) return <p className="text-center mt-10 text-lg font-medium text-red-500">No price data available.</p>;

  const chartData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Min Price (Rs)',
        data: filteredData.map(item => item.min_price),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Max Price (Rs)',
        data: filteredData.map(item => item.max_price),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: { size: 14 },
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        ticks: { color: '#666' },
      },
      y: {
        ticks: { color: '#666' },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {productName} Price Chart
        </h2>

        <div className="flex justify-center gap-4 mb-6">
          {['daily', 'weekly', 'monthly'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300
                ${filter === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-blue-500 hover:text-white'}
              `}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 h-[400px]">
          <Line data={chartData} options={options} />
        </div>
      </div>
    </div>
  );
};

export default ProductPriceChart;
