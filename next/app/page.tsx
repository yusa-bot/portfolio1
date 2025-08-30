import Layout from 'components/layout/Layout'
import AboutSection from 'components/sections/AboutSection'
import VisionSection from 'components/sections/VisionSection'
import ProjectsSection from 'components/sections/ProjectsSection'

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
      </div>
    </Layout>
  )
}
