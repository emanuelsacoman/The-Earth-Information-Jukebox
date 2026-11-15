import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

/* ============================================================================
 * TYPES
 * ========================================================================== */

type SectionId = 'records' | 'sound' | 'listening' | 'globe' | 'accessibility' | 'about';
type Mode = 'sweep' | 'explore';

interface Section {
  id: SectionId;
  label: string;
  /** The "d" attribute of the icon (24x24 SVG, outline only). */
  icon: string;
}

interface RecordItem {
  id: string;
  title: string;
  description: string;
  period: string;
  source: string;
  /** Legend colors, from the lowest value to the highest. */
  colors: string[];
  legendMin: string;
  legendMax: string;
  totalFrames: number;
}

interface Option {
  id: string;
  label: string;
}

interface Preset {
  id: string;
  label: string;
  description: string;
  scale: string;
  instrument: string;
  speed: number;
}

interface Region {
  id: string;
  label: string;
  lat: number;
  lon: number;
}

/** What the audio engine reports to the dashboard on every note played. */
interface Reading {
  region: string;
  value: string;
  note: string;
}

interface SoundSettings {
  mode: Mode;
  scale: string;
  instrument: string;
  speed: number;
  volume: number;
  muted: boolean;
}

interface Accessibility {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  vibration: boolean;
  announcements: boolean;
}

interface AccessibilityOption {
  key: keyof Accessibility;
  label: string;
  description: string;
}

const PREFERENCES_KEY = 'earth-jukebox:accessibility';

