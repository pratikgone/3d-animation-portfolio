import React, { useState } from 'react';
import { GalaxySettings, PlanetId } from '../types';
import { soundFx } from '../utils/audio';
import {
  Orbit,
  Zap,
  Compass,
  ChevronUp,
  ChevronDown,
  Globe,
  Radio,
  Sliders,
  Layers,
  Sparkles,
} from 'lucide-react';

interface ViewportToolbarProps {
  settings: GalaxySettings;
  onUpdateSettings: (newSettings: Partial<GalaxySettings>) => void;
  fps: number;
}

export const ViewportToolbar: React.FC<ViewportToolbarProps> = ({
  settings,
  onUpdateSettings,
  fps,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickPlanets: { id: PlanetId; label: string; icon: string }[] = [
    { id: 'all', label: 'Overview', icon: '🌌' },
    { id: 'sun', label: 'Sun', icon: '☀️' },
    { id: 'earth', label: 'Earth', icon: '🌍' },
    { id: 'mars', label: 'Mars', icon: '🔴' },
    { id: 'jupiter', label: 'Jupiter', icon: '🪐' },
    { id: 'saturn', label: 'Saturn', icon: '🪐' },
    { id: 'neptune', label: 'Neptune', icon: '🔵' },
  ];

  const handleSelectPlanet = (id: PlanetId) => {
    soundFx.playPlanetSelect();
    onUpdateSettings({ focusedBody: id });
  };

  const handleToggleWarp = () => {
    soundFx.playWarp();
    onUpdateSettings({ warpSpeed: !settings.warpSpeed });
  };

  return (
    <div
      id="viewport-hud-toolbar"
      className="fixed bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl transition-all duration-300 pointer-events-auto"
    >
      <div className="bg-[#0b0f19]/90 backdrop-blur-xl border border-white/15 rounded-2xl p-2 sm:p-3.5 shadow-2xl shadow-black/80">
        {/* Primary Quick Bar */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-4 flex-nowrap sm:flex-wrap">
          {/* Left: Galaxy Status Badge */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900/90 rounded-lg border border-white/10 text-[11px] font-mono text-zinc-300 shrink-0">
              <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span className="font-semibold text-zinc-100">GALAXY HUD</span>
              <span className="text-zinc-500">•</span>
              <span className="text-emerald-400">{fps > 0 ? `${fps} FPS` : '60 FPS'}</span>
            </div>

            {/* Quick Planet Pills */}
            <div className="flex items-center gap-1 bg-zinc-950/70 p-1 rounded-xl border border-white/10 overflow-x-auto no-scrollbar max-w-[180px] min-[400px]:max-w-[240px] sm:max-w-none shrink">
              {quickPlanets.map((item) => {
                const isActive = settings.focusedBody === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectPlanet(item.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-medium transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? 'bg-amber-500 text-black font-semibold shadow-md shadow-amber-500/20'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                    title={`Focus on ${item.label}`}
                  >
                    <span>{item.icon}</span>
                    <span className="hidden md:inline">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Warp Speed & Drawer Expander */}
          <div className="flex items-center gap-2">
            {/* Warp Speed Trigger */}
            <button
              onClick={handleToggleWarp}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                settings.warpSpeed
                  ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-black border-sky-300 shadow-md shadow-sky-500/30 animate-pulse'
                  : 'bg-zinc-900/90 text-sky-400 border-sky-500/30 hover:bg-sky-500/10'
              }`}
              title="Toggle Relativistic Warp Speed"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{settings.warpSpeed ? 'WARP 3.5X' : 'WARP'}</span>
            </button>

            {/* Orbit Lines Toggle */}
            <button
              onClick={() => {
                soundFx.playClick();
                onUpdateSettings({ showOrbits: !settings.showOrbits });
              }}
              className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                settings.showOrbits
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : 'bg-zinc-900 text-zinc-500 border-white/10'
              }`}
              title="Toggle Planetary Orbit Lines"
            >
              <Layers className="w-4 h-4" />
            </button>

            {/* Drawer Expander */}
            <button
              onClick={() => {
                soundFx.playClick();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-mono transition-colors cursor-pointer border border-white/10"
              title="More Galaxy Controls"
            >
              <Sliders className="w-3.5 h-3.5" />
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expanded Drawer */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fadeIn">
            {/* Speed adjustment */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                Orbit Speed: {settings.orbitSpeed.toFixed(1)}x
              </span>
              <input
                type="range"
                min="0.2"
                max="3.0"
                step="0.1"
                value={settings.orbitSpeed}
                onChange={(e) => onUpdateSettings({ orbitSpeed: parseFloat(e.target.value) })}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Asteroids & Nebula Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ showAsteroids: !settings.showAsteroids });
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                  settings.showAsteroids
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40 font-medium'
                    : 'bg-zinc-900/90 text-zinc-400 border-white/10'
                }`}
              >
                Asteroid Belt: {settings.showAsteroids ? 'ON' : 'OFF'}
              </button>
              <button
                onClick={() => {
                  soundFx.playClick();
                  onUpdateSettings({ nebulaGlow: !settings.nebulaGlow });
                }}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono text-center border transition-all cursor-pointer ${
                  settings.nebulaGlow
                    ? 'bg-purple-500/20 text-purple-300 border-purple-400/40 font-medium'
                    : 'bg-zinc-900/90 text-zinc-400 border-white/10'
                }`}
              >
                Nebula: {settings.nebulaGlow ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Quick Overview Reset */}
            <div className="flex items-center justify-end">
              <button
                onClick={() => {
                  soundFx.playPlanetSelect();
                  onUpdateSettings({ focusedBody: 'all' });
                }}
                className="w-full sm:w-auto px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Camera to Overview</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
