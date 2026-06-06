import React from 'react';

export const Methodology: React.FC = () => {
  return (
    <div id="methodology" className="section-container">
      <h2 className="section-title">Methodology & Data Integrity</h2>
      
      <div className="card max-w-3xl">
        <h3 className="text-sm font-bold tracking-tight mb-4 uppercase">Key Definitions</h3>
        <ul className="space-y-4 text-sm text-text-secondary">
          <li>
            <strong className="text-text-primary">Safety Outcome Score (SOS):</strong> Calculated by normalizing the fatality rates (Deaths / Total Cases) of the matched cities on a 0-100 scale, where the lowest fatality rate equals 100 (safest).
          </li>
          <li>
            <strong className="text-text-primary">Street Reality Index (SRI):</strong> A weighted composite metric: <code>(0.40 × NC Score) + (0.60 × SOS)</code>. Safety outcomes are weighted more heavily than visual infrastructure.
          </li>
          <li>
            <strong className="text-text-primary">Data Anomalies:</strong> Agra and Mumbai exhibit fatality rates near or at 100% in the NCRB dataset, suggesting these cities only report fatal accidents rather than all accidents. To preserve statistical integrity, these cities are excluded from SOS and SRI calculations but displayed with anomaly badges for transparency.
          </li>
          <li>
            <strong className="text-text-primary">Gurgaon Exclusion:</strong> Gurgaon was excluded from the matched dataset because NCRB only provides data for the larger "Faridabad" or state-level data, preventing an accurate city-level match.
          </li>
        </ul>
      </div>
    </div>
  );
};
