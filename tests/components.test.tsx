import React from "react";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PolishHistory } from "@/components/polish/PolishHistory";
import { ResultPanel } from "@/components/polish/ResultPanel";

vi.mock("next/navigation", () => ({
  usePathname: () => "/"
}));

afterEach(() => {
  vi.useRealTimers();
});

describe("Navbar", () => {
  it("uses Wenrun branding and the configured logo", () => {
    render(<Navbar />);

    expect(screen.getByText("文润")).toBeInTheDocument();
    expect(screen.queryByText("论笔")).not.toBeInTheDocument();
    expect(screen.getByAltText("")).toHaveAttribute("src", "/logo.jpg");
  });
});

describe("Footer", () => {
  it("uses the current year instead of a hardcoded value", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2031-03-01T00:00:00Z"));

    render(<Footer />);

    expect(screen.getByText("© 2031 文润")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Huayong Hu on GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/HuayongHu/PaperBuddy"
    );
  });
});

describe("PolishHistory", () => {
  it("is expanded by default", () => {
    render(
      <PolishHistory records={[]} onRestore={vi.fn()} onDelete={vi.fn()} />
    );

    expect(screen.getByRole("button", { name: /润色历史/ })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
    expect(screen.getByText("最近 10 条润色记录会显示在这里。")).toBeInTheDocument();
  });
});

describe("ResultPanel", () => {
  it("shows the requested model thinking message while loading", () => {
    render(
      <ResultPanel
        rawResult=""
        isLoading
        error=""
        interrupted={false}
        onRetry={vi.fn()}
      />
    );

    expect(
      screen.getByText("当前服务器负载正常，模型正在思考中，请稍后....")
    ).toBeInTheDocument();
  });
});
