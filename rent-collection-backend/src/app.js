require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('../config/database');
const tenantRoutes = require('../routes/tenantRoutes');
const adminRoutes = require('../routes/adminRoutes');
const shopRoutes = require('../routes/shopRoutes');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');
const paymentRoutes = require('../routes/paymentRoutes'); 
const paymentCorrection = require('../routes/paymentCorrection'); 
const settingRoutes = require('../routes/settingRoutes'); // Import the new setting routes// Import payment routes
require("../jobs/cronJob");  // If placed in /jobs/
require('../models'); 
const invoiceRoutes = require('../routes/invoiceRoutes');
const auditTrailRoutes = require('../routes/auditRoutes'); // Import audit trail routes
const summeryRoutes = require('../routes/summeryRoutes'); // Import summary routes


const app = express();

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173"];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(bodyParser.json());

console.log("Loading environment variables...");
console.log("Super Admin Email:", process.env.DEFAULT_SUPERADMIN_EMAIL);
console.log("Admin Email:", process.env.DEFAULT_ADMIN_EMAIL);
console.log("JWT Secret:", process.env.JWT_SECRET);

// Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/payments', paymentRoutes);  // Payment-related routes
app.use('/api/paymentscorrection', paymentCorrection);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/settings', settingRoutes); // Settings routes
app.use('/api/audit', auditTrailRoutes); // Audit trail routes
app.use('/api/summery', summeryRoutes); // Summary routes

const createDefaultAdmins = async () => {
  try {
    const users = [
      {
        username: process.env.DEFAULT_SUPERADMIN_USERNAME,
        email: process.env.DEFAULT_SUPERADMIN_EMAIL,
        password: process.env.DEFAULT_SUPERADMIN_PASSWORD,
        role: "superadmin"
      },
      {
        username: process.env.DEFAULT_ADMIN_USERNAME,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD,
        role: "admin"
      }
    ];

    for (const user of users) {
      const existingUser = await Admin.findOne({ where: { email: user.email } });
      if (!existingUser) {
        await Admin.create(user);
        console.log(` Default ${user.role} account created: ${user.email}`);
      } else {
        console.log(` Default ${user.role} already exists: ${user.email}`);
      }
    }
  } catch (err) {
    console.error(' Error creating default admins:', err.message);
  }
};

// Sync database and create default admins
sequelize.sync({ alter: true }).then(() => {
  console.log(' Database synced!');
  createDefaultAdmins();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port ${PORT}`);
});
