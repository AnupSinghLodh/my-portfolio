import { describe, expect, it } from "vitest";
import { entranceVariants } from "./motion";

describe("entranceVariants", () => {
  it("gives cards a tilted, blurred, lowered start", () => {
    const hidden = entranceVariants("card", false).hidden as Record<string, unknown>;
    expect(hidden).toMatchObject({ opacity: 0, rotateX: 8, filter: "blur(8px)" });
    expect(hidden.y).toBeGreaterThan(0);
  });

  it("gives list items a subtle blur fade-up", () => {
    const hidden = entranceVariants("fade", false).hidden as Record<string, unknown>;
    expect(hidden).toMatchObject({ opacity: 0, filter: "blur(6px)" });
    expect(hidden).not.toHaveProperty("rotateX");
  });

  it("reduces every entrance to a plain opacity fade under reduced motion", () => {
    for (const kind of ["card", "fade"] as const) {
      const { hidden, visible } = entranceVariants(kind, true);
      expect(hidden).toEqual({ opacity: 0 });
      expect(visible).toMatchObject({ opacity: 1 });
      expect(visible).not.toHaveProperty("filter");
    }
  });
});
