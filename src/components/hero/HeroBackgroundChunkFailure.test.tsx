import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import HeroBackground from "./HeroBackground";

vi.mock("../reactbits/EvilEye", () => {
  throw new Error("Failed to fetch dynamically imported module");
});

describe("HeroBackground when the EvilEye chunk fails to load", () => {
  it("shows the static glow instead of crashing the page", async () => {
    const { container } = render(<HeroBackground trackingRef={createRef<HTMLElement>()} />);
    await waitFor(() => {
      expect(container.querySelector('[data-reason="webgl-unavailable"]')).not.toBeNull();
    });
  });
});
