import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Portfolio" },
    { name: "description", content: "Portfolio" },
  ];
};

export default function Index() {
  return (
    <div>
      <AboutSection />
      <VisionSection />
      <ProjectsSection />
    </div>
  );
}
