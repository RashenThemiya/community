const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { Op } = require('sequelize');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Rent = require('../models/Rent');
const Fine = require('../models/Fine');
const OperationFee = require('../models/OperationFee');
const VAT = require('../models/VAT');
const ShopBalance = require('../models/ShopBalance');
const { getPaymentsByShopAndInvoice } = require('../utils/reportUtils');


// Route
router.get('/current-month-income', async (req, res) => {
  try {
    const latestInvoice = await Invoice.findOne({ order: [['month_year', 'DESC']] });
    if (!latestInvoice) return res.status(404).send('No invoices found.');

    const latestMonthYear = new Date(latestInvoice.month_year);
    const startOfPeriod = new Date(latestMonthYear.getFullYear(), latestMonthYear.getMonth(), 1);
    const endOfPeriod = new Date(latestMonthYear.getFullYear(), latestMonthYear.getMonth() + 1, 0);
    const latestMonthStr = `${latestMonthYear.getFullYear()}-${String(latestMonthYear.getMonth() + 1).padStart(2, '0')}`;

    const invoices = await Invoice.findAll({
      where: { month_year: { [Op.between]: [startOfPeriod, endOfPeriod] } },
      order: [['shop_id', 'ASC'], ['createdAt', 'ASC']],
    });

    const allPayments = await Payment.findAll({ attributes: ['shop_id', 'payment_date', 'amount_paid'], raw: true });
    const shopBalances = await ShopBalance.findAll({ attributes: ['shop_id', 'balance_amount'], raw: true });

    const balanceByShop = shopBalances.reduce((map, sb) => {
      map[sb.shop_id] = parseFloat(sb.balance_amount);
      return map;
    }, {});

    const [rentMap, rentCross] = await getPaymentsByShopAndInvoice(Rent, startOfPeriod, endOfPeriod, latestMonthYear);
    const [fineMap, fineCross] = await getPaymentsByShopAndInvoice(Fine, startOfPeriod, endOfPeriod, latestMonthYear);
    const [opMap, opCross] = await getPaymentsByShopAndInvoice(OperationFee, startOfPeriod, endOfPeriod, latestMonthYear);
    const [vatMap, vatCross] = await getPaymentsByShopAndInvoice(VAT, startOfPeriod, endOfPeriod, latestMonthYear);

    const invoiceMapByShop = {};
    invoices.forEach(inv => {
      if (!invoiceMapByShop[inv.shop_id]) invoiceMapByShop[inv.shop_id] = [];
      invoiceMapByShop[inv.shop_id].push(inv);
    });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Current Month Income');

    sheet.columns = [
      { header: 'Shop ID', key: 'shop_id' },
      { header: 'Month', key: 'month' },
      { header: 'Rent Amount', key: 'rent_amount' },
      { header: 'Operation Fee', key: 'operation_fee' },
      { header: 'VAT', key: 'vat_amount' },
      { header: 'Previous Balance', key: 'previous_balance' },
      { header: 'Total Fines', key: 'fines' },
      { header: 'Fines Previous Month', key: 'previous_fines' },
      { header: 'Total Arrears', key: 'total_arrears' },
      { header: 'Total Amount', key: 'total_amount' },
      { header: 'Total Paid', key: 'total_paid' },
      { header: 'Remaining', key: 'remaining' },
      { header: 'Shop Balance', key: 'shop_balance' },
      { header: 'Rent Paid This Month', key: 'rent_paid_this_month' },
      { header: 'Fine Paid This Month', key: 'fine_paid_this_month' },
      { header: 'Operation Fee Paid This Month', key: 'operation_paid_this_month' },
      { header: 'VAT Paid This Month', key: 'vat_paid_this_month' },
      { header: 'Other Month Rent Paid', key: 'other_rent_paid' },
      { header: 'Other Month Fine Paid', key: 'other_fine_paid' },
      { header: 'Other Month Operation Fee Paid', key: 'other_operation_paid' },
      { header: 'Other Month VAT Paid', key: 'other_vat_paid' },
      { header: 'Other Month Invoice IDs', key: 'other_invoice_ids' },
    ];

    const totals = {
      shop_balance: 0,
      rent_paid_this_month: 0,
      fine_paid_this_month: 0,
      operation_paid_this_month: 0,
      vat_paid_this_month: 0,
      other_rent_paid: 0,
      other_fine_paid: 0,
      other_operation_paid: 0,
      other_vat_paid: 0,
      total_paid: 0, // <-- add this
    };
    

    for (const inv of invoices) {
      const shop_id = inv.shop_id;
      const shopInvoices = invoiceMapByShop[shop_id] || [];
      const currentIndex = shopInvoices.findIndex(i => i.invoice_id === inv.invoice_id);
      const nextInvoice = shopInvoices[currentIndex + 1];

      const invStartDate = new Date(inv.createdAt);
      const invEndDate = nextInvoice ? new Date(nextInvoice.createdAt) : null;

      const paidForThisInvoice = allPayments
        .filter(p => p.shop_id === shop_id && new Date(p.payment_date) >= invStartDate && (!invEndDate || new Date(p.payment_date) < invEndDate))
        .reduce((sum, p) => sum + parseFloat(p.amount_paid), 0);

      let remaining = parseFloat(inv.total_amount) - paidForThisInvoice;
      remaining = Math.max(remaining, 0);

      const shop_balance = balanceByShop[shop_id] || 0;

      sheet.addRow({
        shop_id,
        month: latestMonthStr,
        rent_amount: inv.rent_amount,
        operation_fee: inv.operation_fee,
        vat_amount: inv.vat_amount,
        previous_balance: inv.previous_balance,
        fines: inv.fines,
        previous_fines: inv.previous_fines,
        total_arrears: inv.total_arrears,
        total_amount: inv.total_amount,
        total_paid: paidForThisInvoice,
        remaining,
        shop_balance,
        rent_paid_this_month: rentMap[shop_id]?.current || 0,
        fine_paid_this_month: fineMap[shop_id]?.current || 0,
        operation_paid_this_month: opMap[shop_id]?.current || 0,
        vat_paid_this_month: vatMap[shop_id]?.current || 0,
        other_rent_paid: rentMap[shop_id]?.other || 0,
        other_fine_paid: fineMap[shop_id]?.other || 0,
        other_operation_paid: opMap[shop_id]?.other || 0,
        other_vat_paid: vatMap[shop_id]?.other || 0,
        other_invoice_ids: [
          ...(rentCross[shop_id] || []),
          ...(fineCross[shop_id] || []),
          ...(opCross[shop_id] || []),
          ...(vatCross[shop_id] || []),
        ].join(', '),
      });

      totals.shop_balance += shop_balance;
      totals.rent_paid_this_month += rentMap[shop_id]?.current || 0;
      totals.fine_paid_this_month += fineMap[shop_id]?.current || 0;
      totals.operation_paid_this_month += opMap[shop_id]?.current || 0;
      totals.vat_paid_this_month += vatMap[shop_id]?.current || 0;
      totals.other_rent_paid += rentMap[shop_id]?.other || 0;
      totals.other_fine_paid += fineMap[shop_id]?.other || 0;
      totals.other_operation_paid += opMap[shop_id]?.other || 0;
      totals.other_vat_paid += vatMap[shop_id]?.other || 0;
      totals.total_paid += paidForThisInvoice; // <-- Add this line

    }

    // Excel Header Styling
    sheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0070C0' } };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    });

    // Add Total Row
    const totalRow = sheet.addRow({
      shop_id: 'Total',
      rent_paid_this_month: totals.rent_paid_this_month,
      fine_paid_this_month: totals.fine_paid_this_month,
      operation_paid_this_month: totals.operation_paid_this_month,
      vat_paid_this_month: totals.vat_paid_this_month,
      other_rent_paid: totals.other_rent_paid,
      other_fine_paid: totals.other_fine_paid,
      other_operation_paid: totals.other_operation_paid,
      other_vat_paid: totals.other_vat_paid,
      shop_balance: totals.shop_balance,
      total_paid: totals.total_paid, // <-- add this line

    });

    totalRow.eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Auto Width
    sheet.columns.forEach(column => {
      column.width = Math.max(15, column.header.length + 5);
    });

    // Proof Section
    const proofStartRow = sheet.rowCount + 2;
    sheet.mergeCells(`A${proofStartRow}:H${proofStartRow}`);
    sheet.getCell(`A${proofStartRow}`).value = 'Mathematical Proof of Total Paid Calculation';
    sheet.getCell(`A${proofStartRow}`).font = { bold: true, size: 14 };
    sheet.getCell(`A${proofStartRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF92D050' } };

    const formulaRow = proofStartRow + 1;
    const valueRow = proofStartRow + 2;
    const resultRow = proofStartRow + 3;

    sheet.mergeCells(`A${formulaRow}:H${formulaRow}`);
    sheet.getCell(`A${formulaRow}`).value =
      'Total Paid = Shop Balance + Rent Paid (Current) + Fine Paid (Current) + Operation Fee Paid (Current) + VAT Paid (Current) + Other Rent Paid + Other Fine Paid + Other Operation Paid + Other VAT Paid';

    sheet.mergeCells(`A${valueRow}:H${valueRow}`);
    sheet.getCell(`A${valueRow}`).value =
      `Total Paid = ${totals.shop_balance} + ${totals.rent_paid_this_month} + ${totals.fine_paid_this_month} + ${totals.operation_paid_this_month} + ${totals.vat_paid_this_month} + ${totals.other_rent_paid} + ${totals.other_fine_paid} + ${totals.other_operation_paid} + ${totals.other_vat_paid}`;

    const totalPaidFinal = totals.shop_balance + totals.rent_paid_this_month + totals.fine_paid_this_month +
      totals.operation_paid_this_month + totals.vat_paid_this_month +
      totals.other_rent_paid + totals.other_fine_paid + totals.other_operation_paid + totals.other_vat_paid;

    sheet.mergeCells(`A${resultRow}:H${resultRow}`);
    sheet.getCell(`A${resultRow}`).value = `Total Paid = ${totalPaidFinal.toFixed(2)}`;
    sheet.getCell(`A${resultRow}`).font = { bold: true, size: 12 };

    for (let i = proofStartRow; i <= resultRow; i++) {
      sheet.getRow(i).eachCell(cell => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    }

    // Response
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=Current_Month_Income_Report.xlsx');
    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Error generating report');
  }
});

module.exports = router;
