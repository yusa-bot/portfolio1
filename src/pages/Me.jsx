import React from 'react';

import HeroSection from '../components/sections/HeroSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import SkillsSection from '../components/sections/SkillsSection';
import BlogSection from '../components/sections/BlogSection';

export default function Me() {
  return (
    <div>
      <HeroSection />
      <ExperienceSection />
      <SkillsSection />
      <BlogSection />
    </div>
  );
}