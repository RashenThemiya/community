const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const Tenant = require('../models/Tenant');


dotenv.config();

// Setup email transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("Email credentials not set in environment variables");
}
const sendEmail = async (req, res) => {
  const { invoices } = req.body;

  if (!invoices || !Array.isArray(invoices) || invoices.length === 0) {
    return res.status(400).json({ success: false, message: "No invoices provided." });
  }

  const results = [];

  for (const invoice of invoices) {
    try {
      const tenant = await Tenant.findOne({ where: { shop_id: invoice.shop_id } });

      if (!tenant || !tenant.email) {
        results.push({
          invoice_id: invoice.invoice_id,
          shop_id: invoice.shop_id,
          success: false,
          message: "Tenant email not found",
        });
        continue;
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: tenant.email,
        subject: `Invoice ${invoice.invoice_id} from Admin`,
        html: `
          <h3>Invoice Details</h3>
          <p><strong>Invoice ID:</strong> ${invoice.invoice_id}</p>
          <p><strong>Shop ID:</strong> ${invoice.shop_id}</p>
          <p><strong>Month-Year:</strong> ${invoice.month_year}</p>
          <p><strong>Rent:</strong> ${invoice.rent_amount}</p>
          <p><strong>Operation Fee:</strong> ${invoice.operation_fee}</p>
          <p><strong>VAT:</strong> ${invoice.vat}</p>
          <p><strong>Status:</strong> ${invoice.status}</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      results.push({
        invoice_id: invoice.invoice_id,
        shop_id: invoice.shop_id,
        success: true,
        message: "Email sent successfully",
      });
    } catch (err) {
      results.push({
        invoice_id: invoice.invoice_id,
        shop_id: invoice.shop_id,
        success: false,
        message: `Error sending email: ${err.message}`,
      });
    }
  }

  return res.status(200).json({ success: true, results });
};


// Register route
router.post("/send-email", sendEmail);
module.exports = router;
