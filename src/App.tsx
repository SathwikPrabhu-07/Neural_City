import React from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { HeroStats } from './components/HeroStats';
import { Footer } from './components/Footer';
import { StreetRealityExplorer } from './components/map/StreetRealityExplorer';
import { Leaderboard } from './components/leaderboard/Leaderboard';
import { GapAnalysis } from './components/gap/GapAnalysis';
import { SRISection } from './components/sri/SRISection';
import { Analytics } from './components/analytics/Analytics';
import { Methodology } from './components/Methodology';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-base flex flex-col">
      <Header />
      <Navigation />
      
      <main className="flex-1">
        <HeroStats />
        <StreetRealityExplorer />
        <Leaderboard />
        <GapAnalysis />
        <SRISection />
        <Analytics />
        <Methodology />
      </main>

      <Footer />
    </div>
  );
};

export default App;
