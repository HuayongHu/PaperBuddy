import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <span>© 2026 文润</span>
      <span>
        Powered by{" "}
        <Link
          href="https://github.com/HuayongHu/PaperBuddy"
          target="_blank"
          rel="noreferrer"
        >
          Huayong Hu on GitHub
        </Link>
      </span>
    </footer>
  );
}
