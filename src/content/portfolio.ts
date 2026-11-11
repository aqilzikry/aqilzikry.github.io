export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  status?: string;
  keyResult: string;
  summary: string;
  highlights: string[];
  stack: string[];
};

export type Project = {
  name: string;
  type: string;
  summary: string;
  impact: string;
  stack: string[];
  image: string;
  replacementFile: string;
  links?: {
    label: string;
    href: string;
  }[];
};

export const profile = {
  name: "Aqilzikry Arman",
  role: "Software engineer",
  roleFocus: "AI-augmented systems design",
  location: "Cyberjaya, Selangor",
  email: "aqilzikry97@gmail.com",
  github: "https://github.com/aqilzikry",
  linkedin: "https://www.linkedin.com/in/aqilzikry-arman",
  resume: "/resume.pdf",
  // Optional: drop a square photo in /public (e.g. /profile.jpg) and set its path here.
  photo: "" as string,
  startedYear: 2021,
  currently: "Architecting internal platforms for supervisors, workforce planning, and access control at RBC, delivered with agentic AI workflows.",
  headline: "I design and ship reliable enterprise systems, orchestrating AI coding agents to move from idea to production faster, without trading off quality.",
  summary:
    "Software engineer focused on system design and architecture for enterprise platforms, using AI agents to accelerate delivery across .NET, SQL Server, and full-stack web development. Experience spans banking dashboards, payroll platforms, government portals, DevOps workflows, and machine-learning enabled products.",
  about: [
    "I'm a full-stack engineer whose focus has shifted from writing every line by hand to designing the system around it. My work spans the whole stack, from APIs and databases to the interfaces people use every day: payroll engines, banking dashboards, government portals, and internal tools.",
    "Today I treat AI coding agents as part of the team. I set the architecture, define the contracts and constraints, and delegate implementation, test generation, and refactoring to agents, then review the output with the same rigor I'd apply to any pull request. The result is more time on the decisions that matter (data models, service boundaries, security, and performance) and faster, higher-quality delivery.",
    "Before that shift, I spent years in the details: tuning SQL Server queries, building CI/CD pipelines on Azure and AWS, and shipping production code across five teams. That hands-on depth is what lets me steer agents well and catch what they miss. I'm working toward a senior, architecture-focused role.",
  ],
  domains: ["Banking", "Payroll", "Government", "Education"],
  signals: [
    "AI agent-driven development workflows",
    "Payroll processing cut from hours to minutes",
    "15+ minute SQL queries tuned to sub-second response",
    "Banking and government systems experience",
  ],
};

