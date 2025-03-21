const { generateInvoice } = require("../utils/generateInvoice");

async function testInvoiceGeneration() {
    try {
        const shop_id = "SHP009";
        const month_year = "2025-03";

        console.log("🔄 Generating Invoice for:", shop_id, month_year);
        const invoice = await generateInvoice(shop_id, month_year);

        console.log("✅ Invoice Generated Successfully:");
        console.log(invoice);
    } catch (error) {
        console.error("❌ Invoice Generation Failed:", error);
    }
}

// Run the test if executed directly
if (require.main === module) {
    testInvoiceGeneration();
}

module.exports = { testInvoiceGeneration };
