require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS package
const sequelize = require('../config/database');
const tenantRoutes = require('../routes/tenantRoutes');
const adminRoutes = require('../routes/adminRoutes');
const shopRoutes = require('../routes/shopRoutes');
const Admin = require('../models/Admin');
const bcrypt = require('bcrypt');

const app = express();

// ✅ Allow requests from React app (running on http://localhost:3000)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Body parser middleware
app.use(bodyParser.json());

console.log("Loading environment variables...");
console.log("Super Admin Email:", process.env.DEFAULT_SUPERADMIN_EMAIL);
console.log("Admin Email:", process.env.DEFAULT_ADMIN_EMAIL);
console.log("JWT Secret:", process.env.JWT_SECRET);

// Routes
app.use('/api/tenants', tenantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/shops', shopRoutes);

// Function to create default Super Admin and Admin
const createDefaultAdmins = async () => {
  try {
    const users = [
      {
        username: process.env.DEFAULT_SUPERADMIN_USERNAME,
        email: process.env.DEFAULT_SUPERADMIN_EMAIL,
        password: process.env.DEFAULT_SUPERADMIN_PASSWORD, // Do NOT hash here
        role: "superadmin"
      },
      {
        username: process.env.DEFAULT_ADMIN_USERNAME,
        email: process.env.DEFAULT_ADMIN_EMAIL,
        password: process.env.DEFAULT_ADMIN_PASSWORD, // Do NOT hash here
        role: "admin"
      }
    ];

    for (const user of users) {
      const existingUser = await Admin.findOne({ where: { email: user.email } });
      if (!existingUser) {
        await Admin.create(user); // Password will be hashed inside model
        console.log(`✅ Default ${user.role} account created: ${user.email}`);
      } else {
        console.log(`⚡ Default ${user.role} already exists: ${user.email}`);
      }
    }
  } catch (err) {
    console.error('❌ Error creating default admins:', err.message);
  }
};

// Sync database and create default admins
sequelize.sync({ alter: true }).then(() => {
  console.log('📦 Database synced!');
  createDefaultAdmins();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
