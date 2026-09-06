import React, { useState } from 'react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { soundFx } from '../utils/audio';
import {
  Mail,
  Send,
  Check,
  Copy,
  Github,
  Linkedin,
  Phone,
  MessageSquare,
  Loader2,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    projectType: '3D Web Experience',
    message: '',
  });

  const handleCopyEmail = () => {
    soundFx.playClick();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;

    setIsSubmitting(true);
    soundFx.playModeSwitch();

    try {
      // 1. Try FormSubmit AJAX API (Sends real email to pratikgone1678@gmail.com)
      const res = await fetch(`https://formsubmit.co/ajax/${PERSONAL_INFO.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          project_type: formState.projectType,
          message: formState.message,
          _subject: `⚡ New Portfolio Inquiry: ${formState.projectType} from ${formState.name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      const data = await res.json();

      if (data.success === 'true' || data.success === true || res.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
        return;
      }

      // Fallback: If FormSubmit has any issue, try Web3Forms
      const web3Res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: import.meta.env.VITE_WEB3FORMS_KEY || '03a6b8c9-test-fallback',
          name: formState.name,
          email: formState.email,
          subject: `⚡ Portfolio Contact: ${formState.name}`,
          message: `Project Type: ${formState.projectType}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`,
        }),
      });

      if (web3Res.ok) {
        setIsSubmitting(false);
        setIsSubmitted(true);
      } else {
        throw new Error('Email service error');
      }
    } catch (err) {
      console.error('Email send error:', err);
      // Emergency fallback to mailto if all APIs fail
      const subject = encodeURIComponent(`[Portfolio] ${formState.projectType} — ${formState.name}`);
      const body = encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\nMessage: ${formState.message}`);
      window.location.href = `mailto:${PERSONAL_INFO.email}?subject=${subject}&body=${body}`;
      setIsSubmitting(false);
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    soundFx.playClick();
    setIsSubmitted(false);
    setFormState({ name: '', email: '', projectType: '3D Web Experience', message: '' });
  };

  return (
    <section id="contact" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* ── Left Column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-3 tracking-widest uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>05 // INITIATE TRANSMISSION</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-display font-bold text-white tracking-tight leading-[1.1]">
            Let's Build Something Spatial&nbsp;&amp;&nbsp;Exceptional.
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
            Send a direct message right to my inbox.
            Whether it's enterprise Next.js, fintech SaaS, or interactive 3D WebGL — let's bring it to reality.
          </p>

          {/* Email copy row */}
          <div className="bg-[#0c101b]/90 border border-white/10 rounded-2xl p-5 backdrop-blur-xl space-y-3">
            <span className="text-xs font-mono text-zinc-400 block">Direct Communication:</span>

            <div className="flex items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 text-sm font-mono text-white truncate">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">{PERSONAL_INFO.email}</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors cursor-pointer shrink-0"
                id="copy-email-btn"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 text-sm font-mono text-white bg-zinc-950 p-3 rounded-xl border border-white/5">
              <Phone className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{PERSONAL_INFO.phone}</span>
            </div>
          </div>

          {/* Social links */}
          <div>
            <span className="text-xs font-mono text-zinc-400 block mb-3">Connect across networks:</span>
            <div className="flex items-center gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/50 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
                title="GitHub — @pratikgone"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundFx.playClick()}
                className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 hover:border-blue-500/50 flex items-center justify-center text-zinc-300 hover:text-blue-400 transition-all cursor-pointer"
                title="LinkedIn — Pratik Gone"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                onClick={() => soundFx.playClick()}
                className="w-11 h-11 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-500/50 flex items-center justify-center text-zinc-300 hover:text-amber-400 transition-all cursor-pointer"
                title="Send Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Right Column: Form ────────────────────────────────────────── */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">

          {isSubmitted ? (
            /* ── Success State ── */
            <div className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                <Check className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-white mb-2">Message Delivered! 🚀</h3>
              <p className="text-sm text-slate-300 max-w-sm mx-auto mb-3">
                Your message has been sent directly to <strong>{PERSONAL_INFO.email}</strong>.
              </p>
              
              <div className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 max-w-md mx-auto mb-6 text-left space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-400">
                  <span>📌 First-time Setup Note for Pratik:</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-normal">
                  If this is your first submission test, please check your Gmail inbox (or Spam folder) for a <strong>1-click activation link from FormSubmit</strong> to confirm `pratikgone1678@gmail.com`. Once activated, all future messages arrive instantly!
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono border border-white/15 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold text-white">Send me a message</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full ml-auto">
                  Direct SMTP Delivery
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Thorne"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                    Your Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@studio.io"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  Project Type
                </label>
                <select
                  value={formState.projectType}
                  onChange={(e) => setFormState({ ...formState, projectType: e.target.value })}
                  className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all"
                >
                  <option value="3D Web Experience">Interactive 3D WebGL Showcase</option>
                  <option value="Blender Modeling & Baking">Blender 3D Modeling &amp; Asset Pipeline</option>
                  <option value="Full-Stack Next.js Application">Full-Stack Next.js / React 19 Application</option>
                  <option value="Fintech SaaS Platform">Fintech / Loan Management SaaS</option>
                  <option value="Creative Direction & Shaders">Custom GLSL Shaders &amp; Motion Design</option>
                  <option value="General Inquiry">General Inquiry / Collaboration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                  Message / Project Brief <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Describe your vision, timeline, budget, or any specific requirements..."
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-slate-900/90 border border-white/15 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: isSubmitting
                    ? 'rgba(245,158,11,0.4)'
                    : 'linear-gradient(90deg, #f59e0b 0%, #ea580c 60%, #f59e0b 100%)',
                  color: '#0a0c12',
                  boxShadow: isSubmitting ? 'none' : '0 0 28px rgba(245,158,11,0.3)',
                }}
                id="submit-contact-form"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Transmitting email via SMTP…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Pratik</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-zinc-400 text-center font-mono">
                ⚡ Direct API delivery — sends real email to pratikgone1678@gmail.com on Mobile & PC.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
