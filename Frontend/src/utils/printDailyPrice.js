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
    // Retaining alert as per user's provided code.
    alert(ui.noPrices);
    return;
  }

  const capitalize = str => str ? str.charAt(0).toLocaleUpperCase() + str.slice(1) : "";

  // Group by category and form category blocks (header + items)
  const grouped = prices.reduce((acc, item) => {
    const type = item.product?.type || ui.uncategorized;
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const categoryBlocks = Object.entries(grouped).map(([type, items]) => {
    const label = capitalize(types?.[type] || type);
    const block = [{ isHeader: true, label }]; // Header
    for (const item of items) {
      block.push({ isHeader: false, item }); // Items
    }
    return block;
  });

  // --- Fixed Column Distribution Logic (as per previous correct iteration) ---
  const col1 = [];
  const col2 = [];
  let col1ActualItemsCount = 0; // Counts only actual data items, not headers or nulls
  let col2ActualItemsCount = 0;

  const maxRowsPerColumn = 60; // Total number of slots in each column for display purposes

  for (const block of categoryBlocks) {
    const header = block[0];
    const items = block.slice(1);
    const itemsInCurrentBlock = items.length;

    // Calculate available rows in col1 before attempting to add the current block.
    // col1.length includes existing headers and data rows.
    const availableRowsInCol1 = maxRowsPerColumn - col1.length;

    // Check if the current block (header + items) can fit entirely in col1.
    // +1 accounts for the header row.
    if (availableRowsInCol1 >= (1 + itemsInCurrentBlock)) {
      // Entire block fits in col1
      col1.push(header);
      col1.push(...items);
      col1ActualItemsCount += itemsInCurrentBlock;
    } else {
      // Block needs to be split or moved entirely to col2.

      // Try to add the header to col1 if space allows, then fill with items.
      let itemsToMoveToCol1 = 0;
      if (availableRowsInCol1 > 0) { // If there's any space left in col1
        col1.push(header); // Add the header to col1
        const remainingSpaceForItemsInCol1 = maxRowsPerColumn - col1.length; // Space left after adding header
        itemsToMoveToCol1 = Math.min(itemsInCurrentBlock, remainingSpaceForItemsInCol1);
        col1.push(...items.slice(0, itemsToMoveToCol1));
        col1ActualItemsCount += itemsToMoveToCol1;
      }

      // Move remaining parts of the block to col2.
      const itemsRemainingForCol2 = items.slice(itemsToMoveToCol1);
      if (itemsRemainingForCol2.length > 0) {
        // If there are remaining items, always add the header to col2 for continuity.
        col2.push(header); // Repeat header for continuity in the second column
        col2.push(...itemsRemainingForCol2);
        col2ActualItemsCount += itemsRemainingForCol2.length;
      }
    }
  }

  // --- End Fixed Column Distribution Logic ---

  // Pad both columns with empty rows until each has maxRowsPerColumn entries
  while (col1.length < maxRowsPerColumn) {
    col1.push({ isHeader: false, item: null }); // Pad with empty row placeholders
  }
  while (col2.length < maxRowsPerColumn) {
    col2.push({ isHeader: false, item: null }); // Pad with empty row placeholders
  }

  // Prepare number tracking for item indexing across columns
  // cumulativeCounts[0] is for the starting index of col1 (always 0, implying count starts from 1)
  // cumulativeCounts[1] is the total item count in col1, which is the starting index for col2 numbering
  const cumulativeCounts = [0, col1ActualItemsCount];

  // Build rows (row-by-row, two columns)
  let tableRows = "";
  // This loop iterates 60 times, creating a row for each potential slot in the two columns
  for (let i = 0; i < maxRowsPerColumn; i++) {
    tableRows += "<tr>";
    [col1, col2].forEach((column, colIndex) => {
      const entry = column[i]; // Get the entry for the current row `i` in the current column `colIndex`

      // --- FIX: Render 4 individual empty cells with borders for empty item slots ---
      if (!entry || entry.item === null) { // If it's a padded empty row or no item
        // Removed height:18px; from here as it caused inconsistencies.
        // The global 'height' in style block will now control this.
        tableRows += `
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold;"></td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold;"></td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold; text-align:right;"></td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold; text-align:right;"></td>
        `;
      } else if (entry.isHeader) { // If it's a category header
        tableRows += `
          <td colspan="4" style="border:1px solid #000; background:#eee; font-size:8.25px; font-weight:bold; padding:1px 2px; text-align:left;">
            ${entry.label}
          </td>
        `;
      } else { // It's an actual item
        const item = entry.item;
        // Calculate the item number: start index for the column + count of actual items processed so far in this column
        const index = cumulativeCounts[colIndex] +
                      column.slice(0, i + 1).filter(e => !e.isHeader && e.item).length;

        const name = item?.product?.name ? (productNames?.[item.product.name] || item.product.name) : "";
        const min = item?.min_price ? `Rs. ${Number(item.min_price).toFixed(2)}` : "";
        const max = item?.max_price ? `Rs. ${Number(item.max_price).toFixed(2)}` : "";

        tableRows += `
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold;">${item ? index : ""}</td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold;">${name}</td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold; text-align:right;">${min}</td>
          <td style="border:1px solid #000; padding:1px 2px; font-size:8.25px; font-weight:bold; text-align:right;">${max}</td>
        `;
      }
      if (colIndex === 0) tableRows += `<td style="width:8px; border:none;"></td>`;
    });
    tableRows += "</tr>";
  }

  const headerRow = Array(2).fill(`
    <th style="border:1px solid #000; padding:1px 2px; font-size:9px; font-weight:bold; width:5%;">Number</th>
    <th style="border:1px solid #000; padding:1px 2px; font-size:9px; font-weight:bold;">Item</th>
    <th style="border:1px solid #000; padding:1px 2px; font-size:9px; font-weight:bold; width:13%;">Min Price</th>
    <th style="border:1px solid #000; padding:1px 2px; font-size:9px; font-weight:bold; width:13%;">Max Price</th>
  `).map(h => h.replace("Number", ui.tableHeaders.number)
               .replace("Item", ui.tableHeaders.item)
               .replace("Min Price", ui.tableHeaders.minPrice)
               .replace("Max Price", ui.tableHeaders.maxPrice)
  ).join(`<th style="width:8px; border:none;"></th>`);

  const tableHtml = `
    <table style="width:100%; border-collapse:collapse; margin:0; page-break-inside: avoid;">
      <thead><tr>${headerRow}</tr></thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  const content = `
    <div style="font-family: 'Iskoola Pota', 'Noto Sans Sinhala', Arial, sans-serif;">
      <div style="display:flex; align-items:center; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:4px; margin-bottom:4px;">
        <img src="/images/Gov.jpg" alt="Left Logo" style="height:70px;" onerror="this.onerror=null;this.src='https://placehold.co/70x70/E0E0E0/4A4A4A?text=Gov';">
        <div style="flex:1; text-align:center;">
          <div style="font-size:16.25px; font-weight:bold;">${ui.title}</div>
          <div style="font-size:10.25px;">${ui.center}</div>
        </div>
        <img src="/images/logo.jpg" alt="Right Logo" style="height:70px;" onerror="this.onerror=null;this.src='https://placehold.co/70x70/E0E0E0/4A4A4A?text=Logo';">
      </div>

      <div style="display:flex; justify-content:space-between; font-size:9.25px; margin-bottom:4px;">
        <div>${ui.tel}</div>
        <div>${ui.dateLabel}: <strong>${date}</strong></div>
        <div>${ui.emailLabel}: dambulladec@gmail.com</div>
      </div>

      ${tableHtml}

      <div style="margin-top:4px; font-size:8.25px; background:#fff3cd; border:1px solid #000; padding:4px;">
        <strong>${ui.inquiry}</strong> ${ui.manager}<br/>
        ${ui.contact}
      </div>
    </div>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Retaining alert as per user's provided code.
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
          /* Ensure all table cells have a consistent height for a uniform grid */
          td, th {
            height: 15.4px; /* Fixed height for consistent sizing */
            line-height: 1.2; /* Tighter line spacing */
            overflow: hidden; /* Prevent content from overflowing if too large */
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700&display=swap" rel="stylesheet">
      </head>
      <body>${content}</body>
    </html>
  `);

  printWindow.document.close();
  // Ensure images load before printing to prevent missing images on the printout
  await waitForImagesToLoad(printWindow.document.body);
  printWindow.focus();
  printWindow.print();
};
