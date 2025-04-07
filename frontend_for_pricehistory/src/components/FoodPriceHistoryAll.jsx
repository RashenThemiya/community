// src/components/FoodPriceHistoryAll.jsx
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

const getColor = (index) => {
  const colors = [
    'rgba(75, 192, 192, 1)',
    'rgba(255, 99, 132, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(231, 233, 237, 1)'
  ];
  return colors[index % colors.length];
};

const FoodPriceHistoryAll = () => {
  const [foodHistories, setFoodHistories] = useState([]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/food-prices/history-all');
      setFoodHistories(res.data);
    } catch (err) {
      console.error('Error fetching food histories:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Gather all unique dates
  const allDates = Array.from(
    new Set(foodHistories.flatMap(food => food.history.map(h => h.price_date)))
  ).sort((a, b) => new Date(a) - new Date(b));

  // Build datasets
  const datasets = foodHistories.map((food, index) => {
    const color = getColor(index);
    const dataMap = new Map(food.history.map(h => [h.price_date, parseFloat(h.price)]));

    return {
      label: food.food_name,
      data: allDates.map(date => dataMap.get(date) || null),
      borderColor: color,
      backgroundColor: color.replace('1)', '0.2)'),
      tension: 0.3,
      fill: false,
    };
  });

  const chartData = {
    labels: allDates,
    datasets
  };

  return (
    <div>
      <h2>Food Prices Over Time</h2>
      {datasets.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: 'top' },
              title: { display: false }
            },
            interaction: {
              mode: 'index',
              intersect: false
            },
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Price (ETB)'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Date'
                }
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default FoodPriceHistoryAll;
