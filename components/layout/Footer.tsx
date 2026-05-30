"use client";

import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <span suppressHydrationWarning>© {year} 文润</span>
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
