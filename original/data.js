// ============================================================================
// Neural City × Road Safety Insights — Data Layer
// Sources: Neural City SEM 2026 (confirmed rankings), NCRB 2023
// ============================================================================

// ---------------------------------------------------------------------------
// 10 Confirmed Matched Cities (Neural City score + NCRB accident data)
// Gurgaon (#3, NC 48.8) excluded — no NCRB city-level entry
// ---------------------------------------------------------------------------
const MATCHED_CITIES = [
  {
    id: "bengaluru", displayName: "Bengaluru", csvName: "BENGALURU",
    ncScore: 49.2, ncRank: 1,
    ncrb: { cases: 4980, injured: 4162, died: 915 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "ahmedabad", displayName: "Ahmedabad", csvName: "AHMEDABAD",
    ncScore: 49.0, ncRank: 2,
    ncrb: { cases: 1808, injured: 1347, died: 577 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "vizag", displayName: "Vizag", csvName: "VISHAKHAPATNAM",
    ncScore: 48.8, ncRank: 4,
    ncrb: { cases: 1297, injured: 1222, died: 326 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "lucknow", displayName: "Lucknow", csvName: "LUCKNOW",
    ncScore: 48.4, ncRank: 5,
    ncrb: { cases: 1235, injured: 784, died: 547 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "hyderabad", displayName: "Hyderabad", csvName: "HYDERABAD",
    ncScore: 47.6, ncRank: 6,
    ncrb: { cases: 2943, injured: 2596, died: 335 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "indore", displayName: "Indore", csvName: "INDORE",
    ncScore: 47.2, ncRank: 7,
    ncrb: { cases: 3580, injured: 2768, died: 310 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "chennai", displayName: "Chennai", csvName: "CHENNAI",
    ncScore: 46.5, ncRank: 8,
    ncrb: { cases: 3653, injured: 3958, died: 503 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "delhi", displayName: "NCT of Delhi", csvName: "DELHI (CITY)",
    ncScore: 46.3, ncRank: 9,
    ncrb: { cases: 6543, injured: 5080, died: 2085 },
    hasDataAnomaly: false, anomalyNote: null
  },
  {
    id: "mumbai", displayName: "Mumbai", csvName: "MUMBAI",
    ncScore: 45.7, ncRank: 10,
    ncrb: { cases: 414, injured: 1924, died: 414 },
    hasDataAnomaly: true,
    anomalyNote: "Cases likely represent fatal accidents only. 100% fatality rate is a reporting artifact, not a real-world measure."
  },
  {
    id: "surat", displayName: "Surat", csvName: "SURAT",
    ncScore: 45.6, ncRank: 11,
    ncrb: { cases: 685, injured: 461, died: 344 },
    hasDataAnomaly: false, anomalyNote: null
  }
];

// ---------------------------------------------------------------------------
// Full NCRB 2023 Dataset — 53 cities (for Chart D / reference table)
// TOTAL row excluded
// ---------------------------------------------------------------------------
const FULL_NCRB = [
  { name: "Agra", cases: 590, injured: 157, died: 528, isMatched: false, isAnomaly: true, anomalyNote: "89.5% fatality rate — likely reflects reporting methodology differences" },
  { name: "Ahmedabad", cases: 1808, injured: 1347, died: 577, isMatched: true, isAnomaly: false },
  { name: "Amritsar", cases: 147, injured: 73, died: 110, isMatched: false, isAnomaly: false },
  { name: "Asansol", cases: 406, injured: 173, died: 344, isMatched: false, isAnomaly: true, anomalyNote: "84.7% fatality rate" },
  { name: "Aurangabad", cases: 604, injured: 402, died: 265, isMatched: false, isAnomaly: false },
  { name: "Bengaluru", cases: 4980, injured: 4162, died: 915, isMatched: true, isAnomaly: false },
  { name: "Bhopal", cases: 2968, injured: 2196, died: 258, isMatched: false, isAnomaly: false },
  { name: "Chandigarh", cases: 182, injured: 171, died: 67, isMatched: false, isAnomaly: false },
  { name: "Chennai", cases: 3653, injured: 3958, died: 503, isMatched: true, isAnomaly: false },
  { name: "Coimbatore", cases: 1161, injured: 993, died: 305, isMatched: false, isAnomaly: false },
  { name: "Delhi", cases: 6543, injured: 5080, died: 2085, isMatched: true, isAnomaly: false },
  { name: "Dhanbad", cases: 195, injured: 70, died: 126, isMatched: false, isAnomaly: false },
  { name: "Durg Bhilainagar", cases: 807, injured: 649, died: 157, isMatched: false, isAnomaly: false },
  { name: "Faridabad", cases: 636, injured: 485, died: 307, isMatched: false, isAnomaly: false },
  { name: "Ghaziabad", cases: 928, injured: 661, died: 403, isMatched: false, isAnomaly: false },
  { name: "Gwalior", cases: 1267, injured: 1138, died: 207, isMatched: false, isAnomaly: false },
  { name: "Hyderabad", cases: 2943, injured: 2596, died: 335, isMatched: true, isAnomaly: false },
  { name: "Indore", cases: 3580, injured: 2768, died: 310, isMatched: true, isAnomaly: false },
  { name: "Jabalpur", cases: 2350, injured: 2606, died: 299, isMatched: false, isAnomaly: false },
  { name: "Jaipur", cases: 3082, injured: 2333, died: 1017, isMatched: false, isAnomaly: false },
  { name: "Jamshedpur", cases: 155, injured: 134, died: 72, isMatched: false, isAnomaly: false },
  { name: "Jodhpur", cases: 699, injured: 573, died: 270, isMatched: false, isAnomaly: false },
  { name: "Kannur", cases: 1562, injured: 2018, died: 148, isMatched: false, isAnomaly: false },
  { name: "Kanpur", cases: 1776, injured: 985, died: 791, isMatched: false, isAnomaly: false },
  { name: "Kochi", cases: 2610, injured: 2788, died: 202, isMatched: false, isAnomaly: false },
  { name: "Kolkata", cases: 1129, injured: 925, died: 204, isMatched: false, isAnomaly: false },
  { name: "Kollam", cases: 2135, injured: 2318, died: 251, isMatched: false, isAnomaly: false },
  { name: "Kota", cases: 611, injured: 642, died: 135, isMatched: false, isAnomaly: false },
  { name: "Kozhikode", cases: 2045, injured: 2266, died: 192, isMatched: false, isAnomaly: false },
  { name: "Lucknow", cases: 1235, injured: 784, died: 547, isMatched: true, isAnomaly: false },
  { name: "Ludhiana", cases: 504, injured: 209, died: 402, isMatched: false, isAnomaly: true, anomalyNote: "79.8% fatality rate" },
  { name: "Madurai", cases: 768, injured: 583, died: 264, isMatched: false, isAnomaly: false },
  { name: "Malappuram", cases: 959, injured: 1194, died: 111, isMatched: false, isAnomaly: false },
  { name: "Meerut", cases: 496, injured: 404, died: 198, isMatched: false, isAnomaly: false },
  { name: "Mumbai", cases: 414, injured: 1924, died: 414, isMatched: true, isAnomaly: true, anomalyNote: "Deaths exactly equal cases — reporting artifact" },
  { name: "Nagpur", cases: 1276, injured: 1211, died: 371, isMatched: false, isAnomaly: false },
  { name: "Nasik", cases: 261, injured: 150, died: 261, isMatched: false, isAnomaly: true, anomalyNote: "100% fatality rate — same reporting pattern as Mumbai" },
  { name: "Patna", cases: 322, injured: 166, died: 200, isMatched: false, isAnomaly: false },
  { name: "Prayagraj", cases: 1297, injured: 865, died: 582, isMatched: false, isAnomaly: false },
  { name: "Pune", cases: 546, injured: 185, died: 437, isMatched: false, isAnomaly: true, anomalyNote: "80% fatality rate" },
  { name: "Raipur", cases: 1087, injured: 663, died: 168, isMatched: false, isAnomaly: false },
  { name: "Rajkot", cases: 505, injured: 380, died: 189, isMatched: false, isAnomaly: false },
  { name: "Ranchi", cases: 263, injured: 192, died: 117, isMatched: false, isAnomaly: false },
  { name: "Srinagar", cases: 476, injured: 491, died: 55, isMatched: false, isAnomaly: false },
  { name: "Surat", cases: 685, injured: 461, died: 344, isMatched: true, isAnomaly: false },
  { name: "Thiruvananthapuram", cases: 2106, injured: 2326, died: 137, isMatched: false, isAnomaly: false },
  { name: "Thrissur", cases: 2456, injured: 3029, died: 243, isMatched: false, isAnomaly: false },
  { name: "Tiruchirappalli", cases: 619, injured: 652, died: 165, isMatched: false, isAnomaly: false },
  { name: "Vadodara", cases: 573, injured: 404, died: 206, isMatched: false, isAnomaly: false },
  { name: "Varanasi", cases: 237, injured: 158, died: 264, isMatched: false, isAnomaly: true, anomalyNote: "Deaths exceed cases (111%) — data quality issue" },
  { name: "Vasai Virar", cases: 365, injured: 246, died: 154, isMatched: false, isAnomaly: false },
  { name: "Vijayawada", cases: 1522, injured: 1416, died: 373, isMatched: false, isAnomaly: false },
  { name: "Vishakhapatnam", cases: 1297, injured: 1222, died: 326, isMatched: true, isAnomaly: false }
];


// ---------------------------------------------------------------------------
// Computation Engine
// ---------------------------------------------------------------------------

function computeMetrics(cities) {
  // Step 1: Fatality rate for all cities
  cities.forEach(c => {
    c.fatalityRate = (c.ncrb.died / c.ncrb.cases) * 100;
  });

  // Step 2: Separate normal from anomaly
  const normal = cities.filter(c => !c.hasDataAnomaly);
  const anomaly = cities.filter(c => c.hasDataAnomaly);

  // Step 3: FR range among normal cities only
  const frs = normal.map(c => c.fatalityRate);
  const frMax = Math.max(...frs);
  const frMin = Math.min(...frs);
  const frRange = frMax - frMin;

  // Step 4: Safety Outcome Score (SOS) — 0 to 100, higher = safer
  normal.forEach(c => {
    c.sos = frRange > 0
      ? 100 * (frMax - c.fatalityRate) / frRange
      : 50;
  });

  // Step 5: Street Reality Index (SRI)
  // Formula 1: Weighted Composite — 40% NC Score + 60% SOS
  normal.forEach(c => {
    c.sri = 0.40 * c.ncScore + 0.60 * c.sos;
  });

  // Step 6: Anomaly cities get null computed metrics
  anomaly.forEach(c => {
    c.sos = null;
    c.sri = null;
  });

  // Step 7: Rank by NC Score within matched set (1 = best quality)
  const byNC = [...normal].sort((a, b) => b.ncScore - a.ncScore);
  byNC.forEach((c, i) => { c.ncRankMatched = i + 1; });

  // Step 8: Rank by Fatality Rate (1 = lowest FR = safest)
  const byFR = [...normal].sort((a, b) => a.fatalityRate - b.fatalityRate);
  byFR.forEach((c, i) => { c.safetyRank = i + 1; });

  // Step 9: Gap Score = Safety Rank - NC Rank
  // Positive = worse safety than street quality would suggest
  // Negative = safer than street quality would suggest
  normal.forEach(c => {
    c.gapScore = c.safetyRank - c.ncRankMatched;
  });

  // Step 10: Safety Tier classification
  cities.forEach(c => {
    if (c.hasDataAnomaly) {
      c.safetyTier = "ANOMALY";
    } else if (c.fatalityRate < 20) {
      c.safetyTier = "SAFE";
    } else if (c.fatalityRate <= 35) {
      c.safetyTier = "CAUTION";
    } else {
      c.safetyTier = "DANGER";
    }
  });

  // Step 11: SRI Rank among normal cities (1 = best composite)
  const bySRI = [...normal].sort((a, b) => b.sri - a.sri);
  bySRI.forEach((c, i) => { c.sriRank = i + 1; });

  // Step 12: Anomaly cities get null for rank fields
  anomaly.forEach(c => {
    c.ncRankMatched = null;
    c.safetyRank = null;
    c.gapScore = null;
    c.sriRank = null;
  });

  return cities;
}

// ---------------------------------------------------------------------------
// Gap Insight Text Generator
// ---------------------------------------------------------------------------

function generateGapInsight(city) {
  if (city.hasDataAnomaly) return city.anomalyNote;

  const fr = city.fatalityRate.toFixed(1);
  const died = city.ncrb.died.toLocaleString();
  const cases = city.ncrb.cases.toLocaleString();

  if (city.gapScore > 0) {
    // Danger gap — streets look good but safety is poor
    return `${city.displayName} ranks #${city.ncRankMatched} in Neural City's street quality assessment but drops to #${city.safetyRank} in safety outcomes. With a ${fr}% fatality rate — ${died} deaths from ${cases} reported accidents — the city's infrastructure quality has not translated into safer roads.`;
  } else if (city.gapScore < 0) {
    // Safe surprise — streets look average but safety is good
    return `Despite ranking only #${city.ncRankMatched} in street quality, ${city.displayName} achieves the #${city.safetyRank} safest outcome among matched cities. A ${fr}% fatality rate — ${died} deaths from ${cases} cases — suggests factors beyond visual infrastructure are driving better safety outcomes.`;
  } else {
    return `${city.displayName} ranks consistently at #${city.ncRankMatched} in both street quality and safety outcomes. Its ${fr}% fatality rate aligns with what its infrastructure quality would suggest.`;
  }
}

// ---------------------------------------------------------------------------
// Sort Utility
// ---------------------------------------------------------------------------

function sortCities(cities, field, ascending = true) {
  return [...cities].sort((a, b) => {
    let valA, valB;

    switch (field) {
      case "displayName": valA = a.displayName; valB = b.displayName; break;
      case "ncScore": valA = a.ncScore; valB = b.ncScore; break;
      case "cases": valA = a.ncrb.cases; valB = b.ncrb.cases; break;
      case "injured": valA = a.ncrb.injured; valB = b.ncrb.injured; break;
      case "died": valA = a.ncrb.died; valB = b.ncrb.died; break;
      case "fatalityRate": valA = a.fatalityRate; valB = b.fatalityRate; break;
      case "sos": valA = a.sos ?? -1; valB = b.sos ?? -1; break;
      case "sri": valA = a.sri ?? -1; valB = b.sri ?? -1; break;
      case "gapScore": valA = a.gapScore ?? 99; valB = b.gapScore ?? 99; break;
      default: valA = 0; valB = 0;
    }

    if (typeof valA === "string") {
      return ascending ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return ascending ? valA - valB : valB - valA;
  });
}

// ---------------------------------------------------------------------------
// Summary Statistics
// ---------------------------------------------------------------------------

function computeSummaryStats(cities) {
  const normal = cities.filter(c => !c.hasDataAnomaly);
  const totalDeaths = cities.reduce((s, c) => s + c.ncrb.died, 0);
  const totalCases = cities.reduce((s, c) => s + c.ncrb.cases, 0);
  const avgFR = normal.reduce((s, c) => s + c.fatalityRate, 0) / normal.length;
  const gapCities = normal.filter(c => c.gapScore > 0).length;

  return {
    cityCount: cities.length,
    totalDeaths,
    totalCases,
    avgFatalityRate: avgFR,
    gapCityCount: gapCities
  };
}
