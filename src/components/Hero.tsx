import React from 'react';
import { soundFx } from '../utils/audio';
import { PERSONAL_INFO } from '../data/portfolioData';
import { PlanetId } from '../types';
import {
  ArrowDown,
  Sparkles,
  Layers,
  Compass,
  Code2,
  Orbit,
  MousePointerClick,
  Zap,
} from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onOpenLab: () => void;
  onFocusPlanet: (id: PlanetId) => void;
  warpSpeed: boolean;
  onToggleWarp: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onOpenLab,
  onFocusPlanet,
  warpSpeed,
  onToggleWarp,
}) => {
  const quickCelestialBodies: { id: PlanetId; label: string; icon: string; detail: string }[] = [
    { id: 'sun', label: 'The Sun', icon: '☀️', detail: 'Corona & Plasma Flares' },
    { id: 'earth', label: 'Earth', icon: '🌍', detail: 'Oceans & Orbiting Moon' },
    { id: 'mars', label: 'Mars', icon: '🔴', detail: 'Rusted Iron-Oxide Dunes' },
    { id: 'jupiter', label: 'Jupiter', icon: '🪐', detail: 'Great Red Storm Vortex' },
    { id: 'saturn', label: 'Saturn', icon: '🪐', detail: 'Crystalline 3D Rings' },
  ];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10 pointer-events-none select-none"
    >
      {/* Top HUD Cosmic Viewport Metadata Bar */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 text-[10px] sm:text-[11px] font-mono text-zinc-400 pointer-events-auto">
        <div className="flex items-center gap-2 sm:gap-3 bg-zinc-950/70 backdrop-blur-md px-2.5 sm:px-3.5 py-1.5 rounded-lg border border-white/10 max-w-full truncate">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold truncate">
            <Orbit className="w-3.5 h-3.5 animate-spin shrink-0" />
            <span className="truncate">THREE.JS 3D SOLAR SYSTEM & GALAXY</span>
          </div>
          <span className="text-zinc-600 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-zinc-300">8 Planets + Sun + Asteroids</span>
          <span className="text-zinc-600 hidden md:inline">|</span>
          <span className="hidden md:inline text-zinc-300">5,200+ Stars</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-zinc-950/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-emerald-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{PERSONAL_INFO.availability}</span>
        </div>
      </div>

      {/* Center Open Viewport - 100% Unobstructed 3D Galaxy */}
      <div className="my-auto" />
    </section>
  );
};
