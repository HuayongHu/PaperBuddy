"use client";

import { FileUp, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { PDFChatRecord } from "@/types/storage";

interface UploadZoneProps {
  isProcessing: boolean;
  error: string;
  progressText: string;
  history: PDFChatRecord[];
  onFileSelected: (file: File) => void;
  onRestore: (record: PDFChatRecord) => void;
  onDeleteHistory: (filename: string) => void;
}

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(timestamp);
}

export function UploadZone({
  isProcessing,
  error,
  progressText,
  history,
  onFileSelected,
  onRestore,
  onDeleteHistory
}: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (file) {
      onFileSelected(file);
    }
  }

  return (
    <main className="upload-page">
      <section
        className={`upload-zone ${dragging ? "dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={(event) => {
          event.preventDefault();
          setDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFiles(event.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label="上传 PDF 文件"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          hidden
          onChange={(event) => handleFiles(event.target.files)}
        />
        {isProcessing ? (
          <Loader2 className="upload-spin" size={36} aria-hidden="true" />
        ) : (
          <FileUp size={42} aria-hidden="true" />
        )}
        <h1>{isProcessing ? "正在处理 PDF" : "拖拽 PDF 文件到此处"}</h1>
        <p>{isProcessing ? progressText : "或点击选择文件，支持 PDF 格式，文件大小 ≤ 20MB"}</p>
        {isProcessing && <div className="progress-bar"><span /></div>}
        {error && <p className="upload-error">{error}</p>}
      </section>

      {history.length > 0 && (
        <section className="pdf-history">
          <h2>从历史记录中选择之前上传的文献</h2>
          <div className="pdf-history-list">
            {history.map((record) => (
              <article key={record.filename} className="pdf-history-item">
                <button type="button" onClick={() => onRestore(record)}>
                  <strong>{record.filename}</strong>
                  <span>
                    {record.pageCount} 页 · {record.messages.length} 条消息 ·{" "}
                    {formatTime(record.lastAccessed)}
                  </span>
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onDeleteHistory(record.filename)}
                >
                  删除
                </Button>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
