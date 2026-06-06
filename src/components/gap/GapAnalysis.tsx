import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { generateGapInsight } from '../../data/computeMetrics';

export const GapAnalysis: React.FC = () => {
  const { state } = useDashboard();
  
  const normalCities = state.cities.filter(c => !c.hasDataAnomaly);
  const overrated = normalCities.filter(c => (c.gapScore ?? 0) > 0).sort((a, b) => (b.gapScore ?? 0) - (a.gapScore ?? 0));
  const underrated = normalCities.filter(c => (c.gapScore ?? 0) < 0).sort((a, b) => (a.gapScore ?? 0) - (b.gapScore ?? 0));
  
  return (
    <div id="gap-analysis" className="section-container">
      <h2 className="section-title">Safety Gap Analysis</h2>
      <p className="section-subtitle">
        Where does visual street quality fail to predict actual road safety? A positive gap means the city's safety is worse than its infrastructure score suggests.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overrated Cities (Danger) */}
        <div>
          <h3 className="text-sm font-bold tracking-tight text-accent-red uppercase mb-4 flex items-center gap-2">
            <span className="text-lg">⚠</span> Significant Safety Gaps
          </h3>
          <div className="flex flex-col gap-4">
            {overrated.map(city => (
              <div key={city.id} className="card border-l-4 border-l-accent-red hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg m-0">{city.displayName}</h4>
                  <span className="gap-badge gap-badge-positive px-3 py-1">-{city.gapScore} Rank Drop</span>
                </div>
                <div className="flex gap-4 mb-3 text-sm">
                  <div><span className="text-text-muted text-xs uppercase block">NC Rank</span><span className="font-bold">#{city.ncRankMatched}</span></div>
                  <div><span className="text-text-muted text-xs uppercase block">Safety Rank</span><span className="font-bold">#{city.safetyRank}</span></div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed m-0">{generateGapInsight(city)}</p>
              </div>
            ))}
            {overrated.length === 0 && <div className="text-text-muted text-sm italic p-4">No significant negative gaps found.</div>}
          </div>
        </div>

        {/* Underrated Cities (Safe) */}
        <div>
          <h3 className="text-sm font-bold tracking-tight text-accent-green uppercase mb-4 flex items-center gap-2">
            <span className="text-lg">★</span> Outperforming Cities
          </h3>
          <div className="flex flex-col gap-4">
            {underrated.map(city => (
              <div key={city.id} className="card border-l-4 border-l-accent-green hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-lg m-0">{city.displayName}</h4>
                  <span className="gap-badge gap-badge-negative px-3 py-1">+{Math.abs(city.gapScore ?? 0)} Rank Jump</span>
                </div>
                <div className="flex gap-4 mb-3 text-sm">
                  <div><span className="text-text-muted text-xs uppercase block">NC Rank</span><span className="font-bold">#{city.ncRankMatched}</span></div>
                  <div><span className="text-text-muted text-xs uppercase block">Safety Rank</span><span className="font-bold">#{city.safetyRank}</span></div>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed m-0">{generateGapInsight(city)}</p>
              </div>
            ))}
            {underrated.length === 0 && <div className="text-text-muted text-sm italic p-4">No outperforming cities found.</div>}
          </div>
        </div>

      </div>
    </div>
  );
};
