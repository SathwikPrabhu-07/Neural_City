import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ScatterController } from 'chart.js';
import { Scatter, Bar } from 'react-chartjs-2';
import { TIER_COLORS } from '../../utils/colors';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ScatterController);

// Shared chart options for dark mode
const darkOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: '#F1F5F9', // text-primary
  scales: {
    x: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } },
    y: { grid: { color: '#1E293B' }, ticks: { color: '#94A3B8' } }
  },
  plugins: {
    legend: { labels: { color: '#F1F5F9' } }
  }
};

export const Analytics: React.FC = () => {
  const { state } = useDashboard();
  
  const normalCities = state.cities.filter(c => !c.hasDataAnomaly);
  const anomalyCities = state.cities.filter(c => c.hasDataAnomaly);

  // Scatter Plot Data (NC Score vs Fatality Rate)
  const scatterData = {
    datasets: [
      {
        label: 'Safe (<20% FR)',
        data: normalCities.filter(c => c.safetyTier === 'SAFE').map(c => ({ x: c.ncScore, y: c.fatalityRate, city: c.displayName })),
        backgroundColor: TIER_COLORS.SAFE,
        pointRadius: 6,
      },
      {
        label: 'Caution (20-35% FR)',
        data: normalCities.filter(c => c.safetyTier === 'CAUTION').map(c => ({ x: c.ncScore, y: c.fatalityRate, city: c.displayName })),
        backgroundColor: TIER_COLORS.CAUTION,
        pointRadius: 6,
      },
      {
        label: 'Danger (>35% FR)',
        data: normalCities.filter(c => c.safetyTier === 'DANGER').map(c => ({ x: c.ncScore, y: c.fatalityRate, city: c.displayName })),
        backgroundColor: TIER_COLORS.DANGER,
        pointRadius: 6,
      },
      {
        label: 'Anomaly (Excluded)',
        data: anomalyCities.map(c => ({ x: c.ncScore, y: c.fatalityRate, city: c.displayName })),
        backgroundColor: TIER_COLORS.ANOMALY,
        pointRadius: 6,
        pointStyle: 'rectRot',
      }
    ]
  };

  const scatterOptions = {
    ...darkOptions,
    plugins: {
      ...darkOptions.plugins,
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const point = ctx.raw;
            return `${point.city}: NC Score ${point.x}, FR ${point.y.toFixed(1)}%`;
          }
        }
      }
    },
    scales: {
      x: { ...darkOptions.scales.x, title: { display: true, text: 'Neural City Score (Higher = Better)', color: '#64748B' } },
      y: { ...darkOptions.scales.y, title: { display: true, text: 'Fatality Rate % (Lower = Safer)', color: '#64748B' } }
    }
  };

  // Bar Chart Data (Top 10 High-Fatality NCRB Cities)
  const top10Fr = [...state.fullNcrb]
    .filter(c => !c.isAnomaly && c.cases >= 500)
    .map(c => ({ ...c, fr: (c.died / c.cases) * 100 }))
    .sort((a, b) => b.fr - a.fr)
    .slice(0, 10);

  const barData = {
    labels: top10Fr.map(c => c.name),
    datasets: [{
      label: 'Fatality Rate %',
      data: top10Fr.map(c => c.fr),
      backgroundColor: top10Fr.map(c => c.isMatched ? '#3B82F6' : '#475569'),
      borderWidth: 0,
      borderRadius: 4,
    }]
  };

  const barOptions = {
    ...darkOptions,
    scales: {
      x: { ...darkOptions.scales.x },
      y: { ...darkOptions.scales.y, title: { display: true, text: 'Fatality Rate %', color: '#64748B' } }
    }
  };

  return (
    <div id="analytics" className="section-container">
      <h2 className="section-title">Visual Analytics</h2>
      <p className="section-subtitle">Deep dive into the correlations between visual infrastructure and safety data.</p>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Scatter Plot */}
        <div className="card">
          <h3 className="text-sm font-bold tracking-tight mb-2 uppercase">Infrastructure Quality vs. Fatality Rate</h3>
          <p className="text-xs text-text-muted mb-6">
            Ideally, cities with higher NC Scores should cluster in the bottom-right (high score, low fatality rate). 
            Cities in the top-right indicate high-quality infrastructure that fails to protect citizens.
          </p>
          <div className="h-[400px]">
            <Scatter data={scatterData} options={scatterOptions} />
          </div>
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 className="text-sm font-bold tracking-tight mb-2 uppercase">Highest Fatality Rates (All NCRB Cities)</h3>
          <p className="text-xs text-text-muted mb-6">
            Top 10 most dangerous cities by fatality rate across the entire 53-city dataset (min. 500 cases). 
            <span className="text-accent-blue font-semibold ml-1">Blue indicates cities in Neural City dataset.</span>
          </p>
          <div className="h-[400px]">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

      </div>
    </div>
  );
};
