export interface ITechnology {
  name: string;
  icon: string;
}

export interface ISocialMedia {
  github: string;
  email: string;
  linkedin: string;
}

export interface IInfo {
  baseUrl: string;
  name: string;
  jobDescription: string;
  about: string;
  resumeUrl: string;
  experience: IExperience[];
  education: IExperience[];
  socialMedia: ISocialMedia;
  projects: IProject[];
  technologies: ITechnology[];
}

export interface IMetaHead {
  title: string;
  description: string;
  ogImageUrl: string;
}

export interface IHeroProps {
  name: string;
  jobDescription: string;
  about: string;
  resumeUrl?: string;
}

export interface IExperience {
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string[];
}
export interface IExperiences {
  title: string;
  subtitle: string;
  details: IExperience[];
  variant?: 'experience' | 'education';
  id?: string;
}

export interface IProject {
  id: string;
  title: string;
  isFeatured: boolean;
  thumbnail: string;
  images: string[];
  description: string;
  githubUrl?: string;
  liveUrl?: string;
}
export interface IProjects {
  projects: IProject[];
}

export interface IProjectDetails {
  projectDetail: IProject;
}
