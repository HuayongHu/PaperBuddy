"use client";

import { CheckCircle2, ChevronDown, ChevronUp, FileText, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { CopyButton } from "@/components/ui/CopyButton";
import type { PolishBlock } from "@/types/polish";

interface AnnotationCardProps {
  block: PolishBlock;
  index: number;
}

export function AnnotationCard({ block, index }: AnnotationCardProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <article className="annotation-card">
      <header className="annotation-card-header">
        <h3>段落 {index + 1}</h3>
        <button
          type="button"
          className="icon-text-button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          {collapsed ? "展开" : "收起"}
        </button>
      </header>

      {!collapsed && (
        <div className="annotation-card-body">
          <section className="annotation-section">
            <h4>
              <FileText size={16} aria-hidden="true" />
              原文
            </h4>
            <div className="original-box">{block.original}</div>
          </section>

          <section className="annotation-section">
            <h4 className="issue-title">
              <TriangleAlert size={16} aria-hidden="true" />
              问题分析
            </h4>
            <ul className="issue-list">
              {block.analysis.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="annotation-section">
            <div className="annotation-section-title-row">
              <h4 className="polished-title">
                <CheckCircle2 size={16} aria-hidden="true" />
                润色结果
              </h4>
              <CopyButton text={block.polished} label="复制本段" />
            </div>
            <div className="polished-box">{block.polished}</div>
          </section>
        </div>
      )}
    </article>
  );
}
