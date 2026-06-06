import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-surface border-b border-border py-5 px-6 flex justify-between items-center z-50 relative">
      <div className="flex items-center gap-3">
        {/* Simple geometric logo placeholder */}
        <div className="w-8 h-8 rounded grid grid-cols-2 gap-0.5 overflow-hidden">
          <div className="bg-accent-blue opacity-90"></div>
          <div className="bg-accent-blue opacity-60"></div>
          <div className="bg-accent-blue opacity-40"></div>
          <div className="bg-accent-blue opacity-80"></div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight m-0 text-text-primary leading-tight">
            Neural City <span className="text-text-secondary font-normal mx-1">×</span> Road Safety Insights
          </h1>
          <div className="text-xs text-text-secondary font-medium tracking-wide">
            STATE OF INDIAN STREETS 2026
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 bg-[rgba(16,185,129,0.1)] px-3 py-1.5 rounded-full border border-[rgba(16,185,129,0.2)]">
        <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></div>
        <span className="text-xs font-semibold text-accent-green tracking-wide">SYSTEM ACTIVE</span>
      </div>
    </header>
  );
};
