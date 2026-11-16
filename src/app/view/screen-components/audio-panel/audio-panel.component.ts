import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  AfterRenderRef,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
  afterNextRender,
  inject,
} from '@angular/core';
import { PlaybackCoordinator } from '../../../sonification/playback-coordinator';
import { SCIENTIFIC_RECORDS } from '../../../sonification/scientific-catalog';
import { PlaybackStatus } from '../../../sonification/sonification.types';

@Component({
  selector: 'app-audio-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audio-panel.component.html',
  styleUrl: './audio-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AudioPanelComponent implements OnInit, OnChanges, OnDestroy {
  @Input() expanded = false;
  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @ViewChild('sciencePanel') private sciencePanel?: ElementRef<HTMLElement>;
  @ViewChild('methodDetails')
  private methodDetails?: ElementRef<HTMLDetailsElement>;
  readonly playback = inject(PlaybackCoordinator);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly injector = inject(Injector);
  private focusRequest: AfterRenderRef | null = null;
  readonly records = SCIENTIFIC_RECORDS;
  readonly statusLabels: Record<PlaybackStatus, string> = {
    idle: 'Not ready',
    loading: 'Checking image',
    ready: 'Ready',
    playing: 'Playing',
    paused: 'Paused',
    ended: 'Scan complete',
    error: 'Unable to continue',
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId))
      this.select(this.records[0].frames[0].id);
  }

  select(frameId: string): void {
    const record = this.records.find((item) =>
      item.frames.some((frame) => frame.id === frameId),
    );
    if (record) void this.playback.select(record, frameId);
  }

  togglePlayback(): void {
    if (this.playback.state().status === 'playing') this.playback.pause();
    else {
      this.expandedChange.emit(true);
      void this.playback.play();
    }
  }

  focusPanel(showMethod = false): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.cancelFocus();
    this.focusRequest = afterNextRender(
      () => {
        this.focusRequest = null;
        if (!this.expanded) return;
        if (showMethod && this.methodDetails) {
          this.methodDetails.nativeElement.open = true;
          this.methodDetails.nativeElement.querySelector('summary')?.focus();
        } else this.sciencePanel?.nativeElement.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }

  ngOnChanges(): void {
    if (!this.expanded) this.cancelFocus();
  }

  ngOnDestroy(): void {
    this.cancelFocus();
  }

  private cancelFocus(): void {
    this.focusRequest?.destroy();
    this.focusRequest = null;
  }

  get canPlay(): boolean {
    const state = this.playback.state();
    return (
      ['ready', 'playing', 'paused', 'ended'].includes(state.status) ||
      (state.status === 'error' && this.playback.frame() !== null)
    );
  }

  retry(): void {
    this.select(
      this.playback.state().currentFrameId ?? this.records[0].frames[0].id,
    );
  }
}
