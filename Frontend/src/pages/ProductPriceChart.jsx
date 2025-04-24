import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
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
        console.log('First price entry:', res.data?.[0]);

        setPriceData(res.data);
        // Fetch product name
        setProductName(res.data?.[0]?.Product?.name || 'Product');

        console.log() // Assuming the product name is in the response
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
        label: 'Price (Rs)',
        data: filteredData.map(item => item.price),
        borderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: '#ff6384',
        pointBorderColor: '#fff',
        pointRadius: 5,
        tension: 0.4,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 150);
          gradient.addColorStop(0, 'rgba(255,99,132,0.3)');
          gradient.addColorStop(1, 'rgba(54,162,235,0.1)');
          return gradient;
        },
        fill: true,
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
    <div>
       <Navbar />
    <div style={{ width: '100%', height: '350px', padding: '10px' }}>
      
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h2 className="text-3xl font-bold text-center mb-6">{productName} Price Chart</h2> {/* Display the product name */}
      </div>

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
