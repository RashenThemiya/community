const Invoice = require("../models/Invoice");
const Rent = require("../models/Rent");
const OperationFee = require("../models/OperationFee");
const Vat = require("../models/Vat");
const AuditTrail = require("../models/AuditTrail");
const Shop = require("../models/Shop");
const ShopBalance = require("../models/ShopBalance");

const { fetchAndCalculateDues } = require("./fetchAndCalculateDues");

async function generateInvoice(shop_id, monthYear) {
  try {
    // 🔄 Fetch shop details
    const shop = await Shop.findOne({ where: { shop_id } });

    if (!shop) {
      throw new Error(`Shop with ID ${shop_id} not found.`);
    }

    // 📌 Fetch and calculate dues
    const { totalArrest, totalPartPaid, totalUnpaid, totalUnpaidFine } = 
    await fetchAndCalculateDues(shop_id);

    // 🏛️ Convert values to numbers
    const rentAmount = parseFloat(shop.rent_amount) || 0;
    const operationFee = parseFloat(shop.operation_fee) || 0;
    const vatRate = parseFloat(shop.vat_rate) || 0;

    // 🔍 Fetch Shop Balance for the given shop_id
    const shopBalanceRecord = await ShopBalance.findOne({ where: { shop_id } });
    const shopBalanceAmount = shopBalanceRecord ? parseFloat(shopBalanceRecord.balance_amount) : 0;

    // 📌 VAT Calculation (Fixed)
    const vatAmount = (rentAmount + operationFee) * (vatRate / 100);

    // 🏛️ Calculate final values
    const totalArrears = totalArrest + totalPartPaid + totalUnpaid;
    const fineAmount = totalUnpaidFine;
    const totalAmountToPay =
      totalArrears + rentAmount + operationFee + vatAmount + fineAmount - shopBalanceAmount;

    // 📝 Create invoice entry
    const invoice = await Invoice.create({
      invoice_id: `INV-${shop_id}-${monthYear.replace("-", "")}`,
      shop_id,
      month_year: monthYear,
      rent_amount: rentAmount,
      operation_fee: operationFee,
      vat_amount: vatAmount, // ✅ Fixed
      previous_balance: shopBalanceAmount, // ✅ Corrected
      fines: fineAmount,
      total_arrears: totalArrears,
      total_amount: totalAmountToPay,
      status: "Unpaid",
    });

    // 📌 Create linked entries in related tables
    await Rent.create({
      shop_id,
      invoice_id: invoice.invoice_id,
      rent_amount: rentAmount,
      status: "Unpaid",
    });

    await OperationFee.create({
      shop_id,
      invoice_id: invoice.invoice_id,
      operation_amount: operationFee,
      status: "Unpaid",
    });

    await Vat.create({
      shop_id,
      invoice_id: invoice.invoice_id,
      vat_amount: vatAmount,
      status: "Unpaid",
    });

    // 📝 Log event in audit_trail
    await AuditTrail.create({
      shop_id,
      invoice_id: invoice.invoice_id,
      event_type: "Invoice Generated",
      event_description: `Invoice ${invoice.invoice_id} generated for shop ${shop_id}`,
      user_actioned: "System", // Replace with actual user
    });

    console.log(`✅ Invoice ${invoice.invoice_id} generated successfully.`);
    return invoice;
  } catch (error) {
    console.error("❌ Error generating invoice:", error);
    throw error;
  }
}

module.exports = { generateInvoice };
