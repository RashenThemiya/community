export const printInvoices = (invoices) => {
    if (invoices.length === 0) {
        alert("Please select at least one invoice to print.");
        return;
    }

    const printableContent = invoices.map(invoice => (
        `<div style="border: 2px solid #000; padding: 16px; margin-bottom: 20px;">
            <h2 style="text-align: center; margin-bottom: 10px;">Invoice Details</h2>
            <hr />
            <p><strong>Invoice ID:</strong> ${invoice.invoice_id}</p>
            <p><strong>Shop ID:</strong> ${invoice.shop_id}</p>
            <p><strong>Month/Year:</strong> ${new Date(invoice.month_year).toLocaleDateString()}</p>
            <p><strong>Rent Amount:</strong> LKR ${invoice.rent_amount}</p>
            <p><strong>Operation Fee:</strong> LKR ${invoice.operation_fee}</p>
            <p><strong>VAT:</strong> LKR ${invoice.vat_amount}</p>
            <p><strong>Previous Balance:</strong> LKR ${invoice.previous_balance}</p>
            <p><strong>Fines:</strong> LKR ${invoice.fines}</p>
            <p><strong>Total Arrears:</strong> LKR ${invoice.total_arrears}</p>
            <p><strong>Total Amount:</strong> LKR ${invoice.total_amount}</p>
            <p><strong>Status:</strong> ${invoice.status}</p>
            <p><strong>Created At:</strong> ${new Date(invoice.createdAt).toLocaleDateString()}</p>
        </div>`
    )).join('');

    const printWindow = window.open('', '_blank');
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
