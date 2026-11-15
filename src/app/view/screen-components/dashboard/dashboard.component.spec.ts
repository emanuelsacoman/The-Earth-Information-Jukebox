import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // If the project uses NgModule, replace with: declarations: [DashboardComponent]
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should open on the welcome screen and close it on start', () => {
    expect(component.showWelcome).toBe(true);
    component.start();
    expect(component.showWelcome).toBe(false);
    expect(component.playing).toBe(true);
  });

  it('should switch pages in the panel', () => {
    component.openSection('sound');
    expect(component.activeSection).toBe('sound');
    expect(component.panelOpen).toBe(true);
  });

  it('should close the panel when clicking the page that is already open', () => {
    component.openSection('sound');
    component.openSection('sound');
    expect(component.panelOpen).toBe(false);
  });

  it('should toggle between play and pause', () => {
    component.togglePlayback();
    expect(component.playing).toBe(true);
    component.togglePlayback();
    expect(component.playing).toBe(false);
  });

  it('should apply a sound preset', () => {
    const calm = component.presets[0];
    component.applyPreset(calm);
    expect(component.sound.scale).toBe(calm.scale);
    expect(component.sound.instrument).toBe(calm.instrument);
    expect(component.sound.speed).toBe(calm.speed);
    expect(component.activePreset).toBe(calm.id);
  });

  it('should clear the preset after a manual adjustment', () => {
    component.applyPreset(component.presets[0]);
    component.setScale('minor');
    expect(component.activePreset).toBeNull();
  });

  it('should select a record and go back to the first frame', () => {
    component.setFrame(10);
    component.selectRecord(component.records[1]);
    expect(component.currentRecord.id).toBe(component.records[1].id);
    expect(component.currentFrame).toBe(0);
  });

  it('should keep the cursor within the globe limits', () => {
    component.cursor = { lat: 88, lon: 178 };
    component.moveCursor(5, 5);
    expect(component.cursor.lat).toBe(90);
    expect(component.cursor.lon).toBe(-177);
  });

  it('should toggle an accessibility option', () => {
    const before = component.a11y.highContrast;
    component.toggleAccessibility('highContrast');
    expect(component.a11y.highContrast).toBe(!before);
  });
});
