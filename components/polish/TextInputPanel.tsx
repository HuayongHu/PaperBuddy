"use client";

import { Send, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Textarea } from "@/components/ui/Textarea";
import type { PolishMode } from "@/types/polish";

import { ModeSelector } from "./ModeSelector";

interface TextInputPanelProps {
  mode: PolishMode;
  text: string;
  isLoading: boolean;
  onModeChange: (mode: PolishMode) => void;
  onTextChange: (text: string) => void;
  onSubmit: () => void;
  onClear: () => void;
}

export function TextInputPanel({
  mode,
  text,
  isLoading,
  onModeChange,
  onTextChange,
  onSubmit,
  onClear
}: TextInputPanelProps) {
  const wordCount = text.trim().length;
  const tooLong = wordCount > 2000;
  const canSubmit = text.trim().length > 0 && !tooLong && !isLoading;

  return (
    <div className="input-panel">
      <ModeSelector value={mode} onChange={onModeChange} />

      <section className="panel-section grow" aria-labelledby="input-title">
        <div className="section-header">
          <h2 id="input-title">输入区</h2>
        </div>
        <Textarea
          value={text}
          onChange={(event) => onTextChange(event.target.value)}
          placeholder={`在此粘贴需要润色的论文片段（段落或章节）…

支持中英文论文，建议每次提交不超过 2000 字。
超过 2000 字时，系统将提示您分段提交。`}
          rows={14}
          aria-label="需要润色的论文片段"
        />
        <div className={`input-meta ${tooLong ? "danger" : ""}`}>
          <span>当前字数: {wordCount} 字</span>
          {tooLong && <span>文字超出 2000 字限制，建议分段提交。</span>}
        </div>
        <div className="action-row">
          <Button
            type="button"
            variant="secondary"
            onClick={onClear}
            disabled={!text && !isLoading}
            icon={<Trash2 size={16} />}
          >
            清空
          </Button>
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            icon={isLoading ? <Spinner /> : <Send size={16} />}
          >
            {isLoading ? "润色中..." : tooLong ? "文字超出限制" : "提交润色"}
          </Button>
        </div>
      </section>
    </div>
  );
}
