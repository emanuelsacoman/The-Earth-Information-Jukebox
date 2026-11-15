import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
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
export class AudioPanelComponent implements OnInit {
  readonly playback = inject(PlaybackCoordinator);
  private readonly platformId = inject(PLATFORM_ID);
  readonly records = SCIENTIFIC_RECORDS;
  readonly statusLabels: Record<PlaybackStatus, string> = {
    idle: 'Aguardando preparação', loading: 'Verificando imagem', ready: 'Pronto para ouvir',
    playing: 'Reproduzindo', paused: 'Pausado', ended: 'Varredura concluída', error: 'Não foi possível continuar',
  };

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.select(this.records[0].frames[0].id);
  }

  select(frameId: string): void {
    const record = this.records.find(item => item.frames.some(frame => frame.id === frameId));
    if (record) void this.playback.select(record, frameId);
  }

  togglePlayback(): void {
    if (this.playback.state().status === 'playing') this.playback.pause();
    else void this.playback.play();
  }

  get canPlay(): boolean {
    const state = this.playback.state();
    return ['ready', 'playing', 'paused', 'ended'].includes(state.status)
      || (state.status === 'error' && this.playback.frame() !== null);
  }

  retry(): void {
    this.select(this.playback.state().currentFrameId ?? this.records[0].frames[0].id);
  }
}
