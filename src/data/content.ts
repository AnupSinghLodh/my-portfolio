import type {
  Achievement,
  Fact,
  NavItem,
  ProcessStepData,
  Project,
  Role,
  SectionId,
  SkillGroup,
  SocialLink,
  Stat,
  TimelineEntry,
} from "../types";

export const sectionIds: readonly SectionId[] = ["about", "experience", "projects", "skills", "education", "contact"];

export const navItems: NavItem[] = [
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

export const hero = {
  label: "Software Engineer",
  name: "Anup Singh Lodh",
  rotatingStack: ["Node.js", "Puppeteer", "React", "MongoDB", "Express"],
  summary:
    "I build browser automation, database-backed applications, and practical web systems with JavaScript, Node.js, React, and MongoDB.",
  email: "asingh29240@gmail.com",
};

export const heroStats: Stat[] = [
  { value: 7.63, label: "CSE CGPA" },
  { value: 97.2, suffix: "%", label: "Class XII score" },
  { value: 3, label: "Featured projects" },
];

export const about = {
  title: "Focused on dependable software and clean user experiences.",
  paragraphs: [
    "I'm a Computer Science graduate working as a Graduate Engineer Trainee at SolarSquare, with hands-on experience in backend automation, desktop application development, and full-stack web technologies. Before that, during my internship at ixigo, I engineered complex automation workflows and internal business tools.",
    "My work combines JavaScript ecosystems, database-backed applications, and practical engineering habits built through internship work, academic projects, and competitive programming. I care about building scalable, high-impact software that teams can rely on.",
  ],
};

export const quickFacts: Fact[] = [
  { label: "Latest role", value: "Graduate Engineer Trainee, SolarSquare" },
  { label: "Education", value: "B.Tech CSE, MITS Gwalior" },
  { label: "Location", value: "Gurgaon, Haryana" },
];

const solarSquareRole: Role = {
  title: "Graduate Engineer Trainee",
  company: "SolarSquare",
  period: "Sep 2026 – Present",
  location: "Gurgaon, Haryana",
  bullets: [
    {
      title: "Nakama chat platform",
      body: "Working on Nakama, SolarSquare's customer chat platform: a ground-up rebuild of the conversation engine on Node.js, Express, PostgreSQL (Prisma), and Socket.IO, with an embeddable chat widget and an admin console.",
    },
    {
      title: "Google sign-in & access control",
      body: "Migrated authentication to Google-only sign-in with tenant-specific domain restrictions, and strengthened session management, access control, and first-party origin checks.",
    },
    {
      title: "Conversational dialogue flows",
      body: "Built dialogue-flow previews and a \"set property\" step that lets conversations store and reuse customer-specific data, plus handoff and resolve actions for support agents.",
    },
    {
      title: "Admin console & agent tools",
      body: "Built React and TypeScript screens for managing dialogue flows across bots, structured logging and theming in the admin console, and supervisor floor management in the agent UI.",
    },
  ],
};

const ixigoRole: Role = {
  title: "Software Developer Intern",
  company: "ixigo",
  period: "Dec 2025 – Jun 2026",
  location: "Gurgaon, Haryana",
  bullets: [
    {
      title: "Online Login Management System (OLMS)",
      body: "Built a desktop management app with Electron, JavaScript, HTML, and CSS to monitor booking agents, track real-time wallet balances, manage daily ticket limits, and audit transaction histories.",
    },
    {
      title: "Automated web check-in & boarding passes",
      body: "Built browser automation that performs web check-in across multiple airline platforms: it extracts PNR and passenger data, handles mandatory consent and policy steps automatically, and downloads the final PDF boarding passes.",
    },
    {
      title: "No-show refund automation (Air India Express)",
      body: "Engineered workflows that identify passengers who missed their departures and navigate airline portals to calculate and execute partial or tax refunds according to each airline's penalty policy.",
    },
    {
      title: "Core automation & collaboration",
      body: "Used Node.js and Puppeteer to drive backend browser tasks, and GitLab for version control, merge requests, and task tracking in an agile team.",
    },
  ],
};

export const experience = {
  title: "Where I've been building software.",
  roles: [solarSquareRole, ixigoRole],
};

export const projectsSection = {
  title: "Selected work from full-stack and frontend builds.",
};

export const projects: Project[] = [
  {
    id: "01",
    title: "E-Commerce Platform",
    period: "Mar 2025 – May 2025",
    summary: "Full-stack e-commerce platform with an interactive backend architecture and a smooth shopping experience.",
    tags: ["React", "Node.js", "Express", "MongoDB", "REST API"],
  },
  {
    id: "02",
    title: "Personal Portfolio Website",
    period: "Aug 2025 – Sep 2025",
    summary: "This site: a dark, animated portfolio with a WebGL hero, built to showcase projects, skills, and achievements.",
    tags: ["React", "TypeScript", "Tailwind CSS", "Vite", "React Bits"],
  },
  {
    id: "03",
    title: "Scientific Calculator",
    period: "Apr 2026",
    summary: "Web calculator supporting arithmetic and advanced mathematical operations through a responsive interface.",
    tags: ["HTML", "CSS", "JavaScript", "DOM"],
  },
];

export const skillsSection = {
  title: "Tools and concepts I use to ship software.",
  processTitle: "How I build",
};

export const skillGroups: SkillGroup[] = [
  { title: "Languages", items: ["C++", "Python", "JavaScript", "TypeScript", "HTML5", "CSS"] },
  { title: "Frameworks & Libraries", items: ["React", "Node.js", "Express", "Tailwind CSS", "Puppeteer", "Electron", "Vite"] },
  { title: "Developer Tools", items: ["Git", "GitLab", "GitHub", "Postman", "Docker", "GitLab CI"] },
  { title: "Databases", items: ["MongoDB", "Redis (basics)"] },
  {
    title: "Computer Science Concepts",
    items: [
      "Data Structures",
      "Problem Solving",
      "OOP",
      "Networking",
      "Low Level Design",
      "DBMS",
      "Operating Systems",
      "REST API design",
      "Authentication flows",
    ],
    wide: true,
  },
];

export const processSteps: ProcessStepData[] = [
  { title: "Model the data", body: "Define entities, user flows, and MongoDB structures before writing route logic." },
  { title: "Build service routes", body: "Connect Express endpoints, validation, auth-aware logic, and error states." },
  { title: "Automate repeat work", body: "Use Puppeteer for repeatable browser tasks where manual UI work slows teams down." },
  { title: "Polish the interface", body: "Shape React screens around clear states, fast scanning, and responsive behaviour." },
];

export const educationSection = {
  title: "Academic foundation with competitive learning.",
};

export const timeline: TimelineEntry[] = [
  { period: "Jun 2026", title: "NPTEL Discipline Star", detail: "IIT Roorkee" },
  {
    period: "Nov 2022 – Jun 2026",
    title: "Madhav Institute of Technology and Science",
    detail: "B.Tech, Computer Science & Engineering · CGPA 7.63",
  },
  { period: "Jan 2025 – Apr 2025", title: "Competitive Programming (NPTEL)", detail: "IIT Madras" },
  { period: "Aug 2024 – Nov 2024", title: "Cyber Security and Privacy (NPTEL)", detail: "IIT Madras" },
  {
    period: "2021",
    title: "Government Subhash Excellence Higher Secondary School",
    detail: "Class XII, MPBSE · 97.2%",
  },
];

export const achievements: Achievement[] = [
  {
    title: "Yuva Unstoppable Scholarship",
    body: "Awarded INR 50,000 per year from 2022 to 2026 for education and stationery expenses, based on academic performance.",
  },
  {
    title: "Captain, CSE Hawks",
    body: "Led the team in an intra-college cricket league, managing selection, strategy, teamwork, and decision-making.",
  },
  { title: "Languages", body: "English and Hindi." },
];

export const contact = {
  title: "Let's build something useful.",
  body: "I'm always happy to talk engineering and collaborate on projects around backend systems, web automation, and full-stack applications.",
};

export const socialLinks: SocialLink[] = [
  { label: "Email", cta: hero.email, href: `mailto:${hero.email}`, external: false },
  { label: "LinkedIn", cta: "LinkedIn", href: "https://www.linkedin.com/in/anupsinghlodh8345/", external: true },
  { label: "GitHub", cta: "GitHub", href: "https://github.com/AnupSinghLodh", external: true },
  { label: "X", cta: "X", href: "https://x.com/Anupsingh834920", external: true },
];
