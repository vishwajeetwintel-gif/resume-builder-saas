import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportToPDF = async (elementId, filename = 'resume.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error('Element not found');

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      width: element.scrollWidth,
      height: element.scrollHeight
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const totalHeight = imgHeight * ratio;
    let heightLeft = totalHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, totalHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - totalHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, totalHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.error('PDF export error:', err);
    throw err;
  }
};

export const printResume = (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) return;
  const printContent = element.innerHTML;
  const win = window.open('', '', 'height=900,width=700');
  win.document.write(`<html><head><title>Resume</title>
    <style>
      body { margin: 0; padding: 20px; font-family: 'Times New Roman', serif; }
      * { box-sizing: border-box; }
    </style>
    </head><body>${printContent}</body></html>`);
  win.document.close();
  win.focus();
  win.print();
  win.close();
};
