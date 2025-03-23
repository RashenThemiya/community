const cron = require("node-cron");
const { generateInvoice } = require("../utils/generateInvoice");
const Shop = require("../models/Shop");

async function generateMonthlyInvoices() {
  try {
    console.log("🔄 Starting monthly invoice generation...");

    // Get current Year-Month (e.g., "2025-04")
    const today = new Date();
    const monthYear = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

    // Fetch all active shops
    const shops = await Shop.findAll();

    for (const shop of shops) {
      await generateInvoice(shop.shop_id, monthYear);
    }

    console.log("✅ Monthly invoices generated successfully!");
  } catch (error) {
    console.error("❌ Error in monthly invoice generation:", error);
  }
}

// Schedule the job: Runs at 00:00 on the 1st day of every month
cron.schedule("0 0 1 * *", async () => {
  await generateMonthlyInvoices();
  console.log("📆 Monthly invoice cron job executed.");
});

module.exports = { generateMonthlyInvoices };
