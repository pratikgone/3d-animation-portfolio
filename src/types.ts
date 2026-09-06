export type PlanetId = 'all' | 'sun' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune';

export interface GalaxySettings {
  focusedBody: PlanetId;
  orbitSpeed: number;
  showOrbits: boolean;
  showAsteroids: boolean;
  nebulaGlow: boolean;
  warpSpeed: boolean;
  starFieldSpeed: number;
  sunGlowColor: string;
}

export interface PlanetData {
  id: PlanetId;
  name: string;
  subtitle: string;
  distance: number;
  radius: number;
  color: string;
  secondaryColor?: string;
  roughness: number;
  metalness: number;
  hasRings?: boolean;
  ringInner?: number;
  ringOuter?: number;
  ringColor?: string;
  orbitPeriod: number;
  rotationSpeed: number;
  hasMoon?: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  category: 'WebGL & Three.js' | 'Cosmic 3D & Shaders' | 'Full-Stack Next.js' | 'Interactive Creative';
  description: string;
  longDescription: string;
  tech: string[];
  features: string[];
  metrics: string;
  accentColor: string;
  planetTarget: PlanetId;
  liveUrl?: string;
  githubUrl?: string;
}

export interface SkillCategory {
  title: string;
  iconName: string;
  description: string;
  skills: {
    name: string;
    level: number;
    highlight?: string;
  }[];
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
  location: string;
  description: string[];
  technologies: string[];
}

