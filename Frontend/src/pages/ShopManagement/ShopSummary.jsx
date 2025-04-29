import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../utils/axiosInstance";
import InvoiceTable from "./components/InvoiceTable";
import PaymentList from "./components/PaymentList";
import TenantDetails from "./components/TenantDetails";

import { exportShopSummaryExcel, exportPaymentsExcel, exportInvoicesExcel } from "../../utils/exportExcel.js"; 

const ShopSummary = () => {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("payments");

    useEffect(() => {
        const fetchShopSummary = async () => {
            try {
                const response = await api.get(`/api/shops/shop-summary/${shopId}`);
                if (response.data && response.data.shop) {
                    setShop(response.data.shop);
                } else {
                    setError("Shop not found.");
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load shop summary.");
            } finally {
                setLoading(false);
            }
        };
        fetchShopSummary();
    }, [shopId]);

    const handleExportSummary = () => {
        if (shop) {
            exportShopSummaryExcel(shop);
        }
    };

    const handleExportPayments = () => {
        if (shop?.Payments) {
            exportPaymentsExcel(shop.Payments, shop.shop_name);
        }
    };

    const handleExportInvoices = () => {
        if (shop?.Invoices && shop?.Payments) {
          exportInvoicesExcel(
            shop.Invoices,
            shop.shop_name,
            shop.Payments
          );
        }
      };
      

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8">
            <div className="bg-white shadow-lg rounded-lg w-full max-w-7xl p-6 space-y-6">
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm hover:bg-gray-300 transition duration-200"
                >
                    ← Back
                </button>

                {/* Shop Balance */}
                <div className="bg-green-100 text-green-800 text-center text-xl font-semibold py-3 rounded-lg shadow-md">
                    Shop Balance: LKR {shop?.ShopBalance?.balance_amount || "0.00"}
                </div>

                <h2 className="text-3xl font-bold text-center text-gray-800">Shop Summary</h2>

                {loading ? (
                    <div className="text-center text-gray-500">Loading...</div>
                ) : error ? (
                    <div className="text-center text-red-600">{error}</div>
                ) : (
                    <>
                        {/* Shop Details and Tenant Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Shop Details</h3>
                                <div className="text-sm text-gray-600 space-y-1 mt-2">
                                    <p><strong>ID:</strong> {shop.shop_id}</p>
                                    <p><strong>Name:</strong> {shop.shop_name}</p>
                                    <p><strong>Location:</strong> {shop.location}</p>
                                    <p><strong>Rent Amount:</strong> LKR {shop.rent_amount}</p>
                                    <p><strong>VAT Rate:</strong> {shop.vat_rate}%</p>
                                    <p><strong>Operation Fee:</strong> LKR {shop.operation_fee}</p>
                                </div>

                                {/* Export Shop Summary Button */}
                                <div className="mt-4">
                                    <button
                                        onClick={handleExportSummary}
                                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
                                    >
                                        Export Shop Summary
                                    </button>
                                </div>
                            </div>

                            <TenantDetails tenant={shop.Tenant} />
                        </div>

                        {/* Payments and Invoices Tabs */}
                        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                            <div className="flex space-x-4 border-b pb-2 mb-4">
                                <button
                                    onClick={() => setActiveTab("payments")}
                                    className={`px-6 py-2 text-lg font-semibold transition duration-200 ${
                                        activeTab === "payments"
                                            ? "border-b-4 border-green-600 text-green-800"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Payments
                                </button>
                                <button
                                    onClick={() => setActiveTab("invoices")}
                                    className={`px-6 py-2 text-lg font-semibold transition duration-200 ${
                                        activeTab === "invoices"
                                            ? "border-b-4 border-green-600 text-green-800"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    Invoices
                                </button>
                            </div>

                            {/* Export Payments or Invoices Buttons */}
                            <div className="flex justify-end mb-4">
                                {activeTab === "payments" && (
                                    <button
                                        onClick={handleExportPayments}
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
                                    >
                                        Export Payments
                                    </button>
                                )}
                                {activeTab === "invoices" && (
                                    <button
                                        onClick={handleExportInvoices}
                                        className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-200"
                                    >
                                        Export Invoices
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="mt-4 max-h-64 overflow-y-auto">
                                {activeTab === "payments" ? (
                                    <PaymentList payments={shop.Payments} />
                                ) : (
                                    <InvoiceTable shop={shop} payments={shop.Payments} />
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ShopSummary;
