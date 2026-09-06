import React, { useEffect } from 'react';
import { Project, PlanetId } from '../types';
import { soundFx } from '../utils/audio';
import {
  X,
  ExternalLink,
  Sparkles,
  Zap,
  CheckCircle2,
  Compass,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onFocusPlanet?: (target: PlanetId) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onFocusPlanet,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const handleFlyToTarget = () => {
    soundFx.playPlanetSelect();
    if (onFocusPlanet) {
      onFocusPlanet(project.planetTarget);
    }
    onClose();
  };

  return (
    <div
      id="project-case-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0d111a] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-white/10"
          id="close-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Status */}
        <div className="flex items-center gap-3 mb-3">
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-semibold"
            style={{
              backgroundColor: `${project.accentColor}20`,
              color: project.accentColor,
              border: `1px solid ${project.accentColor}40`,
            }}
          >
            {project.category}
          </span>
          <span className="text-xs font-mono text-zinc-400">
            Celestial Anchor: {project.planetTarget.toUpperCase()}
          </span>
        </div>

        {/* Modal Title */}
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-white tracking-tight mb-4">
          {project.title}
        </h2>

        {/* Long Narrative */}
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-6">
          {project.longDescription}
        </p>

        {/* Tech Stack */}
        <div className="mb-6">
          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2.5">
            Architecture & Technologies
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="px-2.5 py-1 rounded-lg text-xs font-mono bg-zinc-900 border border-white/10 text-zinc-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="mb-6">
          <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Key Engineering Deliverables</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.features.map((feat, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 bg-zinc-900/40 p-3 rounded-xl border border-white/5 text-xs text-zinc-300"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metric Box */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-transparent border border-amber-500/20 mb-6 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-white">Performance Verification: </span>
            <span className="text-zinc-300">{project.metrics}</span>
          </div>
        </div>

        {/* Modal Footer Links */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10 flex-wrap">
          {/* Fly to target 3D planet */}
          <button
            onClick={handleFlyToTarget}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30 text-xs font-mono transition-colors cursor-pointer"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Fly Camera to {project.planetTarget.toUpperCase()} in 3D</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                soundFx.playClick();
                onClose();
              }}
              className="px-4 py-2 rounded-xl text-xs font-mono text-zinc-400 hover:text-white cursor-pointer"
            >
              Close Inspector
            </button>
            <a
              href={project.liveUrl || '#'}
              target="_blank"
              rel="noreferrer"
              onClick={() => soundFx.playClick()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-semibold text-xs hover:bg-amber-400 transition-colors cursor-pointer"
            >
              <span>Live Interactive Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
