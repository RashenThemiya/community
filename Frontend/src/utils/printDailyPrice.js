const waitForImagesToLoad = (container) => {
    const images = container.querySelectorAll("img");
    const promises = Array.from(images).map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) {
            resolve();
          } else {
            img.onload = resolve;
            img.onerror = resolve;
          }
        })
    );
    return Promise.all(promises);
  };
  
  export const printDailyPrices = async ({ prices, date }) => {
    if (!prices || prices.length === 0) {
      alert("No daily prices to print.");
      return;
    }
  
    // Split items for two columns (snaking)
    const splitIndex = Math.ceil(prices.length / 2);
    const leftItems = prices.slice(0, splitIndex);
    const rightItems = prices.slice(splitIndex);
  
    // Table header
    const tableHeader = `
      <tr style="background:#f5f5f5;">
        <th style="border:1px solid #000; padding:4px 0; font-size:13px; width:5%;">#</th>
        <th style="border:1px solid #000; padding:4px 0; font-size:13px;">අයිතමය</th>
        <th style="border:1px solid #000; padding:4px 0; font-size:13px; width:20%;">අවම මිල</th>
        <th style="border:1px solid #000; padding:4px 0; font-size:13px; width:20%;">උපරිම මිල</th>
      </tr>
    `;
  
    // Table body generator
    const makeRows = (items, offset = 0) =>
      items
        .map(
          (item, idx) => `
          <tr>
            <td style="border:1px solid #000; padding:2px 4px; font-size:12px;">${offset + idx + 1}</td>
            <td style="border:1px solid #000; padding:2px 4px; font-size:12px; text-align:left;">${item.product?.name || ""}</td>
            <td style="border:1px solid #000; padding:2px 4px; font-size:12px; text-align:right;">${item.min_price ? "Rs. " + Number(item.min_price).toFixed(2) : ""}</td>
            <td style="border:1px solid #000; padding:2px 4px; font-size:12px; text-align:right;">${item.max_price ? "Rs. " + Number(item.max_price).toFixed(2) : ""}</td>
          </tr>
        `
        )
        .join("");
  
    // Two side-by-side tables, snaking
    const tableHtml = `
      <div style="display:flex; gap:24px;">
        <table style="flex:1; border-collapse:collapse; margin-top:8px; margin-bottom:8px;">
          <thead>${tableHeader}</thead>
          <tbody>${makeRows(leftItems, 0)}</tbody>
        </table>
        <table style="flex:1; border-collapse:collapse; margin-top:8px; margin-bottom:8px;">
          <thead>${tableHeader}</thead>
          <tbody>${makeRows(rightItems, leftItems.length)}</tbody>
        </table>
      </div>
    `;
  
    // HTML content
    const printableContent = `
      <div style="font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif; color:#222;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #333; margin-bottom:8px; padding-bottom:6px;">
          <img src="/images/Gov.jpg" alt="Logo" style="height:48px;">
          <div style="text-align:center; flex:1;">
            <div style="font-size:17px; font-weight:bold;">දෛනික මිල තොරතුරු</div>
            <div style="font-size:11px; margin-top:1px;">Dedicated Economic Center, Dambulla</div>
          </div>
          <img src="/images/logo.jpg" alt="Logo" style="height:48px;">
        </div>
        <div style="display:flex; justify-content:space-between; font-size:11px; margin-bottom:6px;">
          <div>දු.අ: 0662285181</div>
          <div>දිනය : <strong>${date}</strong></div>
          <div>Email : dambulladec@gmail.com</div>
        </div>
        <div style="text-align:center; font-size:12px; margin-bottom:6px;">වේලාව : 9.00 am</div>
        ${tableHtml}
        <div style="margin-top:10px; font-size:11px; background:#fff3cd; border:1px solid #000; padding:6px;">
          <strong>විමසීම්:</strong> Manager, Management Office, Dedicated Economic Center, Dambulla<br/>
          Tel: 066-2285181 / 066-2285448 | Email: dambulladec@gmail.com
        </div>
      </div>
    `;
  
    // Open print window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Popup blocked! Please allow popups for printing.");
      return;
    }
  
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Daily Prices</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { margin:0; padding:0; }
            table, th, td { border-collapse: collapse; }
          </style>
          <link href="https://fonts.googleapis.com/css?family=Noto+Sans+Sinhala:400,700&display=swap" rel="stylesheet">
          <style>
            body, td, th {
              font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif !important;
            }
          </style>
        </head>
        <body>
          ${printableContent}
        </body>
      </html>
    `);
  
    printWindow.document.close();
    await waitForImagesToLoad(printWindow.document);
    printWindow.print();
  };
  