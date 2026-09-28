import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { MotionGlobalConfig } from "motion/react";
import { afterEach, vi } from "vitest";

// Animations finish instantly in tests so exit/enter states settle synchronously.
MotionGlobalConfig.skipAnimations = true;

type TestWindow = Window & { __reducedMotion?: boolean };

/**
 * Call at the top of a test file, before importing components; motion caches the preference on first use.
 * Stored on window so it is shared even if this module is instantiated twice.
 */
export function setReducedMotion(value: boolean) {
  (window as TestWindow).__reducedMotion = value;
}

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: query.includes("prefers-reduced-motion") ? (window as TestWindow).__reducedMotion === true : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

class StubObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("IntersectionObserver", StubObserver);
vi.stubGlobal("ResizeObserver", StubObserver);

// jsdom has no WebGL; returning null mirrors a browser without GPU support.
HTMLCanvasElement.prototype.getContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
window.scrollTo = vi.fn() as typeof window.scrollTo;

afterEach(() => cleanup());
