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
  
    // Group items by product.type
    const grouped = prices.reduce((acc, item) => {
      const type = item.product?.type || "Uncategorized";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
  
    // Flatten grouped items with category headers as special rows
    const categorizedList = [];
    for (const [type, items] of Object.entries(grouped)) {
      categorizedList.push({ isHeader: true, label: type });
      items.forEach(item => categorizedList.push({ isHeader: false, item }));
    }
  
    // Setup multi-column print layout
    const numColumnSets = 2; // two columns side-by-side
    const rowsPerColumn = Math.ceil(categorizedList.length / numColumnSets);
  
    // Split into columns
    const columns = [];
    for (let i = 0; i < numColumnSets; i++) {
      columns.push(categorizedList.slice(i * rowsPerColumn, (i + 1) * rowsPerColumn));
    }
  
    // Table header repeated for each column set
    const headerRow = Array(numColumnSets).fill(`
      <th style="border:1px solid #000; padding:2px 4px; font-size:11px; width:4%;">#</th>
      <th style="border:1px solid #000; padding:2px 4px; font-size:11px;">අයිතමය</th>
      <th style="border:1px solid #000; padding:2px 4px; font-size:11px; width:13%;">අවම මිල</th>
      <th style="border:1px solid #000; padding:2px 4px; font-size:11px; width:13%;">උපරිම මිල</th>
    `).join(`<th style="width:12px; border:none;"></th>`);
  
    // Precompute counts of non-header items in each column
const itemsCountPerColumn = columns.map(col =>
    col.reduce((count, entry) => count + (entry.isHeader ? 0 : 1), 0)
  );
  
  // Compute cumulative counts to know starting number per column
  const cumulativeCounts = [];
  itemsCountPerColumn.reduce((acc, count, i) => {
    cumulativeCounts[i] = acc;
    return acc + count;
  }, 0);
  
  let tableRows = "";
  const maxRows = rowsPerColumn;
  
  for (let row = 0; row < maxRows; row++) {
    tableRows += "<tr>";
    for (let col = 0; col < numColumnSets; col++) {
      const entry = columns[col][row];
      if (!entry) {
        // Empty cells for missing rows
        tableRows += `
          <td style="border:none; padding:0;"></td>
          <td style="border:none; padding:0;"></td>
          <td style="border:none; padding:0;"></td>
          <td style="border:none; padding:0;"></td>
        `;
      } else if (entry.isHeader) {
        // Category header spanning 4 columns
        tableRows += `
          <td colspan="4" style="border:1px solid #000; background:#ddd; font-weight:bold; font-size:12px; padding:6px 8px; text-align:left;">
            ${entry.label}
          </td>
        `;
      } else {
        // Find the index of this item in the column ignoring headers
        const colItems = columns[col];
        let itemIndexInCol = 0;
        for (let i = 0; i <= row; i++) {
          if (colItems[i] && !colItems[i].isHeader) itemIndexInCol++;
        }
        // Number is cumulative count of previous columns + this index
        const number = cumulativeCounts[col] + itemIndexInCol;
  
        const item = entry.item;
        tableRows += `
          <td style="border:1px solid #000; padding:4px 8px; font-size:10px;">${number}</td>
          <td style="border:1px solid #000; padding:4px 8px; font-size:10px; text-align:left;">${item.product?.name || ""}</td>
          <td style="border:1px solid #000; padding:4px 8px; font-size:10px; text-align:right;">${item.min_price ? "Rs. " + Number(item.min_price).toFixed(2) : ""}</td>
          <td style="border:1px solid #000; padding:4px 8px; font-size:10px; text-align:right;">${item.max_price ? "Rs. " + Number(item.max_price).toFixed(2) : ""}</td>
        `;
      }
      if (col < numColumnSets - 1) {
        tableRows += `<td style="width:12px; border:none;"></td>`;
      }
    }
    tableRows += "</tr>";
  }
  

  
    // Build the table
    const tableHtml = `
      <table style="width:100%; border-collapse:collapse; margin-top:12px; margin-bottom:12px;">
        <thead>
          <tr style="background:#f5f5f5;">
            ${headerRow}
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    `;
  
    // Printable content
    const printableContent = `
      <div style="font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif; color:#222;">
        <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #333; margin-bottom:12px; padding-bottom:8px;">
          <img src="/images/Gov.jpg" alt="Logo" style="height:48px;">
          <div style="text-align:center; flex:1;">
            <div style="font-size:18px; font-weight:bold;">දෛනික මිල තොරතුරු</div>
            <div style="font-size:12px; margin-top:4px;">Dedicated Economic Center, Dambulla</div>
          </div>
          <img src="/images/logo.jpg" alt="Logo" style="height:48px;">
        </div>
        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:8px;">
          <div>දු.අ: 0662285181</div>
          <div>දිනය : <strong>${date}</strong></div>
          <div>Email : dambulladec@gmail.com</div>
        </div>
        ${tableHtml}
        <div style="margin-top:12px; font-size:11px; background:#fff3cd; border:1px solid #000; padding:8px;">
          <strong>විමසීම්:</strong> Manager, Management Office, Dedicated Economic Center, Dambulla<br/>
          Tel: 066-2285181 / 066-2285448 | Email: dambulladec@gmail.com
        </div>
      </div>
    `;
  
    // Open print window and print
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
    printWindow.print();
  };
  