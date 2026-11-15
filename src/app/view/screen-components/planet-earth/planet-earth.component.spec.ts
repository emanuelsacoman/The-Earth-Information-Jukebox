import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanetEarthComponent } from './planet-earth.component';

describe('PlanetEarthComponent', () => {
  let component: PlanetEarthComponent;
  let fixture: ComponentFixture<PlanetEarthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanetEarthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanetEarthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the selected coordinates from the rendered observatory', async () => {
    await import('./observatory.mjs');
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    let selected: { lat: number; lon: number } | undefined;
    const subscription = component.pointSelected.subscribe((point) => selected = point);
    const host = fixture.nativeElement as HTMLElement;
    const destination = host.querySelector<HTMLButtonElement>('button[aria-label="Explorar Amazônia"]');
    expect(destination).not.toBeNull();
    destination!.click();
    expect(selected).toEqual({ lat: -3, lon: -60 });
    subscription.unsubscribe();
  });

  it('should release the native canvas when Angular destroys the view', async () => {
    await import('./observatory.mjs');
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
    const host = fixture.nativeElement as HTMLElement;
    expect(host.querySelector('canvas')).not.toBeNull();
    fixture.destroy();
    expect(host.querySelector('canvas')).toBeNull();
  });
});
