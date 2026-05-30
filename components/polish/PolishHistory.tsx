"use client";

import { ChevronDown, ChevronUp, History, X } from "lucide-react";
import { useState } from "react";

import type { PolishRecord } from "@/types/polish";

interface PolishHistoryProps {
  records: PolishRecord[];
  onRestore: (record: PolishRecord) => void;
  onDelete: (id: string) => void;
}

const modeLabels = {
  light: "轻度润色",
  academic: "学术加强",
  rewrite: "结构重写"
};

function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(timestamp);
}

export function PolishHistory({ records, onRestore, onDelete }: PolishHistoryProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="history-panel">
      <button
        type="button"
        className="history-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>
          <History size={16} aria-hidden="true" />
          润色历史
        </span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="history-list">
          {records.length === 0 ? (
            <p className="muted small">最近 10 条润色记录会显示在这里。</p>
          ) : (
            records.map((record) => (
              <div key={record.id} className="history-item">
                <button type="button" onClick={() => onRestore(record)}>
                  <strong>
                    {formatTime(record.timestamp)} {modeLabels[record.mode]}
                  </strong>
                  <span>{record.inputText.slice(0, 20) || "无预览"}</span>
                </button>
                <button
                  type="button"
                  className="history-delete"
                  aria-label="删除该润色历史"
                  onClick={() => onDelete(record.id)}
                >
                  <X size={15} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
