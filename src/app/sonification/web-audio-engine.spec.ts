import { SonificationEvent } from './sonification.types';
import { AUDIO_POLICY, AudioPlaybackOptions, WebAudioEngine } from './web-audio-engine';

class ParameterMock {
  value = 0;
  readonly setValueAtTime = jasmine.createSpy('setValueAtTime').and.callFake((value: number) => { this.value = value; return this; });
  readonly linearRampToValueAtTime = jasmine.createSpy('linearRampToValueAtTime').and.callFake((value: number) => { this.value = value; return this; });
  readonly cancelScheduledValues = jasmine.createSpy('cancelScheduledValues');
  readonly cancelAndHoldAtTime = jasmine.createSpy('cancelAndHoldAtTime');
}

class NodeMock {
  readonly connect = jasmine.createSpy('connect');
  readonly disconnect = jasmine.createSpy('disconnect');
}

class GainMock extends NodeMock { readonly gain = new ParameterMock(); }
class PannerMock extends NodeMock { readonly pan = new ParameterMock(); }
class OscillatorMock extends NodeMock {
  readonly frequency = new ParameterMock();
  type = '';
  onended: (() => void) | null = null;
  endedAt = Infinity;
  readonly start = jasmine.createSpy('start');
  readonly stop = jasmine.createSpy('stop').and.callFake((time = 0) => { this.endedAt = time; });
  finish(time: number): void {
    if (this.endedAt <= time) this.onended?.();
  }
}

class ContextMock {
  currentTime = 0;
  state: AudioContextState = 'suspended';
  readonly destination = new NodeMock();
  onstatechange: (() => void) | null = null;
  readonly gains: GainMock[] = [];
  readonly panners: PannerMock[] = [];
  readonly oscillators: OscillatorMock[] = [];
  readonly createGain = jasmine.createSpy('createGain').and.callFake(() => {
    const node = new GainMock(); this.gains.push(node); return node;
  });
  readonly createOscillator = jasmine.createSpy('createOscillator').and.callFake(() => {
    const node = new OscillatorMock(); this.oscillators.push(node); return node;
  });
  readonly createStereoPanner = jasmine.createSpy('createStereoPanner').and.callFake(() => {
    const node = new PannerMock(); this.panners.push(node); return node;
  });
  readonly resume = jasmine.createSpy('resume').and.callFake(async () => { this.state = 'running'; });
  readonly close = jasmine.createSpy('close').and.callFake(async () => { this.state = 'closed'; });
  changeState(state: AudioContextState): void { this.state = state; this.onstatechange?.(); }
  advance(seconds: number): void {
    const steps = Math.round(seconds / 0.025);
    for (let index = 0; index < steps; index++) {
      this.currentTime = Math.round((this.currentTime + 0.025) * 1000000) / 1000000;
      this.oscillators.forEach(node => node.finish(this.currentTime));
      jasmine.clock().tick(25);
    }
  }
}

/** Deliberately synthetic fixture: no NASA measurement is encoded here. */
function event(offset = 0, index = 0): SonificationEvent {
  return {
    id: `synthetic-${index}`, origin: {
      recordId: 'synthetic', frameId: 'fixture', featureId: `feature-${index}`,
      resourceVersion: 'fixture-v1', extractionMethod: 'synthetic-v1',
    },
    featureSnapshot: {
      id: `feature-${index}`, recordId: 'synthetic', frameId: 'fixture', resourceVersion: 'fixture-v1',
      index, kind: 'relative-image-brightness', domain: 'visual-pixel', rawValue: 128,
      normalizedValue: 128 / 255, validity: 'valid', extent: {x: 0, y: 0, width: 1, height: 1},
      position: {x: 0.5, y: 0.5}, extractionMethod: 'synthetic-v1',
    },
    mappingVersion: 'synthetic-v1', frequencyHz: 440, note: 'A4', intensity: 0.1,
    durationSeconds: 0.18, timelineOffsetSeconds: offset, pan: -0.5,
    textDescription: 'Fixture sintética identificada para teste.',
  };
}

