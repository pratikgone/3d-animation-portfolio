import React from 'react';
import { GalaxySettings, PlanetId } from '../types';
import { PLANETS_DATA } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import {
  Orbit,
  Sparkles,
  Zap,
  Compass,
  Sliders,
  RotateCcw,
  CheckCircle,
  Eye,
  Globe,
  Radio,
} from 'lucide-react';

interface CosmicLabSectionProps {
  settings: GalaxySettings;
  onUpdateSettings: (newSettings: Partial<GalaxySettings>) => void;
}

export const BlenderLabSection: React.FC<CosmicLabSectionProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const selectedPlanet = PLANETS_DATA.find((p) => p.id === settings.focusedBody) || PLANETS_DATA[0];

  const handleSelectPlanet = (id: PlanetId) => {
    soundFx.playPlanetSelect();
    onUpdateSettings({ focusedBody: id });
  };

  const handleToggleWarp = () => {
    soundFx.playWarp();
    onUpdateSettings({ warpSpeed: !settings.warpSpeed });
  };

  return (
    <section id="blender-lab" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-widest uppercase">
            <Orbit className="w-4 h-4 animate-spin text-amber-400" />
            <span>02 // INTERACTIVE SOLAR SYSTEM & GALAXY LAB</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
            Celestial Viewport & Planetarium
          </h2>
          <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl">
            Real-time Three.js solar system simulation featuring all 8 planets, the blazing Sun,
            orbital mechanics, asteroid belt, and deep space starfields.
          </p>
        </div>

        {/* Panoramic System Reset */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundFx.playPlanetSelect();
              onUpdateSettings({ focusedBody: 'all' });
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
              settings.focusedBody === 'all'
                ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                : 'bg-zinc-900/80 text-zinc-300 border-white/10 hover:border-amber-400/40 hover:text-white'
            }`}
            id="lab-overview-btn"
          >
            <Compass className="w-4 h-4" />
            <span>Overview (Solar System)</span>
          </button>

          {/* Warp Speed Button */}
          <button
            onClick={handleToggleWarp}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
              settings.warpSpeed
                ? 'bg-gradient-to-r from-sky-400 to-indigo-500 text-black border-sky-300 shadow-lg shadow-sky-500/30 animate-pulse'
                : 'bg-zinc-900/80 text-sky-400 border-sky-500/30 hover:bg-sky-500/10'
            }`}
            id="lab-warp-toggle"
          >
            <Zap className="w-4 h-4" />
            <span>{settings.warpSpeed ? 'WARP ACTIVE (3.5X)' : 'ENGAGE WARP'}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: All Planets Selector */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-2 font-semibold">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>Select Celestial Target (Planets & Sun)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {PLANETS_DATA.length} Celestial Bodies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {PLANETS_DATA.map((planet) => {
              const isSelected = settings.focusedBody === planet.id;
              return (
                <button
                  key={planet.id}
                  onClick={() => handleSelectPlanet(planet.id)}
                  className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer backdrop-blur-xl flex flex-col justify-between group ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      : 'bg-slate-900/70 border-white/10 hover:border-amber-400/40 hover:bg-slate-800/80 shadow-md hover:-translate-y-0.5'
                  }`}
                  id={`planet-card-${planet.id}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-md"
                        style={{
                          backgroundColor: planet.color,
                          boxShadow: `0 0 10px ${planet.color}`,
                        }}
                      />
                      <span className="font-display font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {planet.name}
                      </span>
                    </div>

                    {isSelected && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold tracking-wide">
                        TRACKING
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] font-mono text-amber-300/90 mb-1.5 font-medium">
                    {planet.subtitle}
                  </p>

                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {planet.description}
                  </p>

                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>
                      {planet.id === 'sun' ? 'Center Star' : `Orbit: ${planet.distance} AU`}
                    </span>
                    <span className="text-zinc-400 group-hover:text-amber-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>Focus</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Celestial Telemetry & Simulation Controls */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Active Target Card */}
          <div className="bg-[#0b0f19]/90 border border-white/15 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wide">
                  Real-Time Orbital Telemetry
                </span>
              </div>
              <span className="text-[11px] font-mono text-zinc-500">
                {selectedPlanet.id.toUpperCase()}
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <h4 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                {selectedPlanet.name}
              </h4>
              <span className="text-sm font-mono text-amber-400">
                {selectedPlanet.subtitle}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedPlanet.description}
            </p>

            {/* Scientific Matrix */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-zinc-950/70 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                  SEMI-MAJOR AXIS
                </span>
                <span className="text-sm font-mono font-semibold text-zinc-200">
                  {selectedPlanet.distance === 0 ? '0.00 AU (Origin)' : `${selectedPlanet.distance} AU`}
                </span>
              </div>

              <div className="bg-zinc-950/70 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                  ORBITAL PERIOD
                </span>
                <span className="text-sm font-mono font-semibold text-zinc-200">
                  {selectedPlanet.orbitPeriod === 0 ? 'Stationary' : `${selectedPlanet.orbitPeriod} Earth Yrs`}
                </span>
              </div>

              <div className="bg-zinc-950/70 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                  RELATIVE RADIUS
                </span>
                <span className="text-sm font-mono font-semibold text-zinc-200">
                  {selectedPlanet.radius * 10} Units
                </span>
              </div>

              <div className="bg-zinc-950/70 p-3 rounded-xl border border-white/5">
                <span className="text-[10px] font-mono text-zinc-500 block mb-1">
                  SPECIAL FEATURES
                </span>
                <span className="text-xs font-mono font-semibold text-amber-300 truncate block">
                  {selectedPlanet.hasRings
                    ? 'Dual Ring System'
                    : selectedPlanet.hasMoon
                    ? 'Orbiting Luna (Moon)'
                    : selectedPlanet.id === 'sun'
                    ? 'Solar Corona Flares'
                    : 'Cratered Rocky Surface'}
                </span>
              </div>
            </div>

            {/* Quick action: smooth camera glide */}
            <button
              onClick={() => handleSelectPlanet(selectedPlanet.id)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-black font-semibold text-xs flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Glide Camera to {selectedPlanet.name}</span>
            </button>
          </div>

          {/* Simulation Toggles */}
          <div className="bg-[#0b0f19]/90 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
            <h4 className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Galaxy Engine Adjustments</span>
            </h4>

            {/* Orbit Speed Slider */}
            <div className="mb-5">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-zinc-400">Orbital Speed</span>
                <span className="text-amber-400 font-semibold">{settings.orbitSpeed.toFixed(1)}x</span>
              </div>
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

            {/* Toggles */}
            <div className="space-y-3">
              {/* Show Orbits */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                <div className="text-xs">
                  <span className="text-white font-medium block">Planetary Orbit Lines</span>
                  <span className="text-[11px] text-zinc-400">Display orbital trajectory rings</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showOrbits}
                  onChange={(e) => {
                    soundFx.playClick();
                    onUpdateSettings({ showOrbits: e.target.checked });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {/* Show Asteroid Belt */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                <div className="text-xs">
                  <span className="text-white font-medium block">Asteroid Belt</span>
                  <span className="text-[11px] text-zinc-400">1,400+ rocky debris between Mars & Jupiter</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showAsteroids}
                  onChange={(e) => {
                    soundFx.playClick();
                    onUpdateSettings({ showAsteroids: e.target.checked });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {/* Nebula Clouds */}
              <label className="flex items-center justify-between p-3 rounded-xl bg-zinc-950/60 border border-white/5 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                <div className="text-xs">
                  <span className="text-white font-medium block">Volumetric Nebula Clouds</span>
                  <span className="text-[11px] text-zinc-400">Cosmic magenta and cyan dust glow</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.nebulaGlow}
                  onChange={(e) => {
                    soundFx.playClick();
                    onUpdateSettings({ nebulaGlow: e.target.checked });
                  }}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
