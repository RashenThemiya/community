import React, { useState } from "react";
import { FaBars, FaChartBar, FaCog, FaFileInvoice, FaHome, FaMoneyBill, FaStore, FaTimes, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button className="btn btn-dark sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        <h4 className="text-center text-white mt-3">Dashboard</h4>
        <ul className="list-unstyled">
          <li>
            <Link to="/dashboard">
              <FaHome /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/shop-management">
              <FaStore /> Shop Management
            </Link>
          </li>
          <li>
            <Link to="/tenant-management">
              <FaUser /> Tenant Management
            </Link>
          </li>
          <li>
            <Link to="/payments">
              <FaMoneyBill /> Payments
            </Link>
          </li>
          <li>
            <Link to="/invoices">
              <FaFileInvoice /> Invoices
            </Link>
          </li>
          <li>
            <Link to="/reports">
              <FaChartBar /> Reports
            </Link>
          </li>
          <li>
            <Link to="/settings">
              <FaCog /> Settings
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
