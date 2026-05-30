"use client";

import type { PolishMode } from "@/types/polish";

const modes: Array<{ id: PolishMode; label: string; help: string }> = [
  { id: "light", label: "轻度润色", help: "修正语法、病句、冗余和用词不当" },
  { id: "academic", label: "学术加强", help: "提升学术语气、术语规范和逻辑连贯性" },
  { id: "rewrite", label: "结构重写", help: "保留论点与数据，大幅重组表达" }
];

interface ModeSelectorProps {
  value: PolishMode;
  onChange: (mode: PolishMode) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const current = modes.find((mode) => mode.id === value);

  return (
    <section className="panel-section" aria-labelledby="mode-title">
      <div className="section-header">
        <h2 id="mode-title">润色模式</h2>
      </div>
      <div className="segmented-control" role="tablist" aria-label="润色模式">
        {modes.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="tab"
            aria-selected={value === mode.id}
            className={value === mode.id ? "selected" : ""}
            onClick={() => onChange(mode.id)}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <p className="mode-help">{current?.help}</p>
    </section>
  );
}
