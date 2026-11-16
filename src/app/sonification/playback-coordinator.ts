import { Injectable, OnDestroy, signal } from '@angular/core';
import { FrameLoader } from './frame-loader';
import { extractFeatures, mapFeatures, STEP_SECONDS } from './feature-mapping';
import { WebAudioEngine } from './web-audio-engine';
import {
  ExtractedFeature,
  PlaybackState,
  ScientificFrame,
  ScientificRecord,
  SonificationEvent,
} from './sonification.types';

@Injectable()
export class PlaybackCoordinator implements OnDestroy {
  private readonly mutableState = signal<PlaybackState>({
    status: 'idle',
    sessionRevision: 0,
    selectedRecordId: null,
    currentFrameId: null,
    position: 0,
    duration: 0,
    volume: 0.3,
    muted: false,
    speed: 1,
    audioStatus: 'uninitialized',
    currentEvent: null,
    currentFeature: null,
    execution: null,
    error: null,
    announcement: 'Choose an image to prepare the sound.',
  });
  readonly state = this.mutableState.asReadonly();
  private readonly mutableFrame = signal<ScientificFrame | null>(null);
  readonly frame = this.mutableFrame.asReadonly();
  private readonly mutableGlobePoint = signal<{
    lat: number;
    lon: number;
  } | null>(null);
  readonly globePoint = this.mutableGlobePoint.asReadonly();
  private engine = new WebAudioEngine();
  private loader = new FrameLoader();
  private controller?: AbortController;
  private events: readonly SonificationEvent[] = [];
  private features: readonly ExtractedFeature[] = [];
  private revision = 0;
  private destroyed = false;
  private starting = false;

  async select(record: ScientificRecord, frameId: string): Promise<void> {
    if (this.destroyed) return;
    const revision = ++this.revision;
    this.starting = false;
    this.engine.pause();
    this.controller?.abort();
    const controller = (this.controller = new AbortController());
    this.events = [];
    this.features = [];
    this.mutableFrame.set(null);
    this.update({
      status: 'loading',
      sessionRevision: revision,
      selectedRecordId: record.id,
      currentFrameId: frameId,
      currentEvent: null,
      currentFeature: null,
      execution: null,
      position: 0,
      duration: 0,
      error: null,
      audioStatus: this.engine.audioStatus,
      announcement: 'Loading and verifying the NASA image.',
    });
    try {
      const frame = record.frames.find(
        (item) => item.id === frameId && item.recordId === record.id,
      );
      if (!frame)
        throw new Error('The selected image is not part of this record.');
      const pixels = await this.loader.load(frame, controller.signal);
      if (!this.accepts(revision)) return;
      const features = extractFeatures(pixels, {
        recordId: record.id,
        frameId: frame.id,
        resourceVersion: frame.sha256,
        roi: frame.roi,
        excludedRegions: frame.excludedRegions,
      });
      const events = mapFeatures(features);
      if (!events.length)
        throw new Error('This region has no valid pixels to sonify.');
      this.events = events;
      this.features = features;
      this.mutableFrame.set(frame);
      this.update({
        status: 'ready',
        currentFrameId: frame.id,
        duration: features.length * STEP_SECONDS,
        announcement: `${frame.observationYear} image ready. Press Play to hear its relative brightness.`,
      });
    } catch (error) {
      if (this.accepts(revision))
        this.fail(
          error instanceof Error
            ? error.message
            : 'Could not prepare the image.',
        );
    }
  }

  async play(): Promise<void> {
    const state = this.state();
    if (
      this.destroyed ||
      this.starting ||
      !['ready', 'paused', 'ended', 'error'].includes(state.status) ||
      !this.events.length ||
      !this.frame()
    )
      return;
    this.starting = true;
    const revision = ++this.revision;
    const position =
      state.status === 'ended' || state.position >= state.duration
        ? 0
        : state.position;
    this.update({
      sessionRevision: revision,
      status: 'paused',
      execution: null,
      error: null,
      announcement: 'Preparing audio output.',
    });
    this.engine.setVolume(state.volume, state.muted);
    try {
      await this.engine.play(this.events, {
        position,
        duration: state.duration,
        speed: state.speed,
        revision,
        onEvent: (event, scheduledAudioTimeSeconds) => {
          if (!this.accepts(revision)) return;
          this.update({
            currentEvent: event,
            currentFeature: event.featureSnapshot,
            execution: {
              eventId: event.id,
              sessionRevision: revision,
              scheduledAudioTimeSeconds,
              observedAudioTimeSeconds: this.engine.currentAudioTime,
              status: 'executed',
            },
          });
        },
        onPosition: (current) => {
          if (this.accepts(revision)) this.updatePosition(current);
        },
        onEnded: () => {
          if (this.accepts(revision))
            this.update({
              status: 'ended',
              position: state.duration,
              announcement: 'Scan complete. Press Play to start again.',
            });
        },
        onError: (message) => {
          if (this.accepts(revision)) this.fail(message);
        },
      });
      if (this.accepts(revision) && this.state().status !== 'error') {
        this.update({
          status: 'playing',
          position,
          audioStatus: this.engine.audioStatus,
          announcement: `Playing the ${this.frame()?.observationYear} image. This is a spatial scan, not observation time.`,
        });
      }
    } catch (error) {
      if (this.accepts(revision))
        this.fail(
          error instanceof Error
            ? error.message
            : 'The browser blocked audio. Press Play to try again.',
        );
    } finally {
      if (this.accepts(revision)) this.starting = false;
    }
  }

