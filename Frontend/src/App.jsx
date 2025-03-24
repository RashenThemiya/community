import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Invoice from './pages/Invoice';
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import Payment from './pages/Payment';
import Report from './pages/Report';
import Setting from './pages/Setting';
import AddShop from './pages/ShopManagement/AddShop';
import EditShop from './pages/ShopManagement/EditShop';
import ShopManagement from './pages/ShopManagement/ShopManagement';
import ViewShops from './pages/ShopManagement/ViewShop';
import TenantManagement from './pages/TenantManagement/TenantManagement';




function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/manager-dashboard" element={<ManagerDashboard />} />
            <Route path="/shop-management" element={<ShopManagement />} />
            <Route path="/tenant-management" element={<TenantManagement />} />
            <Route path="/invoices" element={<Invoice />} />
            <Route path="/payments" element={<Payment />} />
            <Route path="/reports" element={<Report />} />
            <Route path="/settings" element={<Setting />} />
            <Route path="/add-shop" element={<AddShop />} />
            <Route path="/edit-shop/:id" element={<EditShop />} />
            <Route path="/view-shops" element={<ViewShops />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
