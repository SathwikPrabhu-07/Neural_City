import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { sriColor } from '../../utils/colors';
import { scr } from '../../utils/formatters';

export const SRISection: React.FC = () => {
  const { state, dispatch } = useDashboard();
  
  const normalCities = state.cities
    .filter(c => !c.hasDataAnomaly)
    .sort((a, b) => (b.sri ?? 0) - (a.sri ?? 0));

  return (
    <div id="sri" className="section-container">
      <div className="flex flex-col lg:flex-row gap-10">
        
        <div className="lg:w-1/3">
          <h2 className="section-title">Street Reality Index (SRI)</h2>
          <p className="text-text-secondary leading-relaxed mb-6">
            The SRI is a composite metric that balances Neural City's infrastructure scores with actual safety outcomes from the NCRB.
          </p>
          
          <div className="card bg-[rgba(59,130,246,0.05)] border-accent-blue mb-6">
            <h4 className="font-bold mb-3 text-sm tracking-tight text-accent-blue uppercase">The Formula</h4>
            <div className="font-mono text-xs bg-base p-3 rounded border border-[rgba(255,255,255,0.05)] mb-3 leading-relaxed">
              SRI = (0.40 × NC Score) + (0.60 × SOS)
            </div>
            <ul className="text-sm text-text-secondary pl-5 space-y-1 m-0">
              <li><strong>NC Score:</strong> Neural City's visual infrastructure rating (40%)</li>
              <li><strong>SOS:</strong> Safety Outcome Score, derived from NCRB fatality rates (60%)</li>
            </ul>
          </div>
          
          <p className="text-sm text-text-muted italic">
            By weighting safety outcomes more heavily (60%), the SRI penalizes cities that look good but perform poorly in reality.
          </p>
        </div>

        <div className="lg:w-2/3">
          <div className="card p-0 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
              {normalCities.map((city, index) => {
                const color = sriColor(city.sri);
                const isSelected = state.selectedCityId === city.id;
                
                return (
                  <div 
                    key={city.id} 
                    className={`p-5 bg-surface transition-colors cursor-pointer hover:bg-[rgba(255,255,255,0.02)] ${isSelected ? 'bg-[rgba(59,130,246,0.1)] relative' : ''}`}
                    onClick={() => dispatch({ type: 'SELECT_CITY', cityId: isSelected ? null : city.id })}
                  >
                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-blue"></div>}
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-base" style={{ backgroundColor: `${color}20`, color }}>
                          {index + 1}
                        </div>
                        <h4 className="font-bold text-lg m-0">{city.displayName}</h4>
                      </div>
                      <div className="font-mono font-bold text-xl" style={{ color }}>{scr(city.sri)}</div>
                    </div>
                    
                    <div className="w-full bg-raised h-1.5 rounded-full mt-4 mb-2 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${city.sri}%`, backgroundColor: color }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-text-secondary mt-2">
                      <span>NC Score: {scr(city.ncScore)}</span>
                      <span>SOS: {scr(city.sos)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
