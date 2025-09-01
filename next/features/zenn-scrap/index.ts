import { fetchZennScrapContent } from './comment-fetcher';
import { processHtml, type ProcessedHtml } from './html-processor';

export type { ProcessedHtml, StructuredElement } from '../../types/zenn-scrap';

export async function getProcessedScrapContent(scrapUrl: string, targetKeyword: string = '今期のアジェンダ'): Promise<ProcessedHtml> {
  // コメントを取得
  const commentHtml = await fetchZennScrapContent(scrapUrl, targetKeyword);

  // HTMLを成形
  return processHtml(commentHtml);
}
