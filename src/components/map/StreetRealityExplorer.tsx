import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { CityMap } from './CityMap';
import { MapFilterControl } from './MapFilterControl';
import { MapLegend } from './MapLegend';

export const StreetRealityExplorer: React.FC = () => {
  const { state } = useDashboard();
  
  // Filter logic
  const filteredCities = state.cities.filter(city => {
    if (city.hasDataAnomaly) return true; // Always show anomalies for transparency
    
    switch (state.mapFilter) {
      case 'high-risk':
        return city.safetyTier === 'DANGER';
      case 'safety-gap':
        return (city.gapScore ?? 0) > 0;
      case 'top-sri':
        return (city.sriRank ?? 99) <= 3;
      case 'lowest-sri':
        return (city.sriRank ?? 0) >= 8;
      case 'all':
      default:
        return true;
    }
  });

  return (
    <div id="explorer" className="section-container">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-8 gap-4">
        <div>
          <h2 className="section-title">Street Reality Explorer</h2>
          <p className="section-subtitle mb-0">
            Interactive map correlating Neural City infrastructure scores with NCRB road safety outcomes.
          </p>
        </div>
        <MapFilterControl />
      </div>

      <div className="card p-0 overflow-hidden relative" style={{ height: '650px' }}>
        <div className="absolute top-4 left-4 z-10 w-64">
          <div className="bg-[rgba(15,22,36,0.9)] backdrop-blur p-4 rounded-xl border border-border shadow-lg">
            <h3 className="text-sm font-bold tracking-tight mb-2 uppercase text-text-secondary">Insight Layer</h3>
            <p className="text-xs text-text-muted mb-4 leading-relaxed">
              Circle size represents total fatalities. Color indicates Street Reality Index (SRI) combining visual quality and safety outcomes.
            </p>
            <MapLegend />
          </div>
        </div>

        <CityMap cities={filteredCities} />
      </div>
    </div>
  );
};
