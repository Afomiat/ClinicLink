import jsPDF from 'jspdf';
import 'jspdf-autotable';

/**
 * Export data to a real CSV file download
 */
export const exportToCSV = (filename, headers, rows) => {
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export data to a clean formatted PDF document download
 */
export const exportToPDF = (title, headers, rows, filename = 'document') => {
  const doc = new jsPDF();
  
  // Header section
  doc.setFontSize(18);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('ClinicLink Health Portal', 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(`${title} - Generated on ${new Date().toLocaleDateString()}`, 14, 28);
  
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 32, 196, 32);

  // Auto Table
  if (doc.autoTable) {
    doc.autoTable({
      startY: 38,
      head: [headers],
      body: rows,
      theme: 'grid',
      headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 4 },
      alternateRowStyles: { fillColor: [248, 250, 252] }
    });
  } else {
    // Fallback if autotable plugin isn't mounted
    let y = 42;
    doc.setFontSize(10);
    rows.forEach((row, idx) => {
      doc.text(row.join(' | '), 14, y);
      y += 8;
    });
  }

  doc.save(`${filename}.pdf`);
};

/**
 * Print functional helper
 */
export const printReport = (title, contentHtml) => {
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { font-family: sans-serif; padding: 30px; color: #0f172a; }
          h1 { font-size: 24px; color: #0f172a; margin-bottom: 5px; }
          p { color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; font-size: 12px; }
          th { background-color: #0f172a; color: white; }
        </style>
      </head>
      <body>
        <h1>ClinicLink - ${title}</h1>
        <p>Report Date: ${new Date().toLocaleString()}</p>
        <hr/>
        ${contentHtml}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
