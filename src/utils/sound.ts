// Pure browser Web Audio API synthesizer for tactile game feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private getContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume = 0.08, delay = 0) {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch {
      // Ignore audio errors if blocked by browser autoplay policy
    }
  }

  public click() {
    this.playTone(520, 0.06, 'triangle', 0.05);
  }

  public place() {
    this.playTone(440, 0.07, 'sine', 0.07);
    this.playTone(660, 0.09, 'sine', 0.05, 0.04);
  }

  public step() {
    this.playTone(340, 0.06, 'triangle', 0.05);
  }

  public collect() {
    this.playTone(659.25, 0.09, 'sine', 0.08);
    this.playTone(880, 0.14, 'sine', 0.08, 0.07);
  }

  public error() {
    this.playTone(220, 0.14, 'sawtooth', 0.05);
    this.playTone(175, 0.18, 'sawtooth', 0.05, 0.09);
  }

  public success() {
    this.playTone(523.25, 0.12, 'triangle', 0.08, 0);
    this.playTone(659.25, 0.12, 'triangle', 0.08, 0.09);
    this.playTone(783.99, 0.18, 'triangle', 0.09, 0.18);
    this.playTone(1046.5, 0.28, 'sine', 0.08, 0.28);
  }
}

export const sound = new SoundEngine();
