export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  url?: string;
  featured?: boolean;
  status?: '運用中' | '完成' | '開発中';
  technologies?: string[];
  created_date?: string;
}
