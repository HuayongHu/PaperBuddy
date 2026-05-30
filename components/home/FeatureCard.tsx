import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  highlighted?: boolean;
}

export function FeatureCard({
  href,
  icon: Icon,
  title,
  description,
  highlighted = false
}: FeatureCardProps) {
  return (
    <Link href={href} className={`feature-card ${highlighted ? "highlighted" : ""}`}>
      <span className="feature-icon">
        <Icon size={28} aria-hidden="true" />
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="feature-action">
        开始使用
        <ArrowRight size={16} aria-hidden="true" />
      </span>
    </Link>
  );
}
