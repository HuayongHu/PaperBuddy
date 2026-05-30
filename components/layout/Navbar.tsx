"use client";

import { BookOpenText, FileText, PenLine } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/polish", label: "论文润色", icon: PenLine },
  { href: "/pdf", label: "文献解读", icon: FileText }
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="navbar">
      <Link href="/" className="brand" aria-label="返回首页">
        <BookOpenText size={22} aria-hidden="true" />
        <span>论笔</span>
      </Link>
      <nav className="nav-links" aria-label="主导航">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${active ? "active" : ""}`}
            >
              <Icon size={16} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
