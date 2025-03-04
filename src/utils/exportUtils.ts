
import { jsPDF } from 'jspdf';

// Convert JSON data to CSV string
export const convertToCSV = (data: any[]) => {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values that contain commas, quotes, or are undefined
      const escaped = value === null || value === undefined ? '' 
        : typeof value === 'object' ? JSON.stringify(value).replace(/"/g, '""')
        : String(value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
};

// Convert JSON data to XML string
export const convertToXML = (data: any[], rootName = 'data', itemName = 'item') => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<${rootName}>\n`;
  
  for (const item of data) {
    xml += `  <${itemName}>\n`;
    for (const [key, value] of Object.entries(item)) {
      xml += `    <${key}>${value === null || value === undefined ? '' : String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>\n`;
    }
    xml += `  </${itemName}>\n`;
  }
  
  xml += `</${rootName}>`;
  return xml;
};

// Export data as CSV file
export const exportAsCSV = (data: any[], filename = 'export') => {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as XML file
export const exportAsXML = (data: any[], filename = 'export', rootName = 'data', itemName = 'item') => {
  const xml = convertToXML(data, rootName, itemName);
  const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
  const link = document.createElement('a');
  
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xml`);
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data as PDF file
export const exportAsPDF = (data: any[], filename = 'export', columns?: string[]) => {
  const doc = new jsPDF();
  
  if (!columns) {
    columns = Object.keys(data[0] || {});
  }
  
  // Set up document properties
  doc.setFontSize(12);
  doc.text(filename, 14, 22);
  doc.setFontSize(10);
  
  // Draw table header
  let y = 30;
  let colWidth = 180 / columns.length;
  
  columns.forEach((column, i) => {
    doc.setFont('helvetica', 'bold');
    doc.text(column, 14 + (i * colWidth), y);
  });
  
  doc.line(14, y + 2, 200, y + 2);
  y += 10;
  
  // Draw table rows
  data.forEach((row) => {
    doc.setFont('helvetica', 'normal');
    columns!.forEach((column, i) => {
      const value = row[column];
      const text = value === null || value === undefined ? '' : String(value);
      doc.text(text.substring(0, 20) + (text.length > 20 ? '...' : ''), 14 + (i * colWidth), y);
    });
    y += 7;
    
    // Add new page if needed
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
  });
  
  // Save the PDF
  doc.save(`${filename}.pdf`);
};
