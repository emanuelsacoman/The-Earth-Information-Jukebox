import { AfterViewInit, Component, ElementRef, EventEmitter, NgZone, OnDestroy, Output, ViewChild, ViewEncapsulation, inject } from '@angular/core';
import type { GeoPoint, ObservatoryHandle } from './observatory.mjs';

@Component({
  selector: 'app-planet-earth',
  standalone: true,
  imports: [],
  templateUrl: './planet-earth.component.html',
  styleUrl: './planet-earth.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PlanetEarthComponent implements AfterViewInit, OnDestroy {
  @ViewChild('observatoryHost', { static: true }) private host!: ElementRef<HTMLElement>;
  @Output() readonly pointSelected = new EventEmitter<GeoPoint>();
  private readonly zone = inject(NgZone);
  private observatory?: ObservatoryHandle;
  private disposed = false;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      void import('./observatory.mjs').then(({ mountObservatory }) => {
        if (this.disposed) return;
        this.host.nativeElement.replaceChildren();
        this.observatory = mountObservatory(this.host.nativeElement, {
          onSelect: (point) => this.zone.run(() => this.pointSelected.emit(point)),
        });
      }).catch(() => {
        if (!this.disposed) this.host.nativeElement.textContent = 'Não foi possível abrir o observatório. Atualize a página para tentar novamente.';
      });
    });
  }

  ngOnDestroy(): void {
    this.disposed = true;
    this.observatory?.dispose();
  }
}
