import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import TargetAudience from '../components/TargetAudience';
import TechStack from '../components/TechStack';
import CTA from '../components/CTA';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <TechStack />
      <Benefits />
      <TargetAudience />
      {/* <CTA /> */}
    </>
  );
};

export default LandingPage;
