import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { sortCities } from '../../data/computeMetrics';
import { tierColor } from '../../utils/colors';
import { fmt, pct, scr } from '../../utils/formatters';

export const Leaderboard: React.FC = () => {
  const { state, dispatch } = useDashboard();
  
  // Sort logic
  const normalCities = state.cities.filter(c => !c.hasDataAnomaly);
  const anomalyCities = state.cities.filter(c => c.hasDataAnomaly);
  const sortedNormal = sortCities(normalCities, state.sortField, state.sortAscending);

  const toggleSort = (field: any) => {
    if (state.sortField === field) {
      dispatch({ type: 'SET_SORT', field, ascending: !state.sortAscending });
    } else {
      // Default to descending for scores/counts, ascending for text
      const asc = field === 'displayName';
      dispatch({ type: 'SET_SORT', field, ascending: asc });
    }
  };

  const getSortIcon = (field: any) => {
    if (state.sortField !== field) return <span className="text-border opacity-50 ml-1">↕</span>;
    return state.sortAscending ? <span className="text-accent-blue ml-1">↑</span> : <span className="text-accent-blue ml-1">↓</span>;
  };

  return (
    <div id="leaderboard" className="section-container">
      <h2 className="section-title">Safety Leaderboard</h2>
      <p className="section-subtitle">
        Comparing Neural City's visual infrastructure scores against actual road safety outcomes.
      </p>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-raised border-b border-border">
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors" onClick={() => toggleSort('displayName')}>City {getSortIcon('displayName')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors text-right" onClick={() => toggleSort('ncScore')}>NC Score {getSortIcon('ncScore')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors text-right" onClick={() => toggleSort('cases')}>Cases {getSortIcon('cases')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors text-right" onClick={() => toggleSort('died')}>Fatalities {getSortIcon('died')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors text-right" onClick={() => toggleSort('fatalityRate')}>Fatality Rate {getSortIcon('fatalityRate')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide cursor-pointer hover:bg-border transition-colors text-center" onClick={() => toggleSort('sos')}>Safety Tier {getSortIcon('sos')}</th>
              <th className="p-4 text-xs font-bold text-text-secondary uppercase tracking-wide text-center">Gap</th>
            </tr>
          </thead>
          <tbody>
            {sortedNormal.map(city => {
              const isSelected = state.selectedCityId === city.id;
              return (
                <tr 
                  key={city.id} 
                  className={`border-b border-border transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.02)] ${isSelected ? 'bg-[rgba(59,130,246,0.1)]' : ''}`}
                  onClick={() => dispatch({ type: 'SELECT_CITY', cityId: isSelected ? null : city.id })}
                >
                  <td className="p-4 font-bold">{city.displayName}</td>
                  <td className="p-4 text-right">
                    <div className="font-mono text-sm">{scr(city.ncScore)}</div>
                    <div className="text-xs text-text-secondary">Rank #{city.ncRankMatched}</div>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-text-muted">{fmt(city.ncrb.cases)}</td>
                  <td className="p-4 text-right font-mono text-sm text-accent-red font-bold">{fmt(city.ncrb.died)}</td>
                  <td className="p-4 text-right font-mono text-sm">{pct(city.fatalityRate)}</td>
                  <td className="p-4 text-center">
                    <span 
                      className="px-2.5 py-1 text-xs font-bold tracking-wider rounded-sm uppercase inline-block w-20 text-center bg-opacity-15"
                      style={{ color: tierColor(city.safetyTier), backgroundColor: `${tierColor(city.safetyTier)}25` }}
                    >
                      {city.safetyTier}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    {(() => {
                      const gap = city.gapScore ?? 0;
                      if (gap > 0) return <span className="gap-badge gap-badge-positive" title={`NC Rank #${city.ncRankMatched} vs Safety Rank #${city.safetyRank}`}>-{gap} (Overrated)</span>;
                      if (gap < 0) return <span className="gap-badge gap-badge-negative" title={`NC Rank #${city.ncRankMatched} vs Safety Rank #${city.safetyRank}`}>+{Math.abs(gap)} (Underrated)</span>;
                      return <span className="gap-badge gap-badge-neutral">Match</span>;
                    })()}
                  </td>
                </tr>
              );
            })}
            {anomalyCities.map(city => (
              <tr key={city.id} className="border-b border-border bg-[rgba(139,92,246,0.05)]">
                <td className="p-4 font-bold text-accent-purple">{city.displayName}</td>
                <td className="p-4 text-right text-text-muted">{scr(city.ncScore)}</td>
                <td className="p-4 text-right font-mono text-sm text-text-muted">{fmt(city.ncrb.cases)}</td>
                <td className="p-4 text-right font-mono text-sm text-text-muted">{fmt(city.ncrb.died)}</td>
                <td className="p-4 text-right font-mono text-sm text-text-muted">{pct(city.fatalityRate)}</td>
                <td className="p-4 text-center" colSpan={2}>
                  <div className="text-xs text-accent-purple italic">{city.anomalyNote}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
