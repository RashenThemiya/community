import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { FaBars, FaChartBar, FaCog, FaFileInvoice, FaHome, FaMoneyBill, FaStore, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const menuItems = [
  { path: "/dashboard", icon: <FaHome />, label: "Dashboard" },
  { path: "/shop-management", icon: <FaStore />, label: "Shop Management" },
  { path: "/tenant-management", icon: <FaUser />, label: "Tenant Management" },
  { path: "/payments", icon: <FaMoneyBill />, label: "Payments" },
  { path: "/invoices", icon: <FaFileInvoice />, label: "Invoices" },
  { path: "/reports", icon: <FaChartBar />, label: "Reports" },
  { path: "/settings", icon: <FaCog />, label: "Settings" },
];

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  return (
    <div
      className="bg-success text-white position-fixed top-0 start-0 vh-100 d-flex flex-column p-3"
      style={{
        width: isExpanded ? "250px" : "60px",
        transition: "width 0.3s ease-in-out",
        zIndex: 1040,
      }}
    >
      {/* Sidebar Toggle Button */}
      <button
  className="btn btn-light w-100 d-flex align-items-center justify-content-center py-2 mb-3"
  style={{
    minHeight: "50px", 
    width: "100%", 
    padding: "10px"
  }} 
  onClick={() => setIsExpanded(!isExpanded)}
>
  {isExpanded ? <FaTimes size={24} /> : <FaBars size={24} />}
</button>

      {/* Sidebar Menu Items */}
      <ul className="list-unstyled">
        {menuItems.map((item) => (
          <li key={item.path} className="mb-2">
            <Link
              to={item.path}
              className="d-flex align-items-center text-white text-decoration-none p-2 rounded"
            >
              {item.icon} {isExpanded && <span className="ms-2">{item.label}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
