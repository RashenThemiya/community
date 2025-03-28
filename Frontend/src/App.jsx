import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";


import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import Invoice from './pages/Invoice/Invoice';
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import CorrectPayment from './pages/Payment/CorrectPayment';
import MakePayment from './pages/Payment/makePayment';
import Payment from './pages/Payment/Payment';
import ViewPayments from './pages/Payment/ViewPayments';
import Report from './pages/Report';
import Setting from './pages/Setting';
import AddShop from './pages/ShopManagement/AddShop';
import EditShop from './pages/ShopManagement/EditShop';
import ShopManagement from './pages/ShopManagement/ShopManagement';
import ShopSummary from './pages/ShopManagement/ShopSummary';
import ViewShops from './pages/ShopManagement/ViewShop';
import AddTenant from './pages/TenantManagement/AddTenant';
import EditTenant from './pages/TenantManagement/EditTenant';
import TenantManagement from './pages/TenantManagement/TenantManagement';
import ViewTenants from './pages/TenantManagement/ViewTenants';
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
            <Route path="/add-tenant" element={<AddTenant />} />
            <Route path="/view-tenants" element={<ViewTenants />} />
            <Route path="/edit-tenant/:id" element={<EditTenant />} />
            <Route path="/make-payment" element={<MakePayment />} />
            <Route path="/view-payments" element={<ViewPayments />} />
            <Route path="/correct-payment" element={<CorrectPayment />} />
            <Route path="/shop-summary/:shopId" element={<ShopSummary />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
