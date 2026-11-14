import { Component } from '@angular/core';
import { PlanetEarthComponent } from '../screen-components/planet-earth/planet-earth.component';
import { DashboardComponent } from '../screen-components/dashboard/dashboard.component';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [
    PlanetEarthComponent,
    DashboardComponent,
    
  ],
  templateUrl: './index.component.html',
  styleUrl: './index.component.css'
})
export class IndexComponent {

}
