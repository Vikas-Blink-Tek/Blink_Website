import jsPDF, { GState } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatMonthYearDash, formatPaidPct, type EmiResult, type LoanConfig, type EmiScheme } from './emi';

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

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

/** jsPDF turns PNG transparency into black blocks. Flatten onto white, export JPEG. */
function flattenOnWhite(img: HTMLImageElement): { dataUrl: string; width: number; height: number } {
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    return { dataUrl: '', width: img.naturalWidth, height: img.naturalHeight };
  }
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0);
  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.95),
    width: canvas.width,
    height: canvas.height,
  };
}

async function loadLogoAssets(): Promise<{
  header: { dataUrl: string; width: number; height: number };
  watermark: { dataUrl: string; width: number; height: number } | null;
} | null> {
  const [headerImg, markImg] = await Promise.all([
    loadImage('/new_logo.png'),
    loadImage('/logo-mark.png'),
  ]);
  if (!headerImg) return null;
  const header = flattenOnWhite(headerImg);
  if (!header.dataUrl) return null;

  let watermark: { dataUrl: string; width: number; height: number } | null = null;
  if (markImg) {
    const canvas = document.createElement('canvas');
    canvas.width = markImg.naturalWidth;
    canvas.height = markImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(markImg, 0, 0);
      watermark = {
        dataUrl: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height,
      };
    }
  }

  return { header, watermark };
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

  const drawWatermark = () => {
    if (!watermark) return;
    const markHeight = 165;
    const markWidth = markHeight * (watermark.width / watermark.height);
    const x = (pageWidth - markWidth) / 2;
    const y = (pageHeight - markHeight) / 2 + 36;
    try {
      doc.saveGraphicsState();
      doc.setGState(new GState({ opacity: 0.07 }));
      doc.addImage(watermark.dataUrl, 'PNG', x, y, markWidth, markHeight, 'blink-mark', 'NONE');
      doc.restoreGraphicsState();
    } catch {
      try {
        doc.addImage(watermark.dataUrl, 'PNG', x, y, markWidth, markHeight, 'blink-mark', 'NONE');
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
        doc.addImage(logo.dataUrl, 'JPEG', x, y, logoWidth, logoHeight, 'blink-logo', 'NONE');
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
  doc.text('MONTHLY EMI', 22, afterInputs + 9);
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
  doc.text('Loan Amortization Schedule', 12, tableStart);
  doc.setFont(FONT, 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text('Each EMI = Principal (A) + Interest (B). Balance is what remains after that month.', 12, tableStart + 5);

  const GOLD: [number, number, number] = [202, 138, 4];
  const PINK: [number, number, number] = [225, 29, 72];

  autoTable(doc, {
    startY: tableStart + 8,
    head: [[
      'Month #',
      'Month & Year',
      'Principal (A)',
      'Interest (B)',
      'Total Payment (A+B)',
      'Outstanding Balance',
      'Loan Paid To Date',
    ]],
    body: input.result.schedule.map((row) => [
      String(row.monthIndex),
      formatMonthYearDash(row.date),
      formatIndianNumber(row.principal),
      formatIndianNumber(row.interest),
      formatIndianNumber(row.emi),
      formatIndianNumber(row.balance),
      formatPaidPct(row.paidToDatePct),
    ]),
    theme: 'grid',
    styles: { font: FONT, fontSize: 7, cellPadding: 1.6, overflow: 'linebreak', textColor: DARK, lineColor: [226, 232, 240], lineWidth: 0.2 },
    headStyles: {
      font: FONT,
      fontStyle: 'bold',
      fontSize: 6.5,
      halign: 'center',
      valign: 'middle',
      textColor: [255, 255, 255],
    },
    bodyStyles: { font: FONT, textColor: DARK, halign: 'right' },
    columnStyles: {
      0: { cellWidth: 16, halign: 'center' },
      1: { cellWidth: 26, halign: 'left', fontStyle: 'bold' },
      2: { cellWidth: 28, halign: 'right' },
      3: { cellWidth: 26, halign: 'right' },
      4: { cellWidth: 32, halign: 'right' },
      5: { cellWidth: 32, halign: 'right' },
      6: { cellWidth: 26, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.section === 'head') {
        const fills: [number, number, number][] = [
          [241, 245, 249],
          [241, 245, 249],
          GOLD,
          ORANGE,
          [148, 163, 184],
          PINK,
          DARK,
        ];
        const text: [number, number, number][] = [
          DARK,
          DARK,
          [255, 255, 255],
          [255, 255, 255],
          [255, 255, 255],
          [255, 255, 255],
          [255, 255, 255],
        ];
        data.cell.styles.fillColor = fills[data.column.index];
        data.cell.styles.textColor = text[data.column.index];
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
    drawWatermark();
  }

  const safeName = input.name.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  doc.save(`Blink-Finance-EMI-${input.loan.label.replace(/\s+/g, '-')}-${safeName}.pdf`);
}
