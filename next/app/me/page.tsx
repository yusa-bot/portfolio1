import Layout from 'components/layout/Layout'
import { ExperienceSection } from '@/components/sections/Experience';
import { HeroSection } from '@/components/sections/Hero';
import { SkillsSection } from '@/components/sections/Skills';

export default function MePage() {
  return (
    <Layout currentPageName="Me">
      <HeroSection />
      <ExperienceSection />
      <SkillsSection />
    </Layout>
  )
}
