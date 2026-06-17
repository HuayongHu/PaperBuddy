import type { Metadata } from "next";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://paperbuddy.hhylab.com";

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "文润 - 帮您写好论文读懂文献",
    template: "%s | 文润"
  },
  description:
    "文润是一款面向研究者和学生的论文辅助网页，支持论文文字点评润色、中文翻译、PDF 文献解读和基于文献内容的智能问答。",
  keywords: [
    "文润",
    "论文润色",
    "论文写作",
    "学术写作",
    "文献解读",
    "PDF 问答",
    "AI 论文助手",
    "PaperBuddy"
  ],
  authors: [{ name: "Huayong Hu", url: "https://github.com/HuayongHu" }],
  creator: "Huayong Hu",
  publisher: "Huayong Hu",
  applicationName: "文润",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo.jpg"
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "文润",
    title: "文润 - 帮您写好论文读懂文献",
    description:
      "用于论文文字点评润色、中文翻译、PDF 文献解读和文献问答的 AI 学术助手。",
    images: [
      {
        url: "/logo.jpg",
        width: 1096,
        height: 1096,
        alt: "文润"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "文润 - 帮您写好论文读懂文献",
    description:
      "用于论文文字点评润色、中文翻译、PDF 文献解读和文献问答的 AI 学术助手。",
    images: ["/logo.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  alternates: {
    canonical: "/"
  },
  category: "education"
};

export const polishPageMetadata: Metadata = {
  title: "论文润色",
  description:
    "使用文润进行论文润色、问题点评、中文翻译和学术表达优化，按段落获得清晰的修改建议。",
  alternates: {
    canonical: "/polish"
  },
  openGraph: {
    title: "论文润色 | 文润",
    description:
      "粘贴论文片段，获得中文翻译、问题分析、润色结果和润色后的中文翻译。",
    url: "/polish",
    images: ["/logo.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "论文润色 | 文润",
    description:
      "粘贴论文片段，获得中文翻译、问题分析、润色结果和润色后的中文翻译。",
    images: ["/logo.jpg"]
  }
};

export const pdfPageMetadata: Metadata = {
  title: "文献解读",
  description:
    "使用文润上传 PDF 论文，进行 PDF 文献解读、全文理解和基于文献内容的智能问答。",
  alternates: {
    canonical: "/pdf"
  },
  openGraph: {
    title: "文献解读 | 文润",
    description: "上传 PDF 论文，提取全文内容后与 AI 多轮交流，快速理解研究问题、方法和结论。",
    url: "/pdf",
    images: ["/logo.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "文献解读 | 文润",
    description: "上传 PDF 论文，提取全文内容后与 AI 多轮交流，快速理解研究问题、方法和结论。",
    images: ["/logo.jpg"]
  }
};
