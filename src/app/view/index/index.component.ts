import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { PlanetEarthComponent } from '../screen-components/planet-earth/planet-earth.component';
import { AudioPanelComponent } from '../screen-components/audio-panel/audio-panel.component';
import { PlaybackCoordinator } from '../../sonification/playback-coordinator';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [PlanetEarthComponent, AudioPanelComponent],
  providers: [PlaybackCoordinator],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class IndexComponent implements OnInit {
  readonly playback = inject(PlaybackCoordinator);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);
  readonly scienceOpen = signal(false);
  readonly compact = signal(false);
  @ViewChild(AudioPanelComponent) private audioPanel?: AudioPanelComponent;
  @ViewChild('listenButton')
  private listenButton?: ElementRef<HTMLButtonElement>;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const query = window.matchMedia('(max-width: 999px)');
      this.compact.set(query.matches);
      this.scienceOpen.set(!query.matches);
      const updateLayout = () => this.compact.set(query.matches);
      query.addEventListener('change', updateLayout);
      this.destroyRef.onDestroy(() =>
        query.removeEventListener('change', updateLayout),
      );
    }
  }

  openScience(event?: Event, showMethod = false): void {
    event?.preventDefault();
    this.scienceOpen.set(true);
    this.audioPanel?.focusPanel(showMethod);
  }

  setScienceOpen(open: boolean): void {
    this.scienceOpen.set(open);
    if (!open) this.listenButton?.nativeElement.focus({ preventScroll: true });
  }
}
