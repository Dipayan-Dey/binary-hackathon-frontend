import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Benefits from '../components/Benefits';
import TargetAudience from '../components/TargetAudience';
import TechStack from '../components/TechStack';
import CTA from '../components/CTA';
import TestimonialScrollColumns from '../components/TestimonialScrollColumns';
import FeedbackForm from '../components/FeedbackForm';
import GeneralFloatingChatbot from '../dashboard/GeneralFloatingChatbot';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <HowItWorks />
      {/* <Features /> */}
      <TechStack />
      <Benefits />
      <TargetAudience />
      <GeneralFloatingChatbot/>
      {/* <FeedbackForm/> */}
      {/* <TestimonialScrollColumns/> */}
      {/* <CTA /> */}
    </>
  );
};

export default LandingPage;
