import { Component } from '@angular/core';
import { PlanetEarthComponent } from '../screen-components/planet-earth/planet-earth.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    PlanetEarthComponent,
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
