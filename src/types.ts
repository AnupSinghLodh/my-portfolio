export type SectionId = "about" | "experience" | "projects" | "skills" | "education" | "contact";

export type NavItem = { id: SectionId; label: string };

export type Stat = { value: number; suffix?: string; label: string };

export type Fact = { label: string; value: string };

export type RoleBullet = { title: string; body: string };

export type Role = {
  title: string;
  company: string;
  period: string;
  location: string;
  bullets: RoleBullet[];
};

export type Project = {
  id: string;
  title: string;
  period: string;
  summary: string;
  tags: string[];
  href?: string;
};

export type SkillGroup = { title: string; items: string[]; wide?: boolean };

export type ProcessStepData = { title: string; body: string };

export type TimelineEntry = { period: string; title: string; detail: string };

export type Achievement = { title: string; body: string };

export type SocialLink = { label: string; cta: string; href: string; external: boolean };
