import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";

import "katex/dist/katex.min.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "论笔 - 学术论文辅助平台",
  description: "面向研究者的论文文字点评润色与 PDF 文献理解问答工具。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
