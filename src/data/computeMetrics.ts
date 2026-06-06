// ============================================================================
// Computation Engine — SOS, SRI, Gap, Tier calculations
// ============================================================================

import type { RawCity, ComputedCity, SummaryStats } from '../types';
import { CITY_COORDINATES } from './coordinates';

export function computeMetrics(cities: RawCity[]): ComputedCity[] {
  // Deep clone to avoid mutations
  const result: ComputedCity[] = cities.map(c => ({
    ...c,
    ncrb: { ...c.ncrb },
    fatalityRate: (c.ncrb.died / c.ncrb.cases) * 100,
    sos: null,
    sri: null,
    ncRankMatched: null,
    safetyRank: null,
    gapScore: null,
    safetyTier: 'ANOMALY' as const,
    sriRank: null,
    coords: CITY_COORDINATES[c.id] ?? { lat: 0, lng: 0 },
  }));

  const normal = result.filter(c => !c.hasDataAnomaly);
  const anomaly = result.filter(c => c.hasDataAnomaly);

  // FR range among normal cities only
  const frs = normal.map(c => c.fatalityRate);
  const frMax = Math.max(...frs);
  const frMin = Math.min(...frs);
  const frRange = frMax - frMin;

  // Safety Outcome Score (SOS) — 0 to 100, higher = safer
  normal.forEach(c => {
    c.sos = frRange > 0 ? 100 * (frMax - c.fatalityRate) / frRange : 50;
  });

  // Street Reality Index (SRI) — 40% NC Score + 60% SOS
  normal.forEach(c => {
    c.sri = 0.40 * c.ncScore + 0.60 * (c.sos ?? 0);
  });

  // Anomaly cities get null computed metrics
  anomaly.forEach(c => {
    c.sos = null;
    c.sri = null;
  });

  // Rank by NC Score (1 = best quality)
  const byNC = [...normal].sort((a, b) => b.ncScore - a.ncScore);
  byNC.forEach((c, i) => { c.ncRankMatched = i + 1; });

  // Rank by Fatality Rate (1 = safest)
  const byFR = [...normal].sort((a, b) => a.fatalityRate - b.fatalityRate);
  byFR.forEach((c, i) => { c.safetyRank = i + 1; });

  // Gap Score = Safety Rank - NC Rank
  normal.forEach(c => {
    c.gapScore = (c.safetyRank ?? 0) - (c.ncRankMatched ?? 0);
  });

  // Safety Tier classification
  result.forEach(c => {
    if (c.hasDataAnomaly) {
      c.safetyTier = 'ANOMALY';
    } else if (c.fatalityRate < 20) {
      c.safetyTier = 'SAFE';
    } else if (c.fatalityRate <= 35) {
      c.safetyTier = 'CAUTION';
    } else {
      c.safetyTier = 'DANGER';
    }
  });

  // SRI Rank (1 = best composite)
  const bySRI = [...normal].sort((a, b) => (b.sri ?? 0) - (a.sri ?? 0));
  bySRI.forEach((c, i) => { c.sriRank = i + 1; });

  // Anomaly cities null ranks
  anomaly.forEach(c => {
    c.ncRankMatched = null;
    c.safetyRank = null;
    c.gapScore = null;
    c.sriRank = null;
  });

  return result;
}

// ============================================================================
// Gap Insight Text Generator
// ============================================================================

export function generateGapInsight(city: ComputedCity): string {
  if (city.hasDataAnomaly) return city.anomalyNote ?? '';

  const fr = city.fatalityRate.toFixed(1);
  const died = city.ncrb.died.toLocaleString();
  const cases = city.ncrb.cases.toLocaleString();

  if ((city.gapScore ?? 0) > 0) {
    return `${city.displayName} ranks #${city.ncRankMatched} in Neural City's street quality assessment but drops to #${city.safetyRank} in safety outcomes. With a ${fr}% fatality rate — ${died} deaths from ${cases} reported accidents — the city's infrastructure quality has not translated into safer roads.`;
  } else if ((city.gapScore ?? 0) < 0) {
    return `Despite ranking only #${city.ncRankMatched} in street quality, ${city.displayName} achieves the #${city.safetyRank} safest outcome among matched cities. A ${fr}% fatality rate — ${died} deaths from ${cases} cases — suggests factors beyond visual infrastructure are driving better safety outcomes.`;
  } else {
    return `${city.displayName} ranks consistently at #${city.ncRankMatched} in both street quality and safety outcomes. Its ${fr}% fatality rate aligns with what its infrastructure quality would suggest.`;
  }
}

// ============================================================================
// Sort Utility
// ============================================================================

export function sortCities(
  cities: ComputedCity[],
  field: string,
  ascending: boolean = true
): ComputedCity[] {
  return [...cities].sort((a, b) => {
    let valA: string | number;
    let valB: string | number;

    switch (field) {
      case 'displayName': valA = a.displayName; valB = b.displayName; break;
      case 'ncScore': valA = a.ncScore; valB = b.ncScore; break;
      case 'cases': valA = a.ncrb.cases; valB = b.ncrb.cases; break;
      case 'injured': valA = a.ncrb.injured; valB = b.ncrb.injured; break;
      case 'died': valA = a.ncrb.died; valB = b.ncrb.died; break;
      case 'fatalityRate': valA = a.fatalityRate; valB = b.fatalityRate; break;
      case 'sos': valA = a.sos ?? -1; valB = b.sos ?? -1; break;
      case 'sri': valA = a.sri ?? -1; valB = b.sri ?? -1; break;
      case 'gapScore': valA = a.gapScore ?? 99; valB = b.gapScore ?? 99; break;
      default: valA = 0; valB = 0;
    }

    if (typeof valA === 'string' && typeof valB === 'string') {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return ascending
      ? (valA as number) - (valB as number)
      : (valB as number) - (valA as number);
  });
}

// ============================================================================
// Summary Statistics
// ============================================================================

export function computeSummaryStats(cities: ComputedCity[]): SummaryStats {
  const normal = cities.filter(c => !c.hasDataAnomaly);
  const totalDeaths = cities.reduce((s, c) => s + c.ncrb.died, 0);
  const totalCases = cities.reduce((s, c) => s + c.ncrb.cases, 0);
  const avgFR = normal.reduce((s, c) => s + c.fatalityRate, 0) / normal.length;
  const gapCities = normal.filter(c => (c.gapScore ?? 0) > 0).length;

  return {
    cityCount: cities.length,
    totalDeaths,
    totalCases,
    avgFatalityRate: avgFR,
    gapCityCount: gapCities,
  };
}
