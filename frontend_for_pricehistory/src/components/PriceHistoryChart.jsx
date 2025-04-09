import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import api from '../api';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const PriceHistoryChart = ({ foodId }) => {
  const [chartData, setChartData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await api.get(`/food-prices/history/${foodId}`);
      const sorted = res.data.sort((a, b) => new Date(a.price_date) - new Date(b.price_date));
      setChartData(sorted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [foodId]); // Re-fetch data if foodId changes

  const data = {
    labels: chartData.map(d => d.price_date),
    datasets: [{
      label: 'Price (ETB)',
      data: chartData.map(d => parseFloat(d.price)),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false,
      tension: 0.3
    }]
  };

  return (
    <div>
      <h4>Food Price History</h4>
      <Line data={data} />
    </div>
  );
};

export default PriceHistoryChart;
