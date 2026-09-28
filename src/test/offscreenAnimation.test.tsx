import { act, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

// Record the pause flags our components pass, instead of timing real animation frames.
vi.mock("../components/reactbits/ShinyText", () => ({
  default: ({ text, disabled }: { text: string; disabled?: boolean }) => (
    <span data-testid="shiny" data-disabled={String(Boolean(disabled))}>
      {text}
    </span>
  ),
}));
vi.mock("../components/reactbits/GradientText", () => ({
  default: ({ children, paused }: { children: ReactNode; paused?: boolean }) => (
    <div data-testid="gradient" data-paused={String(Boolean(paused))}>
      {children}
    </div>
  ),
}));

const observers: { callback: IntersectionObserverCallback; targets: Element[] }[] = [];

class ControlledObserver {
  private record: { callback: IntersectionObserverCallback; targets: Element[] };
  constructor(callback: IntersectionObserverCallback) {
    this.record = { callback, targets: [] };
    observers.push(this.record);
  }
  observe(target: Element) {
    this.record.targets.push(target);
  }
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
vi.stubGlobal("IntersectionObserver", ControlledObserver);

function setInView(target: Element, isIntersecting: boolean) {
  act(() => {
    observers
      .filter((observer) => observer.targets.includes(target))
      .forEach((observer) =>
        observer.callback([{ target, isIntersecting } as IntersectionObserverEntry], {} as IntersectionObserver)
      );
  });
}

const { default: HeroContent } = await import("../components/hero/HeroContent");
const { default: Contact } = await import("../sections/Contact");

describe("text animations pause offscreen", () => {
  it("runs the hero label shine only while the hero content is in view", () => {
    const { container } = render(
      <HeroContent label="Software Engineer" name="Anup" rotatingStack={["React"]} summary="s" email="a@b.c" />
    );
    expect(screen.getByTestId("shiny")).toHaveAttribute("data-disabled", "true");

    setInView(container.firstElementChild!, true);
    expect(screen.getByTestId("shiny")).toHaveAttribute("data-disabled", "false");

    setInView(container.firstElementChild!, false);
    expect(screen.getByTestId("shiny")).toHaveAttribute("data-disabled", "true");
  });

  it("runs the contact heading gradient only while the contact section is in view", () => {
    render(<Contact />);
    const section = document.getElementById("contact")!;
    expect(screen.getByTestId("gradient")).toHaveAttribute("data-paused", "true");

    setInView(section, true);
    expect(screen.getByTestId("gradient")).toHaveAttribute("data-paused", "false");
  });
});
