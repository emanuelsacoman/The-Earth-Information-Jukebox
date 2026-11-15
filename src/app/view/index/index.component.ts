import { Component, inject } from '@angular/core';
import { PlanetEarthComponent } from '../screen-components/planet-earth/planet-earth.component';
import { AudioPanelComponent } from '../screen-components/audio-panel/audio-panel.component';
import { PlaybackCoordinator } from '../../sonification/playback-coordinator';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    PlanetEarthComponent,
    AudioPanelComponent,
  ],
  providers: [PlaybackCoordinator],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {
  readonly playback = inject(PlaybackCoordinator);
}
