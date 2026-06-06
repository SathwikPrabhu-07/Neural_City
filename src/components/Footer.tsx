import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-surface border-t border-border py-12 px-6 mt-16 text-center">
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold tracking-tight text-text-primary m-0">
          Neural City × Road Safety Insights
        </h2>
        <p className="text-sm text-text-secondary leading-relaxed max-w-2xl m-0">
          This prototype bridges the gap between infrastructure assessment and safety outcomes.
          By combining Neural City's Street Evidence Model (SEM) with NCRB 2023 accident statistics,
          we create a holistic view of the "State of Indian Streets 2026."
        </p>
        <div className="flex gap-4 mt-4 text-xs font-medium text-text-muted">
          <span>Data Sources: Neural City Internal Data, NCRB (2023)</span>
          <span>•</span>
          <span>Prototype Version 1.1 (React + Leaflet)</span>
        </div>
      </div>
    </footer>
  );
};
