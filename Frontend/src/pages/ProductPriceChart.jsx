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

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const ProductPriceChart = () => {
  const { id } = useParams();
  const [priceData, setPriceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/prices/product/${id}/chart`);
        setPriceData(res.data);
        // Fetch product name
        setProductName(res.data?.[0]?.productName || 'Product'); // Assuming the product name is in the response
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

  if (loading) return <p className="text-center text-gray-500">Loading chart...</p>;
  if (filteredData.length === 0) return <p className="text-center text-red-500">No price data available.</p>;

  const chartData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Min Price (Rs)',
        data: filteredData.map(item => item.min_price),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Max Price (Rs)',
        data: filteredData.map(item => item.max_price),
        borderColor: 'rgba(255,99,132,1)',
        backgroundColor: 'rgba(255,99,132,0.1)',
        pointBackgroundColor: 'rgba(255,99,132,1)',
        pointBorderColor: '#fff',
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
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#666',
        },
      },
      y: {
        ticks: {
          color: '#666',
        },
      },
    },
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 className="text-2xl font-bold">{productName} Price Chart</h2>
      </div>

      <div className="flex justify-end mb-6">
        <label htmlFor="filter" className="mr-2 text-lg">Filter: </label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div style={{ width: '100%', height: '350px' }}>
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProductPriceChart;
