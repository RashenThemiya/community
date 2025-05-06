import api from "./axiosInstance";

export const printInvoices = async (invoices) => {
  if (invoices.length === 0) {
    alert("Please select at least one invoice to print.");
    return;
  }

  try {
    await Promise.all(
      invoices.map((invoice) =>
        api.patch(`api/invoices/${invoice.invoice_id}/print`, { printed: true })
      )
    );
  } catch (err) {
    console.error("Failed to update invoices:", err);
  }

  const printableContent = invoices
    .map((invoice) => {
      const invoiceHTML = `
        <div style="padding: 5px; font-size: 11px; font-family: Arial, sans-serif;">
          <div style="display: flex; align-items: center; justify-content: center; gap: 60px; background-color: #f0f0f0; border: 1px solid #000; padding: 10px; margin-bottom: 15px;">
                <img src="/images/Gov.jpg" alt="Logo" style="height: 60px;"/>
            <div style="text-align: center;">
              <h2 style="margin: 0; font-size: 14px;">දඹුල්ල විශේෂිත ආර්ථික මධ්‍යස්ථානය</br>කළමනාකරණභාරය</h2>
                    
          

              
              <h4 style="margin-top: 5px; font-size: 7px;">Monthly Rent Notice / මාසික බදු කුලිය අය කිරීමේ බිල්පත්‍රය</h4>
            </div>
              <img src="/images/logo.jpg" alt="Logo" style="height: 60px;" />
          </div>
      
          <div style="display: flex; justify-content: space-between; padding: 5px; background-color: #d0e7f9;font-size: 11px; ">
            
  <div>
    <strong>Invoice No</strong><br/>
    <span>බිල්පත් අංකය</span>: ${invoice.invoice_id}
  </div>

  <div>
    <strong>Invoice Month</strong><br/>
    <span>බිල්පත් මාසය</span>: ${new Date(
      invoice.month_year
    ).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    })}
  </div>

  <div>
    <strong>Accounting Date</strong><br/>
    <span>ගිණුම් කල දිනය</span>: ${new Date(
      invoice.createdAt
    ).toLocaleDateString()}
  </div>
  <div style="padding: 5px; background-color: #d0e7f9;">
  <strong>Shop No</strong><br/>
  <span>කඩ අංකය</span>: ${invoice.shop_id}
</div>
</div>




          <div style="display: flex; justify-content: space-between; margin-top: 10px; gap: 10px;">
            <div style="background-color: #f4d3a1; border: 1px solid #000; padding: 10px; width: 50%;">
              <h3 style="text-align: center; margin: 0 0 8px;">Statement of Account / ගිණුම් ප්‍රකාශය
</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <tr><td>Monthly Rent / මාසික කුලිය</td><td style="text-align: right;">LKR ${
                  invoice.rent_amount
                }</td></tr>
                <tr><td>Operation Fee / මෙහෙයුම් ගාස්තුව
</td><td style="text-align: right;">LKR ${invoice.operation_fee}</td></tr>
                <tr><td>VAT / එකතු කල අගය මත බද්ද
 </td><td style="text-align: right;">LKR ${invoice.vat_amount}</td></tr>
                <tr><td>Previous Balance / ශේෂය
</td><td style="text-align: right;">LKR ${invoice.previous_balance}</td></tr>
                <tr><td>Fines / දඩ</td><td style="text-align: right;">LKR ${
                  invoice.fines
                }</td></tr>
                <tr><td>Total Arrears / හිඟ බදු කුලිය
</td><td style="text-align: right;">LKR ${invoice.total_arrears}</td></tr>
                <tr style="border-top: 1px solid #000;"><td><strong>Total Amount / අය විය යුතු මුලු මුදල
</strong></td><td style="text-align: right;"><strong>LKR ${
        invoice.total_amount
      }</strong></td></tr>
              </table>
            </div>


<div style="background-color: #f4d3a1; border: 1px solid #000; padding: 5px; width: 20%;">
  <h4 style="text-align: center; margin-bottom: 8px ;">පසුගිය මස ගෙවීම් විස්තර
</h4>
  <div style=" font-size: 10px;">
    <div >
      අවසන් වරට බදු කුලී ගෙවූ දිනය :
      <span>
        ${
          invoice.previous_payment_summary?.last_payment_date
            ? new Date(
                invoice.previous_payment_summary.last_payment_date
              ).toLocaleDateString()
            : "N/A"
        }
      </span>
    </div>

   <div>
  පසුගිය මස ගෙවීමට තිබූ මුලු මුදල : 
  <span>
    LKR ${
      typeof invoice.previous_invoice_total_amount === "number"
        ? invoice.previous_invoice_total_amount.toFixed(2)
        : "0.00"
    }
  </span>
</div>

    <div >
      පසුගිය මස ගෙවූ මුදල : <br/>
      <span>LKR ${parseFloat(
        invoice.previous_payment_summary?.total_paid || 0
      ).toFixed(2)}</span>
    </div>
  
  </div>
</div>








      
            <div style="background-color: #e7f3d4; border: 1px solid #000; padding: 10px; width: 30%; font-size: 9px;">
          
              <h4 style="color: red; margin: 0 0 5px; border-bottom: 1px solid black;">
මෙම බිල්පතේ අයවිය යුතු මාසික කුලිය මෙම මස 15 වන දිනට පෙර ගෙවිය යුතුය. එසේ නොමැති වුවහොත් 30%ක බදු කුලියක් අය කරනු ලැබේ.</h4>

              <div style="text-align: center;">
  <p style="margin: 0;">
    දඹුල්ල විශේෂිත ආර්ථික මධ්‍යස්ථානය<br/>
    කළමනාකරණභාරය <br/>
    නමට ලංකා බැංකු ජංගම ගිණුම් අංක 2603285 දරණ ගිණුමට ඔබ විසින් මුදල් <br/>
    ගෙවීම් කළ යුතු අතර ඒ සඳහා මෙම බිල්පත අනිවාර්යයෙන්ම භාවිතා කල යුතුය
  </p>
</div>

            </div>
          </div>


     <div style="background-color: #fff3cd; border: 1px solid #000; padding: 10px; margin-top: 10px; font-size: 11px;">
  <div style="display: flex; justify-content: space-between; align-items: stretch; text-align: left;">
    
    <!-- Section 1: Contacts -->
    <div style="flex: 1; padding-right: 10px; border-right: 1px solid #000; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <p style="margin: 0;"><strong>විමසීම්
</strong></p>
        <p style="margin: 5px 0 0;">Manager<br/>Management Office<br/>Dedicated Economic Center<br/>Dambulla<br/>Tel: 066-2285181 / 066-2285448<br/>Email: dambulladec@gmail.com</p>
      </div>
    </div>

    <!-- Section 2: For Renter -->
    <div style="flex: 1.5; padding: 0 10px; border-right: 1px solid #000; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <p style="margin: 0;"><strong>බදුකරුගේ ප්‍රයෝජනය සඳහා
</strong></p>
  <p style="margin: 5px 0;">
  බැංකුවට ගෙවූ මුදල: 
  <span style="display: inline-block; width: 165px; border: 1px solid #000; height: 20px; padding: 0 5px;">
    රු.
  </span>
</p>

      </div>
      <div style="text-align: center; margin-top: auto;">
        <p style="margin: 0;">_______________________<br/><span style="font-size: 11px;">බදුකරුගේ අත්සන
 </span></p>
      </div>
    </div>

     <!-- Section 3: for market office -->
    <div style="flex: 1; padding-left: 10px; display: flex; flex-direction: column; justify-content: space-between;border-right: 1px solid #000;">
      <div>
        <p style="margin: 0;"><strong>For Market Office Use</strong></p>
        
      </div>
      <div style="text-align: center; margin-top: auto;">
        <p style="margin: 0;">_________________<br/><span style="font-size: 11px;">Official Seal</span></p>
      </div>
    </div>

    <!-- Section 4: Bank Cashier -->
    <div style="flex: 1.5; padding-left: 10px; display: flex; flex-direction: column; justify-content: space-between; ">
      <div>
        <p style="margin: 0;"><strong>Bank Use Only</strong></p>
          <p style="margin: 5px 0;">
  Amount Received: 
  <span style="display: inline-block; width: 165px; border: 1px solid #000; height: 20px; padding: 0 5px;">
    Rs.
  </span>
</p>
      </div>
      <div style="text-align: center; margin-top: auto;">
        <p style="margin: 0;">_______________________<br/><span style="font-size: 11px;">Signature of Bank Cashier</span></p>
      </div>
    </div>



   

  </div>
</div>






        </div>
      `;

      // return two copies stacked vertically
      return `
      <div class="invoice-copy">
        <div class="half-page">
  <div class="scale-content">
        <p style="text-align: right; font-size: 12px; font-weight: bold;"> Customer Copy</p>
    ${invoiceHTML}
  </div>
</div>
        <hr style="margin: 20px 0; border: 1px dashed #aaa;" />
       <div class="half-page">
  <div class="scale-content">
        <p style="text-align: right; font-size: 12px; font-weight: bold;" > Office Copy </p>
    ${invoiceHTML}
  </div>
</div>
      </div>
      <div class="page-break"></div>
    `;
    })
    .join("");

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Popup blocked! Please allow popups for printing.");
    return;
  }

  printWindow.document.write(`
        <html>
            <head>
                <title>Print Invoices</title>
             <style>
  @page {
    size: A4;
    margin: 10mm;
  }

  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  .invoice-copy {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    box-sizing: border-box;
    page-break-inside: avoid;
  }

  .half-page {
    height: 48%;
    overflow: hidden;
     
    box-sizing: border-box;
  }
    .scale-content {
  transform: scale(0.9);
  transform-origin: top left;
  width: 100%;
}


  .page-break {
    display: block;
    height: 0;
    page-break-after: always;
  }

  @media print {
    body {
      margin: 0;
      padding: 0;
    }

    .page-break {
      display: block;
      height: 0;
      page-break-after: always;
    }

    .invoice-copy {
      page-break-inside: avoid;
    }
  }
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
