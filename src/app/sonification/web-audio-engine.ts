import { SonificationEvent } from './sonification.types';

export interface AudioPlaybackOptions {
  position: number;
  duration: number;
  speed: number;
  revision: number;
  onEvent: (event: SonificationEvent, scheduledAudioTimeSeconds: number) => void;
  onPosition: (position: number) => void;
  onEnded: () => void;
  onError: (message: string) => void;
}

export const AUDIO_POLICY = {
  minFrequencyHz: 100,
  maxFrequencyHz: 1600,
  maxVoiceGain: 0.2,
  maxVoices: 4,
  minDurationSeconds: 0.04,
  maxDurationSeconds: 1,
  lookaheadSeconds: 0.1,
  tickMilliseconds: 25,
  leadSeconds: 0.025,
  attackSeconds: 0.008,
  releaseSeconds: 0.015,
  cancellationSeconds: 0.008,
} as const;

interface Voice {
  oscillator: OscillatorNode;
  gain: GainNode;
  panner: StereoPannerNode;
  start: number;
  end: number;
  peak: number;
  cancelled: boolean;
}

interface Session {
  events: readonly SonificationEvent[];
  options: AudioPlaybackOptions;
  anchor: number;
  nextIndex: number;
  pending: { event: SonificationEvent; time: number; end: number }[];
}

function browserContext(): AudioContext {
  if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') {
    throw new Error('Este navegador não oferece Web Audio. Use um navegador compatível.');
  }
  return new window.AudioContext();
}

/** Browser adapter: constructors do not touch browser globals or create audio. */
export class WebAudioEngine {
  private context?: AudioContext;
  private master?: GainNode;
  private session?: Session;
  private timer?: ReturnType<typeof setInterval>;
  private readonly voices = new Set<Voice>();
  private generation = 0;
  private disposed = false;
  private positionValue = 0;
  private volume = 0.3;
  private muted = false;
  private unavailable = false;

  constructor(private readonly contextFactory: () => AudioContext = browserContext) {}

  get audioStatus(): 'uninitialized' | AudioContextState | 'unavailable' {
    return this.context?.state ?? (this.unavailable ? 'unavailable' : 'uninitialized');
  }

  get currentAudioTime(): number | null { return this.context?.currentTime ?? null; }

  get position(): number {
    const session = this.session;
    if (!session || !this.context) return this.positionValue;
    return Math.min(session.options.duration, Math.max(session.options.position,
      session.options.position + (this.context.currentTime - session.anchor) * session.options.speed));
  }

  get diagnostics(): { activeVoices: number; allocatedVoices: number; schedulerActive: boolean } {
    return {
      activeVoices: [...this.voices].filter(voice => !voice.cancelled).length,
      allocatedVoices: this.voices.size,
      schedulerActive: this.timer !== undefined,
    };
  }

  async play(events: readonly SonificationEvent[], options: AudioPlaybackOptions): Promise<void> {
    if (this.disposed) throw new Error('A experiência de áudio já foi encerrada.');
    this.pause();
    this.validate(events, options);
    // Accept the new logical position before resume can yield. A pause while
    // activation is pending must preserve this selection, not the last source.
    this.positionValue = options.position;
    const generation = this.generation;
    let context: AudioContext;
    try {
      // Synchronous, before the first await: preserve the user's activation.
      context = this.ensureContext();
      if (context.state === 'suspended') await context.resume();
      if (generation !== this.generation || this.disposed) return;
      if (context.state !== 'running') {
        throw new Error('O navegador bloqueou ou suspendeu o áudio. Pressione Reproduzir para tentar novamente.');
      }
      this.session = {
        events,
        options,
        anchor: context.currentTime + AUDIO_POLICY.leadSeconds,
        nextIndex: events.findIndex(event => event.timelineOffsetSeconds >= options.position),
        pending: [],
      };
      if (this.session.nextIndex < 0) this.session.nextIndex = events.length;
      this.tick(generation);
      if (this.session && generation === this.generation) {
        this.timer = setInterval(() => {
          if (generation !== this.generation) return;
          try { this.tick(generation); }
          catch { this.fail('Não foi possível continuar a síntese. Pressione Reproduzir para tentar novamente.'); }
        }, AUDIO_POLICY.tickMilliseconds);
      }
    } catch (error) {
      if (generation !== this.generation || this.disposed) return;
      this.pause();
      throw error;
    }
  }

