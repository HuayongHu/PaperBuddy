export function Footer() {
  const model = process.env.LLM_MODEL_ID ?? "openai/gpt-oss-120b";

  return (
    <footer className="footer">
      <span>© 2026 论笔</span>
      <span>Powered by {model}</span>
    </footer>
  );
}
