import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

/* ============================================================================
 * TIPOS
 * ========================================================================== */

type SecaoId =
  | 'discos'
  | 'som'
  | 'ouvindo'
  | 'globo'
  | 'acessibilidade'
  | 'sobre';
type Modo = 'varredura' | 'explorar';

interface Secao {
  id: SecaoId;
  rotulo: string;
  /** Atributo "d" do �cone (SVG 24x24, s� contorno). */
  icone: string;
}

interface Disco {
  id: string;
  titulo: string;
  descricao: string;
  periodo: string;
  fonte: string;
  /** Cores da legenda, do valor mais baixo ao mais alto. */
  cores: string[];
  legendaMin: string;
  legendaMax: string;
  totalQuadros: number;
}

interface Opcao {
  id: string;
  rotulo: string;
}

interface Predefinicao {
  id: string;
  rotulo: string;
  descricao: string;
  escala: string;
  instrumento: string;
  velocidade: number;
}

interface Regiao {
  id: string;
  rotulo: string;
  lat: number;
  lon: number;
}

/** O que o motor de �udio informa ao dashboard a cada nota tocada. */
interface Leitura {
  regiao: string;
  valor: string;
  nota: string;
}

interface AjustesDeSom {
  modo: Modo;
  escala: string;
  instrumento: string;
  velocidade: number;
  volume: number;
  mudo: boolean;
}

interface Acessibilidade {
  altoContraste: boolean;
  textoGrande: boolean;
  menosMovimento: boolean;
  vibracao: boolean;
  anuncios: boolean;
}

interface OpcaoDeAcessibilidade {
  chave: keyof Acessibilidade;
  rotulo: string;
  descricao: string;
}

const CHAVE_PREFERENCIAS = 'earth-jukebox:acessibilidade';

