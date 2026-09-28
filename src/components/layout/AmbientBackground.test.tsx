import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AmbientBackground from "./AmbientBackground";

describe("AmbientBackground", () => {
  it("sits fixed behind the page, hidden from assistive tech and pointer events", () => {
    const { container } = render(<AmbientBackground />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root).toHaveClass("fixed", "pointer-events-none", "-z-10");
  });

  it("starts invisible so the hero stays clean", () => {
    const { container } = render(<AmbientBackground />);
    expect((container.firstElementChild as HTMLElement).style.opacity).toBe("0");
  });
});
