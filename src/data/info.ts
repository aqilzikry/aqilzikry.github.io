import myeasyprogthumbnail from '../assets/images/myeasyprog.png';

export const info = {
  baseUrl: 'https://astro-portfolio-uzair.vercel.app',
  name: 'Aqilzikry Arman',
  jobDescription: 'Web Developer',
  about: `
  An experienced software engineer with a focus on high-quality user-centric products. Skilled in mobile, software, and native development, continuously learning new tech. Strong team player and communicator. Eager to contribute to your innovative products.
  `,

  experience: [
    {
      name: 'FPT Software',
      location: 'Kuala Lumpur, Malaysia',
      startDate: 'Aug 2023',
      endDate: 'Present',
      description: [
        'Develop e-commerce projects using ReactJS, Redux, ExpressJS and NodeJS.',
        'Develop e-commerce projects using Angular and .NET Core API.',
      ],
    },

    {
      name: 'WPH Digital Pte Ltd',
      location: 'Cyberjaya Office and Singapore HQ',
      startDate: 'May 2022',
      endDate: 'Aug 2023',
      description: [
        'Responsible for developing and managing Sitecore/ASP.NET and JSP websites of clients mainly consisting of Singapore government agencies.',
        'Developing a DevOps workflow for the internal team.',
      ],
    },

    {
      name: 'Silverlake Axis',
      location: 'Petaling Jaya, Malaysia',
      startDate: 'Dec 2021',
      endDate: 'May 2022',
      description: [
        'Participated in the complete software development life cycle of a banking solution to a public bank in Brunei.',
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
      title: 'MyEasyProg',
      isFeatured: true,
      thumbnail: 'assets/images/profile.png',
      // githubUrl: 'https://github.com/aqilzikry/ycu-webapp',
      liveUrl: 'https://myeasyprog.my/',
    },
  ],
};
