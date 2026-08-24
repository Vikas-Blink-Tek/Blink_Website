import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { EmiResult, LoanConfig, EmiScheme } from './emi';

const ORANGE: [number, number, number] = [234, 88, 12];
const DARK: [number, number, number] = [15, 23, 42];
const MUTED: [number, number, number] = [100, 116, 139];
const AMBER: [number, number, number] = [217, 119, 6];
const FONT = 'helvetica';

function formatIndianNumber(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(Number.isFinite(amount) ? amount : 0));
}

/** ASCII-safe currency for jsPDF built-in fonts (₹ renders as a stray "1" in Helvetica). */
function formatPdfINR(amount: number): string {
  return `Rs. ${formatIndianNumber(amount)}`;
}

async function loadLogoAssets(): Promise<{
  header: { dataUrl: string; width: number; height: number };
  watermark: { dataUrl: string; width: number; height: number };
} | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = '/new_logo.png';
    await img.decode();

    const pad = 8;
    const headerCanvas = document.createElement('canvas');
    headerCanvas.width = img.naturalWidth + pad * 2;
    headerCanvas.height = img.naturalHeight + pad * 2;
    const headerCtx = headerCanvas.getContext('2d');
    if (!headerCtx) return null;
    headerCtx.fillStyle = '#ffffff';
    headerCtx.fillRect(0, 0, headerCanvas.width, headerCanvas.height);
    headerCtx.drawImage(img, pad, pad);

    const bWidth = Math.round(img.naturalWidth * (105 / 267));
    const bHeight = img.naturalHeight;
    const targetHeight = 2400;
    const targetWidth = Math.round(targetHeight * (bWidth / bHeight));

    let stage = document.createElement('canvas');
    stage.width = bWidth;
    stage.height = bHeight;
    const stageCtx = stage.getContext('2d');
    if (!stageCtx) return null;
    stageCtx.imageSmoothingEnabled = true;
    stageCtx.imageSmoothingQuality = 'high';
    stageCtx.drawImage(img, 0, 0, bWidth, bHeight, 0, 0, bWidth, bHeight);

    while (stage.width * 2 <= targetWidth && stage.height * 2 <= targetHeight) {
      const next = document.createElement('canvas');
      next.width = stage.width * 2;
      next.height = stage.height * 2;
      const nextCtx = next.getContext('2d');
      if (!nextCtx) break;
      nextCtx.imageSmoothingEnabled = true;
      nextCtx.imageSmoothingQuality = 'high';
      nextCtx.drawImage(stage, 0, 0, next.width, next.height);
      stage = next;
    }

    const markCanvas = document.createElement('canvas');
    markCanvas.width = targetWidth;
    markCanvas.height = targetHeight;
    const markCtx = markCanvas.getContext('2d');
    if (!markCtx) return null;
    markCtx.imageSmoothingEnabled = true;
    markCtx.imageSmoothingQuality = 'high';
    markCtx.globalAlpha = 0.04;
    markCtx.drawImage(stage, 0, 0, targetWidth, targetHeight);

    return {
      header: {
        dataUrl: headerCanvas.toDataURL('image/png'),
        width: headerCanvas.width,
        height: headerCanvas.height,
      },
      watermark: {
        dataUrl: markCanvas.toDataURL('image/png'),
        width: markCanvas.width,
        height: markCanvas.height,
      },
    };
  } catch {
    return null;
  }
}

export interface EmiPdfInput {
  name: string;
  loan: LoanConfig;
  principal: number;
  annualRate: number;
  months: number;
  scheme: EmiScheme;
  result: EmiResult;
}

