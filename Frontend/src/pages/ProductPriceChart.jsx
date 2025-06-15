import axios from 'axios';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Tooltip,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import zoomPlugin from 'chartjs-plugin-zoom';

import { format, parseISO } from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
  zoomPlugin
);

const ProductPriceChart = () => {
  const { id } = useParams();
  const [priceData, setPriceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('daily');
  const [productName, setProductName] = useState('');
  const [showMinPrice, setShowMinPrice] = useState(true);
  const [showMaxPrice, setShowMaxPrice] = useState(true);
  const [timeRange, setTimeRange] = useState('all');
  const chartRef = useRef();

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
      if (!priceData || priceData.length === 0) return [];

      let data = [...priceData];
      const now = new Date();
      let startDate = null;

      switch (timeRange) {
        case '5D': startDate = new Date(now.setDate(now.getDate() - 5)); break;
        case '10D': startDate = new Date(now.setDate(now.getDate() - 10)); break;
        case '1M': startDate = new Date(now.setMonth(now.getMonth() - 1)); break;
        case '1Y': startDate = new Date(now.setFullYear(now.getFullYear() - 1)); break;
        case '5Y': startDate = new Date(now.setFullYear(now.getFullYear() - 5)); break;
        default: break;
      }

      if (startDate) {
        data = data.filter(d => new Date(d.date) >= startDate);
      }

      if (filter === 'weekly') {
        return data.filter((_, i) => i % 7 === 0);
      } else if (filter === 'monthly') {
        const map = new Map();
        data.forEach((d) => {
          const month = d.date.slice(0, 7); // "YYYY-MM"
          if (!map.has(month)) map.set(month, d);
        });
        return Array.from(map.values());
      }

      return data;
    };

    setFilteredData(groupData());
  }, [priceData, filter, timeRange]);

  if (loading) return <p className="text-center mt-10 text-lg font-medium text-gray-600">Loading chart...</p>;
  if (filteredData.length === 0) return <p className="text-center mt-10 text-lg font-medium text-red-500">No price data available.</p>;

  const datasets = [];

  if (showMinPrice) {
    datasets.push({
      label: 'Min Price (Rs)',
      data: filteredData.map(item => ({ x: item.date, y: item.min_price })),
      borderColor: '#007f5f',
      backgroundColor: 'rgba(0, 127, 95, 0.2)',
      pointBorderColor: '#005f46',
      pointBackgroundColor: '#005f46',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    });
  }

  if (showMaxPrice) {
    datasets.push({
      label: 'Max Price (Rs)',
      data: filteredData.map(item => ({ x: item.date, y: item.max_price })),
      borderColor: '#ff6f00',
      backgroundColor: 'rgba(255, 111, 0, 0.2)',
      pointBorderColor: '#e65100',
      pointBackgroundColor: '#e65100',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
    });
  }

  const chartData = { datasets };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#333',
          font: { size: 14 },
        },
      },
      tooltip: {
        callbacks: {
          title: (tooltipItems) => {
            return format(parseISO(tooltipItems[0].parsed.x), 'PPP');
          },
        },
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit:
            timeRange === '1Y' ? 'month'
              : timeRange === '5Y' ? 'year'
              : 'day',
          tooltipFormat: 'PP',
        },
        ticks: {
          color: '#666',
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit:
            timeRange === '1M' ? 10 :
            timeRange === '1Y' ? 12 :
            timeRange === '5Y' ? 8 : undefined,
        },
        grid: { color: '#eee' },
      },
      y: {
        ticks: { color: '#666' },
        grid: { color: '#eee' },
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

        {/* Time Range Filter */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {['5D', '10D', '1M', '1Y', '5Y', 'all'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md font-medium transition-all duration-300
                ${timeRange === range
                  ? 'bg-blue-700 text-white shadow'
                  : 'bg-white text-gray-800 border hover:bg-blue-600 hover:text-white'}`}
            >
              {range}
            </button>
          ))}
        </div>

        {/* Show/Hide Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            onClick={() => setShowMinPrice(prev => !prev)}
            className={`px-4 py-2 rounded-lg font-medium border transition duration-300
              ${showMinPrice
                ? 'bg-green-700 text-white'
                : 'bg-white text-green-700 border-green-700 hover:bg-green-600 hover:text-white'}`}
          >
            {showMinPrice ? 'Hide Min Price' : 'Show Min Price'}
          </button>
          <button
            onClick={() => setShowMaxPrice(prev => !prev)}
            className={`px-4 py-2 rounded-lg font-medium border transition duration-300
              ${showMaxPrice
                ? 'bg-orange-600 text-white'
                : 'bg-white text-orange-600 border-orange-600 hover:bg-orange-500 hover:text-white'}`}
          >
            {showMaxPrice ? 'Hide Max Price' : 'Show Max Price'}
          </button>
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-lg shadow-lg p-4 h-[400px] relative">
          <Line ref={chartRef} data={chartData} options={options} />
          <button
            onClick={() => chartRef.current?.resetZoom()}
            className="absolute top-2 right-2 px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-700"
          >
            Reset Zoom
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPriceChart;
