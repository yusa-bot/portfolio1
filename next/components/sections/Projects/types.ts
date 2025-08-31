export interface ProjectsTypes {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  url?: string;
  image_url?: string;
  status?: '開発中' | '完成' | '運用中';
  featured?: boolean;
  created_at: string | null;
  updated_at: string | null;
}
