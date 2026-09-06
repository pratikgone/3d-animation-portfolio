import React, { useState } from 'react';
import { SKILL_CATEGORIES } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import { Box, Orbit, Code, Sparkles, CheckCircle2 } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const getCategoryIcon = (name: string) => {
    switch (name) {
      case 'Box':
        return <Box className="w-5 h-5 text-amber-400" />;
      case 'Orbit':
        return <Orbit className="w-5 h-5 text-sky-400" />;
      case 'Code':
      default:
        return <Code className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <section id="skills" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-widest uppercase">
          <Orbit className="w-4 h-4" />
          <span>03 // CORE CAPABILITIES & TECH STACK</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Specialized Skill Matrix
        </h2>
        <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl">
          A balanced synthesis of artistic 3D digital craftsmanship and deep software engineering principles.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar max-w-full pb-2 mb-6 sm:flex-wrap">
        {SKILL_CATEGORIES.map((cat, idx) => (
          <button
            key={cat.title}
            onClick={() => {
              soundFx.playClick();
              setActiveIdx(idx);
            }}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border whitespace-nowrap shrink-0 ${
              activeIdx === idx
                ? 'bg-zinc-800 text-white border-amber-500/60 shadow-lg shadow-black/40'
                : 'bg-zinc-950/70 text-zinc-400 border-white/10 hover:text-white hover:bg-zinc-900'
            }`}
          >
            {getCategoryIcon(cat.iconName)}
            <span>{cat.title}</span>
          </button>
        ))}
      </div>

      {/* Active Category Display */}
      <div className="bg-slate-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
        <div className="mb-6 pb-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-xl font-display font-bold text-white">
              {SKILL_CATEGORIES[activeIdx].title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {SKILL_CATEGORIES[activeIdx].description}
            </p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30 self-start sm:self-center font-semibold">
            Industry Standard Proficiency
          </span>
        </div>

        {/* Skills List with Dynamic Percentage Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SKILL_CATEGORIES[activeIdx].skills.map((skill) => (
            <div
              key={skill.name}
              className="bg-slate-900/60 p-4.5 rounded-xl border border-white/10 hover:border-amber-400/30 transition-all shadow-md"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white">{skill.name}</span>
                <span className="font-mono text-xs font-bold text-amber-400">{skill.level}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-white/10 mb-2.5">
                <div
                  className="bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 h-full rounded-full transition-all duration-700 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {/* Highlight Tag */}
              {skill.highlight && (
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{skill.highlight}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
