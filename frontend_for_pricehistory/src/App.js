
import React from 'react';
import FoodPriceForm from './components/FoodPriceForm';

import FoodPriceHistoryAll from './components/FoodPriceHistoryAll';


function App() {


  return (
    <div className="App" style={{ padding: 20 }}>
      <h2>Daily Food Price Tracker</h2>
      <FoodPriceForm/>
      <h2>Food Price History</h2>
      <FoodPriceHistoryAll/>
     
    </div>
  );
}

export default App;
