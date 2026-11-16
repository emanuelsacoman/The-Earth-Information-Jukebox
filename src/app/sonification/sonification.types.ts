export interface PixelRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ScientificFrame {
  id: string;
  recordId: string;
  order: number;
  observationYear: number;
  resourceUrl: string;
  sourceUrl: string;
  width: number;
  height: number;
  sha256: string;
  roi: PixelRegion;
  excludedRegions?: readonly PixelRegion[];
}

export interface ScientificRecord {
  id: string;
  schemaVersion: 1;
  title: string;
  description: string;
  originUrl: string;
  credits: string;
  usageUrl: string;
  limitations: string;
  frames: readonly ScientificFrame[];
}

export interface ExtractedFeature {
  id: string;
  recordId: string;
  frameId: string;
  resourceVersion: string;
  index: number;
  kind: 'relative-image-brightness';
  domain: 'visual-pixel';
  rawValue: number | null;
  normalizedValue: number | null;
  validity: 'valid' | 'masked' | 'missing';
  extent: PixelRegion;
  position: { x: number; y: number };
  extractionMethod: string;
}

export interface SonificationEvent {
  id: string;
  origin: {
    recordId: string;
    frameId: string;
    featureId: string;
    resourceVersion: string;
    extractionMethod: string;
  };
  featureSnapshot: ExtractedFeature;
  mappingVersion: string;
  frequencyHz: number;
  note: string;
  intensity: number;
  durationSeconds: number;
  timelineOffsetSeconds: number;
  pan: number;
  textDescription: string;
}

export type PlaybackStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';
export interface PlaybackState {
  status: PlaybackStatus;
  sessionRevision: number;
  selectedRecordId: string | null;
  currentFrameId: string | null;
  position: number;
  duration: number;
  volume: number;
  muted: boolean;
  speed: number;
  audioStatus: 'uninitialized' | AudioContextState | 'unavailable';
  currentEvent: SonificationEvent | null;
  currentFeature: ExtractedFeature | null;
  execution: {
    eventId: string;
    sessionRevision: number;
    scheduledAudioTimeSeconds: number;
    observedAudioTimeSeconds: number | null;
    status: 'executed';
  } | null;
  error: string | null;
  announcement: string;
}
