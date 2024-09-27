import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const BuildReport = (data) => {
  const doc = new jsPDF();
  doc.text("Reporte", 10, 10);
  autoTable(doc, {
    head: [[
      'ECO',
      'LAT',
      'LNG',
      'STATE',
      'COUNTRY',
    ]],
    body: data,
  });
  doc.save('report-oscar-omar-arias-rodriguez.pdf');
}