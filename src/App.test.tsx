import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { navItems } from "./data/content";

describe("App", () => {
  it("has a section for every nav link, labelled by its heading", () => {
    render(<App />);
    navItems.forEach((item) => {
      const section = document.getElementById(item.id);
      expect(section, `missing section #${item.id}`).not.toBeNull();
      expect(section?.getAttribute("aria-labelledby")).toBe(`${item.id}-title`);
      expect(document.getElementById(`${item.id}-title`)).not.toBeNull();
    });
  });

  it("has exactly one h1 with the name", () => {
    render(<App />);
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName("Anup Singh Lodh");
  });

  it("has a #top target for the logo link", () => {
    render(<App />);
    expect(document.getElementById("top")).not.toBeNull();
  });
});
