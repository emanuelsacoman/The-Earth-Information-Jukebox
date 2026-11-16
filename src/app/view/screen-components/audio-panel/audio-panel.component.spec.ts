import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AudioPanelComponent } from './audio-panel.component';
import { FrameLoader } from '../../../sonification/frame-loader';
import { PlaybackCoordinator } from '../../../sonification/playback-coordinator';
import { WebAudioEngine, AudioPlaybackOptions } from '../../../sonification/web-audio-engine';

describe('AudioPanelComponent integration', () => {
  let load: jasmine.Spy;
  let play: jasmine.Spy;
  let callbacks: AudioPlaybackOptions;

  beforeEach(() => {
    // Synthetic pixels with the curated dimensions; real file decoding has its own loader spec.
    load = spyOn(FrameLoader.prototype, 'load').and.resolveTo({ width: 2048, height: 1152,
      data: new Uint8ClampedArray(2048 * 1152 * 4).fill(128) });
    play = spyOn(WebAudioEngine.prototype, 'play').and.callFake(async (_events, options) => { callbacks = options; });
    spyOn(WebAudioEngine.prototype, 'pause').and.returnValue(0.72);
  });

  it('mounts real controls, selects an annual frame, plays, pauses, seeks and displays errors', async () => {
    TestBed.configureTestingModule({ imports: [AudioPanelComponent], providers: [PlaybackCoordinator] });
    const fixture = TestBed.createComponent(AudioPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const button = host.querySelector<HTMLButtonElement>('.primary')!;
    expect(button.disabled).toBeFalse();
    expect(host.querySelector('img')?.getAttribute('src')).toContain('2012');
    expect(play).not.toHaveBeenCalled();
    const source = host.querySelector<HTMLSelectElement>('#scientific-frame')!;
    source.value = 'night-lights-2023';
    source.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.querySelector('img')?.getAttribute('src')).toContain('2023');
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(button.textContent).toContain('Pause');
    const event = play.calls.mostRecent().args[0][0];
    callbacks.onEvent(event, 3);
    fixture.detectChanges();
    expect(host.querySelector('.reading')?.textContent).toContain('relative image brightness');
    expect(host.querySelector('.reading')?.getAttribute('aria-live')).toBe('off');
    button.click();
    fixture.detectChanges();
    expect(button.textContent).toContain('Play');
    const seek = host.querySelector<HTMLInputElement>('#sweep-position')!;
    seek.value = '1.44';
    seek.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(host.querySelector('[role=status]')?.textContent).toContain('Position changed');
    load.and.rejectWith(new Error('Image unavailable'));
    source.value = 'night-lights-2012';
    source.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(host.querySelector('.error')?.textContent).toContain('Image unavailable');
    expect(button.disabled).toBeTrue();
    fixture.destroy();
  });

  it('renders explanatory controls on the server without loading browser resources', () => {
    TestBed.configureTestingModule({ imports: [AudioPanelComponent], providers: [PlaybackCoordinator,
      { provide: PLATFORM_ID, useValue: 'server' }] });
    const fixture = TestBed.createComponent(AudioPanelComponent);
    fixture.detectChanges();
    expect(load).not.toHaveBeenCalled();
    expect(play).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('Night lights');
    expect(fixture.nativeElement.querySelector('.primary').disabled).toBeTrue();
    fixture.destroy();
  });

  it('keeps the player and prepared source when the contextual panel is collapsed', async () => {
    TestBed.configureTestingModule({ imports: [AudioPanelComponent], providers: [PlaybackCoordinator] });
    const fixture = TestBed.createComponent(AudioPanelComponent);
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const coordinator = fixture.componentInstance.playback;
    coordinator.seek(4.8);
    fixture.detectChanges();
    const revision = coordinator.state().sessionRevision;
    const host = fixture.nativeElement as HTMLElement;
    const panel = host.querySelector<HTMLElement>('.science-panel')!;
    const source = host.querySelector('img');
    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();
    expect(panel.hidden).toBeTrue();
    expect(host.querySelector('.player')).not.toBeNull();
    expect(host.querySelector('img')).toBe(source);
    expect(coordinator.state().sessionRevision).toBe(revision);
    expect(coordinator.state().position).toBe(4.8);
    expect(load).toHaveBeenCalledTimes(1);
    expect(play).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('defers panel focus until the expanded input has rendered and cancels focus on close', async () => {
    TestBed.configureTestingModule({ imports: [AudioPanelComponent], providers: [PlaybackCoordinator] });
    const fixture = TestBed.createComponent(AudioPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = fixture.nativeElement.querySelector('#sonification') as HTMLElement;
    const focus = spyOn(panel, 'focus');
    fixture.componentInstance.focusPanel();
    fixture.componentRef.setInput('expanded', true);
    expect(focus).not.toHaveBeenCalled();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(focus).toHaveBeenCalledWith({ preventScroll: true });
    focus.calls.reset();
    fixture.componentInstance.focusPanel();
    fixture.componentRef.setInput('expanded', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(focus).not.toHaveBeenCalled();
    fixture.destroy();
  });

  it('routes volume, mute, speed and restart through the shared coordinator', async () => {
    TestBed.configureTestingModule({ imports: [AudioPanelComponent], providers: [PlaybackCoordinator] });
    const fixture = TestBed.createComponent(AudioPanelComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const volume = host.querySelector<HTMLInputElement>('#audio-volume')!;
    volume.value = '68';
    volume.dispatchEvent(new Event('input'));
    host.querySelector<HTMLButtonElement>('[data-testid=mute]')!.click();
    const speed = host.querySelector<HTMLSelectElement>('#audio-speed')!;
    speed.value = '1.5';
    speed.dispatchEvent(new Event('change'));
    const coordinator = fixture.componentInstance.playback;
    expect(coordinator.state().volume).toBe(0.68);
    expect(coordinator.state().muted).toBeTrue();
    expect(coordinator.state().speed).toBe(1.5);
    coordinator.seek(4.8);
    fixture.detectChanges();
    host.querySelector<HTMLButtonElement>('.restart')!.click();
    expect(coordinator.state().position).toBe(0);
    expect(coordinator.state().currentEvent).toBeNull();
    fixture.destroy();
  });
});
