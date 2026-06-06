// ============================================================================
// 10 Confirmed Matched Cities (Neural City score + NCRB accident data)
// Gurgaon (#3, NC 48.8) excluded — no NCRB city-level entry
// ============================================================================

import type { RawCity } from '../types';

export const MATCHED_CITIES: RawCity[] = [
  {
    id: 'bengaluru', displayName: 'Bengaluru', csvName: 'BENGALURU',
    ncScore: 49.2, ncRank: 1,
    ncrb: { cases: 4980, injured: 4162, died: 915 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'ahmedabad', displayName: 'Ahmedabad', csvName: 'AHMEDABAD',
    ncScore: 49.0, ncRank: 2,
    ncrb: { cases: 1808, injured: 1347, died: 577 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'vizag', displayName: 'Vizag', csvName: 'VISHAKHAPATNAM',
    ncScore: 48.8, ncRank: 4,
    ncrb: { cases: 1297, injured: 1222, died: 326 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'lucknow', displayName: 'Lucknow', csvName: 'LUCKNOW',
    ncScore: 48.4, ncRank: 5,
    ncrb: { cases: 1235, injured: 784, died: 547 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'hyderabad', displayName: 'Hyderabad', csvName: 'HYDERABAD',
    ncScore: 47.6, ncRank: 6,
    ncrb: { cases: 2943, injured: 2596, died: 335 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'indore', displayName: 'Indore', csvName: 'INDORE',
    ncScore: 47.2, ncRank: 7,
    ncrb: { cases: 3580, injured: 2768, died: 310 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'chennai', displayName: 'Chennai', csvName: 'CHENNAI',
    ncScore: 46.5, ncRank: 8,
    ncrb: { cases: 3653, injured: 3958, died: 503 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'delhi', displayName: 'NCT of Delhi', csvName: 'DELHI (CITY)',
    ncScore: 46.3, ncRank: 9,
    ncrb: { cases: 6543, injured: 5080, died: 2085 },
    hasDataAnomaly: false, anomalyNote: null,
  },
  {
    id: 'mumbai', displayName: 'Mumbai', csvName: 'MUMBAI',
    ncScore: 45.7, ncRank: 10,
    ncrb: { cases: 414, injured: 1924, died: 414 },
    hasDataAnomaly: true,
    anomalyNote: 'Cases likely represent fatal accidents only. 100% fatality rate is a reporting artifact, not a real-world measure.',
  },
  {
    id: 'surat', displayName: 'Surat', csvName: 'SURAT',
    ncScore: 45.6, ncRank: 11,
    ncrb: { cases: 685, injured: 461, died: 344 },
    hasDataAnomaly: false, anomalyNote: null,
  },
];
