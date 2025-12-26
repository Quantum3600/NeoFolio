import { Project, Skill, Experience } from './types';

export const PORTFOLIO_DATA = {
  name: "Trishit Majumdar",
  role: "Android Developer & Web Explorer",
  about: "I am Trishit Majumdar, an Android Developer passionate about Kotlin Multiplatform and Modern Web Development. I bridge the gap between mobile and web using technologies like Jetpack Compose, Kobweb, and React. Currently pursuing B.Tech in CS while building scalable apps.",
  location: "West Bengal, India",
  socials: {
    github: "github.com/Quantum3600",
    linkedin: "linkedin.com/in/trishitmajumdar",
    twitter: "twitter.com/trishit_m", // Placeholder for X/Twitter
    email: "trishitquantum360@gmail.com",
    instagram: "instagram.com/trishit.dev", // Placeholder
    facebook: "facebook.com/trishit.majumdar" // Placeholder
  },
  projects: [
    {
      id: "1",
      title: "KobGames Store",
      description: "A modern web game store interface built with Kobweb, showcasing the power of Kotlin on the web.",
      tech: ["Kobweb", "Kotlin", "Compose HTML"],
      link: "#",
      year: "2024"
    },
    {
      id: "2",
      title: "WakeApp",
      description: "A smart alarm Android application designed to ensure you wake up on time with intuitive UI patterns.",
      tech: ["Android", "Kotlin", "Jetpack Compose"],
      link: "#",
      year: "2023"
    },
    {
      id: "3",
      title: "Quotd",
      description: "A minimalistic quotes application delivering daily inspiration with a focus on Material Design.",
      tech: ["Android", "Kotlin", "MVVM"],
      link: "#",
      year: "2023"
    }
  ] as Project[],
  skills: [
    { category: "Android/KMP", items: ["Kotlin", "Jetpack Compose", "Kobweb", "Ktor Mobile"] },
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind", "HTML/CSS"] },
    { category: "Backend", items: ["Node.js", "Spring Boot", "Java", "Ktor Server", "MongoDB"] },
    { category: "Tools/AI", items: ["Git", "Docker", "Figma", "Gemini", "TensorFlow"] }
  ] as Skill[],
  education: [
    {
      id: "e1",
      role: "B.Tech in Computer Science",
      company: "Hooghly Engineering & Technology College",
      period: "Present",
      description: "Pursuing Bachelor of Technology in Computer Science & Engineering."
    },
    {
      id: "e2",
      role: "Higher Secondary",
      company: "Hooghly Collegiate School",
      period: "Completed",
      description: "Completed Higher Secondary education with focus on Science."
    },
    {
      id: "e3",
      role: "Secondary Education",
      company: "St. John's School",
      period: "Completed",
      description: "Foundation laid at middle school level."
    }
  ] as Experience[]
};

export const INITIAL_TERMINAL_LOGS = [
  "Welcome to TrishitOS v1.0.0",
  "Initializing Android Runtime...",
  "Loading Kotlin Multiplatform modules...",
  "System ready. Type 'help' for commands."
];