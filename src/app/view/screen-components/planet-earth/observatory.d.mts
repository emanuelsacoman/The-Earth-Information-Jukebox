export interface GeoPoint { lat: number; lon: number; }
export interface ObservatoryHandle {
  select(point: GeoPoint): void;
  dispose(): void;
}
export function mountObservatory(host: HTMLElement, options?: {onSelect?: (point: GeoPoint) => void}): ObservatoryHandle;
