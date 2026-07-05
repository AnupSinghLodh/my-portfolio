import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";

type Project = {
  id: string;
  title: string;
  duration: string;
  summary: string;
  tags: string[];
  preview: "ecommerce" | "portfolio" | "calculator";
};

type LabCard = {
  title: string;
  body: string;
};

type Credential = {
  title: string;
  meta: string;
  detail: string;
};

const navItems = ["Experience", "Tech", "Systems", "Projects", "Skills", "Contact"];

const stack = [
  "JavaScript",
  "TypeScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "Puppeteer",
  "Docker",
  "REST APIs",
  "GitLab CI",
  "Vite",
  "Postman",
];

const quickFacts = [
  ["Past role", "Software Engineering Intern"],
  ["Core focus", "Full stack Development"],
  ["Education", "B.Tech CSE, MITS"],
  ["Location", "Gwalior, MP"],
];

const skillGroups = [
  ["Languages", "C++, Python, JavaScript, TypeScript, HTML5, CSS"],
  ["Frameworks & Libraries", "React.js, Node.js, Express.js, Tailwind CSS, Puppeteer, Vite"],
  ["Developer Tools", "Git, GitLab, GitHub, Postman, Docker, GitLab CI"],
  ["Databases", "MongoDB, Redis basics"],
  [
    "Computer Science Concepts",
    "Data Structures, Problem Solving, OOPS, Networking, Low Level Design, DBMS, Operating System, REST API design, authentication flows",
  ],
];

const labCards: LabCard[] = [
  {
    title: "API Architecture",
    body: "Express services, REST routing, auth-aware flows, and database-backed feature logic.",
  },
  {
    title: "Browser Automation",
    body: "Puppeteer scripts for browser-based task execution, workflow automation, and repeatable actions.",
  },
  {
    title: "Frontend Systems",
    body: "React interfaces, Tailwind styling, reusable components, responsive layouts, and clean state flows.",
  },
  {
    title: "Dev Workflow",
    body: "GitLab merge requests, GitHub repos, Postman testing, Docker basics, and CI/CD awareness.",
  },
];

const systems = [
  ["Model the data", "Define entities, user flows, and MongoDB structures before writing route logic."],
  ["Build service routes", "Connect Express endpoints, validation, auth-aware logic, and error states."],
  ["Automate repeat work", "Use Puppeteer for repeatable browser tasks where manual UI work slows teams down."],
  ["Polish the interface", "Shape React screens around clear states, fast scanning, and responsive behavior."],
];

const trace = [
  ["request", "Validate payload and user intent"],
  ["service", "Execute business logic through clean route handlers"],
  ["database", "Persist data with query-aware MongoDB patterns"],
  ["automation", "Run Puppeteer flow when browser execution is required"],
  ["response", "Return predictable state for the frontend"],
];

const projects: Project[] = [
  {
    id: "01",
    title: "E-Commerce Platform",
    duration: "Mar 2025 - May 2025",
    summary: "Full-stack e-commerce platform with interactive backend architecture and a smooth shopping experience.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "REST API"],
    preview: "ecommerce",
  },
  {
    id: "02",
    title: "Personal Portfolio Website",
    duration: "Aug 2025 - Sep 2025",
    summary: "Modern portfolio experience designed to showcase projects, skills, achievements, and web expertise.",
    tags: ["React.js", "Tailwind CSS", "Node.js", "Vite"],
    preview: "portfolio",
  },
  {
    id: "03",
    title: "Scientific Calculator",
    duration: "April 2026",
    summary: "Web calculator supporting arithmetic and advanced mathematical operations through a responsive interface.",
    tags: ["HTML", "CSS", "JavaScript", "DOM"],
    preview: "calculator",
  },
];

