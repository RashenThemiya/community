import 'font-awesome/css/font-awesome.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";



import AdminDashboard from "./pages/AdminDashboard";
import HomeDailyPrice from './pages/DailyPrice';
import AddDailyPrice from './pages/DailyPrice/AddDailyPrice';
import DailyPrice from './pages/DailyPrice/DailyPrice';
import EditDailyPrice from './pages/DailyPrice/EditDailyPrice';
import ViewDailyPrice from './pages/DailyPrice/ViewDailyPrice';
import Home from "./pages/Home";
import Invoice from './pages/Invoice/Invoice';
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import CorrectPayment from './pages/Payment/CorrectPayment';
import MakePayment from './pages/Payment/makePayment';
import Payment from './pages/Payment/Payment';
import ViewPayments from './pages/Payment/ViewPayments';
import AddProduct from './pages/ProductManagement/AddProduct';
import EditProduct from './pages/ProductManagement/EditProduct';
import ProductManagement from './pages/ProductManagement/ProductManagement';
import ProductSummary from './pages/ProductManagement/ProductSummary';
import ViewProducts from './pages/ProductManagement/ViewProducts';
import AddPublication from './pages/Publications/AddPublication';
import Publication from './pages/Publications/PublicationManagement';
import ViewPublications from './pages/Publications/ViewPublications';
import Report from './pages/Report/Report';
import Sanitation from './pages/Sanitation/SanitationTickets';
import AdminPanel from './pages/SettingPage/AdminPanel';
import Setting from './pages/SettingPage/Setting';
import SystemLog from './pages/SettingPage/SystemLog';
import UpdateVATRate from './pages/SettingPage/UpdateVATRate';
import AddShop from './pages/ShopManagement/AddShop';
import EditShop from './pages/ShopManagement/EditShop';
import ShopManagement from './pages/ShopManagement/ShopManagement';
import ShopSummary from './pages/ShopManagement/ShopSummary';
import ViewShops from './pages/ShopManagement/ViewShop';
import AddTenant from './pages/TenantManagement/AddTenant';
import EditTenant from './pages/TenantManagement/EditTenant';
import TenantManagement from './pages/TenantManagement/TenantManagement';
import ViewTenants from './pages/TenantManagement/ViewTenants';
import VehicleTicket from './pages/VehicleTickets/VehicleTickets';
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
            <Route path="/update-vat-rate" element={<UpdateVATRate />} />
            <Route path="/system-logs" element={<SystemLog />} />
            <Route path="/vehicle-ticketing" element={<VehicleTicket />} />
            <Route path="/sanitation-ticketing" element={<Sanitation />} />
            <Route path="/product-management" element={<ProductManagement />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/view-products" element={<ViewProducts />} />
            <Route path="/daily-price" element={<DailyPrice/>} />
            <Route path="/add-dailyprice" element={<AddDailyPrice />} />
            <Route path="/view-dailyprices" element={<ViewDailyPrice />} />
            <Route path="/edit-dailyprice/:date/:productId" element={<EditDailyPrice />} />
            <Route path="/product-summary/:productId" element={<ProductSummary />} /> 
            <Route path="/publication" element={<Publication />} />
            <Route path="/add-publication" element={<AddPublication />} />
            <Route path="/view-publications" element={<ViewPublications />} />
            <Route path="/home-dailyprice" element={<HomeDailyPrice />} />
            <Route path="/admin-panel" element={<AdminPanel />}/>

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
