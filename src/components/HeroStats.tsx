import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { computeSummaryStats } from '../data/computeMetrics';
import { fmt } from '../utils/formatters';

export const HeroStats: React.FC = () => {
  const { state } = useDashboard();
  const stats = computeSummaryStats(state.cities);

  return (
    <div className="bg-surface border-b border-border py-8 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-raised rounded-xl p-5 border-l-4 border-l-accent-blue shadow-sm">
          <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Cities Analyzed
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight mb-1">
            {stats.cityCount}
          </div>
          <div className="text-xs text-text-muted font-medium">
            Neural City × NCRB matched
          </div>
        </div>

        <div className="bg-raised rounded-xl p-5 border-l-4 border-l-accent-red shadow-sm">
          <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Total Road Deaths
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight mb-1">
            {fmt(stats.totalDeaths)}
          </div>
          <div className="text-xs text-text-muted font-medium">
            Across matched cities, 2023
          </div>
        </div>

        <div className="bg-raised rounded-xl p-5 border-l-4 border-l-accent-amber shadow-sm">
          <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Avg Fatality Rate
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight mb-1">
            {stats.avgFatalityRate.toFixed(1)}%
          </div>
          <div className="text-xs text-text-muted font-medium">
            Excl. Mumbai anomaly
          </div>
        </div>

        <div className="bg-raised rounded-xl p-5 border-l-4 border-l-accent-green shadow-sm">
          <div className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
            Gap Cities Found
          </div>
          <div className="text-3xl font-bold text-text-primary tracking-tight mb-1">
            {stats.gapCityCount}
          </div>
          <div className="text-xs text-text-muted font-medium">
            High quality, poor safety
          </div>
        </div>

      </div>
    </div>
  );
};
