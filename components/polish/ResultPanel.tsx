"use client";

import { FileText } from "lucide-react";

import { CopyButton } from "@/components/ui/CopyButton";
import { ErrorBanner } from "@/components/ui/ErrorBanner";
import { parsePolishResult } from "@/lib/parsePolishResult";

import { AnnotationCard } from "./AnnotationCard";

interface ResultPanelProps {
  rawResult: string;
  isLoading: boolean;
  error: string;
  interrupted: boolean;
  onRetry: () => void;
}

export function ResultPanel({
  rawResult,
  isLoading,
  error,
  interrupted,
  onRetry
}: ResultPanelProps) {
  const { blocks, pending } = parsePolishResult(rawResult);
  const combined = blocks.map((block) => block.polished).join("\n\n");
  const hasContent = blocks.length > 0 || pending;

  return (
    <section className="result-panel" aria-labelledby="result-title">
      <div className="result-header">
        <h2 id="result-title">润色结果</h2>
        <CopyButton
          text={combined}
          label="复制全文"
          copiedLabel="已复制"
          disabled={!combined}
        />
      </div>

      {error && (
        <ErrorBanner
          message={error}
          action={
            <button type="button" className="inline-retry" onClick={onRetry}>
              重试
            </button>
          }
        />
      )}

      {!hasContent && !error && (
        <div className="empty-state">
          <FileText size={36} aria-hidden="true" />
          <p>提交论文片段后，润色建议将逐段显示在这里</p>
        </div>
      )}

      <div className="annotation-list">
        {blocks.map((block, index) => (
          <AnnotationCard key={`${block.original}-${index}`} block={block} index={index} />
        ))}

        {pending && (
          <article className="annotation-card skeleton-card">
            <div className="skeleton-line short" />
            <div className="skeleton-line" />
            <div className="skeleton-line" />
            <pre>{pending}</pre>
          </article>
        )}
      </div>

      {isLoading && !pending && (
        <div className="streaming-hint">当前服务器负载正常，模型正在思考中，请稍后....</div>
      )}
      {interrupted && (
        <div className="warning-note">响应中断，以上内容可能不完整。</div>
      )}
    </section>
  );
}
