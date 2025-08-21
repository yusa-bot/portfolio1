import { base44 } from '@/api/base44Client';

export interface ZennComment {
  id: string;
  body: string;
  published_at: string;
}

export interface ZennScrapDetails {
  id: string;
  title: string;
  body: string;
  comments: ZennComment[];
  targetComment?: ZennComment;
}

export interface ZennScrapDetailsResponse {
  status: number;
  data: ZennScrapDetails;
}

export const getZennScrapDetails = async (params: { scrapPath: string }): Promise<ZennScrapDetailsResponse> => {
  return base44.functions.getZennScrapDetails(params);
};
