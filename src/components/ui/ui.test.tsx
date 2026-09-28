import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Button from "./Button";
import ProjectCard from "./ProjectCard";
import Section from "./Section";
import StatItem from "./StatItem";

describe("Section", () => {
  it("labels the section by its heading", () => {
    render(
      <Section id="projects" eyebrow="Projects" title="Selected work">
        <p>body</p>
      </Section>
    );
    expect(screen.getByRole("region", { name: "Selected work" })).toHaveAttribute("id", "projects");
  });
});

describe("Button", () => {
  it("opens external links in a new tab safely", () => {
    render(
      <Button href="https://github.com/AnupSinghLodh" external>
        GitHub
      </Button>
    );
    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noreferrer");
  });

  it("keeps internal links in the same tab", () => {
    render(<Button href="#projects">View projects</Button>);
    expect(screen.getByRole("link", { name: "View projects" })).not.toHaveAttribute("target");
  });
});

describe("StatItem", () => {
  it("exposes the final value to screen readers even while counting", () => {
    render(
      <dl>
        <StatItem stat={{ value: 97.2, suffix: "%", label: "Class XII score" }} />
      </dl>
    );
    expect(screen.getByText("97.2%", { selector: ".sr-only" })).toBeInTheDocument();
    expect(screen.getByText("Class XII score")).toBeInTheDocument();
  });
});

describe("ProjectCard", () => {
  it("renders title, period and tags, and a link only when href is given", () => {
    const project = { id: "01", title: "E-Commerce Platform", period: "Mar 2025", summary: "Shop", tags: ["React", "MongoDB"] };
    const { rerender } = render(<ProjectCard project={project} />);
    const tags = screen.getByRole("list", { name: "E-Commerce Platform technologies" });
    expect(within(tags).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();

    rerender(<ProjectCard project={{ ...project, href: "https://example.com" }} />);
    expect(screen.getByRole("link", { name: /view project/i })).toHaveAttribute("href", "https://example.com");
  });
});