describe('WebAudioEngine', () => {
  let context: ContextMock;
  let factory: jasmine.Spy;
  let engine: WebAudioEngine;
  let options: AudioPlaybackOptions;

  beforeEach(() => {
    jasmine.clock().install();
    context = new ContextMock();
    factory = jasmine.createSpy('contextFactory').and.returnValue(context as unknown as AudioContext);
    engine = new WebAudioEngine(factory);
    options = {
      position: 0, duration: 1, speed: 1, revision: 1,
      onEvent: jasmine.createSpy('onEvent'), onPosition: jasmine.createSpy('onPosition'),
      onEnded: jasmine.createSpy('onEnded'), onError: jasmine.createSpy('onError'),
    };
  });

  afterEach(() => { engine.destroy(); jasmine.clock().uninstall(); });

  it('does not instantiate browser APIs until play and initializes only one context', async () => {
    expect(factory).not.toHaveBeenCalled();
    expect(engine.audioStatus).toBe('uninitialized');
    await engine.play([event()], options);
    expect(context.resume).toHaveBeenCalledTimes(1);
    engine.pause();
    await engine.play([event()], options);
    expect(factory).toHaveBeenCalledTimes(1);
    expect(engine.audioStatus).toBe('running');
    expect(engine.diagnostics.schedulerActive).toBeTrue();
  });

  it('synthesizes the traced event through envelope, stereo pan and master gain', async () => {
    const note = event();
    await engine.play([note], options);
    const oscillator = context.oscillators[0];
    const envelope = context.gains[1];
    expect(oscillator.type).toBe('sine');
    expect(oscillator.frequency.setValueAtTime).toHaveBeenCalledWith(440, 0.025);
    expect(oscillator.start).toHaveBeenCalledWith(0.025);
    expect(oscillator.stop.calls.mostRecent().args[0]).toBeCloseTo(0.205);
    expect(envelope.gain.setValueAtTime).toHaveBeenCalledWith(0, 0.025);
    expect(envelope.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.1, 0.033);
    expect(envelope.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.205);
    expect(context.panners[0].pan.setValueAtTime).toHaveBeenCalledWith(-0.5, 0.025);
    expect(oscillator.connect).toHaveBeenCalledWith(envelope);
    expect(envelope.connect).toHaveBeenCalledWith(context.panners[0]);
    expect(context.panners[0].connect).toHaveBeenCalledWith(context.gains[0]);
    expect(context.gains[0].connect).toHaveBeenCalledWith(context.destination);
    expect(options.onEvent).not.toHaveBeenCalled();
    context.advance(0.025);
    expect(options.onEvent).toHaveBeenCalledOnceWith(note, 0.025);
  });

  it('uses a short scheduling horizon and releases all nodes when each source ends', async () => {
    await engine.play([event(), event(0.5, 1)], options);
    expect(context.oscillators.length).toBe(1);
    context.advance(0.25);
    expect(engine.diagnostics.allocatedVoices).toBe(0);
    expect(context.oscillators[0].disconnect).toHaveBeenCalledTimes(1);
    expect(context.gains[1].disconnect).toHaveBeenCalledTimes(1);
    expect(context.panners[0].disconnect).toHaveBeenCalledTimes(1);
    context.advance(0.2);
    expect(context.oscillators.length).toBe(2);
  });

  it('pauses at the audio clock position, fades the active note and cancels future sources', async () => {
    await engine.play([event(), event(0.12, 1)], options);
    context.advance(0.075);
    expect(context.oscillators.length).toBe(2);
    expect(engine.pause()).toBeCloseTo(0.05);
    expect(engine.diagnostics.schedulerActive).toBeFalse();
    expect(context.gains[1].gain.cancelAndHoldAtTime).toHaveBeenCalledWith(0.075);
    expect(context.gains[1].gain.linearRampToValueAtTime.calls.mostRecent().args[0]).toBe(0);
    expect(context.gains[1].gain.linearRampToValueAtTime.calls.mostRecent().args[1]).toBeCloseTo(0.083);
    expect(context.gains[2].gain.setValueAtTime).toHaveBeenCalledWith(0, 0.075);
    expect(context.oscillators[1].stop.calls.mostRecent().args[0]).toBe(0.075);
    context.advance(0.5);
    expect(options.onEvent).toHaveBeenCalledTimes(1);
    expect(engine.diagnostics.allocatedVoices).toBe(0);
  });

  it('resumes at the preserved position without replaying prior notes or adding schedulers', async () => {
    const notes = [event(), event(0.24, 1), event(0.48, 2)];
    await engine.play(notes, options);
    context.advance(0.125);
    const position = engine.pause();
    context.advance(0.1);
    const laterOptions = {...options, position, revision: 2};
    await engine.play(notes, laterOptions);
    context.advance(0.2);
    expect(options.onEvent).toHaveBeenCalledTimes(2);
    expect((options.onEvent as jasmine.Spy).calls.mostRecent().args[0].id).toBe('synthetic-1');
    expect(context.oscillators.filter(node => node.frequency.setValueAtTime.calls.count() > 0).length).toBe(2);
    expect(engine.diagnostics.schedulerActive).toBeTrue();
  });

  it('volume and mute change actual master automation while retaining the chosen volume', async () => {
    engine.setVolume(0.7, false);
    await engine.play([event()], options);
    expect(context.gains[0].gain.setValueAtTime).toHaveBeenCalledWith(0.7, 0);
    engine.setVolume(0.7, true);
    expect(context.gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.015);
    engine.setVolume(0.7, false);
    expect(context.gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.7, 0.015);
    engine.setVolume(10, false);
    expect(context.gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, 0.015);
    engine.setVolume(NaN, false);
    expect(context.gains[0].gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.3, 0.015);
  });

  it('speed changes event spacing and envelope duration without changing pitch', async () => {
    await engine.play([event(), event(0.24, 1)], {...options, speed: 2});
    expect(context.oscillators[0].stop.calls.mostRecent().args[0]).toBeCloseTo(0.115);
    context.advance(0.05);
    expect(context.oscillators[1].start.calls.mostRecent().args[0]).toBeCloseTo(0.145);
    expect(context.oscillators[1].frequency.setValueAtTime.calls.mostRecent().args[0]).toBe(440);
    context.advance(0.075);
    expect(engine.position).toBeCloseTo(0.2);
  });

  it('completes ten play/pause cycles using one context and no orphaned sources', async () => {
    for (let cycle = 0; cycle < 10; cycle++) {
      await engine.play([event()], {...options, revision: cycle});
      context.advance(0.075);
      engine.setVolume(cycle / 10, cycle % 2 === 0);
      engine.pause();
      context.advance(0.025);
      expect(engine.diagnostics).toEqual({activeVoices: 0, allocatedVoices: 0, schedulerActive: false});
    }
    expect(factory).toHaveBeenCalledTimes(1);
    expect(context.oscillators.length).toBe(10);
    expect(context.oscillators.every(node => node.disconnect.calls.count() === 1)).toBeTrue();
  });

  it('ends once at the logical duration and stops the scheduler', async () => {
    await engine.play([event()], {...options, duration: 0.25});
    context.advance(0.3);
    expect(options.onEnded).toHaveBeenCalledTimes(1);
    expect(engine.position).toBe(0.25);
    expect(engine.diagnostics.schedulerActive).toBeFalse();
    context.advance(0.3);
    expect(options.onEnded).toHaveBeenCalledTimes(1);
  });

  it('reports suspension, stops scheduling and resumes the same context after another play', async () => {
    await engine.play([event(), event(0.5, 1)], options);
    context.advance(0.075);
    context.changeState('suspended');
    expect(options.onError).toHaveBeenCalledTimes(1);
    expect(engine.audioStatus).toBe('suspended');
    expect(engine.diagnostics).toEqual({activeVoices: 0, allocatedVoices: 0, schedulerActive: false});
    await engine.play([event()], options);
    expect(context.resume).toHaveBeenCalledTimes(2);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('handles factory failure and rejects invalid or missing event data before initialization', async () => {
    await expectAsync(engine.play([], options)).toBeRejected();
    await expectAsync(engine.play([{...event(), frequencyHz: NaN}], options)).toBeRejected();
    await expectAsync(engine.play([{...event(), intensity: 0.21}], options)).toBeRejected();
    await expectAsync(engine.play([event(0.5), event()], options)).toBeRejected();
    await expectAsync(engine.play([event()], {...options, speed: Infinity})).toBeRejected();
    expect(factory).not.toHaveBeenCalled();
    factory.and.throwError('Unavailable');
    await expectAsync(engine.play([event()], options)).toBeRejectedWithError('Unavailable');
    expect(engine.audioStatus).toBe('unavailable');
    expect(engine.diagnostics.schedulerActive).toBeFalse();
  });

  it('does not claim playback when resume rejects or leaves the context suspended', async () => {
    context.resume.and.rejectWith(new Error('Blocked'));
    await expectAsync(engine.play([event()], options)).toBeRejectedWithError('Blocked');
    expect(context.oscillators.length).toBe(0);
    context.resume.and.resolveTo();
    await expectAsync(engine.play([event()], options)).toBeRejected();
    expect(engine.diagnostics.schedulerActive).toBeFalse();
  });

  it('invalidates a pending resume on pause, repeated play and destruction', async () => {
    let releaseResume!: () => void;
    context.resume.and.callFake(() => new Promise<void>(resolve => { releaseResume = resolve; }));
    const stale = engine.play([event()], options);
    engine.pause();
    context.state = 'running';
    releaseResume();
    await stale;
    expect(context.oscillators.length).toBe(0);
    context.state = 'suspended';
    const destroyed = engine.play([event()], options);
    engine.destroy();
    releaseResume();
    await destroyed;
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(engine.diagnostics.schedulerActive).toBeFalse();
    expect(context.oscillators.length).toBe(0);
  });

  it('accepts only the latest of two overlapping play attempts', async () => {
    const resolvers: (() => void)[] = [];
    context.resume.and.callFake(() => new Promise<void>(resolve => { resolvers.push(resolve); }));
    const oldOptions = {...options, onEvent: jasmine.createSpy('oldEvent')};
    const first = engine.play([event()], oldOptions);
    const second = engine.play([event(0, 1)], {...options, revision: 2});
    context.state = 'running';
    resolvers[1]();
    await second;
    resolvers[0]();
    await first;
    context.advance(0.05);
    expect(oldOptions.onEvent).not.toHaveBeenCalled();
    expect(options.onEvent).toHaveBeenCalledTimes(1);
    expect(context.oscillators.length).toBe(1);
    expect(factory).toHaveBeenCalledTimes(1);
  });

  it('preserves the new source position when paused during a pending resume', async () => {
    context.state = 'running';
    await engine.play([event(20)], {...options, position: 20, duration: 30});
    expect(engine.pause()).toBe(20);
    context.changeState('suspended');
    let releaseResume!: () => void;
    context.resume.and.callFake(() => new Promise<void>(resolve => { releaseResume = resolve; }));
    const pending = engine.play([event()], {...options, position: 0, revision: 2});
    expect(engine.pause()).toBe(0);
    context.state = 'running';
    releaseResume();
    await pending;
    expect(engine.position).toBe(0);
    expect(engine.diagnostics.schedulerActive).toBeFalse();
    expect(context.oscillators.length).toBe(1);
  });

  it('preserves an initial seek position if paused before the first resume completes', async () => {
    let releaseResume!: () => void;
    context.resume.and.callFake(() => new Promise<void>(resolve => { releaseResume = resolve; }));
    const pending = engine.play([event(4.8)], {...options, position: 4.8, duration: 6});
    expect(engine.pause()).toBe(4.8);
    context.state = 'running';
    releaseResume();
    await pending;
    expect(engine.position).toBe(4.8);
    expect(context.oscillators.length).toBe(0);
    expect(engine.diagnostics.schedulerActive).toBeFalse();
  });

  it('uses the known envelope amplitude when cancelAndHoldAtTime is unavailable', async () => {
    await engine.play([event()], options);
    context.advance(0.075);
    const parameter = context.gains[1].gain;
    (parameter as unknown as {cancelAndHoldAtTime: undefined}).cancelAndHoldAtTime = undefined;
    engine.pause();
    expect(parameter.cancelScheduledValues).toHaveBeenCalledWith(0.075);
    expect(parameter.setValueAtTime).toHaveBeenCalledWith(0.1, 0.075);
  });

  it('bounds simultaneous voices and shuts down safely on a dense invalid performance', async () => {
    const notes = Array.from({length: AUDIO_POLICY.maxVoices + 1}, (_, index) => event(0, index));
    await expectAsync(engine.play(notes, options)).toBeRejected();
    expect(context.oscillators.length).toBe(AUDIO_POLICY.maxVoices);
    expect(engine.diagnostics).toEqual({activeVoices: 0, allocatedVoices: 0, schedulerActive: false});
  });

  it('skips missed events after a stalled tab instead of emitting a backlog', async () => {
    await engine.play([event(), event(0.24, 1), event(0.48, 2), event(0.72, 3)], options);
    context.currentTime = 0.65;
    context.oscillators.forEach(node => node.finish(context.currentTime));
    jasmine.clock().tick(25);
    expect(context.oscillators.length).toBe(2);
    expect(context.oscillators[1].start.calls.mostRecent().args[0]).toBeCloseTo(0.745);
    expect(options.onEvent).not.toHaveBeenCalled();
  });

  it('destroy disconnects every voice/master, closes once and cancels all future callbacks', async () => {
    await engine.play([event(), event(0.5, 1)], options);
    context.advance(0.05);
    engine.destroy();
    engine.destroy();
    expect(context.close).toHaveBeenCalledTimes(1);
    expect(context.gains[0].disconnect).toHaveBeenCalledTimes(1);
    expect(context.onstatechange).toBeNull();
    expect(engine.diagnostics).toEqual({activeVoices: 0, allocatedVoices: 0, schedulerActive: false});
    context.advance(1);
    expect(options.onEnded).not.toHaveBeenCalled();
    expect(options.onError).not.toHaveBeenCalled();
    await expectAsync(engine.play([event()], options)).toBeRejected();
  });
});
