const express = require('express');
const router = express.Router();
const ExcelJS = require('exceljs');
const { Op, fn, col } = require('sequelize');
const Invoice = require('../models/Invoice');
const Payment = require('../models/Payment');
const Rent = require('../models/Rent');
const Fine = require('../models/Fine');
const OperationFee = require('../models/OperationFee');
const VAT = require('../models/VAT');
const sequelize = require('../config/database');

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

const getPaymentsByShopAndInvoice = async (Model, field = 'paid_amount') => {
  const records = await Model.findAll({
    where: {
      paid_date: {
        [Op.between]: [startOfMonth, endOfMonth],
      },
    },
    include: {
      model: Invoice,
      attributes: ['month_year'],
    },
  });

  const result = {};
  const crossMonthInvoices = {};

  records.forEach(r => {
    const shopId = r.shop_id;
    const invoice = r.Invoice;
    const invoiceMonth = invoice?.month_year;
    const isCurrent = invoiceMonth && new Date(invoiceMonth).getMonth() === now.getMonth();

    const amount = parseFloat(r[field] || 0);
    if (!result[shopId]) result[shopId] = { current: 0, other: 0 };
    if (!crossMonthInvoices[shopId]) crossMonthInvoices[shopId] = [];

    if (isCurrent) {
      result[shopId].current += amount;
    } else {
      result[shopId].other += amount;
      if (r.invoice_id) crossMonthInvoices[shopId].push(r.invoice_id);
    }
  });

  return [result, crossMonthInvoices];
};

router.get('/current-month-income', async (req, res) => {
  try {
    const invoices = await Invoice.findAll({
      where: {
        month_year: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
    });

    const payments = await Payment.findAll({
      where: {
        payment_date: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },
      attributes: ['shop_id', [fn('SUM', col('amount_paid')), 'total_paid']],
      group: ['shop_id'],
      raw: true,
    });

    const paymentsByShop = payments.reduce((map, p) => {
      map[p.shop_id] = parseFloat(p.total_paid);
      return map;
    }, {});

    const [rentMap, rentCross] = await getPaymentsByShopAndInvoice(Rent);
    const [fineMap, fineCross] = await getPaymentsByShopAndInvoice(Fine);
    const [opMap, opCross] = await getPaymentsByShopAndInvoice(OperationFee);
    const [vatMap, vatCross] = await getPaymentsByShopAndInvoice(VAT);

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

    invoices.forEach(inv => {
      const shop_id = inv.shop_id;
      const paid = paymentsByShop[shop_id] || 0;
      const remaining = parseFloat(inv.total_amount) - paid;

      sheet.addRow({
        shop_id,
        month: currentMonthStr,
        rent_amount: inv.rent_amount,
        operation_fee: inv.operation_fee,
        vat_amount: inv.vat_amount,
        previous_balance: inv.previous_balance,
        fines: inv.fines,
        previous_fines: inv.previous_fines,
        total_arrears: inv.total_arrears,
        total_amount: inv.total_amount,
        total_paid: paid,
        remaining,
        shop_balance: remaining,
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
    });

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
