import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import type { MapFilter } from '../../types';

export const MapFilterControl: React.FC = () => {
  const { state, dispatch } = useDashboard();

  const filters: { id: MapFilter; label: string }[] = [
    { id: 'all', label: 'All Cities' },
    { id: 'top-sri', label: 'Top 3 SRI' },
    { id: 'lowest-sri', label: 'Lowest 3 SRI' },
    { id: 'safety-gap', label: 'Safety Gaps' },
    { id: 'high-risk', label: 'High Risk (>35% FR)' },
  ];

  return (
    <div className="flex flex-wrap gap-2 bg-surface p-1.5 rounded-lg border border-border self-stretch lg:self-auto">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => dispatch({ type: 'SET_FILTER', filter: filter.id })}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            state.mapFilter === filter.id
              ? 'bg-accent-blue text-white shadow-sm'
              : 'text-text-secondary hover:text-text-primary hover:bg-raised'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
