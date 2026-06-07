import type { IInfo } from '@types';
import { technologies } from './icons';

export const info = {
  baseUrl: 'https://aqilzikry.github.io',
  name: 'Aqilzikry Arman',
  jobDescription: 'Turning ideas into things that work',
  about:
    'Enterprise software engineer specializing in .NET, SQL Server, and full-stack web development. I have built payroll platforms, banking dashboards, and government portals — with a track record of turning slow queries into sub-second responses and manual workflows into automated systems.',
  resumeUrl: '/resume.pdf',

  experience: [
    {
      name: 'RBC',
      location: 'Putrajaya, Malaysia',
      startDate: 'Nov 2025',
      endDate: 'Present',
      description: [
        'Develop and maintain a supervisory dashboard integrating absence management platforms and Workday to track tasks, training, and leave.',
        'Contribute to a capital management system for workforce deployment and cost tracking, plus an access control dashboard for user permissions across internal systems.',
        'Build internal enterprise web applications used by employees across the banking organization.',
      ],
    },

    {
      name: 'activpayroll Sdn. Bhd.',
      location: 'Kuala Lumpur, Malaysia',
      startDate: 'May 2024',
      endDate: 'Nov 2025',
      description: [
        'Developed RESTful APIs using .NET and Entity Framework to streamline payroll processing, cutting processing time from hours to minutes and eliminating calculation errors.',
        'Managed and optimized MSSQL databases, reducing query response times from 15+ minutes to sub-second, even during month-end processing peaks.',
        'Designed complex Stored Procedures for client-specific requirements, automating manual reporting and enabling real-time financial insights.',
        'Utilised Azure DevOps for CI/CD pipelines and Agile delivery, significantly decreasing production defects and meeting delivery deadlines.',
      ],
    },

    {
      name: 'FPT Software Malaysia',
      location: 'Kuala Lumpur, Malaysia',
      startDate: 'Aug 2023',
      endDate: 'May 2024',
      description: [
        'Developed REST APIs using ASP.NET Core with Entity Framework and Node.js with Sequelize, improving system interoperability across services.',
        'Maintained MSSQL and MongoDB databases, ensuring data integrity, security, and optimal performance under production load.',
        'Integrated API endpoints with Angular and React front-ends, delivering faster and more responsive user interfaces.',
        'Implemented Auth0 and custom JWT-based authentication, strengthening API security and reducing vulnerabilities.',
      ],
    },

    {
      name: 'WPH Digital Ltd',
      location: 'Cyberjaya Office and Singapore HQ',
      startDate: 'May 2022',
      endDate: 'Aug 2023',
      description: [
        'Developed and managed C# .NET and JSP websites for government agencies, ensuring robust functionality and user experience.',
        'Administered MSSQL databases, upholding data integrity, security, and performance for production workloads.',
        'Established and configured DevOps workflows for the internal team, streamlining releases and increasing delivery efficiency.',
        'Implemented security measures to safeguard sensitive data and ensure compliance with government regulations.',
      ],
    },

    {
      name: 'Java Programmer',
      location: 'Silverlake Axis',
      startDate: 'Dec 2021',
      endDate: 'Apr 2022',
      description: [
        'Contributed to the full software development life cycle of a banking solution for a public bank in Brunei.',
        'Built features with Java, Spring Boot, Hibernate, and JSP to deliver a robust, scalable core banking platform.',
        'Provided MSSQL support and troubleshooting through development and deployment phases.',
        "Collaborated with stakeholders to gather requirements and design architecture tailored to the bank's needs.",
      ],
    },

    {
      name: 'Software Tester Intern',
      location: 'MIMOS Berhad',
      startDate: 'Aug 2021',
      endDate: 'Nov 2021',
      description: [
        'Conducted System Integration Testing (SIT), System Testing (ST), and User Acceptance Testing (UAT) across MIMOS and vendor systems.',
        'Coordinated testing activities in JIRA to ensure seamless integration and functionality across multiple platforms.',
        'Collaborated with development teams and vendors to identify, document, and resolve issues found during testing phases.',
      ],
    },
  ],

  education: [
    {
      name: 'Universiti Tenaga Nasional',
      location: 'Putrajaya',
      startDate: '2019',
      endDate: '2021',
      description: [
        'Studied native and web development, minored in Software Testing and IT Security.',
        'Graduated with 3.96 CGPA.',
      ],
    },
    {
      name: 'Kolej Professional MARA Beranang',
      location: 'Beranang, Selangor',
      startDate: '2015',
      endDate: '2018',
      description: [
        'Studied system development and networking.',
        'Graduated Foundation with 3.98 CGPA.',
        'Graduated Higher National Diploma with 3.57 CGPA.',
      ],
    },
  ],

  socialMedia: {
    github: 'https://github.com/aqilzikry',
    email: 'aqilzikry97@gmail.com',
    linkedin: 'https://www.linkedin.com/in/aqilzikry-arman',
  },

  projects: [
    {
      id: 'myeasyprog',
      title: 'MyEasyProg',
      isFeatured: true,
      thumbnail: '/src/assets/images/myeasyprog.png',
      images: ['/src/assets/images/myeasyprog.png'],
      description:
        'A comprehensive programming learning platform designed to make coding education accessible and engaging. MyEasyProg provides reading materials, challenges, and real-time feedback to help students master programming concepts effectively.',
      // githubUrl: 'https://github.com/aqilzikry/ycu-webapp',
      // liveUrl: 'https://myeasyprog.uniten.edu.my/',
    },
    {
      id: 'smartalgebra',
      title: 'SmartAlgebra',
      isFeatured: true,
      thumbnail: '/src/assets/images/smartalgebra.png',
      images: [
        '/src/assets/images/smartalgebra/dashboard.png',
        '/src/assets/images/smartalgebra/edit-quiz.png',
        '/src/assets/images/smartalgebra/lesson-plan.png',
        '/src/assets/images/smartalgebra/manage-quiz.png',
        '/src/assets/images/smartalgebra/manage-user.png',
      ],
      description:
        'SmartAlgebra is a web-based platform that provides a comprehensive suite of tools for students and teachers to learn and teach algebra. It includes lesson plans, quizzes, and student performance tracking.',
      // githubUrl: 'https://github.com/aqilzikry/ycu-webapp',
      // liveUrl: 'https://myeasyprog.uniten.edu.my/',
    },
  ],

  technologies,
} satisfies IInfo;
