import api from "./axiosInstance";

export const printInvoices = async (invoices) => {
    if (invoices.length === 0) {
        alert("Please select at least one invoice to print.");
        return;
    }

    try {
        await Promise.all(
            invoices.map(invoice =>
                api.patch(`api/invoices/${invoice.invoice_id}/print`, { printed: true })
            )
        );
    } catch (err) {
        console.error("Failed to update invoices:", err);
    }

    const printableContent = invoices.map(invoice => `
       
    <div style="padding: 10px; text-align: center;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 70px; background-color: #f0f0f0; border: 2px solid #000; padding: 20px; margin-bottom: 30px; font-family: 'Arial', sans-serif;">
        <img src="/images/logo.jpg" alt="Logo" style="height: 100px;" />
        <div>
            <h1 style="margin: 0;">දඹුල්ල විශේෂිත ආර්ථික මධ්‍යස්ථානය</h1>
            <h3 style="margin-top: 5px;">Monthly Rent Notice</h3>
        </div>
    </div>
</div>

                
          
    
            <div style="display: flex; justify-content: space-between; padding: 10px; background-color: #d0e7f9;">
                <div><strong>Invoice No:</strong> ${invoice.invoice_id}</div>
                <div><strong>Invoice Month:</strong> ${new Date(invoice.month_year).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</div>
                <div><strong>Accounting Date:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</div>
            </div>
    
            <div style="padding: 10px; background-color: #d0e7f9;">
                <strong>Shop ID :</strong> ${invoice.shop_id}
            </div>
    
         <div style="display: flex; justify-content: space-between; margin-top: 15px; gap: 20px;">
    <!-- Statement of Account -->
    <div style="background-color: #f4d3a1; border: 1px solid #000; padding: 15px; width: 65%;">
        <h3 style="text-align: center;">Statement of Account</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr><td>Monthly Rent</td><td style="text-align: right;">LKR ${invoice.rent_amount}</td></tr>
            <tr><td>Operation Fee</td><td style="text-align: right;">LKR ${invoice.operation_fee}</td></tr>
            <tr><td>VAT</td><td style="text-align: right;">LKR ${invoice.vat_amount}</td></tr>
            <tr><td>Previous Balance</td><td style="text-align: right;">LKR ${invoice.previous_balance}</td></tr>
            <tr><td>Fines</td><td style="text-align: right;">LKR ${invoice.fines}</td></tr>
            <tr><td><strong>Total Arrears</strong></td><td style="text-align: right;"><strong>LKR ${invoice.total_arrears}</strong></td></tr>
            <tr><td><strong>Total Amount</strong></td><td style="text-align: right;"><strong>LKR ${invoice.total_amount}</strong></td></tr>
        </table>
    </div>

    <!-- Note Box on Right -->
    <div style="background-color: #e7f3d4; border: 1px solid #000; padding: 15px; width: 30%; font-size: 14px;">
        <h4 style="margin-top: 0;">Notes</h4>
        <p style="color: red;">Please ensure full payment is made before the 15th of this month. A 30% fine will be applied for late payments.</p>
        <p>• Contact management for any queries.</p>
    </div>
</div>

<!-- Note Box Below -->
<div style="background-color: #fff3cd; border: 1px solid #000; padding: 15px; margin-top: 15px; font-size: 14px;">
    <h4 style="margin-top: 0;">Additional Notes</h4>
    <p>This invoice includes all applicable charges for the selected month. Ensure to keep a copy for your records.</p>
</div>
    
            <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                <div>
                    <p><strong>Manager</strong><br/>Management Office<br/>Dedicated Economic Center</p>
                    <p>Tel: 066-2285181<br/>Email: dambulladeci@gmail.com</p>
                </div>
                <div style="text-align: center;">
                    <p>_______________________<br/>Renter Signature</p>
                </div>
                <div style="text-align: center;">
                    <p>_______________________<br/>Bank Cashier</p>
                </div>
            </div>
        </div>
    `).join('');
    

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Popup blocked! Please allow popups for printing.");
        return;
    }

    printWindow.document.write(`
        <html>
            <head>
                <title>Print Invoices</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    h2 { color: #4CAF50; }
                    p { margin: 5px 0; }
                    hr { border: 1px solid #ddd; margin: 10px 0; }
                </style>
            </head>
            <body>
                ${printableContent}
            </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.print();
    
};

