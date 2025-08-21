import { base44 } from '@/api/base44Client';

export interface NoteArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  published_at: string;
}

export const getNoteArticles = async (params: { username: string }): Promise<{ data: NoteArticle[] }> => {
  return base44.functions.getNoteArticles(params);
};
