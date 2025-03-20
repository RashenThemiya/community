const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

/**
 * 📝 Register a New Admin (Super Admin Only)
 * Route: POST /api/admin/register
 * Access: Super Admin
 */
router.post("/register", authenticateUser, authorizeRole(["superadmin"]), async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Validate role
    if (!["superadmin", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role!" });
    }

    // Check if admin already exists
    const existingUser = await Admin.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Admin already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const newAdmin = await Admin.create({ username, email, password: hashedPassword, role });

    res.status(201).json({ message: "Admin registered successfully!", admin: newAdmin });
  } catch (err) {
    console.error("Admin Registration Error:", err);
    res.status(500).json({ message: "Error registering admin", error: err.message });
  }
});

/**
 * 🔑 Admin Login
 * Route: POST /api/admin/login
 * Access: Public
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ where: { email } });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // Compare passwords
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign(
      { adminId: admin.admin_id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ message: "Login successful", token, role: admin.role });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Error logging in", error: err.message });
  }
});
/**
 * 👤 Get Admin Profile
 * Route: GET /api/admin/profile
 * Access: Authenticated Admins
 */
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.user.adminId, {
      attributes: { exclude: ["password"] },
    });

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ admin });
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

/**
 * 🔒 Super Admin-Only Route
 * Route: GET /api/admin/superadmin
 * Access: Super Admin
 */
router.get("/superadmin", authenticateUser, authorizeRole(["superadmin"]), (req, res) => {
  res.status(200).json({ message: "Welcome Super Admin!" });
});

/**
 * 🔒 Admin & Super Admin Route
 * Route: GET /api/admin/admin
 * Access: Admin & Super Admin
 */
router.get("/admin", authenticateUser, authorizeRole(["admin", "superadmin"]), (req, res) => {
  res.status(200).json({ message: "Welcome Admin!" });
});

/**
 * 📜 Get All Admins (Super Admin Only)
 * Route: GET /api/admin/list
 * Access: Super Admin
 */
router.get("/list", authenticateUser, authorizeRole(["superadmin"]), async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ["password"] },
    });
    res.status(200).json({ admins });
  } catch (err) {
    console.error("Error Fetching Admin List:", err);
    res.status(500).json({ message: "Error fetching admin list", error: err.message });
  }
});

module.exports = router;
