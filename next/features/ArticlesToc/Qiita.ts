import { TocItem } from '@/components/sections/Blog/Updates/Articles/Qiita/type';

/**
 * Qiitaマークダウン　→　目次オブジェクト
 */
export const extractQiitaToc = (markdown: string): TocItem[] => {
  if (!markdown) return [];

  const lines = markdown.split(/\r?\n/);
  const headings: TocItem[] = [];
  let minLevel = 6; // 最小の見出しレベルを追跡

  // 1回目のパス: 見出しを抽出し、最小レベルを見つける
  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+?)\s*$/);
    if (!match) continue;

    const level = match[1].length;
    const text = match[2].trim();

    // アンカーIDを生成（Qiita形式）
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // 英数字とハイフンのみ
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');

    headings.push({
      id,
      text,
      level,
    });

    if (level < minLevel) {
      minLevel = level;
    }
  }

  // 2回目のパス: ベースレベルを設定
  return headings.map(heading => ({
    ...heading,
    base: minLevel,
  }));
};

/**
 * 見出しテキストからcを生成
 */
export const generateAnchorId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
};
