export type Experience = {
  company: string;
  role: string;
  period: string;
  location: string;
  status?: string;
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
  role: "Enterprise software engineer",
  location: "Cyberjaya, Selangor",
  email: "aqilzikry97@gmail.com",
  github: "https://github.com/aqilzikry",
  linkedin: "https://www.linkedin.com/in/aqilzikry-arman",
  resume: "/resume.pdf",
  headline: "I build reliable internal systems, APIs, and dashboards that turn messy operations into clean software.",
  summary:
    "Mid-level software engineer specializing in .NET, SQL Server, and full-stack web development, with experience across payroll platforms, banking dashboards, government portals, DevOps workflows, testing, and machine-learning enabled products.",
  signals: [
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
    summary:
      "Building internal enterprise web applications for employees across the banking organization.",
    highlights: [
      "Develop and maintain a supervisory dashboard integrating absence management platforms and Workday to track tasks, training, and leave.",
      "Contribute to a capital management system for workforce deployment and cost tracking.",
      "Build an access control dashboard for user permissions across internal systems.",
    ],
    stack: [".NET", "SQL Server", "Enterprise dashboards", "Access control"],
  },
  {
    company: "activpayroll Sdn. Bhd.",
    role: "Software Engineer",
    period: "May 2024 - Nov 2025",
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
