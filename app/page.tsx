import { FileText, PenLine } from "lucide-react";

import { FeatureCard } from "@/components/home/FeatureCard";

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <h1 id="home-title">让学术写作更精准，让文献理解更深入</h1>
          <p>专为大学生、研究生和博士生设计的 AI 学术助手。</p>
        </div>

        <div className="feature-grid">
          <FeatureCard
            href="/polish"
            icon={PenLine}
            title="论文润色"
            description="粘贴论文片段，AI 按段落给出问题分析和修改后的学术表达。"
            highlighted
          />
          <FeatureCard
            href="/pdf"
            icon={FileText}
            title="文献解读"
            description="上传 PDF 论文，提取全文内容后与 AI 多轮交流，快速理解文献。"
          />
        </div>
      </section>
    </main>
  );
}
