import type { Metadata } from "next";

import { PDFPage } from "@/components/pdf/PDFPage";
import { pdfPageMetadata } from "@/lib/siteMetadata";

export const metadata: Metadata = pdfPageMetadata;

export default function Page() {
  return <PDFPage />;
}
