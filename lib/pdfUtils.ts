"use client";

export interface ExtractedPDF {
  filename: string;
  pageCount: number;
  text: string;
  originalLength: number;
  truncated: boolean;
  isTextEmpty: boolean;
  data: ArrayBuffer;
}

const MAX_PDF_TEXT_LENGTH = 60_000;

async function getPDFJS() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.mjs",
    import.meta.url
  ).toString();
  return pdfjs;
}

export async function extractPDF(file: File): Promise<ExtractedPDF> {
  const data = await file.arrayBuffer();
  const pdfjs = await getPDFJS();
  const loadingTask = pdfjs.getDocument({ data: data.slice(0) });
  const pdf = await loadingTask.promise;
  const pages: string[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
    pages.push(pageText);
  }

  const fullText = pages.join("\n\n").trim();
  const truncated = fullText.length > MAX_PDF_TEXT_LENGTH;
  const text = truncated ? fullText.slice(0, MAX_PDF_TEXT_LENGTH) : fullText;

  return {
    filename: file.name,
    pageCount: pdf.numPages,
    text,
    originalLength: fullText.length,
    truncated,
    isTextEmpty: fullText.length === 0,
    data
  };
}

export async function loadPDFDocument(data: ArrayBuffer) {
  const pdfjs = await getPDFJS();
  return pdfjs.getDocument({ data: data.slice(0) }).promise;
}
