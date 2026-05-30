"use client";

const questions = ["概述主要贡献", "解释研究方法", "实验结果如何？", "本文创新点是什么？"];

interface QuickQuestionsProps {
  onAsk: (question: string) => void;
}

export function QuickQuestions({ onAsk }: QuickQuestionsProps) {
  return (
    <div className="quick-questions" aria-label="快捷提问">
      {questions.map((question) => (
        <button key={question} type="button" onClick={() => onAsk(question)}>
          {question}
        </button>
      ))}
    </div>
  );
}