  pause(): void {
    if (this.state().status !== 'playing' && !this.starting) return;
    const position = this.engine.pause();
    this.starting = false;
    this.update({
      sessionRevision: ++this.revision,
      status: 'paused',
      position,
      audioStatus: this.engine.audioStatus,
      announcement: 'Audio paused. Position preserved.',
    });
  }

  stop(): void {
    if (!this.events.length || this.destroyed) return;
    this.engine.pause();
    this.starting = false;
    this.update({
      sessionRevision: ++this.revision,
      status: 'ready',
      position: 0,
      currentEvent: null,
      currentFeature: null,
      execution: null,
      audioStatus: this.engine.audioStatus,
      announcement: 'Scan reset. Press Play.',
    });
  }

  seek(value: number): void {
    if (!Number.isFinite(value) || !this.events.length || this.destroyed)
      return;
    this.engine.pause();
    this.starting = false;
    const position = Math.max(0, Math.min(this.state().duration, value));
    const currentFeature = this.featureAt(position);
    const currentEvent =
      this.events.find(
        (event) => event.origin.featureId === currentFeature?.id,
      ) ?? null;
    this.update({
      sessionRevision: ++this.revision,
      status: 'paused',
      position,
      currentEvent,
      currentFeature,
      execution: null,
      audioStatus: this.engine.audioStatus,
      announcement: 'Position changed; audio paused. Press Play to continue.',
    });
  }

  setVolume(volume: number): void {
    if (!Number.isFinite(volume)) return;
    volume = Math.max(0, Math.min(1, volume));
    this.engine.setVolume(volume, this.state().muted);
    this.update({ volume });
  }

  toggleMute(): void {
    const muted = !this.state().muted;
    this.engine.setVolume(this.state().volume, muted);
    this.update({
      muted,
      announcement: muted
        ? 'Sound muted. The reading continues.'
        : 'Sound unmuted.',
    });
  }

  setSpeed(speed: number): void {
    if (!Number.isFinite(speed)) return;
    speed = Math.max(0.5, Math.min(2, speed));
    // Changing speed pauses first, so the new clock never shares an old queue.
    this.pause();
    this.update({
      speed,
      announcement: `Speed ${speed} times. Press Play to continue.`,
    });
  }

  receiveGlobePoint(point: { lat: number; lon: number }): void {
    if (
      !Number.isFinite(point.lat) ||
      !Number.isFinite(point.lon) ||
      Math.abs(point.lat) > 90 ||
      Math.abs(point.lon) > 180
    )
      return;
    this.mutableGlobePoint.set({ ...point });
    // No geographic-to-pixel adapter: this source has no validated transform.
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    ++this.revision;
    this.controller?.abort();
    this.events = [];
    this.features = [];
    this.mutableFrame.set(null);
    void this.engine.destroy();
  }

  private accepts(revision: number): boolean {
    return !this.destroyed && revision === this.revision;
  }
  private featureAt(position: number): ExtractedFeature | null {
    return (
      this.features[
        Math.min(this.features.length - 1, Math.floor(position / STEP_SECONDS))
      ] ?? null
    );
  }
  private updatePosition(position: number): void {
    const currentFeature = this.featureAt(position);
    const changed =
      currentFeature?.id !== this.state().currentEvent?.origin.featureId;
    this.update({
      position,
      currentFeature,
      ...(changed ? { currentEvent: null, execution: null } : {}),
    });
  }
  private update(patch: Partial<PlaybackState>): void {
    this.mutableState.update((state) => ({ ...state, ...patch }));
  }
  private fail(message: string): void {
    const enginePosition = this.engine.pause();
    const position = this.frame() ? enginePosition : 0;
    this.starting = false;
    this.update({
      status: 'error',
      position,
      audioStatus: this.engine.audioStatus,
      error: message,
      announcement: message,
    });
  }
}
