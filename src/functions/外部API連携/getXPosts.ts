import { base44 } from '@/api/base44Client';

export interface XPost {
  id: string;
  content: string;
  url: string;
  created_at: string;
  engagement?: {
    likes: number;
    retweets: number;
  };
}

export const getXPosts = async (params: { username: string }): Promise<{ data: XPost[] }> => {
  return base44.functions.getXPosts(params);
};
