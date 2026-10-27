import { SOUND_NAMES, SOUND_DEFINITIONS } from './sounds';

class AudioManager {
  constructor() {
    this.ctx = null;
    this.volume = 0.7;
    this.muted = false;
    this.activeWheelTimers = [];
    this.lastPlayedAt = {};

    try {
      const savedMute = localStorage.getItem('rbp_sound_muted');
      if (savedMute !== null) {
        this.muted = savedMute === 'true';
      }
      const savedVol = localStorage.getItem('rbp_sound_volume');
      if (savedVol !== null) {
        const v = parseFloat(savedVol);
        if (Number.isFinite(v) && v >= 0 && v <= 1) {
          this.volume = v;
        }
      }
    } catch {
      // localStorage restrictions
    }

    if (typeof window !== 'undefined') {
      const unlock = () => {
        this._initContext();
        window.removeEventListener('click', unlock);
        window.removeEventListener('keydown', unlock);
        window.removeEventListener('touchstart', unlock);
      };
      window.addEventListener('click', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true, passive: true });
      window.addEventListener('touchstart', unlock, { once: true, passive: true });
    }
  }

  _initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        try {
          this.ctx = new AudioCtx();
        } catch (e) {
          console.warn('[AUDIO] Failed to initialize AudioContext:', e);
        }
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  setVolume(vol) {
    const clamped = Math.max(0, Math.min(1, Number(vol) || 0));
    this.volume = clamped;
    try {
      localStorage.setItem('rbp_sound_volume', String(clamped));
    } catch {}
  }

  getVolume() {
    return this.volume;
  }

  setMuted(muted) {
    this.muted = Boolean(muted);
    try {
      localStorage.setItem('rbp_sound_muted', String(this.muted));
    } catch {}
  }

  isMuted() {
    return this.muted;
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  /**
   * @param {string} soundName - semantic sound name
   * @param {object} [options] - optional overrides { volume, pitch }
   */
  play(soundName, options = {}) {
    if (this.muted) return;

    const def = SOUND_DEFINITIONS[soundName];
    if (!def) {
      console.warn(`[AUDIO] Unknown sound: "${soundName}"`);
      return;
    }

    const now = Date.now();
    const minInterval = soundName === SOUND_NAMES.WHEEL_TICK ? 30 : 60;
    if (this.lastPlayedAt[soundName] && now - this.lastPlayedAt[soundName] < minInterval) {
      return;
    }
    this.lastPlayedAt[soundName] = now;

    const ctx = this._initContext();
    if (!ctx) return;

    try {
      const effectiveVol = (options.volume ?? 1) * this.volume;
      this._synthesize(soundName, ctx, effectiveVol, options);
    } catch (err) {
      console.warn(`[AUDIO] Playback error for ${soundName}:`, err);
    }
  }




  _synthesize(name, ctx, masterVol, options = {}) {
    const t0 = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(masterVol, t0);
    gainNode.connect(ctx.destination);

    switch (name) {
      case 'buttonClick': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, t0);
        osc.frequency.exponentialRampToValueAtTime(150, t0 + 0.04);
        g.gain.setValueAtTime(0.2, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.04);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(t0);
        osc.stop(t0 + 0.045);
        break;
      }

      case 'buttonConfirm': {
        [523.25, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.06;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.25, start + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.12);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.13);
        });
        break;
      }

      case 'buttonError': {
        [220, 165].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.08;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.2, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.08);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.09);
        });
        break;
      }

      case 'scoreUp': {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.045;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.3, start + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.23);
        });
        break;
      }

      case 'scoreDown': {
        const notes = [440, 370, 311.13];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.055;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0.25, start);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.17);
        });
        break;
      }

      case 'roundTransition': {
        const chord = [392.0, 523.25, 659.25, 783.99];
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t0);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t0 + 0.45);
          g.gain.setValueAtTime(0, t0);
          g.gain.linearRampToValueAtTime(0.2, t0 + 0.05);
          g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(t0);
          osc.stop(t0 + 0.56);
        });
        break;
      }

      case 'timerWarning': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, t0);
        g.gain.setValueAtTime(0.3, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(t0);
        osc.stop(t0 + 0.13);
        break;
      }

      case 'timerEnd': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, t0);
        osc.frequency.exponentialRampToValueAtTime(110, t0 + 0.5);
        g.gain.setValueAtTime(0.4, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.55);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(t0);
        osc.stop(t0 + 0.56);
        break;
      }

      case 'wheelStart': {
        // Filtered noise sweep
        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, t0);
        filter.frequency.exponentialRampToValueAtTime(1200, t0 + 0.3);
        const g = ctx.createGain();
        g.gain.setValueAtTime(0.1, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.3);
        noise.connect(filter);
        filter.connect(g);
        g.connect(gainNode);
        noise.start(t0);
        noise.stop(t0 + 0.31);
        break;
      }

      case 'wheelTick': {
        // High-snap peg click
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const pitch = options.pitch ?? (1100 + Math.random() * 150);
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, t0);
        osc.frequency.exponentialRampToValueAtTime(180, t0 + 0.025);
        g.gain.setValueAtTime(0.32, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.025);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(t0);
        osc.stop(t0 + 0.03);
        break;
      }

      case 'wheelStop': {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, t0);
        osc.frequency.exponentialRampToValueAtTime(60, t0 + 0.15);
        g.gain.setValueAtTime(0.4, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.16);
        osc.connect(g);
        g.connect(gainNode);
        osc.start(t0);
        osc.stop(t0 + 0.17);
        break;
      }

      case 'wheelResult': {
        const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51];
        melody.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.08;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.28, start + 0.01);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.35);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.36);
        });
        break;
      }

      case 'winner': {
        const fanfare = [
          { f: 523.25, d: 0.12, t: 0 },
          { f: 523.25, d: 0.12, t: 0.13 },
          { f: 523.25, d: 0.12, t: 0.26 },
          { f: 659.25, d: 0.28, t: 0.4 },
          { f: 783.99, d: 0.45, t: 0.7 }
        ];
        fanfare.forEach((note) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + note.t;
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note.f, start);
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.3, start + 0.015);
          g.gain.exponentialRampToValueAtTime(0.001, start + note.d);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + note.d + 0.01);
        });
        break;
      }

      case 'announcement': {
        [587.33, 880.0].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          const start = t0 + idx * 0.12;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);
          g.gain.setValueAtTime(0, start);
          g.gain.linearRampToValueAtTime(0.35, start + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, start + 0.32);
          osc.connect(g);
          g.connect(gainNode);
          osc.start(start);
          osc.stop(start + 0.35);
        });
        break;
      }

      default:
        break;
    }
  }

  /**
   * Stop any running wheel tick sequence.
   */
  stopWheelSequence() {
    this.activeWheelTimers.forEach((t) => clearTimeout(t));
    this.activeWheelTimers = [];
  }

  /**
   * @param {number} totalDurationMs - duration of wheel spin animation (default 3200ms)
   * @param {Function} [onComplete] - callback when sequence finishes
   */
  playWheelSpinSequence(totalDurationMs = 3200, onComplete) {
    this.stopWheelSequence();
    if (this.muted) {
      if (typeof onComplete === 'function') {
        const finishTimer = setTimeout(onComplete, totalDurationMs);
        this.activeWheelTimers.push(finishTimer);
      }
      return;
    }

    this.play(SOUND_NAMES.WHEEL_START);

    const tickTimes = [];
    let currentTime = 40; // start after 40ms
    const minInterval = 45;
    const maxInterval = 420;

    while (currentTime < totalDurationMs - 120) {
      tickTimes.push(currentTime);
      const progress = currentTime / totalDurationMs;
      const interval = minInterval + (maxInterval - minInterval) * Math.pow(progress, 2.4);
      currentTime += interval;
    }

    tickTimes.forEach((delay) => {
      const timer = setTimeout(() => {
        this.play(SOUND_NAMES.WHEEL_TICK);
      }, delay);
      this.activeWheelTimers.push(timer);
    });




    const stopTimer = setTimeout(() => {
      this.play(SOUND_NAMES.WHEEL_STOP);
    }, totalDurationMs);
    this.activeWheelTimers.push(stopTimer);




    const resultTimer = setTimeout(() => {
      this.play(SOUND_NAMES.WHEEL_RESULT);
      if (typeof onComplete === 'function') {
        onComplete();
      }



    }, totalDurationMs + 250);
    this.activeWheelTimers.push(resultTimer);
  }
}

export const audioManager = new AudioManager();

/**
 * @param {string} soundName
 * @param {object} [options]
 */
export function playSound(soundName, options) {
  audioManager.play(soundName, options);
}

export default audioManager;
