// src/components/FoodPriceForm.jsx
import React, { useState } from 'react';
import api from '../api';

const FoodPriceForm = ({ onAddSuccess }) => {
  const [form, setForm] = useState({
    food_id: '',
    food_name: '',
    price_date: '',
    price: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/food-prices/add', {
        ...form,
        food_id: parseInt(form.food_id),
        price: parseFloat(form.price),
      });
      alert('Price added!');
      onAddSuccess();
      setForm({ food_id: '', food_name: '', price_date: '', price: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add price');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <div>
        <input type="number" name="food_id" value={form.food_id} onChange={handleChange} placeholder="Food ID" required />
        <input type="text" name="food_name" value={form.food_name} onChange={handleChange} placeholder="Food Name" required />
        <input type="date" name="price_date" value={form.price_date} onChange={handleChange} required />
        <input type="number" name="price" value={form.price} onChange={handleChange} step="0.01" placeholder="Price (ETB)" required />
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default FoodPriceForm;
