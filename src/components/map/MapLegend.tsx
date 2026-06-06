import React from 'react';
import { TIER_COLORS } from '../../utils/colors';

export const MapLegend: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* SRI Colors */}
      <div>
        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">Street Reality Index (SRI)</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }}></div>
            <span className="text-xs text-text-secondary">Safe (≥65)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FBBF24' }}></div>
            <span className="text-xs text-text-secondary">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#F97316' }}></div>
            <span className="text-xs text-text-secondary">Concerning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#EF4444' }}></div>
            <span className="text-xs text-text-secondary">High Risk (&lt;35)</span>
          </div>
          <div className="flex items-center gap-2 col-span-2">
            <div className="w-3 h-3 rounded-full border border-dashed border-text-secondary" style={{ backgroundColor: TIER_COLORS.ANOMALY }}></div>
            <span className="text-xs text-text-secondary">Data Anomaly (No SRI)</span>
          </div>
        </div>
      </div>

      {/* Circle Sizes */}
      <div className="pt-3 border-t border-[rgba(255,255,255,0.1)]">
        <div className="text-[10px] text-text-muted uppercase tracking-wider mb-2 font-semibold">Total Fatalities (2023)</div>
        <div className="flex items-end gap-4 h-12">
          <div className="flex flex-col items-center gap-1">
            <div className="w-4 h-4 rounded-full border border-text-secondary bg-[rgba(255,255,255,0.1)]"></div>
            <span className="text-[10px] text-text-muted">&lt; 500</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 h-7 rounded-full border border-text-secondary bg-[rgba(255,255,255,0.1)]"></div>
            <span className="text-[10px] text-text-muted">1,000</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full border border-text-secondary bg-[rgba(255,255,255,0.1)]"></div>
            <span className="text-[10px] text-text-muted">2,000+</span>
          </div>
        </div>
      </div>
    </div>
  );
};
