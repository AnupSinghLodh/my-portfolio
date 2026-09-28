import { describe, expect, it } from "vitest";
import { withFallback } from "./lazyWithFallback";

describe("withFallback", () => {
  it("resolves to the loaded module when the import succeeds", async () => {
    const real = () => "real";
    await expect(withFallback(() => Promise.resolve({ default: real }), () => "fallback")()).resolves.toEqual({ default: real });
  });

  it("resolves to the fallback when the import rejects (e.g. a 404 chunk after a redeploy)", async () => {
    const fallback = () => "fallback";
    const load = withFallback(() => Promise.reject(new Error("Failed to fetch dynamically imported module")), fallback);
    await expect(load()).resolves.toEqual({ default: fallback });
  });
});
