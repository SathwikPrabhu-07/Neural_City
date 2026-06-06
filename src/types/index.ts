// ============================================================================
// TypeScript Interfaces for Neural City × Road Safety Insights
// ============================================================================

// --- Raw Data Types ---

export interface NcrbData {
  cases: number;
  injured: number;
  died: number;
}

export interface RawCity {
  id: string;
  displayName: string;
  csvName: string;
  ncScore: number;
  ncRank: number;
  ncrb: NcrbData;
  hasDataAnomaly: boolean;
  anomalyNote: string | null;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

// --- Computed City (after computeMetrics) ---

export interface ComputedCity extends RawCity {
  fatalityRate: number;
  sos: number | null;
  sri: number | null;
  ncRankMatched: number | null;
  safetyRank: number | null;
  gapScore: number | null;
  safetyTier: SafetyTier;
  sriRank: number | null;
  coords: Coordinates;
}

// --- Enums & Unions ---

export type SafetyTier = 'SAFE' | 'CAUTION' | 'DANGER' | 'ANOMALY';

export type MapFilter = 'all' | 'high-risk' | 'safety-gap' | 'top-sri' | 'lowest-sri';

export type SortField =
  | 'sri'
  | 'displayName'
  | 'ncScore'
  | 'cases'
  | 'died'
  | 'fatalityRate'
  | 'sos'
  | 'gapScore';

// --- Full NCRB Reference ---

export interface NcrbRefCity {
  name: string;
  cases: number;
  injured: number;
  died: number;
  isMatched: boolean;
  isAnomaly: boolean;
  anomalyNote?: string;
}

// --- Dashboard State ---

export interface DashboardState {
  cities: ComputedCity[];
  fullNcrb: NcrbRefCity[];
  selectedCityId: string | null;
  mapFilter: MapFilter;
  sortField: SortField;
  sortAscending: boolean;
}

export type DashboardAction =
  | { type: 'SELECT_CITY'; cityId: string | null }
  | { type: 'SET_FILTER'; filter: MapFilter }
  | { type: 'SET_SORT'; field: SortField; ascending: boolean };

// --- Summary Stats ---

export interface SummaryStats {
  cityCount: number;
  totalDeaths: number;
  totalCases: number;
  avgFatalityRate: number;
  gapCityCount: number;
}
