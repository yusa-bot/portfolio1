
import React from 'react'; // useState removed, using React.useState
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ExternalLink, List, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getZennArticleDetails } from "@/api/functions";

export default function ZennArticleCard({ article, defaultExpanded = false, initialDetails = null }) {
  // 初期展開・事前取得データ対応
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [articleDetails, setArticleDetails] = React.useState(initialDetails);
  const [isLoading, setIsLoading] = React.useState(false);

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  const handleToggleExpand = async () => {
    if (!isExpanded && !articleDetails && article?.slug) {
      setIsLoading(true);
      try {
        const res = await getZennArticleDetails({ slug: article.slug });
        if (res && res.status === 200) {
          setArticleDetails(res.data);
        }
      } finally {
        setIsLoading(false);
      }
    }
    setIsExpanded((v) => !v);
  };

  const renderTocItem = (item, keyPrefix = '') => {
    const indentPx = Math.max(0, (item.level ?? 2) - 2) * 16; // level=2を基準
    const isTop = (item.level ?? 2) === 2;

    return (
      <div key={`${keyPrefix}-${item.id}`} className="mb-1" style={{ marginLeft: `${indentPx}px` }}>
        <div className="flex items-start py-1">
          <span
            className={`mt-1 mr-2 inline-block rounded-full ${isTop ? 'bg-blue-500' : 'bg-blue-300'}`}
            style={{ width: 6, height: 6 }}
          />
          <a
            href={`https://zenn.dev${article.path}#${item.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`leading-relaxed hover:text-blue-600 ${isTop ? 'text-sm font-medium text-slate-800' : 'text-sm text-slate-700'}`}
          >
            {item.text}
          </a>
        </div>
        {Array.isArray(item.children) && item.children.length > 0 && (
          <div>
            {item.children.map((child, idx) => renderTocItem(child, `${keyPrefix}-${idx}`))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Zenn</Badge>
              {article?.emoji && <span className="text-lg">{article.emoji}</span>}
            </div>

            <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">{article.title}</h4>
            {article.description && (
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{article.description}</p>
            )}

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{formatDate(article.published_at)}</span>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggleExpand}
                  disabled={!article?.slug}
                  className="text-slate-600 hover:text-blue-600"
                >
                  <List className="w-3 h-3 mr-1" />
                  目次
                  {isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(`https://zenn.dev${article.path}`, '_blank')}
                >
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-slate-200"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-slate-500">目次を読み込み中...</span>
                    </div>
                  ) : (articleDetails?.toc?.length ?? 0) > 0 ? (
                    <div>
                      <h5 className="text-sm font-medium text-slate-800 mb-3 flex items-center">
                        <List className="w-4 h-4 mr-2" />
                        目次
                      </h5>
                      <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {articleDetails.toc.map((t, idx) => renderTocItem(t, `root-${idx}`))}
                      </div>
                    </div>
                  ) : articleDetails ? (
                    <div className="text-center py-4 text-slate-500 text-sm">この記事には目次がありません</div>
                  ) : (
                    <div className="text-center py-4 text-red-500 text-sm">記事の詳細を取得できませんでした</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
