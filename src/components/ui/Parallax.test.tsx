import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import Parallax from "./Parallax";

const originalMatchMedia = window.matchMedia;

function mockWideScreen(wide: boolean) {
  window.matchMedia = ((query: string) => ({
    ...originalMatchMedia(query),
    matches: query.includes("min-width: 1024px") ? wide : originalMatchMedia(query).matches,
  })) as typeof window.matchMedia;
}

describe("Parallax", () => {
  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it("offsets its children on wide screens", () => {
    mockWideScreen(true);
    render(<Parallax offset={40}>card</Parallax>);
    expect(screen.getByText("card").style.transform).toContain("translateY(40px)");
  });

  it("leaves its children in place on narrow screens", () => {
    mockWideScreen(false);
    render(<Parallax offset={40}>card</Parallax>);
    expect(screen.getByText("card").style.transform).toBe("");
  });
});