@Component({
  selector: 'app-dashboard',
  // If the project uses app.module.ts (NgModule), delete the two lines below
  // and declare DashboardComponent in the module.
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('startButton') startButton?: ElementRef<HTMLButtonElement>;

  /* ==========================================================================
   * NAVIGATION BETWEEN PANEL PAGES
   * ======================================================================== */

  readonly sections: Section[] = [
    { id: 'records', label: 'Records', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z' },
    { id: 'sound', label: 'Sound', icon: 'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h8M16 18h4M16 4v4M8 10v4M14 16v4' },
    { id: 'listening', label: 'Listening', icon: 'M4 10v4M8 7v10M12 4v16M16 8v8M20 10v4' },
    { id: 'globe', label: 'Globe and time', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18' },
    { id: 'accessibility', label: 'Accessibility', icon: 'M12 3.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3zM5 9h14M12 9v5M12 14l-3 6M12 14l3 6' },
    { id: 'about', label: 'About', icon: 'M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0-18zM12 11v6M12 7v1' },
  ];

  activeSection: SectionId = 'records';
  panelOpen = true;
  showWelcome = true;

  /* ==========================================================================
   * 1. RECORDS (EIC visualizations)
   * ======================================================================== */

  /**
   * Sample catalog. Text in square brackets is a placeholder:
   * the real content should come from loadRecords() (backend).
   */
  records: RecordItem[] = [
    {
      id: 'temperature',
      title: 'Global temperature',
      description: '[Visualization description: what it shows and how to read the colors.]',
      period: '[Data period]',
      source: 'NASA Earth Information Center',
      colors: ['#1D4ED8', '#7DD3FC', '#FDE68A', '#F97316', '#B91C1C'],
      legendMin: '[min.]',
      legendMax: '[max.]',
      totalFrames: 100,
    },
    {
      id: 'currents',
      title: 'Ocean currents',
      description: '[Visualization description: what it shows and how to read the colors.]',
      period: '[Data period]',
      source: 'NASA Earth Information Center',
      colors: ['#082F49', '#0369A1', '#38BDF8', '#E0F2FE'],
      legendMin: '[min.]',
      legendMax: '[max.]',
      totalFrames: 100,
    },
    {
      id: 'record-3',
      title: '[3rd visualization]',
      description: '[Visualization description: what it shows and how to read the colors.]',
      period: '[Data period]',
      source: 'NASA Earth Information Center',
      colors: ['#0F172A', '#475569', '#CBD5E1'],
      legendMin: '[min.]',
      legendMax: '[max.]',
      totalFrames: 100,
    },
  ];

  currentRecord: RecordItem = this.records[0];
  playInSequence = false;

  /* ==========================================================================
   * 2. SOUND
   * ======================================================================== */

  readonly scales: Option[] = [
    { id: 'pentatonic', label: 'Pentatonic' },
    { id: 'major', label: 'Major' },
    { id: 'minor', label: 'Minor' },
  ];

  readonly instruments: Option[] = [
    { id: 'piano', label: 'Piano' },
    { id: 'strings', label: 'Strings' },
    { id: 'synth', label: 'Synthesizer' },
  ];

  readonly presets: Preset[] = [
    { id: 'calm', label: 'Calm', description: 'Slow, strings, pentatonic', scale: 'pentatonic', instrument: 'strings', speed: 60 },
    { id: 'dramatic', label: 'Dramatic', description: 'Fast, synthesizer, minor', scale: 'minor', instrument: 'synth', speed: 130 },
    { id: 'scientific', label: 'Scientific', description: 'Moderate, piano, major', scale: 'major', instrument: 'piano', speed: 90 },
  ];

  readonly speedMin = 40;
  readonly speedMax = 160;

  playing = false;
  activePreset: string | null = null;

  sound: SoundSettings = {
    mode: 'sweep',
    scale: 'pentatonic',
    instrument: 'piano',
    speed: 90,
    volume: 80,
    muted: false,
  };

  /* ==========================================================================
   * 3. LISTENING
   * ======================================================================== */

  /** Updated by receiveReading(), which the audio engine should call. */
  reading: Reading = { region: '?', value: '?', note: '?' };

  /** Cursor position in Explore mode. */
  cursor = { lat: 0, lon: 0 };

  /** Audio visualizer bars (decorative animation until the real audio is connected). */
  readonly bars: number[] = Array.from({ length: 28 }, (_, i) => i);

  readonly mapping: { visual: string; sound: string; detail: string }[] = [
    { visual: 'Color', sound: 'Note pitch', detail: 'Low values sound low; high values sound high.' },
    { visual: 'Brightness', sound: 'Volume', detail: 'The brighter the region, the louder the sound.' },
    { visual: 'Variation', sound: 'Rhythm', detail: 'Areas with a lot of change play more notes per second.' },
    { visual: 'Position', sound: 'Left and right', detail: 'The sound moves from one headphone to the other.' },
  ];

  /* ==========================================================================
   * 4. GLOBE AND TIME
   * ======================================================================== */

  readonly regions: Region[] = [
    { id: 'amazon', label: 'Amazon', lat: -3, lon: -60 },
    { id: 'arctic', label: 'Arctic', lat: 90, lon: 0 },
    { id: 'antarctica', label: 'Antarctica', lat: -90, lon: 0 },
    { id: 'north-atlantic', label: 'North Atlantic', lat: 35, lon: -40 },
    { id: 'sahara', label: 'Sahara', lat: 23, lon: 13 },
    { id: 'pacific', label: 'Pacific', lat: 0, lon: -160 },
  ];

  currentFrame = 0;
  /** Date text of the current frame; should come from loadFrame(). */
  frameDate = '[frame date]';
  autoRotate = true;
  activeRegion: string | null = null;

  /* ==========================================================================
   * 5. ACCESSIBILITY
   * ======================================================================== */

  a11y: Accessibility = {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    vibration: false,
    announcements: true,
  };

  readonly accessibilityOptions: AccessibilityOption[] = [
    { key: 'highContrast', label: 'High contrast', description: 'Black background, white text and borders.' },
    { key: 'largeText', label: 'Larger text', description: 'Increases all the letters in the panel.' },
    { key: 'reducedMotion', label: 'Reduce animations', description: 'Turns off transitions and the visualizer.' },
    { key: 'vibration', label: 'Vibrate on peaks', description: 'Only on compatible phones.' },
    { key: 'announcements', label: 'Screen reader announcements', description: 'Announces what is playing and where.' },
  ];

  readonly shortcuts: { key: string; action: string }[] = [
    { key: 'Space', action: 'Play or pause' },
    { key: 'M', action: 'Mute' },
    { key: '1 to 6', action: 'Open a panel page' },
    { key: 'Arrows', action: 'Move the cursor in Explore mode' },
    { key: 'Esc', action: 'Close the panel' },
  ];

  /** Text read by the screen reader (aria-live region in the HTML). */
  announcement = '';

  /* ==========================================================================
   * 6. ABOUT
   * ======================================================================== */

  readonly steps: string[] = [
    'Pick a record on the Records page.',
    'Press Play to hear the globe sweep.',
    'Switch to Explore and move the cursor to hear each point.',
  ];

  shareLink = '';
  linkCopied = false;

  /* ==========================================================================
   * LIFECYCLE
   * ======================================================================== */

  ngOnInit(): void {
    this.loadPreferences();
    this.readSettingsFromUrl();
    this.loadRecords();
  }

  ngAfterViewInit(): void {
    this.startButton?.nativeElement.focus();
  }

  /* ==========================================================================
   * ACTIONS: NAVIGATION
   * ======================================================================== */

  get sectionTitle(): string {
    return this.sections.find((s) => s.id === this.activeSection)?.label ?? '';
  }

  openSection(id: SectionId): void {
    if (this.activeSection === id && this.panelOpen) {
      this.panelOpen = false;
      return;
    }
    this.activeSection = id;
    this.panelOpen = true;
  }

  closePanel(): void {
    this.panelOpen = false;
  }

  /** "Share" button in the top bar: opens the About page and copies the link. */
  openShare(): void {
    this.activeSection = 'about';
    this.panelOpen = true;
    void this.share();
  }

  /** Closes the welcome screen. The click also unlocks audio in the browser. */
  start(): void {
    this.showWelcome = false;
    if (!this.playing) {
      this.togglePlayback();
    }
  }

  /* ==========================================================================
   * ACTIONS: RECORDS
   * ======================================================================== */

  get legendGradient(): string {
    return 'linear-gradient(90deg, ' + this.currentRecord.colors.join(', ') + ')';
  }

  selectRecord(record: RecordItem): void {
    this.currentRecord = record;
    this.currentFrame = 0;
    this.reading = { region: '?', value: '?', note: '?' };
    this.loadFrame(record.id, 0);
    this.announce('Record selected: ' + record.title);
  }

  nextRecord(): void {
    const i = this.records.indexOf(this.currentRecord);
    this.selectRecord(this.records[(i + 1) % this.records.length]);
  }

  previousRecord(): void {
    const i = this.records.indexOf(this.currentRecord);
    this.selectRecord(this.records[(i - 1 + this.records.length) % this.records.length]);
  }

  toggleSequence(): void {
    this.playInSequence = !this.playInSequence;
  }

  /* ==========================================================================
   * ACTIONS: SOUND
   * ======================================================================== */

  togglePlayback(): void {
    this.playing = !this.playing;
    if (this.playing) {
      this.startAudio();
      this.announce('Playing ' + this.currentRecord.title);
    } else {
      this.pauseAudio();
      this.announce('Paused');
    }
  }

  setMode(mode: Mode): void {
    this.sound.mode = mode;
    this.onSettingsChange();
    this.announce(mode === 'sweep' ? 'Sweep mode' : 'Explore mode: use the arrow keys to move the cursor');
  }

  setScale(id: string): void {
    this.sound.scale = id;
    this.onSettingsChange();
  }

  setInstrument(id: string): void {
    this.sound.instrument = id;
    this.onSettingsChange();
  }

  setSpeed(value: string | number): void {
    this.sound.speed = Number(value);
    this.onSettingsChange();
  }

  setVolume(value: string | number): void {
    this.sound.volume = Number(value);
    this.sound.muted = this.sound.volume === 0;
    this.applySoundSettings(this.sound);
  }

  toggleMute(): void {
    this.sound.muted = !this.sound.muted;
    this.applySoundSettings(this.sound);
    this.announce(this.sound.muted ? 'Sound muted' : 'Sound on');
  }

  applyPreset(p: Preset): void {
    this.sound.scale = p.scale;
    this.sound.instrument = p.instrument;
    this.sound.speed = p.speed;
    this.activePreset = p.id;
    this.applySoundSettings(this.sound);
    this.announce('Preset ' + p.label + ' applied');
  }

  /** Any manual adjustment clears the preset and notifies the audio engine. */
  private onSettingsChange(): void {
    this.activePreset = null;
    this.applySoundSettings(this.sound);
  }

  /* ==========================================================================
   * ACTIONS: GLOBE AND TIME
   * ======================================================================== */

  setFrame(value: string | number): void {
    this.currentFrame = Number(value);
    this.loadFrame(this.currentRecord.id, this.currentFrame);
  }

  rotate(direction: 'left' | 'right'): void {
    this.activeRegion = null;
    this.rotateGlobe(direction);
  }

  zoom(direction: 'in' | 'out'): void {
    this.zoomGlobe(direction === 'in' ? 1 : -1);
  }

  toggleAutoRotate(): void {
    this.autoRotate = !this.autoRotate;
    this.setGlobeAutoRotate(this.autoRotate);
  }

  goToRegion(region: Region): void {
    this.activeRegion = region.id;
    this.cursor = { lat: region.lat, lon: region.lon };
    this.focusRegionOnGlobe(region);
    this.announce('Globe at ' + region.label);
  }

  /** Moves the Explore-mode cursor in 5-degree steps. */
  moveCursor(dLat: number, dLon: number): void {
    const lat = Math.max(-90, Math.min(90, this.cursor.lat + dLat));
    let lon = this.cursor.lon + dLon;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    this.cursor = { lat, lon };
    this.activeRegion = null;
    this.explorePoint(lat, lon);
  }

  /* ==========================================================================
   * ACTIONS: ACCESSIBILITY
   * ======================================================================== */

  toggleAccessibility(key: keyof Accessibility): void {
    this.a11y[key] = !this.a11y[key];
    this.savePreferences();
  }

  /** Sends text to the screen reader, if announcements are on. */
  announce(text: string): void {
    if (this.a11y.announcements) {
      this.announcement = text;
    }
  }

  private vibrate(ms = 40): void {
    if (this.a11y.vibration && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (this.showWelcome || event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }

    if (event.key === 'Escape') {
      this.closePanel();
      return;
    }

    // Inside buttons, fields and lists, keys keep their normal behavior.
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA', 'BUTTON', 'A'].includes(target.tagName)) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === ' ') {
      event.preventDefault();
      this.togglePlayback();
    } else if (key === 'm') {
      this.toggleMute();
    } else if (key.length === 1 && key >= '1' && key <= '6') {
      this.openSection(this.sections[Number(key) - 1].id);
    } else if (this.sound.mode === 'explore' && key.startsWith('arrow')) {
      event.preventDefault();
      if (key === 'arrowup') this.moveCursor(5, 0);
      if (key === 'arrowdown') this.moveCursor(-5, 0);
      if (key === 'arrowleft') this.moveCursor(0, -5);
      if (key === 'arrowright') this.moveCursor(0, 5);
    }
  }

  private savePreferences(): void {
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(this.a11y));
    } catch {
      // No storage available: preferences only last for this visit.
    }
  }

  private loadPreferences(): void {
    try {
      const saved = localStorage.getItem(PREFERENCES_KEY);
      if (saved) {
        this.a11y = { ...this.a11y, ...JSON.parse(saved) };
      }
    } catch {
      // Ignore unreadable preferences.
    }
  }

  /* ==========================================================================
   * ACTIONS: SHARE
   * ======================================================================== */

  async share(): Promise<void> {
    const params = new URLSearchParams({
      record: this.currentRecord.id,
      mode: this.sound.mode,
      scale: this.sound.scale,
      instrument: this.sound.instrument,
      speed: String(this.sound.speed),
    });
    this.shareLink = window.location.origin + window.location.pathname + '?' + params.toString();

    try {
      await navigator.clipboard.writeText(this.shareLink);
      this.linkCopied = true;
      this.announce('Link copied');
    } catch {
      // No permission to copy: the link stays visible in the field for manual copy.
      this.linkCopied = false;
    }
  }

  /** Opens the site with the record and settings that came in the shared link. */
  private readSettingsFromUrl(): void {
    const p = new URLSearchParams(window.location.search);

    const record = this.records.find((r) => r.id === p.get('record'));
    if (record) this.currentRecord = record;

    const mode = p.get('mode');
    if (mode === 'sweep' || mode === 'explore') this.sound.mode = mode;

    const scale = p.get('scale');
    if (this.scales.some((s) => s.id === scale)) this.sound.scale = scale as string;

    const instrument = p.get('instrument');
    if (this.instruments.some((i) => i.id === instrument)) this.sound.instrument = instrument as string;

    const speed = Number(p.get('speed'));
    if (speed >= this.speedMin && speed <= this.speedMax) this.sound.speed = speed;
  }

  /* ==========================================================================
   * INTEGRATION: BACKEND, AUDIO ENGINE AND 3D GLOBE
   *
   * Nothing below is implemented. Each function describes what the dashboard
   * expects from the other part of the project. Ideally, move these functions
   * into services (e.g. RecordsService, AudioService, GlobeService) and inject
   * them.
   * ======================================================================== */

  // ---- Backend --------------------------------------------------------------

  /**
   * BACKEND: fetch the catalog of EIC visualizations.
   * Expected: a list of RecordItem (id, title, description, period, source, legend
   * colors, minimum and maximum values, total frames).
   * On receive: this.records = response; this.currentRecord = this.records[0].
   */
  private loadRecords(): void {
    // TODO(backend): e.g. GET /api/records
  }

  /**
   * BACKEND: fetch one frame (image) of a visualization.
   * Expected: the frame image and its date.
   * On receive: update this.frameDate and hand the image to the 3D globe
   * (texture) and to the audio engine (pixels to sonify).
   */
  private loadFrame(recordId: string, index: number): void {
    // TODO(backend): e.g. GET /api/records/{recordId}/frames/{index}
  }

  // ---- Audio engine (sonification) ------------------------------------------

  /**
   * AUDIO: start sonifying the current frame with the settings in this.sound.
   * In "sweep" mode, scan across the image; in "explore" mode, play only the
   * point at this.cursor. If this.playInSequence is true, call nextRecord()
   * when the sweep of the last frame finishes.
   */
  private startAudio(): void {
    // TODO(audio): create or resume the AudioContext and start playing.
  }

  /** AUDIO: pause the sonification without losing the sweep position. */
  private pauseAudio(): void {
    // TODO(audio)
  }

  /**
   * AUDIO: apply mode, scale, instrument, speed (40 to 160), volume (0 to 100)
   * and mute. Called on every change in the controls.
   */
  private applySoundSettings(settings: SoundSettings): void {
    // TODO(audio)
  }

  /**
   * AUDIO -> DASHBOARD: the audio engine should call this on every note,
   * reporting the region, the data value and the note played. "peak" flags an
   * extreme value, used for phone vibration.
   * For the real audio visualizer, connect an AnalyserNode to the HTML bars.
   */
  receiveReading(reading: Reading, peak = false): void {
    this.reading = reading;
    this.announce(reading.region + ': ' + reading.value + ', note ' + reading.note);
    if (peak) {
      this.vibrate();
    }
  }

  // ---- 3D globe -------------------------------------------------------------

  /** GLOBE: rotate one step to the left or to the right. */
  private rotateGlobe(direction: 'left' | 'right'): void {
    // TODO(globe)
  }

  /** GLOBE: move the camera closer (+1) or farther (-1). */
  private zoomGlobe(step: number): void {
    // TODO(globe)
  }

  /** GLOBE: turn continuous rotation on or off. */
  private setGlobeAutoRotate(enabled: boolean): void {
    // TODO(globe)
  }

  /** GLOBE: rotate until the region's latitude and longitude are centered. */
  private focusRegionOnGlobe(region: Region): void {
    // TODO(globe)
  }

  /**
   * GLOBE + AUDIO: show the cursor at (lat, lon) on the globe and play the note
   * for that point. The globe should also call moveCursor() or update
   * this.cursor when the person hovers or touches it.
   */
  private explorePoint(lat: number, lon: number): void {
    // TODO(globe + audio)
  }
}