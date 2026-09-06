import React, { useEffect, useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { Box, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    soundFx.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-10 border-t border-white/10 bg-[#07090e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Branding & tribute */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <span className="font-display font-bold text-sm text-white">{PERSONAL_INFO.name}</span>
            <p className="text-xs font-mono text-zinc-400">
              Full Stack Developer • Next.js 15, React 19 & Three.js 3D
            </p>
          </div>
        </div>

        {/* Center: System status & Time */}
        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>WebGL 2.0 Engine Active</span>
          </div>
          <span className="text-zinc-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline">Local Time: {time}</span>
        </div>

        {/* Right: Scroll to top */}
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/40 text-xs font-mono text-zinc-300 hover:text-white transition-all cursor-pointer"
          title="Scroll back to top"
        >
          <span>Top</span>
          <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
        <p>© {new Date().getFullYear()} {PERSONAL_INFO.name}. Full Stack Developer & Software Engineer.</p>
        <p>Built with Next.js 15, React 19 & Three.js 3D.</p>
      </div>
    </footer>
  );
};
