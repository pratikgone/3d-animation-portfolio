import React, { useState } from 'react';
import { Project, PlanetId } from '../types';
import { PROJECTS } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { ProjectModal } from './ProjectModal';
import {
  Layers,
  Maximize2,
  Orbit,
  PlayCircle,
  Compass,
} from 'lucide-react';

interface ProjectsSectionProps {
  onFocusPlanet: (target: PlanetId) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onFocusPlanet }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = [
    'All',
    'WebGL & Three.js',
    'Cosmic 3D & Shaders',
    'Full-Stack Next.js',
    'Interactive Creative',
  ];

  const filteredProjects =
    activeCategory === 'All'
      ? PROJECTS
      : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-widest uppercase">
            <Orbit className="w-4 h-4 text-amber-400 animate-spin" />
            <span>01 // FEATURED 3D & COSMIC EXPERIENCES</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Selected Works & Spatial Builds
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-xl">
            A curation of real-time WebGL experiments, celestial physics simulations, and high-performance interactive 3D web applications.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full p-1.5 rounded-2xl border border-white/10 bg-zinc-950/80 backdrop-blur-md sm:flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? 'bg-amber-500 text-black font-semibold shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="group relative bg-slate-950/80 hover:bg-slate-900/90 border border-white/10 hover:border-amber-400/50 rounded-2xl p-5 sm:p-6.5 transition-all duration-300 flex flex-col justify-between backdrop-blur-xl shadow-xl hover:shadow-[0_15px_35px_-10px_rgba(245,158,11,0.2)] hover:-translate-y-1.5"
          >
            <div>
              {/* Card Top Meta */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-wide"
                  style={{
                    backgroundColor: `${project.accentColor}18`,
                    color: project.accentColor,
                    border: `1px solid ${project.accentColor}40`,
                  }}
                >
                  {project.category}
                </span>

                {/* Quick 3D Planet Teleporter */}
                <button
                  onClick={() => {
                    soundFx.playPlanetSelect();
                    onFocusPlanet(project.planetTarget);
                  }}
                  className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300 hover:text-amber-300 transition-colors cursor-pointer bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/10 hover:border-amber-400/40 shadow-sm shrink-0"
                  title={`Fly 3D camera to ${project.planetTarget.toUpperCase()}`}
                >
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span className="capitalize font-semibold">{project.planetTarget}</span>
                </button>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-display font-bold text-white group-hover:text-amber-300 transition-colors mb-2.5 leading-snug">
                {project.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                {project.description}
              </p>

              {/* Tech Stack Pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900/90 text-slate-300 border border-white/10 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Footer Actions */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
              <span className="text-[11px] font-mono text-amber-400/90 font-medium truncate max-w-full sm:max-w-[170px]">
                {project.metrics}
              </span>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setSelectedProject(project);
                }}
                className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer ml-auto bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 shrink-0"
              >
                <span>Case Study</span>
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Case Study Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onFocusPlanet={onFocusPlanet}
      />
    </section>
  );
};
