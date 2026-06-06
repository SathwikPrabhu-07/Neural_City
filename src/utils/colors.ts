// ============================================================================
// Color and Sizing Utilities
// ============================================================================

import type { SafetyTier } from '../types';

export const TIER_COLORS: Record<SafetyTier, string> = {
  SAFE: '#10B981',    // Green
  CAUTION: '#F59E0B', // Amber
  DANGER: '#EF4444',  // Red
  ANOMALY: '#8B5CF6', // Purple
};

export const tierColor = (t: SafetyTier): string => TIER_COLORS[t] || '#7C8DB5';

// For map markers based on SRI
const SRI_COLOR_THRESHOLDS = [
  { min: 65, color: '#10B981', label: 'Safe' },
  { min: 50, color: '#FBBF24', label: 'Moderate' },
  { min: 35, color: '#F97316', label: 'Concerning' },
  { min: 0,  color: '#EF4444', label: 'High Risk' },
];

export const sriColor = (sri: number | null): string => {
  if (sri === null) return TIER_COLORS.ANOMALY;
  for (const threshold of SRI_COLOR_THRESHOLDS) {
    if (sri >= threshold.min) return threshold.color;
  }
  return '#EF4444'; // Fallback
};

// Map marker sizing (square root proportional to deaths)
const MIN_RADIUS = 14;
const MAX_RADIUS = 40;

export const markerRadius = (deaths: number, minDeaths: number, maxDeaths: number): number => {
  if (maxDeaths === minDeaths) return MIN_RADIUS;
  const normalized = Math.sqrt((deaths - minDeaths) / (maxDeaths - minDeaths));
  return MIN_RADIUS + normalized * (MAX_RADIUS - MIN_RADIUS);
};
