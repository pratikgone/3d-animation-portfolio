/**
 * Space Audio Controller
 * Primary:  HTML5 Audio with a local NASA space ambient MP3 (public/space-ambient.mp3)
 * Fallback: Pure Web Audio API synthesizer if the file is missing.
 */
class SoundController {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  public isAmbientPlaying: boolean = false;

  // HTML5 Audio element for the real NASA/space ambient file
  private audioEl: HTMLAudioElement | null = null;

  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private noiseSource: AudioBufferSourceNode | null = null;

  private getCtx(): AudioContext | null {
    try {
      if (!this.ctx) {
        const AC =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AC();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  /**
   * Hard stop & clean up all running nodes so we can restart cleanly.
   */
  private _cleanupNodes() {
    this.oscillators.forEach((o) => { try { o.stop(); o.disconnect(); } catch {} });
    this.oscillators = [];
    try { this.noiseSource?.stop(); this.noiseSource?.disconnect(); } catch {}
    this.noiseSource = null;
    try { this.masterGain?.disconnect(); } catch {}
    this.masterGain = null;
    this.isAmbientPlaying = false;
  }

  /** Start continuous immersive space ambient sound.
   * Uses real NASA MP3 file from /public/space-ambient.mp3 if available,
   * otherwise falls back to Web Audio synthesizer.
   */
  startAmbientSpaceSound() {
    // Clean up any previous session first
    this._cleanupNodes();
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl = null;
    }

    // --- PRIMARY: Try to play the real local space ambient file ---
    try {
      // space-ambient.mp3.wav (user uploaded NASA WAV file)
      const audio = new Audio('/space-ambient.mp3.wav');
      audio.loop = true;
      audio.volume = 0.55;
      this.audioEl = audio;

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('[SpaceAudio] ✅ Real NASA space audio playing');
            this.isAmbientPlaying = true;
          })
          .catch(() => {
            // File missing or blocked — use synthesizer fallback
            console.log('[SpaceAudio] ⚠️ MP3 unavailable, using synthesizer');
            this.audioEl = null;
            this._startSynthesizer();
          });
      } else {
        this.isAmbientPlaying = true;
      }
      return;
    } catch {
      // Fall through to synthesizer
    }

    // --- FALLBACK: Web Audio API synthesizer ---
    this._startSynthesizer();
  }

  /** Web Audio synthesizer (fallback when MP3 is not available). */
  private _startSynthesizer() {
    const ctx = this.getCtx();
    if (!ctx) {
      console.warn('[SpaceAudio] AudioContext unavailable');
      return;
    }

    try {
      const now = ctx.currentTime;

      // Master output gain with slow 3-second fade-in
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.0001, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.6, now + 3);
      this.masterGain.connect(ctx.destination);

      // --- Layer 1: Low cosmic hum (150 Hz) — clearly audible on laptop speakers ---
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 150;
      const g1 = ctx.createGain();
      g1.gain.value = 0.45;
      osc1.connect(g1);
      g1.connect(this.masterGain);
      osc1.start(now);
      this.oscillators.push(osc1);

      // --- Layer 2: Mid tone (220 Hz) ---
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 220;
      const g2 = ctx.createGain();
      g2.gain.value = 0.2;
      osc2.connect(g2);
      g2.connect(this.masterGain);
      osc2.start(now);
      this.oscillators.push(osc2);

      // --- Layer 3: Higher shimmer (440 Hz, very low volume for air) ---
      const osc3 = ctx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = 440;
      const g3 = ctx.createGain();
      g3.gain.value = 0.05;
      osc3.connect(g3);
      g3.connect(this.masterGain);
      osc3.start(now);
      this.oscillators.push(osc3);

      // --- LFO: slow volume pulse every ~20 seconds for breathing effect ---
      const lfo = ctx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.08;
      lfo.connect(lfoGain);
      lfoGain.connect(this.masterGain.gain);
      lfo.start(now);
      this.oscillators.push(lfo);

      // --- Layer 4: Pink-noise "solar wind" (bandpass 300–500 Hz) ---
      const sr = ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, sr * 3, sr);
      const data = noiseBuffer.getChannelData(0);
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < data.length; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886*b0 + w*0.0555179;
        b1 = 0.99332*b1 + w*0.0750759;
        b2 = 0.96900*b2 + w*0.1538520;
        b3 = 0.86650*b3 + w*0.3104856;
        b4 = 0.55000*b4 + w*0.5329522;
        b5 = -0.7616*b5  - w*0.0168980;
        data[i] = (b0+b1+b2+b3+b4+b5+b6 + w*0.5362) * 0.11;
        b6 = w * 0.115926;
      }

      this.noiseSource = ctx.createBufferSource();
      this.noiseSource.buffer = noiseBuffer;
      this.noiseSource.loop = true;

      const bpf = ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.value = 350;
      bpf.Q.value = 0.8;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.4;

      this.noiseSource.connect(bpf);
      bpf.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      this.noiseSource.start(now);

      this.isAmbientPlaying = true;
      console.log('[SpaceAudio] ✅ Space ambient started');
    } catch (e) {
      console.error('[SpaceAudio] ❌ startAmbient failed:', e);
    }
  }

  /** Stop ambient sound with a smooth fade-out. */
  stopAmbientSpaceSound() {
    // Stop HTML5 audio track if playing
    if (this.audioEl) {
      try {
        this.audioEl.pause();
        this.audioEl.currentTime = 0;
      } catch {}
      this.audioEl = null;
      this.isAmbientPlaying = false;
    }
    // Stop Web Audio synthesizer if running
    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
        setTimeout(() => this._cleanupNodes(), 900);
      } catch {
        this._cleanupNodes();
      }
    } else {
      this._cleanupNodes();
    }
  }

  // ── Short one-shot SFX ──────────────────────────────────────────────────

  playClick() {
    const ctx = this.getCtx();
    if (!ctx || this.isMuted) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, t);
      osc.frequency.exponentialRampToValueAtTime(400, t + 0.06);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.07);
    } catch {}
  }

  playModeSwitch() {
    const ctx = this.getCtx();
    if (!ctx || this.isMuted) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.12);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.13);
    } catch {}
  }

  playMorph() {
    const ctx = this.getCtx();
    if (!ctx || this.isMuted) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, t);
      osc.frequency.linearRampToValueAtTime(520, t + 0.08);
      osc.frequency.linearRampToValueAtTime(390, t + 0.16);
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.19);
    } catch {}
  }

  playWarp() {
    const ctx = this.getCtx();
    if (!ctx || this.isMuted) return;
    try {
      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, t);
      osc.frequency.exponentialRampToValueAtTime(1400, t + 0.4);
      g.gain.setValueAtTime(0.12, t);
      g.gain.linearRampToValueAtTime(0.18, t + 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(g); g.connect(ctx.destination);
      osc.start(t); osc.stop(t + 0.5);
    } catch {}
  }

  playPlanetSelect() {
    const ctx = this.getCtx();
    if (!ctx || this.isMuted) return;
    try {
      const t = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t + i * 0.1);
        g.gain.exponentialRampToValueAtTime(0.1, t + i * 0.1 + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.1 + 0.35);
        osc.connect(g); g.connect(ctx.destination);
        osc.start(t + i * 0.1);
        osc.stop(t + i * 0.1 + 0.4);
      });
    } catch {}
  }
}

export const soundFx = new SoundController();
