export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  link: string;
  year: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  RETRO = 'retro'
}
