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
    expect(component.mostrarBoasVindas).toBe(true);
    component.comecar();
    expect(component.mostrarBoasVindas).toBe(false);
    expect(component.tocando).toBe(true);
  });

  it('should switch pages in the panel', () => {
    component.abrirSecao('som');
    expect(component.secaoAtiva).toBe('som');
    expect(component.painelAberto).toBe(true);
  });

  it('should close the panel when clicking the page that is already open', () => {
    component.abrirSecao('som');
    component.abrirSecao('som');
    expect(component.painelAberto).toBe(false);
  });

  it('should toggle between play and pause', () => {
    component.alternarReproducao();
    expect(component.tocando).toBe(true);
    component.alternarReproducao();
    expect(component.tocando).toBe(false);
  });

  it('should apply a sound preset', () => {
    const calm = component.predefinicoes[0];
    component.aplicarPredefinicao(calm);
    expect(component.som.escala).toBe(calm.escala);
    expect(component.som.instrumento).toBe(calm.instrumento);
    expect(component.som.velocidade).toBe(calm.velocidade);
    expect(component.predefinicaoAtiva).toBe(calm.id);
  });

  it('should clear the preset after a manual adjustment', () => {
    component.aplicarPredefinicao(component.predefinicoes[0]);
    component.definirEscala('menor');
    expect(component.predefinicaoAtiva).toBeNull();
  });

  it('should select a record and go back to the first frame', () => {
    component.definirQuadro(10);
    component.selecionarDisco(component.discos[1]);
    expect(component.discoAtual.id).toBe(component.discos[1].id);
    expect(component.quadroAtual).toBe(0);
  });

  it('should keep the cursor within the globe limits', () => {
    component.cursor = { lat: 88, lon: 178 };
    component.moverCursor(5, 5);
    expect(component.cursor.lat).toBe(90);
    expect(component.cursor.lon).toBe(-177);
  });

  it('should toggle an accessibility option', () => {
    const before = component.acess.altoContraste;
    component.alternarAcessibilidade('altoContraste');
    expect(component.acess.altoContraste).toBe(!before);
  });
});
