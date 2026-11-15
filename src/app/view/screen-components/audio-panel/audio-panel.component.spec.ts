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
});