@Component({
  selector: 'app-dashboard',
  // Se o projeto usa app.module.ts (NgModule), apague as duas linhas abaixo
  // e declare o DashboardComponent no m�dulo.
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('botaoComecar') botaoComecar?: ElementRef<HTMLButtonElement>;

  /* ==========================================================================
   * NAVEGA��O ENTRE AS P�GINAS DO PAINEL
   * ======================================================================== */

  readonly secoes: Secao[] = [
    {
      id: 'discos',
      rotulo: 'Discs',
      icone:
        'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z',
    },
    {
      id: 'som',
      rotulo: 'Sound',
      icone:
        'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M16 4v4M8 10v4M14 16v4',
    },
    {
      id: 'ouvindo',
      rotulo: 'Listening',
      icone: 'M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4',
    },
    {
      id: 'globo',
      rotulo: 'Globe and time',
      icone:
        'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
    },
    {
      id: 'acessibilidade',
      rotulo: 'Accessibility',
      icone:
        'M12 3.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM5 9h14M12 9v5M12 14l-3 6M12 14l3 6',
    },
    {
      id: 'sobre',
      rotulo: 'About',
      icone: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 11v6M12 7v1',
    },
  ];

  secaoAtiva: SecaoId = 'discos';
  painelAberto = true;
  mostrarBoasVindas = true;

  /* ==========================================================================
   * 1. DISCOS (visualiza��es do EIC)
   * ======================================================================== */

  /**
   * Cat�logo de exemplo. Os textos entre colchetes s�o espa�os reservados:
   * o conte�do real deve vir de carregarDiscos() (backend).
   */
  discos: Disco[] = [
    {
      id: 'temperatura',
      titulo: 'Global temperature',
      descricao:
        '[Description of the visualization: what it shows and how to read the colors.]',
      periodo: '[Data period]',
      fonte: 'NASA Earth Information Center',
      cores: ['#1D4ED8', '#7DD3FC', '#FDE68A', '#F97316', '#B91C1C'],
      legendaMin: '[min]',
      legendaMax: '[max]',
      totalQuadros: 100,
    },
    {
      id: 'correntes',
      titulo: 'Ocean currents',
      descricao:
        '[Description of the visualization: what it shows and how to read the colors.]',
      periodo: '[Data period]',
      fonte: 'NASA Earth Information Center',
      cores: ['#082F49', '#0369A1', '#38BDF8', '#E0F2FE'],
      legendaMin: '[min]',
      legendaMax: '[max]',
      totalQuadros: 100,
    },
    {
      id: 'disco-3',
      titulo: '[3rd visualization]',
      descricao:
        '[Description of the visualization: what it shows and how to read the colors.]',
      periodo: '[Data period]',
      fonte: 'NASA Earth Information Center',
      cores: ['#0F172A', '#475569', '#CBD5E1'],
      legendaMin: '[min]',
      legendaMax: '[max]',
      totalQuadros: 100,
    },
  ];

  discoAtual: Disco = this.discos[0];
  tocarEmSequencia = false;

  /* ==========================================================================
   * 2. SOM
   * ======================================================================== */

  readonly escalas: Opcao[] = [
    { id: 'pentatonica', rotulo: 'Pentatonic' },
    { id: 'maior', rotulo: 'Major' },
    { id: 'menor', rotulo: 'Minor' },
  ];

  readonly instrumentos: Opcao[] = [
    { id: 'piano', rotulo: 'Piano' },
    { id: 'cordas', rotulo: 'Strings' },
    { id: 'sintetizador', rotulo: 'Synthesizer' },
  ];

  readonly predefinicoes: Predefinicao[] = [
    {
      id: 'calmo',
      rotulo: 'Calm',
      descricao: 'Slow, strings, pentatonic',
      escala: 'pentatonica',
      instrumento: 'cordas',
      velocidade: 60,
    },
    {
      id: 'dramatico',
      rotulo: 'Dramatic',
      descricao: 'Fast, synthesizer, minor',
      escala: 'menor',
      instrumento: 'sintetizador',
      velocidade: 130,
    },
    {
      id: 'cientifico',
      rotulo: 'Scientific',
      descricao: 'Moderate, piano, major',
      escala: 'maior',
      instrumento: 'piano',
      velocidade: 90,
    },
  ];

  readonly velocidadeMin = 40;
  readonly velocidadeMax = 160;

  tocando = false;
  predefinicaoAtiva: string | null = null;

  som: AjustesDeSom = {
    modo: 'varredura',
    escala: 'pentatonica',
    instrumento: 'piano',
    velocidade: 90,
    volume: 80,
    mudo: false,
  };

  /* ==========================================================================
   * 3. OUVINDO
   * ======================================================================== */

  /** Atualizada por receberLeitura(), que o motor de �udio deve chamar. */
  leitura: Leitura = { regiao: '?', valor: '?', nota: '?' };

  /** Posi��o do cursor no modo Explorar. */
  cursor = { lat: 0, lon: 0 };

  /** Barras do visualizador de �udio (anima��o decorativa at� ligar o �udio real). */
  readonly barras: number[] = Array.from({ length: 28 }, (_, i) => i);

  readonly mapeamento: { visual: string; sonoro: string; detalhe: string }[] = [
    {
      visual: 'Color',
      sonoro: 'Pitch',
      detalhe: 'Low values sound low; high values sound high.',
    },
    {
      visual: 'Brightness',
      sonoro: 'Volume',
      detalhe: 'The brighter the region, the louder the sound.',
    },
    {
      visual: 'Variation',
      sonoro: 'Rhythm',
      detalhe: 'Areas with a lot of change play more notes per second.',
    },
    {
      visual: 'Position',
      sonoro: 'Left and right',
      detalhe: 'The sound travels from one ear to the other.',
    },
  ];

  /* ==========================================================================
   * 4. GLOBO E TEMPO
   * ======================================================================== */

  readonly regioes: Regiao[] = [
    { id: 'amazonia', rotulo: 'Amazon', lat: -3, lon: -60 },
    { id: 'artico', rotulo: 'Arctic', lat: 90, lon: 0 },
    { id: 'antartida', rotulo: 'Antarctica', lat: -90, lon: 0 },
    { id: 'atlantico-norte', rotulo: 'North Atlantic', lat: 35, lon: -40 },
    { id: 'saara', rotulo: 'Sahara', lat: 23, lon: 13 },
    { id: 'pacifico', rotulo: 'Pacific', lat: 0, lon: -160 },
  ];

  quadroAtual = 0;
  /** Texto da data do quadro atual; deve vir de carregarQuadro(). */
  dataDoQuadro = '[frame date]';
  rotacaoAutomatica = true;
  regiaoAtiva: string | null = null;

  /* ==========================================================================
   * 5. ACESSIBILIDADE
   * ======================================================================== */

  acess: Acessibilidade = {
    altoContraste: false,
    textoGrande: false,
    menosMovimento: false,
    vibracao: false,
    anuncios: true,
  };

  readonly opcoesDeAcessibilidade: OpcaoDeAcessibilidade[] = [
    {
      chave: 'altoContraste',
      rotulo: 'High contrast',
      descricao: 'Black background, white text and borders.',
    },
    {
      chave: 'textoGrande',
      rotulo: 'Larger text',
      descricao: 'Makes all the text bigger.',
    },
    {
      chave: 'menosMovimento',
      rotulo: 'Reduce motion',
      descricao: 'Turns off transitions and the visualizer.',
    },
    {
      chave: 'vibracao',
      rotulo: 'Vibrate on peaks',
      descricao: 'Only on supported phones.',
    },
    {
      chave: 'anuncios',
      rotulo: 'Screen reader announcements',
      descricao: 'Says what is playing and where.',
    },
  ];

  readonly atalhos: { tecla: string; acao: string }[] = [
    { tecla: 'Space', acao: 'Play or pause' },
    { tecla: 'M', acao: 'Mute' },
    { tecla: '1 to 6', acao: 'Open a panel page' },
    { tecla: 'Arrows', acao: 'Move the cursor in Explore mode' },
    { tecla: 'Esc', acao: 'Close the panel' },
  ];

  /** Texto lido pelo leitor de tela (regi�o aria-live no HTML). */
  anuncio = '';

  /* ==========================================================================
   * 6. SOBRE
   * ======================================================================== */

  readonly passos: string[] = [
    'Pick a disc on the Discs page.',
    'Press Play to hear the sweep across the globe.',
    'Switch to Explore and move the cursor to hear each point.',
  ];

  linkCompartilhavel = '';
  linkCopiado = false;

  /* ==========================================================================
   * CICLO DE VIDA
   * ======================================================================== */

  ngOnInit(): void {
    this.carregarPreferencias();
    this.lerAjustesDaUrl();
    this.carregarDiscos();
  }

  ngAfterViewInit(): void {
    this.botaoComecar?.nativeElement.focus();
  }

  /* ==========================================================================
   * A��ES: NAVEGA��O
   * ======================================================================== */

  get tituloDaSecao(): string {
    return this.secoes.find((s) => s.id === this.secaoAtiva)?.rotulo ?? '';
  }

  abrirSecao(id: SecaoId): void {
    if (this.secaoAtiva === id && this.painelAberto) {
      this.painelAberto = false;
      return;
    }
    this.secaoAtiva = id;
    this.painelAberto = true;
  }

  fecharPainel(): void {
    this.painelAberto = false;
  }

  /** Bot�o "Compartilhar" do topo: abre a p�gina Sobre e j� copia o link. */
  abrirCompartilhar(): void {
    this.secaoAtiva = 'sobre';
    this.painelAberto = true;
    void this.compartilhar();
  }

  /** Fecha a tela de abertura. O clique tamb�m libera o �udio no navegador. */
  comecar(): void {
    this.mostrarBoasVindas = false;
    if (!this.tocando) {
      this.alternarReproducao();
    }
  }

  /* ==========================================================================
   * A��ES: DISCOS
   * ======================================================================== */

  get gradienteDaLegenda(): string {
    return 'linear-gradient(90deg, ' + this.discoAtual.cores.join(', ') + ')';
  }

  selecionarDisco(disco: Disco): void {
    this.discoAtual = disco;
    this.quadroAtual = 0;
    this.leitura = { regiao: '?', valor: '?', nota: '?' };
    this.carregarQuadro(disco.id, 0);
    this.anunciar('Disc selected: ' + disco.titulo);
  }

  proximoDisco(): void {
    const i = this.discos.indexOf(this.discoAtual);
    this.selecionarDisco(this.discos[(i + 1) % this.discos.length]);
  }

  discoAnterior(): void {
    const i = this.discos.indexOf(this.discoAtual);
    this.selecionarDisco(
      this.discos[(i - 1 + this.discos.length) % this.discos.length],
    );
  }

  alternarSequencia(): void {
    this.tocarEmSequencia = !this.tocarEmSequencia;
  }

  /* ==========================================================================
   * A��ES: SOM
   * ======================================================================== */

  alternarReproducao(): void {
    this.tocando = !this.tocando;
    if (this.tocando) {
      this.iniciarAudio();
      this.anunciar('Playing ' + this.discoAtual.titulo);
    } else {
      this.pausarAudio();
      this.anunciar('Paused');
    }
  }

  definirModo(modo: Modo): void {
    this.som.modo = modo;
    this.aoMudarAjustes();
    this.anunciar(
      modo === 'varredura'
        ? 'Sweep mode'
        : 'Explore mode: use the arrow keys to move the cursor',
    );
  }

  definirEscala(id: string): void {
    this.som.escala = id;
    this.aoMudarAjustes();
  }

  definirInstrumento(id: string): void {
    this.som.instrumento = id;
    this.aoMudarAjustes();
  }

  definirVelocidade(valor: string | number): void {
    this.som.velocidade = Number(valor);
    this.aoMudarAjustes();
  }

  definirVolume(valor: string | number): void {
    this.som.volume = Number(valor);
    this.som.mudo = this.som.volume === 0;
    this.aplicarAjustesDeSom(this.som);
  }

  alternarMudo(): void {
    this.som.mudo = !this.som.mudo;
    this.aplicarAjustesDeSom(this.som);
    this.anunciar(this.som.mudo ? 'Sound muted' : 'Sound on');
  }

  aplicarPredefinicao(p: Predefinicao): void {
    this.som.escala = p.escala;
    this.som.instrumento = p.instrumento;
    this.som.velocidade = p.velocidade;
    this.predefinicaoAtiva = p.id;
    this.aplicarAjustesDeSom(this.som);
    this.anunciar(p.rotulo + ' preset applied');
  }

  /** Qualquer ajuste manual desmarca a predefini��o e avisa o motor de �udio. */
  private aoMudarAjustes(): void {
    this.predefinicaoAtiva = null;
    this.aplicarAjustesDeSom(this.som);
  }

  /* ==========================================================================
   * A��ES: GLOBO E TEMPO
   * ======================================================================== */

  definirQuadro(valor: string | number): void {
    this.quadroAtual = Number(valor);
    this.carregarQuadro(this.discoAtual.id, this.quadroAtual);
  }

  girar(direcao: 'esquerda' | 'direita'): void {
    this.regiaoAtiva = null;
    this.girarGlobo(direcao);
  }

  zoom(direcao: 'mais' | 'menos'): void {
    this.zoomGlobo(direcao === 'mais' ? 1 : -1);
  }

  alternarRotacaoAutomatica(): void {
    this.rotacaoAutomatica = !this.rotacaoAutomatica;
    this.definirRotacaoAutomaticaDoGlobo(this.rotacaoAutomatica);
  }

  irParaRegiao(regiao: Regiao): void {
    this.regiaoAtiva = regiao.id;
    this.cursor = { lat: regiao.lat, lon: regiao.lon };
    this.focarRegiaoNoGlobo(regiao);
    this.anunciar('Globe at ' + regiao.rotulo);
  }

  /** Move o cursor do modo Explorar em passos de 5 graus. */
  moverCursor(dLat: number, dLon: number): void {
    const lat = Math.max(-90, Math.min(90, this.cursor.lat + dLat));
    let lon = this.cursor.lon + dLon;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    this.cursor = { lat, lon };
    this.regiaoAtiva = null;
    this.explorarPonto(lat, lon);
  }

  /* ==========================================================================
   * A��ES: ACESSIBILIDADE
   * ======================================================================== */

  alternarAcessibilidade(chave: keyof Acessibilidade): void {
    this.acess[chave] = !this.acess[chave];
    this.salvarPreferencias();
  }

  /** Envia um texto ao leitor de tela, se os an�ncios estiverem ligados. */
  anunciar(texto: string): void {
    if (this.acess.anuncios) {
      this.anuncio = texto;
    }
  }

  private vibrar(ms = 40): void {
    if (
      this.acess.vibracao &&
      typeof navigator !== 'undefined' &&
      'vibrate' in navigator
    ) {
      navigator.vibrate(ms);
    }
  }

  @HostListener('document:keydown', ['$event'])
  aoPressionarTecla(evento: KeyboardEvent): void {
    if (evento.key === 'Tab') {
      this.manterFocoEmCiclo(evento);
      return;
    }

    if (
      this.mostrarBoasVindas ||
      evento.ctrlKey ||
      evento.metaKey ||
      evento.altKey
    ) {
      return;
    }

    if (evento.key === 'Escape') {
      this.fecharPainel();
      return;
    }

    // Dentro de bot�es, campos e listas, as teclas mant�m o comportamento normal.
    const alvo = evento.target as HTMLElement | null;
    if (
      alvo &&
      ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'].includes(alvo.tagName)
    ) {
      return;
    }

    const tecla = evento.key.toLowerCase();

    if (tecla === ' ') {
      evento.preventDefault();
      this.alternarReproducao();
    } else if (tecla === 'm') {
      this.alternarMudo();
    } else if (tecla.length === 1 && tecla >= '1' && tecla <= '6') {
      this.abrirSecao(this.secoes[Number(tecla) - 1].id);
    } else if (this.som.modo === 'explorar' && tecla.startsWith('arrow')) {
      evento.preventDefault();
      if (tecla === 'arrowup') this.moverCursor(5, 0);
      if (tecla === 'arrowdown') this.moverCursor(-5, 0);
      if (tecla === 'arrowleft') this.moverCursor(0, -5);
      if (tecla === 'arrowright') this.moverCursor(0, 5);
    }
  }

  private salvarPreferencias(): void {
    try {
      localStorage.setItem(CHAVE_PREFERENCIAS, JSON.stringify(this.acess));
    } catch {
      // Sem armazenamento dispon�vel: as prefer�ncias valem s� para esta visita.
    }
  }

  private carregarPreferencias(): void {
    try {
      const salvo = localStorage.getItem(CHAVE_PREFERENCIAS);
      if (salvo) {
        this.acess = { ...this.acess, ...JSON.parse(salvo) };
      }
    } catch {
      // Ignora prefer�ncias ileg�veis.
    }
  }

  /* ==========================================================================
   * A��ES: COMPARTILHAR
   * ======================================================================== */

  async compartilhar(): Promise<void> {
    const parametros = new URLSearchParams({
      disco: this.discoAtual.id,
      modo: this.som.modo,
      escala: this.som.escala,
      instrumento: this.som.instrumento,
      velocidade: String(this.som.velocidade),
    });
    this.linkCompartilhavel =
      window.location.origin +
      window.location.pathname +
      '?' +
      parametros.toString();

    try {
      await navigator.clipboard.writeText(this.linkCompartilhavel);
      this.linkCopiado = true;
      this.anunciar('Link copied');
    } catch {
      // Sem permiss�o para copiar: o link fica vis�vel no campo para c�pia manual.
      this.linkCopiado = false;
    }
  }

  /** Abre o site j� com o disco e os ajustes que vieram no link compartilhado. */
  private lerAjustesDaUrl(): void {
    // No servidor (SSR) n�o existe "window"; s� l� a URL no navegador.
    if (typeof window === 'undefined') return;

    const p = new URLSearchParams(window.location.search);

    const disco = this.discos.find((d) => d.id === p.get('disco'));
    if (disco) this.discoAtual = disco;

    const modo = p.get('modo');
    if (modo === 'varredura' || modo === 'explorar') this.som.modo = modo;

    const escala = p.get('escala');
    if (this.escalas.some((e) => e.id === escala))
      this.som.escala = escala as string;

    const instrumento = p.get('instrumento');
    if (this.instrumentos.some((i) => i.id === instrumento))
      this.som.instrumento = instrumento as string;

    const velocidade = Number(p.get('velocidade'));
    if (velocidade >= this.velocidadeMin && velocidade <= this.velocidadeMax)
      this.som.velocidade = velocidade;
  }

  /* ==========================================================================
   * INTEGRA��O: BACKEND, MOTOR DE �UDIO E GLOBO 3D
   *
   * Nada abaixo est� implementado. Cada fun��o descreve o que o dashboard
   * espera da outra parte do projeto. O ideal � mover estas fun��es para
   * servi�os (ex.: DiscosService, AudioService, GloboService) e injet�-los.
   * ======================================================================== */

  // ---- Backend --------------------------------------------------------------

  /**
   * BACKEND: buscar o cat�logo de visualiza��es do EIC.
   * Esperado: lista de Disco (id, t�tulo, descri��o, per�odo, fonte, cores da
   * legenda, valores m�nimo e m�ximo, total de quadros).
   * Ao receber: this.discos = resposta; this.discoAtual = this.discos[0].
   */

  private http = inject(HttpClient, { optional: true });

  private carregarDiscos(): void {
    if (!this.http) return;
    this.http.get<Disco[]>('/api/discos').subscribe({
      next: (discos) => {
        if (discos.length) {
          this.discos = discos;
          this.discoAtual = discos[0];
        }
      },
      error: () => this.anunciar('Could not load the visualizations'),
    });
  }

  /**
   * BACKEND: buscar um quadro (imagem) de uma visualiza��o.
   * Esperado: a imagem do quadro e a data correspondente.
   * Ao receber: atualizar this.dataDoQuadro e entregar a imagem ao globo 3D
   * (textura) e ao motor de �udio (pixels a sonificar).
   */
  private carregarQuadro(discoId: string, indice: number): void {
    if (!this.http) return;
    this.http
      .get<{ data: string }>('/api/discos/${discoId}/quadros/${indice}')
      .subscribe((quadro) => (this.dataDoQuadro = quadro.data));
  }

  // ---- Motor de �udio (sonifica��o) -----------------------------------------

  /**
   * �UDIO: iniciar a sonifica��o do quadro atual com os ajustes de this.som.
   * No modo "varredura", percorrer a imagem; no modo "explorar", tocar s� o
   * ponto de this.cursor. Se this.tocarEmSequencia for true, chamar
   * proximoDisco() quando a varredura do �ltimo quadro terminar.
   */
  private iniciarAudio(): void {
    // TODO(�udio): criar ou retomar o AudioContext e come�ar a tocar.
  }

  /** �UDIO: pausar a sonifica��o sem perder a posi��o da varredura. */
  private pausarAudio(): void {
    // TODO(�udio)
  }

  /**
   * �UDIO: aplicar modo, escala, instrumento, velocidade (40 a 160),
   * volume (0 a 100) e mudo. Chamada a cada mudan�a nos controles.
   */
  private aplicarAjustesDeSom(ajustes: AjustesDeSom): void {
    // TODO(�udio)
  }

  /**
   * �UDIO -> DASHBOARD: o motor de �udio deve chamar esta fun��o a cada nota,
   * informando regi�o, valor do dado e nota tocada. "pico" indica um valor
   * extremo, usado para a vibra��o no celular.
   * Para o visualizador de �udio real, ligar um AnalyserNode �s barras do HTML.
   */
  receberLeitura(leitura: Leitura, pico = false): void {
    this.leitura = leitura;
    this.anunciar(
      leitura.regiao + ': ' + leitura.valor + ', note ' + leitura.nota,
    );
    if (pico) {
      this.vibrar();
    }
  }

  // ---- Globo 3D -------------------------------------------------------------

  /** GLOBO: girar um passo para a esquerda ou para a direita. */
  private girarGlobo(direcao: 'esquerda' | 'direita'): void {
    // TODO(globo)
  }

  /** GLOBO: aproximar (+1) ou afastar (-1) a c�mera. */
  private zoomGlobo(passo: number): void {
    // TODO(globo)
  }

  /** GLOBO: ligar ou desligar a rota��o cont�nua. */
  private definirRotacaoAutomaticaDoGlobo(ligada: boolean): void {
    // TODO(globo)
  }

  /** GLOBO: girar at� centralizar a latitude e a longitude da regi�o. */
  private focarRegiaoNoGlobo(regiao: Regiao): void {
    // TODO(globo)
  }

  /**
   * GLOBO + �UDIO: mostrar o cursor em (lat, lon) no globo e tocar a nota
   * daquele ponto. O globo tamb�m deve chamar moverCursor() ou atualizar
   * this.cursor quando a pessoa passar o mouse ou o dedo sobre ele.
   */
  private explorarPonto(lat: number, lon: number): void {
    // TODO(globo + �udio)
  }

  rotacao = 0;

  definirRotacao(valor: string | number): void {
    this.rotacao = Number(valor);
    this.regiaoAtiva = null;
    this.definirRotacaoDoGlobo(this.rotacao);
  }

  /** GLOBO: posicionar o globo na longitude indicada (-180 a 180). */
  private definirRotacaoDoGlobo(graus: number): void {
    // TODO(globo)
  }

  constructor(private host: ElementRef<HTMLElement>) {}

  private manterFocoEmCiclo(evento: KeyboardEvent): void {
    const raiz = this.mostrarBoasVindas
      ? this.host.nativeElement.querySelector<HTMLElement>('.abertura')
      : this.host.nativeElement;
    if (!raiz) return;

    const focaveis = Array.from(
      raiz.querySelectorAll<HTMLElement>('button, a[href], input, select'),
    ).filter((el) => el.offsetParent !== null);
    if (!focaveis.length) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];

    if (!evento.shiftKey && document.activeElement === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    } else if (evento.shiftKey && document.activeElement === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    }
  }
}
