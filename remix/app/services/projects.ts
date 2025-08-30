import type { Project } from "~/types/Project";

// サンプルプロジェクトデータ
const sampleProjects: Project[] = [
  {
    id: "1",
    title: "MCPサーバー組み込みアプリ",
    description: "AIワークフローを踏まえた実装による、次世代のサーバーアプリケーション。効率的なリソース管理とスケーラビリティを実現。",
    image_url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=450&fit=crop",
    url: "https://example.com/project1",
    featured: true,
    status: "開発中",
    technologies: ["TypeScript", "Node.js", "AI/ML", "Docker"],
    created_date: "2024-01-15"
  },
  {
    id: "2",
    title: "AIワークフロー管理システム",
    description: "機械学習パイプラインの自動化と最適化を行うシステム。データ処理からモデルデプロイまで一貫して管理。",
    image_url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    url: "https://example.com/project2",
    featured: false,
    status: "運用中",
    technologies: ["Python", "TensorFlow", "React", "PostgreSQL"],
    created_date: "2023-11-20"
  },
  {
    id: "3",
    title: "プロダクト戦略プラットフォーム",
    description: "事業開発とプロダクト戦略立案を支援する統合プラットフォーム。データドリブンな意思決定を促進。",
    image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    url: "https://example.com/project3",
    featured: true,
    status: "完成",
    technologies: ["Vue.js", "Python", "AWS", "MongoDB"],
    created_date: "2023-09-10"
  }
];

export async function getProjects(): Promise<Project[]> {
  // 実際のAPI呼び出しの代わりにサンプルデータを返す
  // 本番環境では、ここでAPIエンドポイントを呼び出す
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(sampleProjects);
    }, 500); // ローディング状態をシミュレート
  });
}
