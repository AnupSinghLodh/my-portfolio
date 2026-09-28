import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useActiveSection } from "./useActiveSection";

let emit: IntersectionObserverCallback = () => {};

class ControlledObserver {
  constructor(callback: IntersectionObserverCallback) {
    emit = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

function cross(target: Element, isIntersecting: boolean) {
  act(() => emit([{ target, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver));
}

const ids = ["about", "contact"] as const;

describe("useActiveSection", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
  });

  it("clears the active section when it leaves the middle band and nothing replaces it", () => {
    vi.stubGlobal("IntersectionObserver", ControlledObserver);
    ids.forEach((id) => document.body.append(Object.assign(document.createElement("section"), { id })));
    const { result } = renderHook(() => useActiveSection(ids));
    const about = document.getElementById("about")!;

    cross(about, true);
    expect(result.current).toBe("about");

    cross(about, false);
    expect(result.current).toBeNull();
  });

  it("keeps the newer section when the older one reports leaving afterwards", () => {
    vi.stubGlobal("IntersectionObserver", ControlledObserver);
    ids.forEach((id) => document.body.append(Object.assign(document.createElement("section"), { id })));
    const { result } = renderHook(() => useActiveSection(ids));

    cross(document.getElementById("about")!, true);
    cross(document.getElementById("contact")!, true);
    cross(document.getElementById("about")!, false);

    expect(result.current).toBe("contact");
  });
});
