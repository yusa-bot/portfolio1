import Layout from '@/components/layout/Layout'
import { AboutSection } from '@/components/sections/About'
import { VisionSection } from '@/components/sections/Vision'
import { ProjectsSection } from '@/components/sections/Projects'
import { ThisPageTech } from '@/components/sections/ThisPageTech'

export default function HomePage() {
  return (
    <Layout currentPageName="Top">
      <div>
        <h1 className="text-center mt-12 text-lg font-thin normal-case md:text-6xl tracking-wide">
          Portfolio
        </h1>
        <AboutSection />
        <VisionSection />
        <ProjectsSection />
        <ThisPageTech />
      </div>
    </Layout>
  )
}
