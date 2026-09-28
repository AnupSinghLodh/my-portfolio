import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { setReducedMotion } from "./setup";

setReducedMotion(true);

const { default: StatItem } = await import("../components/ui/StatItem");
const { default: HeroContent } = await import("../components/hero/HeroContent");
const { default: Parallax } = await import("../components/ui/Parallax");
const { default: ProjectCard } = await import("../components/ui/ProjectCard");

describe("reduced motion", () => {
  it("shows final stat values immediately", () => {
    render(
      <dl>
        <StatItem stat={{ value: 97.2, suffix: "%", label: "Class XII score" }} />
        <StatItem stat={{ value: 7.63, label: "CSE CGPA" }} />
      </dl>
    );
    expect(screen.getAllByText("97.2%")).toHaveLength(2);
    expect(screen.getAllByText("7.63")).toHaveLength(2);
  });

  it("renders the hero name as plain heading text", () => {
    render(
      <HeroContent
        label="Software Engineer"
        name="Anup Singh Lodh"
        rotatingStack={["Node.js", "React"]}
        summary="Summary"
        email="a@b.c"
      />
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Anup Singh Lodh");
    expect(heading.querySelector(".blur-text")).toBeNull();
  });

  it("disables parallax even on wide screens", () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...originalMatchMedia(query),
      matches: query.includes("min-width: 1024px") ? true : originalMatchMedia(query).matches,
    })) as typeof window.matchMedia;
    render(<Parallax offset={40}>card</Parallax>);
    expect(screen.getByText("card").style.transform).toBe("");
    window.matchMedia = originalMatchMedia;
  });

  it("renders project titles as plain text, without the hover scramble", () => {
    render(<ProjectCard project={{ id: "01", title: "E-Commerce Platform", period: "2025", summary: "s", tags: [] }} />);
    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("E-Commerce Platform");
    expect(heading.querySelector('[aria-hidden="true"]')).toBeNull();
  });
});
