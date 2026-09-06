import React, { useState, useEffect } from 'react';
import { GalaxySettings } from '../types';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { Orbit, Volume2, VolumeX, Zap, Compass, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  settings: GalaxySettings;
  onUpdateSettings: (newPartial: Partial<GalaxySettings>) => void;
  fps: number;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onUpdateSettings, fps }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [spaceSoundOn, setSpaceSoundOn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSpaceSoundToggle = () => {
    if (spaceSoundOn) {
      // Disable space sound
      soundFx.stopAmbientSpaceSound();
      soundFx.isMuted = true;
      setSpaceSoundOn(false);
    } else {
      // Enable space sound
      soundFx.isMuted = false;
      soundFx.startAmbientSpaceSound();
      setSpaceSoundOn(true);
    }
  };

  const handleToggleWarp = () => {
    soundFx.playWarp();
    onUpdateSettings({ warpSpeed: !settings.warpSpeed });
  };

  const scrollTo = (id: string) => {
    soundFx.playClick();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="main-navigation"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#090b10]/85 backdrop-blur-xl border-b border-white/10 py-3 shadow-2xl shadow-black/40'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo / Name Branding */}
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('hero');
            }}
            className="group flex items-center gap-3 text-inherit no-underline"
            id="nav-logo"
          >
            {/* Animated icon badge */}
            <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300"
              style={{
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 50%, #6366f1 100%)',
              }}
            >
              <Orbit className="w-5 h-5 text-white stroke-[2.5]" style={{ animation: 'spin 6s linear infinite' }} />
              {/* Glow ring */}
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: '0 0 18px rgba(245,158,11,0.6)' }} />
            </div>

            {/* Name + role */}
            <div className="flex flex-col leading-none gap-1">
              {/* NAME — gradient large */}
              <div className="flex items-center gap-2">
                <span
                  className="font-black tracking-tight text-lg sm:text-xl"
                  style={{
                    background: 'linear-gradient(90deg, #ffffff 0%, #fbbf24 50%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontFamily: "'Outfit', 'Inter', sans-serif",
                    letterSpacing: '-0.02em',
                  }}
                >
                  {PERSONAL_INFO.name}
                </span>
                {/* Live FPS badge */}
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                  {fps > 0 ? `${fps} FPS` : '60 FPS'}
                </span>
              </div>
              {/* Role subtitle */}
              <p className="hidden sm:block text-[10px] font-mono tracking-widest uppercase"
                style={{ color: 'rgba(251,191,36,0.65)', letterSpacing: '0.12em' }}
              >
                3D Artist &nbsp;·&nbsp; Full Stack Dev &nbsp;·&nbsp; WebGL
              </p>
            </div>
          </a>
        </div>


        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-zinc-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-inner">
          <button
            onClick={() => scrollTo('projects')}
            className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            id="nav-link-projects"
          >
            Projects
          </button>
          <button
            onClick={() => scrollTo('blender-lab')}
            className="px-3.5 py-1 text-xs font-medium text-amber-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer flex items-center gap-1.5"
            id="nav-link-lab"
          >
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            <span>Solar System Lab</span>
          </button>
          <button
            onClick={() => scrollTo('skills')}
            className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            id="nav-link-skills"
          >
            Tech Stack
          </button>
          <button
            onClick={() => scrollTo('experience')}
            className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            id="nav-link-experience"
          >
            Journey
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="px-3 py-1 text-xs font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-full transition-all cursor-pointer"
            id="nav-link-contact"
          >
            Contact
          </button>
        </nav>

        {/* Warp Speed + Audio + CTA */}
        <div className="flex items-center gap-2.5">
          {/* Warp Speed Button in Header */}
          <button
            onClick={handleToggleWarp}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
              settings.warpSpeed
                ? 'bg-sky-400 text-black border-sky-300 shadow-md shadow-sky-400/30 animate-pulse font-semibold'
                : 'bg-zinc-900/80 text-sky-400 border-sky-500/20 hover:bg-sky-500/10'
            }`}
            id="nav-warp-toggle"
            title="Toggle Warp Speed"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{settings.warpSpeed ? 'WARP: 3.5X' : 'WARP SPEED'}</span>
          </button>

          {/* Reset to Overview */}
          <button
            onClick={() => {
              soundFx.playPlanetSelect();
              onUpdateSettings({ focusedBody: 'all' });
            }}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono text-zinc-300 hover:text-white bg-zinc-900/80 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer"
            title="Overview of Solar System"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>Galaxy View</span>
          </button>

          {/* Space Sound Toggle Button */}
          <button
            id="space-sound-btn"
            onClick={handleSpaceSoundToggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer border ${
              spaceSoundOn
                ? 'bg-zinc-900/80 text-zinc-400 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/40 hover:bg-amber-500/20'
            }`}
            title={spaceSoundOn ? 'Disable Space Sound' : 'Enable Space Sound'}
          >
            {spaceSoundOn ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Disable Sound</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Enable Sound</span>
              </>
            )}
          </button>

          {/* Contact CTA */}
          <button
            onClick={() => scrollTo('contact')}
            className="hidden xl:flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-white text-zinc-950 hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer"
            id="nav-hire-btn"
          >
            <span>Let's Talk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d111b]/95 border-b border-white/10 backdrop-blur-2xl px-4 pt-4 pb-6 mt-3 space-y-3 animate-fadeIn">
          <button
            onClick={() => scrollTo('projects')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Projects
          </button>
          <button
            onClick={() => scrollTo('blender-lab')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-amber-400 hover:bg-white/5 rounded-lg flex items-center gap-2"
          >
            <Orbit className="w-4 h-4" />
            <span>Solar System Lab</span>
          </button>
          <button
            onClick={() => scrollTo('skills')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Tech Stack
          </button>
          <button
            onClick={() => scrollTo('experience')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Journey
          </button>
          <button
            onClick={() => scrollTo('contact')}
            className="w-full text-left py-2 px-3 text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg"
          >
            Contact
          </button>
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={handleToggleWarp}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-sky-500/20 text-sky-300 border border-sky-500/40"
            >
              Warp Speed: {settings.warpSpeed ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={() => {
                soundFx.playPlanetSelect();
                onUpdateSettings({ focusedBody: 'all' });
                setMobileMenuOpen(false);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40"
            >
              Reset Galaxy View
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
