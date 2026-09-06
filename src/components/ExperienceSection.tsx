import React from 'react';
import { EXPERIENCES } from '../data/portfolioData';
import { Briefcase, Calendar, MapPin, CheckCircle2 } from 'lucide-react';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      {/* Header */}
      <div className="mb-14">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-widest uppercase">
          <Briefcase className="w-4 h-4" />
          <span>04 // CAREER JOURNEY & MILESTONES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight">
          Professional Trajectory
        </h2>
        <p className="mt-3 text-zinc-400 text-sm sm:text-base max-w-2xl">
          Leading 3D spatial engineering, crafting production WebGL applications, and delivering next-generation digital experiences.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative border-l border-white/15 ml-3 sm:ml-6 space-y-12">
        {EXPERIENCES.map((exp, idx) => (
          <div key={idx} className="relative pl-6 sm:pl-10 group">
            {/* Timeline Dot */}
            <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-zinc-950 border-2 border-amber-500 group-hover:scale-125 group-hover:bg-amber-400 transition-all" />

            <div className="bg-slate-950/80 border border-white/10 group-hover:border-amber-400/40 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-xl font-display font-bold text-white group-hover:text-amber-300 transition-colors">
                    {exp.role}
                  </h3>
                  <span className="text-amber-400 font-bold text-sm">{exp.company}</span>
                </div>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    {exp.year}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {exp.location}
                  </span>
                </div>
              </div>

              {/* Bullet points */}
              <div className="space-y-2.5 my-4">
                {exp.description.map((desc, dIdx) => (
                  <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{desc}</span>
                  </div>
                ))}
              </div>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
                {exp.technologies.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 text-slate-300 border border-white/10 font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
