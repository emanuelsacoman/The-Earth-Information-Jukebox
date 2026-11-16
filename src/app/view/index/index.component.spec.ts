import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexComponent } from './index.component';
import { FrameLoader } from '../../sonification/frame-loader';
import { WebAudioEngine } from '../../sonification/web-audio-engine';
import { PlaybackCoordinator } from '../../sonification/playback-coordinator';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;

  beforeEach(async () => {
    spyOn(FrameLoader.prototype, 'load').and.resolveTo({ width: 2048, height: 1152,
      data: new Uint8ClampedArray(2048 * 1152 * 4).fill(128) });
    await TestBed.configureTestingModule({
      imports: [IndexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('opens NASA in the same composition without autoplay and restores focus on close', async () => {
    const play = spyOn(WebAudioEngine.prototype, 'play').and.resolveTo();
    await fixture.whenStable();
    component.setScienceOpen(false);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    const coordinator = component.playback;
    const player = host.querySelector('.player');
    const listen = host.querySelector<HTMLButtonElement>('#listen-earth')!;
    listen.click();
    fixture.detectChanges();
    await new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    expect(host.querySelector('main.experience.science-open')).not.toBeNull();
    expect(host.querySelector<HTMLElement>('#sonification')!.hidden).toBeFalse();
    expect(host.querySelectorAll('app-audio-panel').length).toBe(1);
    expect(host.querySelectorAll('app-planet-earth').length).toBe(1);
    expect(host.querySelector('app-audio-panel')?.querySelector('.player')).toBe(player);
    expect(play).not.toHaveBeenCalled();
    expect(fixture.debugElement.children[0].injector.get(PlaybackCoordinator)).toBe(coordinator);
    host.querySelector<HTMLButtonElement>('[aria-label="Close science panel"]')!.click();
    fixture.detectChanges();
    expect(listen.getAttribute('aria-expanded')).toBe('false');
    expect(host.querySelector('.player')).toBe(player);
    expect(component.playback).toBe(coordinator);
  });
});
