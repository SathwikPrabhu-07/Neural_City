// ============================================================================
// City Center Coordinates for Map Markers
// ============================================================================

import type { Coordinates } from '../types';

export const CITY_COORDINATES: Record<string, Coordinates> = {
  bengaluru:  { lat: 12.9716, lng: 77.5946 },
  ahmedabad:  { lat: 23.0225, lng: 72.5714 },
  vizag:      { lat: 17.6868, lng: 83.2185 },
  lucknow:    { lat: 26.8467, lng: 80.9462 },
  hyderabad:  { lat: 17.3850, lng: 78.4867 },
  indore:     { lat: 22.7196, lng: 75.8577 },
  chennai:    { lat: 13.0827, lng: 80.2707 },
  delhi:      { lat: 28.6139, lng: 77.2090 },
  mumbai:     { lat: 19.0760, lng: 72.8777 },
  surat:      { lat: 21.1702, lng: 72.8311 },
};

// Default map view — geographic center of India
export const MAP_CENTER: [number, number] = [22.5, 78.5];
export const MAP_DEFAULT_ZOOM = 5;
