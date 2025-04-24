import React, { useEffect, useState } from "react";
import {
    FaChartBar,
    FaClock,
    FaMoneyBillWave,
    FaStore,
    FaUsers,
} from "react-icons/fa";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import api from "../utils/axiosInstance";

const months = [
  { name: "All Months", value: 0 },
  { name: "January", value: 1 },
  { name: "February", value: 2 },
  { name: "March", value: 3 },
  { name: "April", value: 4 },
  { name: "May", value: 5 },
  { name: "June", value: 6 },
  { name: "July", value: 7 },
  { name: "August", value: 8 },
  { name: "September", value: 9 },
  { name: "October", value: 10 },
  { name: "November", value: 11 },
  { name: "December", value: 12 },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

const AdminDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(currentYear);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
    }).format(amount || 0);

  const mergeMonthlySummaries = (monthlyData) => {
    const initial = {
      invoiceCounts: {
        paid_count: 0,
        unpaid_count: 0,
        arrest_count: 0,
        partial_count: 0,
      },
      rentSums: { total_rent_amount: 0, total_rent_paid: 0 },
      vatSums: { total_vat_amount: 0, total_vat_paid: 0 },
      fineSums: { total_fine_amount: 0, total_fine_paid: 0 },
      operationFeeSums: { total_operation_amount: 0, total_operation_paid: 0 },
    };

    return monthlyData.reduce((acc, month) => {
      ["rentSums", "vatSums", "fineSums", "operationFeeSums"].forEach((field) => {
        Object.entries(month[field] || {}).forEach(([key, value]) => {
          acc[field][key] += parseFloat(value) || 0;
        });
      });
      Object.entries(month.invoiceCounts || {}).forEach(([key, value]) => {
        acc.invoiceCounts[key] += parseInt(value) || 0;
      });

      return acc;
    }, initial);
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const params = { year };
      if (month !== 0) params.month = month;

      const response = await api.get("/api/summery/summary", { params });
      let processedSummary = response.data;

      if (month === 0 && response.data.monthlySummaries) {
        const aggregated = mergeMonthlySummaries(response.data.monthlySummaries);

        processedSummary = {
          ...response.data,
          ...aggregated,
        };
      }

      setSummary(processedSummary);
      setError("");
    } catch (err) {
      console.error("Error fetching summary:", err);
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-700 text-lg">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        {error}
      </div>
    );

  // Safe defaults
  const rentAmount = parseFloat(summary?.rentSums?.total_rent_amount) || 0;
  const rentPaid = parseFloat(summary?.rentSums?.total_rent_paid) || 0;
  const vatAmount = parseFloat(summary?.vatSums?.total_vat_amount) || 0;
  const vatPaid = parseFloat(summary?.vatSums?.total_vat_paid) || 0;
  const fineAmount = parseFloat(summary?.fineSums?.total_fine_amount) || 0;
  const finePaid = parseFloat(summary?.fineSums?.total_fine_paid) || 0;
  const opFeeAmount =
    parseFloat(summary?.operationFeeSums?.total_operation_amount) || 0;
  const opFeePaid =
    parseFloat(summary?.operationFeeSums?.total_operation_paid) || 0;

  const totalIncome = rentAmount + vatAmount + fineAmount + opFeeAmount;
  const totalCollectedIncome = rentPaid + vatPaid + finePaid + opFeePaid;
  const totalPendingCollection = totalIncome - totalCollectedIncome;
  const pendingCollection =
    rentAmount - rentPaid +
    vatAmount - vatPaid +
    fineAmount - finePaid +
    opFeeAmount - opFeePaid;

  const invoiceCounts = summary?.invoiceCounts || {};
  const rawInvoiceData = [
    { name: "Paid", value: invoiceCounts.paid_count, color: "#4CAF50" },
    { name: "Unpaid", value: invoiceCounts.unpaid_count, color: "#F44336" },
    { name: "Partially Paid", value: invoiceCounts.partial_count, color: "#2196F3" },
    { name: "Arrest", value: invoiceCounts.arrest_count, color: "#FF9800" },
  ];
  
  // Ensure values are numbers and filter out zero values
  const invoiceData = rawInvoiceData
    .map(item => ({ ...item, value: parseInt(item.value) || 0 }))
    .filter(item => item.value > 0);
  
  const incomeStats = [
    { title: "Total Income", value: formatCurrency(totalIncome), icon: <FaMoneyBillWave className="text-3xl text-green-700" /> },
    { title: "Collected Income", value: formatCurrency(totalCollectedIncome), icon: <FaMoneyBillWave className="text-3xl text-blue-600" /> },
    { title: "Pending Collection (All)", value: formatCurrency(totalPendingCollection), icon: <FaMoneyBillWave className="text-3xl text-red-500" /> },
  ];

  const detailedStats = [
    { title: "Total Tenants", value: summary?.tenantCount || 0, icon: <FaUsers className="text-3xl text-blue-500" /> },
    { title: "Total Shops", value: summary?.shopCount || 0, icon: <FaStore className="text-3xl text-green-500" /> },
    { title: "Total Rent Amount", value: formatCurrency(rentAmount), icon: <FaMoneyBillWave className="text-3xl text-purple-500" /> },
    { title: "Total Rent Paid", value: formatCurrency(rentPaid), icon: <FaChartBar className="text-3xl text-orange-500" /> },
    { title: "Total VAT Amount", value: formatCurrency(vatAmount), icon: <FaChartBar className="text-3xl text-blue-500" /> },
    { title: "Total VAT Paid", value: formatCurrency(vatPaid), icon: <FaChartBar className="text-3xl text-indigo-500" /> },
    { title: "Total Fines", value: formatCurrency(fineAmount), icon: <FaClock className="text-3xl text-red-500" /> },
    { title: "Total Fine Paid", value: formatCurrency(finePaid), icon: <FaClock className="text-3xl text-orange-500" /> },
    { title: "Total Operation Fee", value: formatCurrency(opFeeAmount), icon: <FaClock className="text-3xl text-pink-500" /> },
    { title: "Operation Fee Paid", value: formatCurrency(opFeePaid), icon: <FaClock className="text-3xl text-purple-600" /> },
    { title: "Pending Collection", value: formatCurrency(pendingCollection), icon: <FaClock className="text-3xl text-yellow-500" /> },
    { title: "Total Shop Balance", value: formatCurrency(summary?.shopBalanceSum?.total_shop_balance || 0), icon: <FaMoneyBillWave className="text-3xl text-green-500" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar className="w-64 flex-shrink-0" />
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Track and manage financial performance.</p>

        <div className="flex space-x-4 mt-4">
          <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))} className="p-2 border border-gray-300 rounded">
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
          <select value={year} onChange={(e) => setYear(parseInt(e.target.value))} className="p-2 border border-gray-300 rounded">
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Income Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {incomeStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              {stat.icon}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{stat.value}</h2>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-700">Detailed Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {detailedStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
              {stat.icon}
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{stat.value}</h2>
                <p className="text-gray-600">{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        {invoiceData.some(item => item.value > 0) && (
          <div className="bg-white p-6 rounded-lg shadow-md mt-6 flex justify-center min-h-[300px]">
            <PieChart width={400} height={300}>
              <Pie data={invoiceData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                {invoiceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend formatter={(value, entry) => `${value} (${entry?.payload?.value ?? 0})`} />
            </PieChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