  pause(): number {
    this.positionValue = this.position;
    this.generation++;
    if (this.timer !== undefined) clearInterval(this.timer);
    this.timer = undefined;
    this.session = undefined;
    this.cancelVoices(false);
    return this.positionValue;
  }

  setVolume(value: number, muted: boolean): void {
    this.volume = Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0.3;
    this.muted = muted;
    if (!this.master || !this.context || this.context.state === 'closed') return;
    const parameter = this.master.gain;
    const now = this.context.currentTime;
    this.hold(parameter, now, parameter.value);
    parameter.linearRampToValueAtTime(this.muted ? 0 : this.volume, now + 0.015);
  }

  destroy(): void {
    if (this.disposed) return;
    this.pause();
    this.disposed = true;
    this.cancelVoices(true);
    this.master?.disconnect();
    if (this.context) {
      this.context.onstatechange = null;
      if (this.context.state !== 'closed') void this.context.close().catch(() => undefined);
    }
  }

  private ensureContext(): AudioContext {
    if (this.context) {
      if (this.context.state === 'closed') throw new Error('O contexto de áudio foi encerrado. Recarregue a página.');
      return this.context;
    }
    let context: AudioContext | undefined;
    try {
      context = this.contextFactory();
      const master = context.createGain();
      master.gain.setValueAtTime(this.muted ? 0 : this.volume, context.currentTime);
      master.connect(context.destination);
      this.context = context;
      this.master = master;
      this.unavailable = false;
      context.onstatechange = () => {
        if (this.session && context?.state !== 'running') {
          this.fail('O navegador suspendeu o áudio. Pressione Reproduzir para retomar.');
        }
      };
      return context;
    } catch (error) {
      this.unavailable = true;
      if (context && context.state !== 'closed') void context.close().catch(() => undefined);
      throw error;
    }
  }

  private tick(generation: number): void {
    const session = this.session;
    const context = this.context;
    if (!session || !context || generation !== this.generation) return;
    if (context.state !== 'running') {
      this.fail('O navegador suspendeu o áudio. Pressione Reproduzir para retomar.');
      return;
    }
    const now = context.currentTime;
    while (session.nextIndex < session.events.length) {
      const event = session.events[session.nextIndex];
      const time = session.anchor + (event.timelineOffsetSeconds - session.options.position) / session.options.speed;
      if (time > now + AUDIO_POLICY.lookaheadSeconds) break;
      session.nextIndex++;
      // A throttled tab must never burst old events on returning to the foreground.
      if (time < now - 0.025) continue;
      const end = time + event.durationSeconds / session.options.speed;
      this.schedule(event, Math.max(now, time), end);
      session.pending.push({ event, time: Math.max(now, time), end });
    }
    while (session.pending.length && session.pending[0].time <= now) {
      const pending = session.pending.shift()!;
      if (pending.end > now) session.options.onEvent(pending.event, pending.time);
      if (generation !== this.generation) return;
    }
    session.options.onPosition(this.position);
    if (generation !== this.generation) return;
    if (this.position >= session.options.duration) {
      const onEnded = session.options.onEnded;
      this.pause();
      onEnded();
    }
  }

