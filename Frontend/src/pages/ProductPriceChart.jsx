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
  const [filter, setFilter] = useState('daily'); // 'daily', 'weekly', 'monthly'
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

  if (loading) return <p>Loading chart...</p>;
  if (filteredData.length === 0) return <p>No price data available.</p>;

  const chartData = {
    labels: filteredData.map(item => item.date),
    datasets: [
      {
        label: 'Min Price (Rs)',
        data: filteredData.map(item => item.min_price),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        pointRadius: 4,
        tension: 0.4,
        fill: false,
      },
      {
        label: 'Max Price (Rs)',
        data: filteredData.map(item => item.max_price),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
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
    <div>
      <Navbar />
      <div style={{ width: '100%', height: '350px', padding: '10px' }}>
        <h2 className="text-3xl font-bold text-center mb-6">
          {productName} Price Chart
        </h2>

        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
          <label htmlFor="filter" style={{ fontSize: '16px', marginRight: '10px' }}>Filter: </label>
          <select
            id="filter"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{
              padding: '6px 12px',
              backgroundColor: '#007bff',
              color: 'white',
              borderRadius: '5px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default ProductPriceChart;
