export class NurseryAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingAudio = false;
  private volume = 0.85;
  private masterGain: GainNode | null = null;
  private tempoBpm = 118;
  private timerId: number | null = null;
  private stepIndex = 0;
  private speechSynth: SpeechSynthesis | null = null;
  private currentVoice: SpeechSynthesisVoice | null = null;
  private lastSpokenCue = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.speechSynth = window.speechSynthesis;
      this.initVoices();
    }
  }

  private initVoices() {
    if (!this.speechSynth) return;
    const load = () => {
      const voices = this.speechSynth?.getVoices() || [];
      // Prefer high-pitch/cheerful female or child English voices
      const preferred = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Victoria') ||
            v.name.includes('Zira') ||
            v.name.includes('Google US English') ||
            v.name.includes('Karen'))
      );
      this.currentVoice = preferred || voices.find((v) => v.lang.startsWith('en')) || null;
    };

    load();
    if (this.speechSynth.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = load;
    }
  }

  private ensureAudioContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  public setTempo(bpm: number) {
    this.tempoBpm = bpm;
  }

  public start() {
    const ctx = this.ensureAudioContext();
    if (this.isPlayingAudio) return;
    this.isPlayingAudio = true;
    this.stepIndex = 0;
    this.scheduleNextBeat();
  }

  public stop() {
    this.isPlayingAudio = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.speechSynth) {
      this.speechSynth.cancel();
    }
  }

  private scheduleNextBeat() {
    if (!this.isPlayingAudio || !this.ctx) return;

    // Sixteenth note duration in seconds
    const beatDuration = 60 / this.tempoBpm;
    const stepDuration = beatDuration / 2; // 8th notes

    this.playStep(this.stepIndex);
    this.stepIndex++;

    this.timerId = window.setTimeout(() => {
      this.scheduleNextBeat();
    }, stepDuration * 1000);
  }

  // Play a musical step (drum, ukulele strum, xylophone lead)
  private playStep(step: number) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const beat = step % 8; // 8 eighth-notes = 4 beats per bar
    const bar = Math.floor(step / 8) % 4; // 4-bar chord progression

    // 1. Kick on beat 0 and beat 4 (1 and 3)
    if (beat === 0 || beat === 4) {
      this.playKick(now);
    }

    // 2. Cheerful Handclap on beats 2 and 6 (2 and 4)
    if (beat === 2 || beat === 6) {
      this.playClap(now);
    }

    // 3. Woodblock / percussion accents
    if (beat === 1 || beat === 3 || beat === 5 || beat === 7) {
      this.playWoodblock(now, beat % 4 === 3 ? 1200 : 900);
    }

    // 4. Ukulele chord strums on each beat (0, 2, 4, 6)
    if (beat % 2 === 0) {
      // Progression: C - G - Am - F
      const chords = [
        [261.63, 329.63, 392.0, 523.25], // C Major
        [246.94, 293.66, 392.0, 493.88], // G Major
        [220.0, 261.63, 329.63, 440.0],  // A Minor
        [261.63, 349.23, 440.0, 523.25], // F Major
      ];
      this.playUkuleleStrum(now, chords[bar]);
    }

    // 5. Xylophone nursery melody
    const melodyPattern = [
      // Bar 0: C major hook
      523.25, 659.25, 783.99, 659.25, 523.25, 0, 659.25, 783.99,
      // Bar 1: G major hook
      783.99, 880.0, 783.99, 659.25, 587.33, 0, 587.33, 659.25,
      // Bar 2: A minor bouncy
      880.0, 880.0, 783.99, 659.25, 523.25, 0, 523.25, 659.25,
      // Bar 3: F to C resolution
      698.46, 659.25, 587.33, 523.25, 523.25, 0, 783.99, 1046.5,
    ];
    const noteFreq = melodyPattern[step % 32];
    if (noteFreq > 0) {
      this.playXylophone(now, noteFreq);
    }
  }

  // Instrument 1: Cheerful Nursery Bass Kick
  private playKick(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, time);
    osc.frequency.exponentialRampToValueAtTime(36, time + 0.16);

    gain.gain.setValueAtTime(0.5 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  // Instrument 2: Hand Clap
  private playClap(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.12;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, time);
    filter.Q.setValueAtTime(2.5, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
  }

  // Instrument 3: Woodblock
  private playWoodblock(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.2 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.05);
  }

  // Instrument 4: Ukulele Plucked Strum
  private playUkuleleStrum(time: number, chord: number[]) {
    if (!this.ctx || !this.masterGain) return;
    chord.forEach((freq, idx) => {
      const strumDelay = idx * 0.015; // Realistic finger roll
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time + strumDelay);

      gain.gain.setValueAtTime(0.18 * this.volume, time + strumDelay);
      gain.gain.exponentialRampToValueAtTime(0.001, time + strumDelay + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(time + strumDelay);
      osc.stop(time + strumDelay + 0.35);
    });
  }

  // Instrument 5: Bright Xylophone / Glockenspiel
  private playXylophone(time: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const harm = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);

    // Bell harmonic (3x frequency)
    harm.type = 'sine';
    harm.frequency.setValueAtTime(freq * 3.0, time);

    gain.gain.setValueAtTime(0.3 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.32);

    osc.connect(gain);
    harm.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    harm.start(time);
    osc.stop(time + 0.32);
    harm.stop(time + 0.32);
  }

  // Spoken cheerful instruction using SpeechSynthesis
  public speakInstruction(text: string) {
    if (!this.speechSynth || text === this.lastSpokenCue) return;
    this.lastSpokenCue = text;

    try {
      this.speechSynth.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (this.currentVoice) utterance.voice = this.currentVoice;
      utterance.rate = 1.05; // Slightly upbeat
      utterance.pitch = 1.35; // Cheerful, child-friendly high pitch
      utterance.volume = this.volume;
      this.speechSynth.speak(utterance);
    } catch {
      // Ignore if speech is blocked
    }
  }

  // Sound Effect: Boing / Jump
  public playBoing() {
    const ctx = this.ensureAudioContext();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(780, now + 0.28);

    gain.gain.setValueAtTime(0.4 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc.connect(gain);
    gain.connect(this.masterGain!);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  // Sound Effect: Freeze crash cymbal
  public playFreezeCrash() {
    const ctx = this.ensureAudioContext();
    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.15));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3000, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.5 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain!);

    noise.start(now);
  }

  // Sound Effect: Character Giggle
  public playGiggle() {
    const ctx = this.ensureAudioContext();
    const notes = [659, 784, 880, 1046, 880, 1046];
    notes.forEach((freq, idx) => {
      const now = ctx.currentTime + idx * 0.06;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(now);
      osc.stop(now + 0.08);
    });
  }
}