export async function downloadEmiPdf(input: EmiPdfInput): Promise<void> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const logos = await loadLogoAssets();
  const logo = logos?.header ?? null;
  const watermark = logos?.watermark ?? null;
  const generatedOn = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const headerHeight = 36;

  const drawWatermark = (pageNumber: number) => {
    if (!watermark) return;
    const markHeight = 250;
    const markWidth = markHeight * (watermark.width / watermark.height);
    const x = (pageWidth - markWidth) / 2;
    const y = (pageHeight - markHeight) / 2 + 42;
    try {
      doc.addImage(watermark.dataUrl, 'PNG', x, y, markWidth, markHeight, `blink-watermark-${pageNumber}`, 'NONE', 0);
    } catch {
      try {
        doc.addImage(watermark.dataUrl, 'PNG', x, y, markWidth, markHeight);
      } catch {
        /* skip watermark if encoding fails */
      }
    }
  };

  const drawHeader = () => {
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, headerHeight, 'F');
    doc.setFillColor(...ORANGE);
    doc.rect(0, headerHeight, pageWidth, 1.2, 'F');

    if (logo) {
      const logoHeight = 26;
      const logoWidth = logoHeight * (logo.width / logo.height);
      const x = 10;
      const y = (headerHeight - logoHeight) / 2;
      try {
        doc.addImage(logo.dataUrl, 'PNG', x, y, logoWidth, logoHeight);
      } catch {
        /* skip logo if encoding fails */
      }
    }

    doc.setTextColor(...DARK);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(12);
    doc.text('EMI Calculation Report', pageWidth - 12, 16, { align: 'right' });
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(generatedOn, pageWidth - 12, 23, { align: 'right' });
  };

  const drawFooter = (pageNumber: number) => {
    doc.setFillColor(248, 250, 252);
    doc.rect(0, pageHeight - 18, pageWidth, 18, 'F');
    doc.setDrawColor(...ORANGE);
    doc.setLineWidth(0.4);
    doc.line(0, pageHeight - 18, pageWidth, pageHeight - 18);
    doc.setTextColor(...MUTED);
    doc.setFontSize(7);
    doc.setFont(FONT, 'normal');
    doc.text(
      'Blink Finance is a loan facilitation/advisory service (DSA) and does not itself lend money.',
      pageWidth / 2,
      pageHeight - 11,
      { align: 'center' }
    );
    doc.text(
      'Call 8828821333  |  info@blinkfinance.in  |  blinkfinance.in',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
    doc.setTextColor(...ORANGE);
    doc.setFont(FONT, 'bold');
    doc.text(String(pageNumber), pageWidth - 10, pageHeight - 6, { align: 'right' });
  };

  drawHeader();

  doc.setTextColor(...DARK);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(13);
  doc.text(`Prepared for ${input.name}`, 12, 46);

  doc.setFont(FONT, 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(
    `${input.loan.label}  |  ${input.scheme === 'advance' ? 'EMI in Advance' : 'EMI in Arrears'}`,
    12,
    52
  );

  const tenureLabel =
    input.months % 12 === 0
      ? `${input.months / 12} year${input.months / 12 === 1 ? '' : 's'}`
      : `${input.months} months`;

  autoTable(doc, {
    startY: 58,
    theme: 'plain',
    styles: { font: FONT, fontSize: 9, cellPadding: 3.2, textColor: DARK, overflow: 'linebreak' },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 42, textColor: MUTED },
      1: { cellWidth: 51, fontStyle: 'bold' },
      2: { fontStyle: 'bold', cellWidth: 42, textColor: MUTED },
      3: { cellWidth: 51, fontStyle: 'bold' },
    },
    body: [
      ['Loan Amount', formatPdfINR(input.principal), 'Interest Rate', `${input.annualRate.toFixed(2)}% p.a.`],
      ['Tenure', tenureLabel, 'Monthly EMI', formatPdfINR(input.result.emi)],
      ['Total Interest', formatPdfINR(input.result.totalInterest), 'Total Payment', formatPdfINR(input.result.totalPayment)],
    ],
  });

  const afterInputs = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 8;

  doc.setFillColor(255, 247, 237);
  doc.roundedRect(12, afterInputs, pageWidth - 24, 28, 3, 3, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(...AMBER);
  doc.text('LOAN EMI', 22, afterInputs + 9);
  doc.setTextColor(...ORANGE);
  doc.text('TOTAL INTEREST', 78, afterInputs + 9);
  doc.setTextColor(...DARK);
  doc.text('TOTAL PAYMENT', 140, afterInputs + 9);

  doc.setFontSize(12);
  doc.setTextColor(...DARK);
  doc.text(formatPdfINR(input.result.emi), 22, afterInputs + 20);
  doc.setTextColor(...ORANGE);
  doc.text(formatPdfINR(input.result.totalInterest), 78, afterInputs + 20);
  doc.setTextColor(...DARK);
  doc.text(formatPdfINR(input.result.totalPayment), 140, afterInputs + 20);

  const tableStart = afterInputs + 36;
  doc.setFont(FONT, 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...DARK);
  doc.text('Year-wise payment schedule', 12, tableStart);

  autoTable(doc, {
    startY: tableStart + 4,
    head: [['Year', 'Principal (Rs.)', 'Interest (Rs.)', 'Total (Rs.)', 'Closing Balance (Rs.)']],
    body: input.result.years.map((year) => [
      year.label,
      formatIndianNumber(year.principal),
      formatIndianNumber(year.interest),
      formatIndianNumber(year.emiTotal),
      formatIndianNumber(year.closingBalance),
    ]),
    theme: 'striped',
    styles: { font: FONT, fontSize: 8, cellPadding: 2.4, overflow: 'linebreak' },
    headStyles: {
      fillColor: DARK,
      textColor: [255, 255, 255],
      font: FONT,
      fontStyle: 'bold',
      fontSize: 7.5,
      halign: 'right',
    },
    bodyStyles: { font: FONT, textColor: DARK },
    columnStyles: {
      0: { cellWidth: 28, halign: 'left', fontStyle: 'bold' },
      1: { cellWidth: 38, halign: 'right' },
      2: { cellWidth: 38, halign: 'right' },
      3: { cellWidth: 40, halign: 'right' },
      4: { cellWidth: 42, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 0) {
        data.cell.styles.halign = 'left';
      }
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { left: 12, right: 12, bottom: 24, top: 42 },
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    if (i > 1) drawHeader();
    drawFooter(i);
    drawWatermark(i);
  }

  const safeName = input.name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  doc.save(`Blink-Finance-EMI-${input.loan.label.replace(/\s+/g, '-')}-${safeName}.pdf`);
}