const credentials: Credential[] = [
  {
    meta: "2021",
    title: "Government Subhash Excellence Higher Secondary School",
    detail: "Class XII, MPBSE | Score: 97.2%",
  },
  {
    meta: "Nov 2022 - Jun 2026",
    title: "Madhav Institute of Technology and Science",
    detail: "B.Tech, Computer Science & Engineering | CGPA: 7.63",
  },
  {
    meta: "Aug 2024 - Nov 2024",
    title: "Cyber Security and Privacy (NPTEL)",
    detail: "IIT Madras",
  },
  {
    meta: "Jan 2025 - Apr 2025",
    title: "Competitive Programming (NPTEL)",
    detail: "IIT Madras",
  },
  {
    meta: "Jun 2026",
    title: "NPTEL Discipline Star",
    detail: "IIT Roorkee",
  },
];

const extras = [
  [
    "Captain, CSE Hawks",
    "Led the team in an intra-college cricket league, managing selection, strategy, teamwork, and decision-making.",
  ],
  [
    "Yuva Unstoppable Scholarship",
    "Awarded INR 50,000 per year from 2022 to 2026 for education and stationery expenses based on academic performance.",
  ],
  ["Languages", "English and Hindi"],
];

const commandLines = [
  ["stack", "Node.js + React + MongoDB"],
  ["focus", "backend workflows + automation"],
  ["ship", "clean UI + reliable execution"],
];

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const activeYear = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const onScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsScrolled(window.scrollY > 12);
      setScrollProgress(maxScroll > 0 ? window.scrollY / maxScroll : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      ".section, .systems-section, .tech-lab, .section-transition, .quick-facts div, .stack-strip span, .project-card, .skill-group, .lab-card, .credential-list article, .extras-grid article"
    );

    targets.forEach((target) => target.setAttribute("data-animate", "true"));

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <header className={`site-header ${isScrolled ? "is-scrolled" : ""} ${isMenuOpen ? "nav-open" : ""}`}>
        <a className="brand" href="#top" aria-label="Anup Singh Lodh home">
          ASL
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setIsMenuOpen(false)}>
              {item}
            </a>
          ))}
        </nav>
        <button
          className="nav-toggle"
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          <span />
          <span />
        </button>
      </header>

      <main id="top">
        <Hero />
        <StackStrip />
        <QuickFacts />
        <SectionTransition label="profile" tone="warm" />
        <About />
        <SectionTransition label="system map" tone="cool" />
        <Systems />
        <Experience />
        <SectionTransition label="toolchain" tone="dark" />
        <Skills />
        <TechLab />
        <SectionTransition label="selected builds" tone="warm" />
        <Projects />
        <Credentials />
        <BeyondCode />
        <SectionTransition label="contact" tone="cool" />
        <Contact />
      </main>

      <footer className="site-footer">
        <p>© {activeYear} Anup Singh Lodh</p>
        <div>
          <a href="mailto:asingh29240@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/anupsinghlodh8345/" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href="https://github.com/AnupSinghLodh" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://x.com/Anupsingh834920" target="_blank" rel="noreferrer">
            X
          </a>
        </div>
      </footer>
    </>
  );
}