export const experience: Experience[] = [
  {
    company: "RBC",
    role: "Software Engineer",
    period: "Nov 2025 - Present",
    location: "Putrajaya, Malaysia",
    status: "Current",
    keyResult: "Supervisory dashboard unifying absence platforms and Workday, delivered with an AI-augmented workflow",
    summary:
      "Designing and delivering internal enterprise web applications for employees across the banking organization, pairing hands-on architecture with agentic AI development.",
    highlights: [
      "Architect and maintain a supervisory dashboard integrating absence management platforms and Workday to track tasks, training, and leave.",
      "Contribute to the design of a capital management system for workforce deployment and cost tracking.",
      "Build an access control dashboard for user permissions across internal systems.",
      "Lead with system design, defining service boundaries, data models, and integration contracts, while delegating implementation, test generation, and refactoring to AI coding agents.",
      "Use AI agents to raise delivery velocity and code quality through broader test coverage, faster reviews, and quicker turnaround on features and fixes, with every change reviewed against architectural and security standards.",
    ],
    stack: [".NET", "SQL Server", "System design", "AI coding agents", "Enterprise dashboards", "Access control"],
  },
  {
    company: "activpayroll Sdn. Bhd.",
    role: "Software Engineer",
    period: "May 2024 - Nov 2025",
    keyResult: "Month-end SQL queries cut from 15+ minutes to under a second",
    location: "Kuala Lumpur, Malaysia",
    summary:
      "Built payroll APIs, optimized database-heavy workflows, and improved delivery through Azure DevOps.",
    highlights: [
      "Developed RESTful APIs using .NET and Entity Framework, cutting payroll processing from hours to minutes.",
      "Optimized MSSQL workloads from 15+ minute query responses to sub-second results during month-end peaks.",
      "Designed stored procedures for client-specific reporting and real-time financial insights.",
      "Used Azure DevOps CI/CD and Agile delivery to reduce production defects and meet delivery deadlines.",
    ],
    stack: ["ASP.NET", "C#", "Angular", "TypeScript", "MSSQL", "Docker", "Azure DevOps"],
  },
  {
    company: "FPT Software Malaysia",
    role: "Software Developer",
    period: "Aug 2023 - May 2024",
    keyResult: "Auth0 and custom JWT authentication across production APIs",
    location: "Kuala Lumpur, Malaysia",
    summary:
      "Delivered APIs, database integrations, and secure front-end connections for production systems.",
    highlights: [
      "Developed REST APIs with ASP.NET Core, Entity Framework, Node.js, and Sequelize.",
      "Maintained MSSQL and MongoDB databases for data integrity, security, and production performance.",
      "Integrated API endpoints with Angular and React front ends for more responsive user interfaces.",
      "Implemented Auth0 and custom JWT authentication to strengthen API security.",
    ],
    stack: ["ASP.NET Core", "Node.js", "React", "Angular", "MSSQL", "MongoDB", "Auth0"],
  },
  {
    company: "WPH Digital Ltd",
    role: "Full Stack Developer",
    period: "May 2022 - Aug 2023",
    keyResult: "Set up the DevOps workflow for the internal team's government projects",
    location: "Cyberjaya / Singapore HQ",
    summary:
      "Developed and maintained production systems for government agencies with security and delivery discipline.",
    highlights: [
      "Built and managed C# .NET and JSP websites for government agency workflows.",
      "Administered MSSQL databases with a focus on integrity, security, and performance.",
      "Configured DevOps workflows for the internal team to streamline releases.",
      "Implemented security measures for sensitive data and compliance requirements.",
    ],
    stack: ["C#", ".NET", "Java", "JSP", "Vue", "TypeScript", "MSSQL", "Sass"],
  },
  {
    company: "Silverlake Axis",
    role: "Java Programmer",
    period: "Dec 2021 - Apr 2022",
    keyResult: "Built features for a public-bank platform deployed in Brunei",
    location: "Malaysia",
    summary:
      "Contributed to the full software development life cycle of a public-bank solution in Brunei.",
    highlights: [
      "Built features with Java, Spring Boot, Hibernate, and JSP for a scalable banking platform.",
      "Provided MSSQL support and troubleshooting through development and deployment.",
      "Collaborated with stakeholders on requirements and banking-system architecture.",
    ],
    stack: ["Java", "Spring Boot", "Hibernate", "JSP", "MSSQL", "Jenkins"],
  },
];

export const projects: Project[] = [
  {
    name: "MyEasyProg",
    type: "Education platform",
    summary:
      "AI-powered Python tutoring system for students and teachers in Malaysian secondary public schools.",
    impact:
      "Built as a grant-backed learning platform with custom content flows, self-managed hosting, and machine-learning integration.",
    stack: ["React", "Mantine UI", "Python", "Flask", "Laravel", "InertiaJS", "GitHub Actions"],
    image: "https://placehold.co/960x640/0f172a/22c55e?text=MyEasyProg",
    replacementFile: "myeasyprog-dashboard.jpg",
  },
  {
    name: "SmartAlgebra",
    type: "Learning product",
    summary:
      "Interactive learning experience designed to make algebra practice more approachable and useful.",
    impact:
      "Highlights the product side of development: clear flows, helpful feedback, and purposeful interface design.",
    stack: ["Web app", "Learning UX", "Frontend engineering"],
    image: "https://placehold.co/960x640/111827/38bdf8?text=SmartAlgebra",
    replacementFile: "smartalgebra-preview.jpg",
  },
  {
    name: "TNB Switch Gear Monitoring",
    type: "Monitoring dashboard",
    summary:
      "Preventative and corrective maintenance dashboard for TNB switch gears using machine-learning assisted insights.",
    impact:
      "Transforms maintenance planning into a clearer operational view with dashboard-first reporting.",
    stack: ["Python", "FastAPI", "React", "Tremor UI", "GitLab", "Docker"],
    image: "https://placehold.co/960x640/111827/a3e635?text=Monitoring+Dashboard",
    replacementFile: "tnb-monitoring-dashboard.jpg",
  },
];

export const techGroups = [
  {
    label: "Backend",
    items: [".NET", "C#", "Node.js", "Fastify", "Java Spring Boot", "Python Flask", "FastAPI", "REST API"],
  },
  {
    label: "Frontend",
    items: ["React", "Angular", "Next.js", "Vue", "TypeScript", "Tailwind CSS", "Astro"],
  },
  {
    label: "Database",
    items: ["SQL Server", "MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    label: "DevOps",
    items: ["Azure DevOps", "GitHub Actions", "GitLab CI", "Docker", "Linux", "AWS", "VPS hosting"],
  },
];

export const tools = [
  "Color converter",
  "JSON/XML validator",
  "JWT decoder",
  "Base64 encoder",
  "URL encoder",
  "Timezone converter",
  "Budget calculator",
  "Deadline countdown",
];