  private schedule(event: SonificationEvent, start: number, end: number): void {
    const context = this.context!;
    // Ended callbacks can arrive after a busy main thread catches up.
    for (const voice of this.voices) if (voice.end <= context.currentTime) this.release(voice);
    if (this.voices.size >= AUDIO_POLICY.maxVoices) throw new Error('Limite de vozes simultâneas atingido.');
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const panner = context.createStereoPanner();
    const voice: Voice = { oscillator, gain, panner, start, end, peak: event.intensity, cancelled: false };
    this.voices.add(voice);
    oscillator.onended = () => this.release(voice);
    try {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(event.frequencyHz, start);
      panner.pan.setValueAtTime(event.pan, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(event.intensity, start + AUDIO_POLICY.attackSeconds);
      gain.gain.setValueAtTime(event.intensity, Math.max(start + AUDIO_POLICY.attackSeconds, end - AUDIO_POLICY.releaseSeconds));
      gain.gain.linearRampToValueAtTime(0, end);
      oscillator.connect(gain);
      gain.connect(panner);
      panner.connect(this.master!);
      oscillator.start(start);
      oscillator.stop(end);
    } catch (error) {
      try { oscillator.stop(); } catch { /* The source may not have started. */ }
      this.release(voice);
      throw error;
    }
  }

  private cancelVoices(immediate: boolean): void {
    const context = this.context;
    if (!context) return;
    const now = context.currentTime;
    for (const voice of this.voices) {
      if (voice.cancelled && !immediate) continue;
      voice.cancelled = true;
      if (immediate || context.state !== 'running' || voice.start > now || voice.end <= now) {
        voice.gain.gain.cancelScheduledValues(now);
        voice.gain.gain.setValueAtTime(0, now);
        try { voice.oscillator.stop(now); } catch { /* Already stopped. */ }
        this.release(voice);
      } else {
        const attack = Math.min(1, Math.max(0, (now - voice.start) / AUDIO_POLICY.attackSeconds));
        const release = Math.min(1, Math.max(0, (voice.end - now) / AUDIO_POLICY.releaseSeconds));
        this.hold(voice.gain.gain, now, voice.peak * Math.min(attack, release));
        voice.gain.gain.linearRampToValueAtTime(0, now + AUDIO_POLICY.cancellationSeconds);
        voice.end = now + AUDIO_POLICY.cancellationSeconds;
        try { voice.oscillator.stop(voice.end); } catch { this.release(voice); }
      }
    }
  }

  private hold(parameter: AudioParam, time: number, fallbackValue: number): void {
    if (typeof parameter.cancelAndHoldAtTime === 'function') parameter.cancelAndHoldAtTime(time);
    else {
      parameter.cancelScheduledValues(time);
      parameter.setValueAtTime(fallbackValue, time);
    }
  }

  private release(voice: Voice): void {
    voice.oscillator.onended = null;
    voice.oscillator.disconnect();
    voice.gain.disconnect();
    voice.panner.disconnect();
    this.voices.delete(voice);
  }

  private fail(message: string): void {
    const onError = this.session?.options.onError;
    this.pause();
    onError?.(message);
  }

  private validate(events: readonly SonificationEvent[], options: AudioPlaybackOptions): void {
    if (!Number.isFinite(options.duration) || options.duration <= 0 || !Number.isFinite(options.position) ||
      options.position < 0 || options.position > options.duration || !Number.isFinite(options.speed) ||
      options.speed < 0.5 || options.speed > 2 || !Number.isSafeInteger(options.revision) || options.revision < 0 || !events.length) {
      throw new Error('A varredura não possui parâmetros de reprodução válidos.');
    }
    let previous = -1;
    for (const event of events) {
      const values = [event.frequencyHz, event.intensity, event.durationSeconds, event.timelineOffsetSeconds, event.pan];
      if (!values.every(Number.isFinite) || event.frequencyHz < AUDIO_POLICY.minFrequencyHz ||
        event.frequencyHz > AUDIO_POLICY.maxFrequencyHz || event.intensity < 0 || event.intensity > AUDIO_POLICY.maxVoiceGain ||
        event.durationSeconds < AUDIO_POLICY.minDurationSeconds || event.durationSeconds > AUDIO_POLICY.maxDurationSeconds ||
        event.timelineOffsetSeconds < previous || event.timelineOffsetSeconds < 0 ||
        event.timelineOffsetSeconds + event.durationSeconds > options.duration + 0.000001 || Math.abs(event.pan) > 1 ||
        event.featureSnapshot.validity !== 'valid') {
        throw new Error('Há um evento sonoro inválido. Selecione novamente a visualização.');
      }
      previous = event.timelineOffsetSeconds;
    }
  }
}