function Hero() {
  const [typedCommand, setTypedCommand] = useState("");
  const [commandIndex, setCommandIndex] = useState(0);
  const [heroTilt, setHeroTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const [key, value] = commandLines[commandIndex];
    const command = `${key} = ${value}`;
    let characterIndex = 0;

    setTypedCommand("");
    const typeTimer = window.setInterval(() => {
      characterIndex += 1;
      setTypedCommand(command.slice(0, characterIndex));

      if (characterIndex >= command.length) {
        window.clearInterval(typeTimer);
        window.setTimeout(() => setCommandIndex((index) => (index + 1) % commandLines.length), 1500);
      }
    }, 42);

    return () => window.clearInterval(typeTimer);
  }, [commandIndex]);

  const heroStyle = {
    "--tilt-x": `${heroTilt.x}deg`,
    "--tilt-y": `${heroTilt.y}deg`,
    "--parallax-x": `${heroTilt.y * -2.4}px`,
    "--parallax-y": `${heroTilt.x * 2.4}px`,
  } as CSSProperties;

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    setHeroTilt({ x: y * -7, y: x * 7 });
  };

  return (
    <section
      className="hero"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHeroTilt({ x: 0, y: 0 })}
    >
      <div className="hero-media" aria-hidden="true">
        <img src="/assets/hero-workspace.png" alt="" />
      </div>
      <div className="hero-overlay" />
      <AutomationCanvas />
      <div className="hero-shell" style={heroStyle}>
        <div className="hero-content">
          <p className="eyebrow status-line">
            <span /> Full Stack Developer
          </p>
          <AnimatedName text="Anup Singh Lodh" />
          <p className="hero-copy">
            Full stack developer building browser automation, database-backed applications, and practical web
            systems with JavaScript, Node.js, Puppeteer, React, and MongoDB.
          </p>
          <div className="hero-actions" aria-label="Primary actions">
            <MagneticLink className="button primary" href="mailto:asingh29240@gmail.com">
              Email me
            </MagneticLink>
            <MagneticLink className="button secondary" href="#projects">
              View projects
            </MagneticLink>
          </div>
          <div className="hero-console" aria-label="Developer highlights">
            <div className="console-bar">
              <span />
              <span />
              <span />
            </div>
            <div className="console-lines">
              {commandLines.map(([key, value], index) => (
                <p key={key} className={index === commandIndex ? "is-active-command" : ""}>
                  <strong>{key}</strong> = {value}
                </p>
              ))}
              <p className="type-line" aria-label="Typing command">
                <strong>run</strong> {typedCommand}
                <span aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>

        <aside className="hero-dashboard" aria-label="Portfolio engineering dashboard">
          <div className="dashboard-card live-card">
            <div className="card-label">Current Build</div>
            <h2>Automation-ready backend workflows</h2>
            <p>Designing small, reliable services that connect UI, data, and browser execution.</p>
            <div className="signal-row" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className="dashboard-card code-card" aria-label="Example architecture snippet">
            <pre>
              <code>{`const workflow = {
  api: "Express",
  browser: "Puppeteer",
  data: "MongoDB",
  deploy: "GitLab CI"
};`}</code>
            </pre>
          </div>
          <div className="dashboard-metrics">
            <Metric value="4+" label="Core project areas" target={4} suffix="+" />
            <Metric value="7.63" label="CSE CGPA" target={7.63} decimals={2} />
            <Metric value="97.2%" label="Class XII score" target={97.2} suffix="%" decimals={1} />
          </div>
        </aside>
      </div>
    </section>
  );
}

function AutomationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = canvas.getContext("2d");
    if (!context) return;

    const nodes = [
      { x: 0.12, y: 0.2 },
      { x: 0.25, y: 0.62 },
      { x: 0.42, y: 0.34 },
      { x: 0.58, y: 0.66 },
      { x: 0.74, y: 0.28 },
      { x: 0.9, y: 0.58 },
    ];
    const edges = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [1, 3],
      [2, 4],
    ];

    let width = 0;
    let height = 0;
    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * scale));
      canvas.height = Math.max(1, Math.floor(height * scale));
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const drawPacket = (from: { x: number; y: number }, to: { x: number; y: number }, progress: number, color: string) => {
      const x = from.x + (to.x - from.x) * progress;
      const y = from.y + (to.y - from.y) * progress;
      context.fillStyle = color;
      context.shadowBlur = 16;
      context.shadowColor = color;
      context.beginPath();
      context.arc(x, y, 4.5, 0, Math.PI * 2);
      context.fill();
      context.shadowBlur = 0;
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      frame += reduceMotion ? 0 : 1;

      const points = nodes.map((node, index) => ({
        x: node.x * width + Math.sin(frame * 0.012 + index) * 8,
        y: node.y * height + Math.cos(frame * 0.01 + index * 1.4) * 7,
      }));

      context.lineWidth = 1;
      edges.forEach(([start, end], index) => {
        const from = points[start];
        const to = points[end];
        const gradient = context.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, "rgba(201, 232, 93, 0.08)");
        gradient.addColorStop(0.5, "rgba(70, 199, 181, 0.34)");
        gradient.addColorStop(1, "rgba(239, 102, 75, 0.12)");
        context.strokeStyle = gradient;
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.stroke();

        if (!reduceMotion) {
          const progress = (frame * 0.008 + index * 0.17) % 1;
          drawPacket(from, to, progress, index % 2 === 0 ? "#c9e85d" : "#46c7b5");
        }
      });

      points.forEach((point, index) => {
        context.fillStyle = index % 2 === 0 ? "rgba(201, 232, 93, 0.88)" : "rgba(70, 199, 181, 0.88)";
        context.strokeStyle = "rgba(255, 250, 240, 0.55)";
        context.lineWidth = 1;
        context.beginPath();
        context.arc(point.x, point.y, 7, 0, Math.PI * 2);
        context.fill();
        context.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas className="automation-canvas" ref={canvasRef} aria-hidden="true" />;
}

function AnimatedName({ text }: { text: string }) {
  return (
    <h1 id="hero-title" className="animated-title" aria-label={text}>
      {text.split("").map((letter, index) => (
        <span
          className="char"
          key={`${letter}-${index}`}
          style={{ "--char-index": index } as CSSProperties}
          aria-hidden="true"
        >
          {letter === " " ? "\u00a0" : letter}
        </span>
      ))}
    </h1>
  );
}

function MagneticLink({
  className,
  href,
  children,
  target,
  rel,
}: {
  className: string;
  href: string;
  children: ReactNode;
  target?: string;
  rel?: string;
}) {
  const linkRef = useRef<HTMLAnchorElement | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    linkRef.current?.style.setProperty("--mx", `${x * 0.18}px`);
    linkRef.current?.style.setProperty("--my", `${y * 0.22}px`);
  };

  const reset = () => {
    linkRef.current?.style.setProperty("--mx", "0px");
    linkRef.current?.style.setProperty("--my", "0px");
  };

  return (
    <a
      className={`${className} magnetic-button`}
      href={href}
      ref={linkRef}
      target={target}
      rel={rel}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      {children}
    </a>
  );
}

