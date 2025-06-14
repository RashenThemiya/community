const waitForImagesToLoad = (container) => {
  const images = container.querySelectorAll("img");
  const promises = Array.from(images).map(img =>
    new Promise(resolve => {
      if (img.complete) resolve();
      else {
        img.onload = resolve;
        img.onerror = resolve;
      }
    })
  );
  return Promise.all(promises);
};

export const printDailyPrices = async ({ prices, date, ui, productNames, types }) => {
  if (!prices || prices.length === 0) {
    alert(ui.noPrices);
    return;
  }

  const grouped = prices.reduce((acc, item) => {
    const type = item.product?.type || ui.uncategorized;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const capitalize = str => str ? str.charAt(0).toLocaleUpperCase() + str.slice(1) : "";

  const categorizedList = [];
  for (const [type, items] of Object.entries(grouped)) {
    categorizedList.push({ isHeader: true, label: capitalize(types?.[type] || type) });
    items.forEach(item => categorizedList.push({ isHeader: false, item }));
  }

  const itemsOnly = categorizedList.filter(e => !e.isHeader);
  while (itemsOnly.length < 120) {
    itemsOnly.push({ isHeader: false, item: null });
  }

  const finalList = [];
  for (const [type, items] of Object.entries(grouped)) {
    finalList.push({ isHeader: true, label: capitalize(types?.[type] || type) });
    for (const item of items) {
      finalList.push({ isHeader: false, item });
    }
  }
  while (finalList.filter(e => !e.isHeader).length < 120) {
    finalList.push({ isHeader: false, item: null });
  }

  const rowsPerCol = 60;
  const col1 = [], col2 = [];
  let count = 0;
  for (const entry of finalList) {
    if (entry.isHeader || count < rowsPerCol) {
      col1.push(entry);
      if (!entry.isHeader) count++;
    } else {
      col2.push(entry);
    }
  }

  const cumulativeCounts = [0, col1.filter(e => !e.isHeader).length];

  const headerRow = Array(2).fill(`
    <th style="border:1px solid #000; padding:2px; font-size:9.25px; font-weight:bold; width:5%;">${ui.tableHeaders.number}</th>
    <th style="border:1px solid #000; padding:2px; font-size:9.25px; font-weight:bold;">${ui.tableHeaders.item}</th>
    <th style="border:1px solid #000; padding:2px; font-size:9.25px; font-weight:bold; width:13%;">${ui.tableHeaders.minPrice}</th>
    <th style="border:1px solid #000; padding:2px; font-size:9.25px; font-weight:bold; width:13%;">${ui.tableHeaders.maxPrice}</th>
  `).join(`<th style="width:8px; border:none;"></th>`);

  let tableRows = "";
  for (let i = 0; i < rowsPerCol; i++) {
    tableRows += "<tr>";
    [col1, col2].forEach((column, colIndex) => {
      const entry = column[i];
      if (!entry) {
        tableRows += `<td colspan="4" style="border:none;"></td>`;
      } else if (entry.isHeader) {
        tableRows += `
          <td colspan="4" style="border:1px solid #000; background:#eee; font-size:8.25px; font-weight:bold; padding:2px; text-align:left;">
            ${entry.label}
          </td>
        `;
      } else {
        const item = entry.item;
        const index = cumulativeCounts[colIndex] +
          column.slice(0, i + 1).filter(e => !e.isHeader && e.item).length;
        const name = item?.product?.name ? (productNames?.[item.product.name] || item.product.name) : "";
        const min = item?.min_price ? `Rs. ${Number(item.min_price).toFixed(2)}` : "";
        const max = item?.max_price ? `Rs. ${Number(item.max_price).toFixed(2)}` : "";

        tableRows += `
          <td style="border:1px solid #000; padding:2px; font-size:8.25px; font-weight:bold;">${item ? index : ""}</td>
          <td style="border:1px solid #000; padding:2px; font-size:8.25px; font-weight:bold;">${name}</td>
          <td style="border:1px solid #000; padding:2px; font-size:8.25px; font-weight:bold; text-align:right;">${min}</td>
          <td style="border:1px solid #000; padding:2px; font-size:8.25px; font-weight:bold; text-align:right;">${max}</td>
        `;
      }
      if (colIndex === 0) {
        tableRows += `<td style="width:8px; border:none;"></td>`;
      }
    });
    tableRows += "</tr>";
  }

  const tableHtml = `
    <table style="width:100%; border-collapse:collapse; margin:0; page-break-inside: avoid;">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  const content = `
    <div style="font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif;">
      <!-- HEADER -->
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:4px; margin-bottom:4px;">
        <img src="/images/Gov.jpg" alt="Left Logo" style="height:70px;">
        <div style="flex:1; text-align:center;">
          <div style="font-size:16.25px; font-weight:bold;">${ui.title}</div>
          <div style="font-size:10.25px;">${ui.center}</div>
        </div>
        <img src="/images/logo.jpg" alt="Right Logo" style="height:70px;">
      </div>

      <!-- CONTACT ROW -->
      <div style="display:flex; justify-content:space-between; font-size:9.25px; margin-bottom:4px;">
        <div>${ui.tel}</div>
        <div>${ui.dateLabel}: <strong>${date}</strong></div>
        <div>${ui.emailLabel}: dambulladec@gmail.com</div>
      </div>

      <!-- TABLE -->
      ${tableHtml}

      <!-- FOOTER -->
      <div style="margin-top:4px; font-size:8.25px; background:#fff3cd; border:1px solid #000; padding:4px;">
        <strong>${ui.inquiry}</strong> ${ui.manager}<br/>
        ${ui.contact}
      </div>
    </div>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert(ui.popupBlocked);
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${ui.title}</title>
        <style>
          @page { size: A4 portrait; margin: 5mm; }
          body { margin: 0; padding: 0; }
          table, th, td { border-collapse: collapse; }
          body, td, th {
            font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif !important;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>${content}</body>
    </html>
  `);

  printWindow.document.close();
  await waitForImagesToLoad(printWindow.document.body);
  printWindow.focus();
  printWindow.print();
};
