const express = require('express');
const { handlePaymentCorrection } = require('../utils/handlePaymentCorrection');
const { authenticateUser, authorizeRole } = require("../middleware/authMiddleware");

const router = express.Router();

// Apply payment correction (Only Admin & Super Admin can correct payments)
router.post(
    '/correct-payment',
    authenticateUser,
    authorizeRole(['admin', 'superadmin']),
    async (req, res) => {
        try {
            const { invoice_id, shop_id, actual_amount, admin_put_amount, edit_reason } = req.body;

            if (!shop_id || !actual_amount || !admin_put_amount) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const result = await handlePaymentCorrection({
                invoice_id,
                shop_id,
                actual_amount,
                admin_put_amount,
                edit_reason
            });

            return res.status(result.success ? 200 : 400).json(result);
        } catch (error) {
            console.error('❌ Payment Correction Route Error:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
);

module.exports = router;
