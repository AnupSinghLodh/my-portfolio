import { describe, expect, it } from "vitest";
import { about, contact, experience, hero, heroStats, navItems, projects, quickFacts, sectionIds } from "./content";

describe("content", () => {
  it("has a nav item for every section id, in page order", () => {
    expect(navItems.map((item) => item.id)).toEqual([...sectionIds]);
  });

  it("lists SolarSquare first, then the ixigo internship with no duplicate bullets", () => {
    expect(experience.roles.map((role) => role.company)).toEqual(["SolarSquare", "ixigo"]);
    const [solarSquare, ixigo] = experience.roles;
    expect(solarSquare).toMatchObject({
      title: "Graduate Engineer Trainee",
      period: "Sep 2026 – Present",
      location: "Gurgaon, Haryana",
    });
    expect(solarSquare.bullets.map((bullet) => bullet.title)).toEqual([
      "Nakama chat platform",
      "Google sign-in & access control",
      "Conversational dialogue flows",
      "Admin console & agent tools",
    ]);
    const titles = ixigo.bullets.map((bullet) => bullet.title);
    expect(new Set(titles).size).toBe(titles.length);
    expect(ixigo.bullets).toHaveLength(4);
    expect(ixigo.location).toBe("Gurgaon, Haryana");
  });

  it("uses the corrected copy", () => {
    expect(experience.roles[1].title).toBe("Software Developer Intern");
    expect(experience.title).not.toMatch(/at ixigo/);
    expect(about.paragraphs.join(" ")).toContain("graduate");
    expect(about.paragraphs.join(" ")).not.toContain("undergraduate");
    expect(contact.body).not.toMatch(/internship/i);
    const bulletText = experience.roles[1].bullets.map((bullet) => bullet.body).join(" ");
    expect(bulletText).not.toContain("bypasses");
    expect(bulletText).toContain("handles mandatory consent and policy steps automatically");
  });

  it("reports a project count that matches the projects list", () => {
    const projectStat = heroStats.find((stat) => stat.label === "Featured projects");
    expect(projectStat?.value).toBe(projects.length);
  });

  it("reflects the current role, location and title", () => {
    expect(hero.label).toBe("Software Engineer");
    expect(quickFacts).toEqual([
      { label: "Latest role", value: "Graduate Engineer Trainee, SolarSquare" },
      { label: "Education", value: "B.Tech CSE, MITS Gwalior" },
      { label: "Location", value: "Gurgaon, Haryana" },
    ]);
  });

  it("describes the current job instead of job-seeking", () => {
    const aboutText = about.paragraphs.join(" ");
    expect(aboutText).toContain("Graduate Engineer Trainee at SolarSquare");
    expect(aboutText).not.toMatch(/looking for/i);
    expect(contact.body).not.toMatch(/full-time|roles/i);
  });
});
