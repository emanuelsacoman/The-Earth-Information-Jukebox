import { PlaybackCoordinator } from './playback-coordinator';
import { FrameLoader } from './frame-loader';
import { WebAudioEngine, AudioPlaybackOptions } from './web-audio-engine';
import { ScientificRecord, SonificationEvent } from './sonification.types';

// Synthetic fixtures: these are deliberately separate from the NASA catalog.
const record: ScientificRecord = {
  id: 'synthetic', schemaVersion: 1, title: 'Synthetic test', description: 'Fixture',
  originUrl: 'https://example.test', credits: 'Fixture', usageUrl: 'https://example.test', limitations: 'Synthetic',
  frames: ['a', 'b'].map((id, order) => ({ id, order, recordId: 'synthetic', observationYear: 2020 + order,
    resourceUrl: id, sourceUrl: 'https://example.test', width: 24, height: 8,
    sha256: 'synthetic-test', roi: { x: 0, y: 0, width: 24, height: 8 } })),
};
function pixels() {
  return { width: 24, height: 8, data: new Uint8ClampedArray(24 * 8 * 4).fill(128) };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

describe('PlaybackCoordinator', () => {
  let coordinator: PlaybackCoordinator;
  let load: jasmine.Spy;
  let play: jasmine.Spy;
  let pause: jasmine.Spy;
  let volume: jasmine.Spy;
  let destroy: jasmine.Spy;
  let callbacks: AudioPlaybackOptions;
  let events: readonly SonificationEvent[];

  beforeEach(() => {
    load = spyOn(FrameLoader.prototype, 'load').and.resolveTo(pixels());
    play = spyOn(WebAudioEngine.prototype, 'play').and.callFake(async (sequence, options) => {
      events = sequence;
      callbacks = options;
    });
    pause = spyOn(WebAudioEngine.prototype, 'pause').and.returnValue(1.2);
    volume = spyOn(WebAudioEngine.prototype, 'setVolume');
    destroy = spyOn(WebAudioEngine.prototype, 'destroy');
    coordinator = new PlaybackCoordinator();
  });
  afterEach(() => coordinator.ngOnDestroy());

  it('prepares the selected frame and traceable extraction without starting audio', async () => {
    await coordinator.select(record, 'a');
    expect(coordinator.state().status).toBe('ready');
    expect(coordinator.frame()?.id).toBe('a');
    expect(play).not.toHaveBeenCalled();
    expect(coordinator.state().duration).toBeCloseTo(192 * 0.24);
    await coordinator.play();
    expect(events.length).toBe(192);
    expect(events[0].origin.frameId).toBe('a');
    expect(events[0].origin.resourceVersion).toBe('synthetic-test');
  });

  it('never indicates playing before the engine accepts initialization', async () => {
    const pending = deferred<void>();
    play.and.returnValue(pending.promise);
    await coordinator.select(record, 'a');
    const started = coordinator.play();
    expect(coordinator.state().status).toBe('paused');
    void coordinator.play();
    expect(play).toHaveBeenCalledTimes(1);
    pending.resolve();
    await started;
    expect(coordinator.state().status).toBe('playing');
  });

  it('ignores an old load after a newer source has been accepted and aborts its signal', async () => {
    const pending = deferred<ReturnType<typeof pixels>>();
    load.and.returnValues(pending.promise, Promise.resolve(pixels()));
    const old = coordinator.select(record, 'a');
    const oldSignal = load.calls.argsFor(0)[1] as AbortSignal;
    await coordinator.select(record, 'b');
    pending.resolve(pixels());
    await old;
    expect(oldSignal.aborted).toBeTrue();
    expect(coordinator.frame()?.id).toBe('b');
    expect(coordinator.state().currentFrameId).toBe('b');
  });

  it('rejects old callbacks and pending play completion after a source change', async () => {
    await coordinator.select(record, 'a');
    await coordinator.play();
    const old = callbacks;
    const oldEvent = events[0];
    await coordinator.select(record, 'b');
    old.onEvent(oldEvent, 4);
    old.onPosition(20);
    old.onEnded();
    old.onError('obsolete');
    expect(coordinator.state().status).toBe('ready');
    expect(coordinator.state().position).toBe(0);
    expect(coordinator.state().currentEvent).toBeNull();
    expect(coordinator.state().error).toBeNull();
  });

  it('preserves the engine position at pause and resumes without replaying the old origin', async () => {
    await coordinator.select(record, 'a');
    await coordinator.play();
    const old = callbacks;
    callbacks.onEvent(events[0], 2);
    coordinator.pause();
    expect(coordinator.state().position).toBe(1.2);
    expect(coordinator.state().status).toBe('paused');
    old.onEnded();
    await coordinator.play();
    expect(play.calls.mostRecent().args[1].position).toBe(1.2);
    expect(callbacks.revision).not.toBe(old.revision);
    expect(pause).toHaveBeenCalled();
  });

  it('supports seek, replay from ended, stop and real parameter forwarding', async () => {
    await coordinator.select(record, 'a');
    coordinator.seek(4.8);
    expect(coordinator.state().status).toBe('paused');
    expect(coordinator.state().currentEvent?.timelineOffsetSeconds).toBeLessThanOrEqual(4.8);
    coordinator.setVolume(0.7);
    coordinator.toggleMute();
    expect(volume.calls.mostRecent().args).toEqual([0.7, true]);
    coordinator.toggleMute();
    expect(volume.calls.mostRecent().args).toEqual([0.7, false]);
    await coordinator.play();
    coordinator.setSpeed(2);
    expect(coordinator.state().status).toBe('paused');
    await coordinator.play();
    expect(callbacks.speed).toBe(2);
    callbacks.onEnded();
    await coordinator.play();
    expect(callbacks.position).toBe(0);
    coordinator.stop();
    expect(coordinator.state().position).toBe(0);
    expect(coordinator.state().currentEvent).toBeNull();
  });

  it('keeps the current reading synchronized to the accepted engine event', async () => {
    await coordinator.select(record, 'b');
    await coordinator.play();
    callbacks.onPosition(0.48);
    callbacks.onEvent(events[2], 10.48);
    expect(coordinator.state().currentEvent?.origin.frameId).toBe(coordinator.frame()?.id);
    expect(coordinator.state().currentEvent?.textDescription).toContain('brilho relativo');
    expect(coordinator.state().position).toBe(0.48);
    expect(coordinator.state().execution?.scheduledAudioTimeSeconds).toBe(10.48);
    expect(coordinator.state().execution?.sessionRevision).toBe(callbacks.revision);
  });

  it('clears the previous reading during a missing cell, including after seek', async () => {
    const missing = pixels();
    missing.data[24 * 4 + 3] = 0; // Synthetic cell 1: column 0, row 1.
    load.and.resolveTo(missing);
    await coordinator.select(record, 'a');
    await coordinator.play();
    callbacks.onEvent(events[0], 0);
    callbacks.onPosition(0.24);
    expect(coordinator.state().currentEvent).toBeNull();
    expect(coordinator.state().execution).toBeNull();
    expect(coordinator.state().currentFeature?.validity).toBe('missing');
    coordinator.seek(0.24);
    expect(coordinator.state().currentEvent).toBeNull();
    expect(coordinator.state().currentFeature?.validity).toBe('missing');
  });

  it('does not carry the previous engine position into a failed new load', async () => {
    await coordinator.select(record, 'a');
    await coordinator.play();
    pause.and.returnValue(20);
    load.and.rejectWith(new Error('Unavailable'));
    await coordinator.select(record, 'b');
    expect(coordinator.state().status).toBe('error');
    expect(coordinator.state().position).toBe(0);
  });

  it('blocks play on missing assets or a completely masked image and permits reselecting', async () => {
    load.and.rejectWith(new Error('Imagem indisponível'));
    await coordinator.select(record, 'a');
    await coordinator.play();
    expect(play).not.toHaveBeenCalled();
    expect(coordinator.state().status).toBe('error');
    load.and.resolveTo(pixels());
    const masked = { ...record, frames: [{ ...record.frames[0], excludedRegions: [{ x: 0, y: 0, width: 24, height: 8 }] }] };
    await coordinator.select(masked, 'a');
    expect(coordinator.state().status).toBe('error');
    await coordinator.select(record, 'a');
    expect(coordinator.state().status).toBe('ready');
  });

  it('does not keep a false playing state after rejected or suspended audio', async () => {
    await coordinator.select(record, 'a');
    play.and.rejectWith(new Error('Áudio bloqueado'));
    await coordinator.play();
    expect(coordinator.state().status).toBe('error');
    expect(coordinator.state().error).toContain('bloqueado');
    play.and.callFake(async (sequence, options) => { events = sequence; callbacks = options; });
    await coordinator.select(record, 'a');
    await coordinator.play();
    callbacks.onError('Contexto suspenso');
    expect(coordinator.state().status).toBe('error');
  });

  it('invalidates pending load, callbacks and audio when the experience is destroyed', async () => {
    const pending = deferred<ReturnType<typeof pixels>>();
    load.and.returnValue(pending.promise);
    const loading = coordinator.select(record, 'a');
    const signal = load.calls.mostRecent().args[1] as AbortSignal;
    coordinator.ngOnDestroy();
    pending.resolve(pixels());
    await loading;
    expect(signal.aborted).toBeTrue();
    expect(destroy).toHaveBeenCalled();
    expect(coordinator.frame()).toBeNull();
    await coordinator.play();
    expect(play).not.toHaveBeenCalled();
  });

  it('receives valid globe coordinates without generating a scientific audio event', async () => {
    coordinator.receiveGlobePoint({ lat: -3, lon: -60 });
    expect(coordinator.globePoint()).toEqual({ lat: -3, lon: -60 });
    coordinator.receiveGlobePoint({ lat: 100, lon: NaN });
    expect(coordinator.globePoint()).toEqual({ lat: -3, lon: -60 });
    expect(play).not.toHaveBeenCalled();
    expect(load).not.toHaveBeenCalled();
    expect(coordinator.state().currentEvent).toBeNull();
  });
});
