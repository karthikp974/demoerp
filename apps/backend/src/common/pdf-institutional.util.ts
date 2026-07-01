import type PDFDocument from "pdfkit";
import { formatIstDateTime } from "./ist-time.util";
import {
  INSTITUTION_LOGO_TAGLINE,
  INSTITUTION_LOGO_WORDMARK
} from "./institution-branding.constants";

export function formatPdfTimestamp(date: Date) {
  return formatIstDateTime(date);
}

/** PDFKit standard fonts cannot render ₹ — use ASCII "Rs." with Indian grouping. */
export function formatPdfInr(amount: number, decimals = 2) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "Rs. —";
  const formatted = n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  return `Rs. ${formatted}`;
}

const PDF_PAYMENT_MODE_LABELS: Record<string, string> = {
  CASH: "Cash",
  UPI: "UPI",
  CARD: "Card",
  BANK_TRANSFER: "Bank transfer",
  CHEQUE: "Cheque",
  OTHER: "Other"
};

/** Human-readable payment mode for receipts (UPI, Card, Cash, …). */
export function formatPdfPaymentMode(mode: string) {
  const key = mode.trim().toUpperCase().replace(/\s+/g, "_");
  return PDF_PAYMENT_MODE_LABELS[key] ?? mode.replace(/_/g, " ");
}

/** Transaction reference column label varies by payment mode. */
export function resolveFeePaymentTransactionLabel(mode: string) {
  const key = mode.trim().toUpperCase().replace(/\s+/g, "_");
  if (key === "UPI") return "UPI Transaction ID / UTR";
  if (key === "CARD") return "ARN";
  if (key === "BANK_TRANSFER") return "Bank Transaction Reference";
  if (key === "CHEQUE") return "Cheque Reference";
  return "Transaction Reference";
}

export function resolveFeePaymentTransactionId(input: {
  transactionId?: string | null;
  receiptNo: string;
  paymentId?: string;
}) {
  const custom = input.transactionId?.trim();
  if (custom) return custom;
  const fromReceipt = input.receiptNo.trim();
  if (fromReceipt) return `TXN-${fromReceipt}`;
  return input.paymentId ? `TXN-${input.paymentId.slice(-12).toUpperCase()}` : "—";
}

export type PdfTableColumn = {
  header: string;
  width: number;
  align?: "left" | "right" | "center";
};

/** Text wordmark for PDF headers — WFT with Institutions below (no image logo). */
export function drawPdfWordmark(
  doc: InstanceType<typeof PDFDocument>,
  left: number,
  y: number,
  align: "left" | "center" = "center"
): number {
  const right = doc.page.margins.right;
  const contentWidth = doc.page.width - left - right;
  const blockWidth = 128;
  const x = align === "center" ? left + Math.max(0, (contentWidth - blockWidth) / 2) : left;

  doc.font("Helvetica-Bold").fontSize(22).fillColor("#004b8d").text(INSTITUTION_LOGO_WORDMARK, x, y, {
    width: blockWidth,
    align: "center"
  });
  const tagY = doc.y + 2;
  doc
    .font("Helvetica-Bold")
    .fontSize(9)
    .fillColor("#64748b")
    .text(INSTITUTION_LOGO_TAGLINE.toUpperCase(), x, tagY, {
      width: blockWidth,
      align: "center",
      characterSpacing: 1.1
    });
  doc.x = left;
  return doc.y + 8;
}

export function drawPdfInstitutionalHeader(doc: InstanceType<typeof PDFDocument>, title: string) {
  const left = doc.page.margins.left;
  const right = doc.page.margins.right;
  const contentWidth = doc.page.width - left - right;
  const y = doc.page.margins.top;

  const afterWordmark = drawPdfWordmark(doc, left, y, "center");

  doc.font("Helvetica-Bold").fontSize(16).fillColor("#004b8d").text(title, left, afterWordmark, {
    width: contentWidth,
    align: "center"
  });
  doc.x = left;
  doc.y = doc.y + 10;
}

export function drawPdfSectionHeading(doc: InstanceType<typeof PDFDocument>, title: string, y?: number) {
  const left = doc.page.margins.left;
  const top = y ?? doc.y;
  doc.font("Helvetica-Bold").fontSize(11).fillColor("#004b8d").text(title, left, top, { align: "left" });
  doc.x = left;
  return doc.y + 6;
}

export function drawPdfTable(
  doc: InstanceType<typeof PDFDocument>,
  startY: number,
  left: number,
  columns: PdfTableColumn[],
  rows: string[][]
) {
  let y = startY;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);
  const bottomLimit = doc.page.height - doc.page.margins.bottom - 36;

  const drawHeader = () => {
    let x = left;
    doc.font("Helvetica-Bold").fontSize(8).fillColor("#004b8d");
    for (const col of columns) {
      doc.text(col.header, x, y, { width: col.width - 4, align: col.align ?? "left" });
      x += col.width;
    }
    y += 14;
    doc
      .moveTo(left, y)
      .lineTo(left + tableWidth, y)
      .strokeColor("#004b8d")
      .lineWidth(0.6)
      .stroke();
    y += 6;
  };

  drawHeader();

  doc.font("Helvetica").fontSize(8).fillColor("#222");
  for (const row of rows) {
    if (y > bottomLimit) {
      doc.addPage();
      y = doc.page.margins.top;
      drawHeader();
      doc.font("Helvetica").fontSize(8).fillColor("#222");
    }

    let x = left;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      doc.text(row[i] ?? "—", x, y, { width: col.width - 4, align: col.align ?? "left" });
      x += col.width;
    }
    y += 14;
    doc
      .moveTo(left, y - 4)
      .lineTo(left + tableWidth, y - 4)
      .strokeColor("#dbe3ef")
      .lineWidth(0.35)
      .stroke();
  }

  doc.x = left;
  return y + 8;
}
