"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";

import { Button } from "@/components/ui/Button";
import { loadPDFDocument } from "@/lib/pdfUtils";

interface PDFViewerProps {
  data: ArrayBuffer | null;
  filename: string;
  pageCount: number;
}

export function PDFViewer({ data, filename, pageCount }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [document, setDocument] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setCurrentPage(1);
    setError("");

    if (!data) {
      return;
    }

    loadPDFDocument(data)
      .then((pdf) => {
        if (!cancelled) {
          setDocument(pdf);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("PDF 预览加载失败，但仍可继续问答。");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [data]);

  useEffect(() => {
    let cancelled = false;

    async function renderPage() {
      if (!document || !canvasRef.current) {
        return;
      }

      const page = await document.getPage(currentPage);
      const containerWidth = containerRef.current?.clientWidth ?? 520;
      const baseViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(1.7, Math.max(0.6, (containerWidth - 32) / baseViewport.width));
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);

      await page.render({ canvasContext: context, viewport }).promise;

      if (cancelled) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }

    renderPage().catch(() => setError("当前页渲染失败，请切换页面或重新上传。"));

    return () => {
      cancelled = true;
    };
  }, [document, currentPage]);

  if (!data) {
    return (
      <aside className="pdf-viewer pdf-viewer-empty">
        <p>从历史恢复的对话不包含 PDF 预览。重新上传原 PDF 后可查看左侧页面。</p>
      </aside>
    );
  }

  return (
    <aside className="pdf-viewer" ref={containerRef} aria-label={`${filename} PDF 预览`}>
      <div className="pdf-canvas-wrap">
        {error ? <p className="upload-error">{error}</p> : <canvas ref={canvasRef} />}
      </div>
      <div className="pdf-controls">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
          disabled={currentPage <= 1}
          icon={<ChevronLeft size={16} />}
        >
          上一页
        </Button>
        <span>
          第 {currentPage} / {pageCount} 页
        </span>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setCurrentPage((value) => Math.min(pageCount, value + 1))}
          disabled={currentPage >= pageCount}
        >
          下一页
          <ChevronRight size={16} />
        </Button>
      </div>
    </aside>
  );
}
