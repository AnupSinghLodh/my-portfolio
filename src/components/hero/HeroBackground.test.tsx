import { render, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import HeroBackground from "./HeroBackground";

describe("HeroBackground", () => {
  it("falls back to the static glow when WebGL is unavailable", async () => {
    const { container } = render(<HeroBackground trackingRef={createRef<HTMLElement>()} />);

    await waitFor(() => {
      expect(container.querySelector('[data-reason="webgl-unavailable"]')).not.toBeNull();
    });
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<HeroBackground trackingRef={createRef<HTMLElement>()} />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });
});
