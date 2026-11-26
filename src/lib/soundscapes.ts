// Web Audio API ambient soundscape & harmonic chime generator
// Pure synthesized audio with zero external file dependencies or latency.

class SoundscapeEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private droneGain: GainNode | null = null;
  private isPlayingDrone: boolean = false;
  private oscillators: OscillatorNode[] = [];

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.initContext();
    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbientDrone();
      this.playChime(523.25); // C5 welcome chime
    } else {
      this.stopAmbientDrone();
    }

    return !this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Soft atmospheric chord drone: Fmaj7 / Dm9 celestial pad
  public startAmbientDrone() {
    if (this.isMuted || this.isPlayingDrone) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const masterDroneGain = this.ctx.createGain();
      masterDroneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      masterDroneGain.gain.exponentialRampToValueAtTime(0.04, this.ctx.currentTime + 3);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, this.ctx.currentTime);

      masterDroneGain.connect(filter);
      filter.connect(this.ctx.destination);

      // F3, A3, C4, E4, G4 (Fmaj9 ambient harmonic cluster)
      const freqs = [174.61, 220.0, 261.63, 329.63, 392.0];
      this.oscillators = [];

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq + (Math.random() * 0.4 - 0.2), this.ctx.currentTime);

        // LFO subtle detune
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        oscGain.gain.setValueAtTime(0.25 / freqs.length, this.ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterDroneGain);

        osc.start();
        this.oscillators.push(osc);
      });

      this.droneGain = masterDroneGain;
      this.isPlayingDrone = true;
    } catch {
      // Audio autoplay policy handled silently
    }
  }

  public stopAmbientDrone() {
    if (!this.isPlayingDrone || !this.ctx || !this.droneGain) return;
    try {
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try { osc.stop(); } catch {}
        });
        this.oscillators = [];
        this.isPlayingDrone = false;
      }, 1200);
    } catch {
      this.isPlayingDrone = false;
    }
  }

  // Harmonic crystal chime for interactions
  public playChime(freq: number = 659.25) { // E5 default
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      // Soft pitch descent
      osc.frequency.exponentialRampToValueAtTime(freq * 0.99, now + 1.5);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.8);
    } catch {}
  }

  // Dual celestial harmonic chime for notifications (E5 -> A5 ascending sparkle)
  public playNotificationChime() {
    this.initContext();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // First tone (E5: 659.25 Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(659.25, now);
      gain1.gain.setValueAtTime(0.09, now);
      gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Second tone, higher sparkling chime (A5: 880.0 Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880.0, now + 0.12);
      gain2.gain.setValueAtTime(0.11, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 1.2);
    } catch {}
  }

  // Gentle transition ripple chords
  public playChapterTone(index: number) {
    if (this.isMuted) return;
    const chords = [
      [261.63, 329.63, 392.0], // C major
      [293.66, 349.23, 440.0], // D minor
      [329.63, 392.0, 493.88], // E minor
      [349.23, 440.0, 523.25]  // F major
    ];
    const notes = chords[index % chords.length] || chords[0];
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playChime(freq * 1.5);
      }, i * 90);
    });
  }
}

export const soundscape = new SoundscapeEngine();