function Metric({
  value,
  label,
  target,
  suffix = "",
  decimals = 0,
}: {
  value: string;
  label: string;
  target: number;
  suffix?: string;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const metricRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = metricRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const startedAt = performance.now();
        const duration = 1200;

        const tick = (now: number) => {
          const progress = Math.min((now - startedAt) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue(`${(target * eased).toFixed(decimals)}${suffix}`);

          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [decimals, suffix, target, value]);

  return (
    <div ref={metricRef}>
      <strong>{displayValue}</strong>
      <span>{label}</span>
    </div>
  );
}

function StackStrip() {
  const tickerStack = [...stack, ...stack];

  return (
    <section className="stack-strip" aria-label="Technology stack">
      <div className="stack-track">
        {tickerStack.map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
    </section>
  );
}

function QuickFacts() {
  return (
    <section className="quick-facts" aria-label="Profile highlights">
      {quickFacts.map(([label, value]) => (
        <div key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </section>
  );
}

function SectionTransition({ label, tone }: { label: string; tone: "warm" | "cool" | "dark" }) {
  return (
    <div className={`section-transition ${tone}`} aria-hidden="true">
      <span className="transition-label">{label}</span>
      <div className="transition-line">
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}

function About() {
  return (
    <section className="section intro-section" aria-labelledby="about-title">
      <SectionHeading eyebrow="About" title="Focused on dependable software and clean user experiences." id="about-title" />
      <div className="intro-copy">
        <p>
          Results-driven Computer Science graduate with hands-on experience in backend automation, 
          desktop application development, and full-stack web technologies. Proven track record of 
          engineering complex workflows and business tools during internship at ixigo. Eager to 
          leverage proficiency in JavaScript, Node.js and React.js to build scalable, high-impact
          software solutions in a full-time engineering role.
        </p>
        <p>
          My work combines JavaScript ecosystems, database-backed applications, and practical engineering habits built
          through internship work, academic projects, and competitive programming practice.
        </p>
      </div>
    </section>
  );
}

function Systems() {
  const [activeTrace, setActiveTrace] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveTrace((index) => (index + 1) % trace.length), 1450);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="systems-section" id="systems" aria-labelledby="systems-title">
      <SectionHeading eyebrow="Systems" title="How I think through backend products." id="systems-title" />
      <div className="systems-board" aria-label="Backend product workflow">
        {systems.map(([title, body], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
      <div className="systems-terminal" aria-label="Backend workflow trace">
        <div className="terminal-heading">
          <span>workflow.trace</span>
          <strong>healthy</strong>
        </div>
        <ol>
          {trace.map(([label, body], index) => (
            <li key={label} className={index === activeTrace ? "is-active" : ""}>
              <span>{label}</span>
              {body}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Experience() {
  return (
    <section className="section timeline-section" id="experience" aria-labelledby="experience-title">
      <SectionHeading eyebrow="Experience" title="Building automation and backend workflows at ixigo." id="experience-title" />
      <article className="timeline-item">
        <div className="timeline-meta">
          <span>Dec 2025 - Jun 2026</span>
          <span>Gurugram, India</span>
        </div>
        <div className="timeline-body">
          <h3>Software Developer Intern</h3>
          <p className="company">Ixigo</p>
          <ul>
            <li>
              Online Login Management System (OLMS): Developed a desktop management application using Electron, 
              JavaScript, HTML, and CSS to monitor booking agents, track real-time wallet balances, manage daily 
              ticket limits, and audit comprehensive transaction histories.
            </li>
            <li>
              Automated Web Check-in & Boarding Pass Generation: Built robust browser automation scripts to 
              perform web check-ins across multiple airline platforms. The automation handles PNR and passenger
              data extraction, bypasses mandatory policy agreements, and automatically downloads the final PDF 
              boarding passes.
            </li>
            <li>
              Core Automation & Collaboration: Utilized Node.js and Puppeteer to drive backend browser tasks,
              while managing version control, task tracking, and merge requests via GitLab in an agile team environment.
            </li>
            <li>
              No-Show Refund Automation (Air India Express): Engineered automated workflows to process flight no-shows.
             The scripts automatically identify passengers who missed their departures and navigate airline portals to 
              calculate and execute partial or tax refunds according to specific airline penalty policies.
            </li>
            <li>
              Used GitLab for version control, merge requests, code collaboration, and tracking development tasks in a
              team environment.
            </li>
          </ul>
        </div>
      </article>
    </section>
  );
}

function Skills() {
  return (
    <section className="section" id="skills" aria-labelledby="skills-title">
      <SectionHeading eyebrow="Technical Skills" title="Tools and concepts I use to ship software." id="skills-title" />
      <div className="skill-grid">
        {skillGroups.map(([title, body]) => (
          <div key={title} className={`skill-group ${title.includes("Concepts") ? "wide" : ""}`}>
            <h3>{title}</h3>
            <p>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TechLab() {
  return (
    <section className="tech-lab" id="tech" aria-labelledby="tech-title">
      <SectionHeading eyebrow="Tech Lab" title="Backend-first thinking with automation built in." id="tech-title" />
      <div className="lab-grid">
        {labCards.map((card, index) => (
          <article className="lab-card" key={card.title}>
            <span className="lab-index">{String(index + 1).padStart(2, "0")}</span>
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects() {
  return (
    <section className="section projects-section" id="projects" aria-labelledby="projects-title">
      <SectionHeading eyebrow="Projects" title="Selected work from full-stack and frontend builds." id="projects-title" />
      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cardRef.current?.style.setProperty("--card-ry", `${(x - 0.5) * 12}deg`);
    cardRef.current?.style.setProperty("--card-rx", `${(0.5 - y) * 10}deg`);
    cardRef.current?.style.setProperty("--glare-x", `${x * 100}%`);
    cardRef.current?.style.setProperty("--glare-y", `${y * 100}%`);
  };

  const reset = () => {
    cardRef.current?.style.setProperty("--card-rx", "0deg");
    cardRef.current?.style.setProperty("--card-ry", "0deg");
    cardRef.current?.style.setProperty("--glare-x", "50%");
    cardRef.current?.style.setProperty("--glare-y", "0%");
  };

  return (
    <article className="project-card" ref={cardRef} onPointerMove={handlePointerMove} onPointerLeave={reset}>
      <div className={`project-preview ${project.preview}-preview`} aria-hidden="true">
        <ProjectPreview type={project.preview} />
      </div>
      <div className="project-top">
        <span className="project-number">{project.id}</span>
        <h3>{project.title}</h3>
        <span>{project.duration}</span>
      </div>
      <p>{project.summary}</p>
      <ul className="tag-list" aria-label={`${project.title} technologies`}>
        {project.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}

function ProjectPreview({ type }: { type: Project["preview"] }) {
  if (type === "ecommerce") {
    return (
      <div className="mini-ui shop-ui">
        <div className="mini-toolbar">
          <span />
          <span />
          <span />
        </div>
        <div className="shop-hero">
          <div>
            <strong>CartFlow</strong>
            <small>order pipeline</small>
          </div>
          <em>live</em>
        </div>
        <div className="shop-grid">
          <span />
          <span />
          <span />
        </div>
        <div className="shop-meter">
          <span />
        </div>
      </div>
    );
  }

  if (type === "portfolio") {
    return (
      <div className="mini-ui portfolio-ui">
        <div className="mini-toolbar">
          <span />
          <span />
          <span />
        </div>
        <div className="portfolio-window">
          <div className="portfolio-copy">
            <strong>ASL.dev</strong>
            <span />
            <span />
          </div>
          <div className="portfolio-orbit">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="portfolio-tabs">
          <span />
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className="mini-ui calculator-ui">
      <div className="calc-display">
        <small>sin(45) + 8²</small>
        <strong>64.707</strong>
      </div>
      <div className="calc-keys">
        {["AC", "ƒ", "÷", "×", "7", "8", "9", "-", "4", "5", "6", "+", "1", "2", "3", "="].map((key) => (
          <span className={key === "=" ? "is-equals" : ""} key={key}>
            {key}
          </span>
        ))}
      </div>
    </div>
  );
}

function Credentials() {
  return (
    <section className="section credentials-section" aria-labelledby="credentials-title">
      <SectionHeading
        eyebrow="Education & Credentials"
        title="Academic foundation with competitive learning."
        id="credentials-title"
      />
      <div className="credential-list">
        {credentials.map((item) => (
          <article key={`${item.title}-${item.meta}`}>
            <span>{item.meta}</span>
            <h3>{item.title}</h3>
            <p>{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function BeyondCode() {
  return (
    <section className="section extras-section" aria-labelledby="leadership-title">
      <SectionHeading eyebrow="Beyond Code" title="Leadership, scholarship, and language strengths." id="leadership-title" />
      <div className="extras-grid">
        {extras.map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact-section" id="contact" aria-labelledby="contact-title">
      <div>
        <p className="eyebrow">Contact</p>
        <h2 id="contact-title">Let’s build something useful.</h2>
        <p>
          I am open to software engineering opportunities, internship conversations, and project collaboration around
          backend systems, web automation, and full-stack applications.
        </p>
      </div>
      <div className="contact-actions">
        <MagneticLink className="button primary" href="mailto:asingh29240@gmail.com">
          asingh29240@gmail.com
        </MagneticLink>
        <MagneticLink className="button secondary" href="https://www.linkedin.com/in/anupsinghlodh8345/" target="_blank" rel="noreferrer">
          LinkedIn profile
        </MagneticLink>
        <MagneticLink className="button secondary" href="https://github.com/AnupSinghLodh" target="_blank" rel="noreferrer">
          GitHub profile
        </MagneticLink>
        <MagneticLink className="button secondary" href="https://x.com/Anupsingh834920" target="_blank" rel="noreferrer">
          X profile
        </MagneticLink>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
    </div>
  );
}

export default App;
