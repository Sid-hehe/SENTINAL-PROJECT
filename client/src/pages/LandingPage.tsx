import React from 'react';
import { HeaderAlertBanner } from '../components/common/HeaderAlertBanner';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { HeroRiskGauge } from '../components/landing/HeroRiskGauge';
import { WhoSentinelProtects } from '../components/landing/WhoSentinelProtects';
import { HowItWorksDiagram } from '../components/landing/HowItWorksDiagram';
import { WhatSentinelWatches } from '../components/landing/WhatSentinelWatches';
import { ResponsibleAISection } from '../components/landing/ResponsibleAISection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080A0D] text-[#F5F7FA] flex flex-col font-sans">
      <HeaderAlertBanner />
      <Navbar />
      <main className="flex-1">
        <HeroRiskGauge />
        <WhoSentinelProtects />
        <HowItWorksDiagram />
        <WhatSentinelWatches />
        <ResponsibleAISection />
      </main>
      <Footer />
    </div>
  );
};
