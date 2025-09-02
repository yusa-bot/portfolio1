// TOC用のヘルパー関数
export function slugify(text = ""): string {
  return text
    .toString()
    .normalize("NFKD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

// ZennのTOC構造をフラット化
export function flattenZennToc(nodes: any[]): any[] {
  const flatten = (nodes: any[], acc: any[] = []) => {
    for (const n of nodes) {
      if (n && typeof n.level === "number" && n.text) {
        if (n.level >= 1 && n.level <= 3) {
          // IDをデコード
          const decodedId = n.id ? decodeURIComponent(n.id) : slugify(n.text);
          acc.push({
            id: decodedId,
            text: n.text,
            level: n.level
          });
        }
      }
      // 子要素も処理
      if (Array.isArray(n.children) && n.children.length) {
        flatten(n.children, acc);
      }
    }
    return acc;
  };

  return flatten(nodes, []);
}

// Zenn記事データの整形
export function formatZennArticle(article: any, toc: any[]) {
  return {
    id: article.id.toString(),
    title: article.title,
    url: `https://zenn.dev${article.path}`,
    createdAt: article.published_at,
    updatedAt: article.published_at,
    likesCount: article.liked_count,
    commentsCount: article.comments_count || 0,
    tags: [article.article_type],
    author: {
      id: article.user.username,
      name: article.user.name,
      profileImageUrl: article.user.avatar_small_url,
    },
    emoji: article.emoji,
    bodyLettersCount: article.body_letters_count,
    toc: toc,
  };
}
