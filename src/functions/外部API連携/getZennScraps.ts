import { base44 } from '@/api/base44Client';

export interface ZennScrap {
  id: string;
  title: string;
  path: string;
  published_at: string;
  comments_count: number;
}

export interface ZennScrapsResponse {
  data: {
    scraps: ZennScrap[];
  };
}

export const getZennScraps = async (params: { username: string }): Promise<ZennScrapsResponse> => {
  return base44.functions.getZennScraps(params);
};
