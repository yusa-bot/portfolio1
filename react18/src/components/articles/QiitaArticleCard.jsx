import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ExternalLink, List, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function QiitaArticleCard({ article, defaultExpanded = true }) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  const [toc, setToc] = React.useState([]);

  React.useEffect(() => {
    if (article?.body) {
      setToc(extractMarkdownToc(article.body));
    }
  }, [article?.body]);

  const extractMarkdownToc = (markdown) => {
    const lines = markdown.split(/\r?\n/);
    const headings = [];
    for (const line of lines) {
      const m = line.match(/^(#{1,6})\s+(.+?)\s*$/);
      if (!m) continue;
      const level = m[1].length;
      const text = m[2].trim();
      // ユーザー要件: 「##, ###」が主対象。#も拾うが、ベースレベルでインデント調整
      headings.push({ level, text, id: slugify(text), children: [] });
    }
    // ネスト構造に変換（階層スタック）
    const root = [];
    const stack = [];
    const baseLevel = headings.length > 0 ? Math.min(...headings.map(h => h.level)) : 2;

    for (const h of headings) {
      const node = { ...h, level: h.level, children: [] };
      while (stack.length && stack[stack.length - 1].level >= node.level) {
        stack.pop();
      }
      if (stack.length === 0) {
        root.push(node);
      } else {
        stack[stack.length - 1].children.push(node);
      }
      stack.push(node);
    }
    // 表示時にインデントを baseLevel 基準で取るため、baseLevelを埋め込む
    return root.map(n => normalizeBase(n, baseLevel));
  };

  const normalizeBase = (node, base) => ({
    ...node,
    base,
    children: (node.children || []).map(c => normalizeBase(c, base))
  });

  const slugify = (str) =>
    str
      .toString()
      .normalize('NFKD')
      .replace(/[\u0300-\u036F]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9\u3040-\u30ff\u4e00-\u9faf\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

  const renderTocItem = (item, keyPrefix = '') => {
    const indentPx = Math.max(0, (item.level ?? 2) - (item.base ?? 2)) * 16;
    const isTop = (item.level ?? 2) === (item.base ?? 2);

    return (
      <div key={`${keyPrefix}-${item.id}`} className="mb-1" style={{ marginLeft: `${indentPx}px` }}>
        <div className="flex items-start py-1">
          <span
            className={`mt-1 mr-2 inline-block rounded-full ${isTop ? 'bg-emerald-500' : 'bg-emerald-300'}`}
            style={{ width: 6, height: 6 }}
          />
          {/* Qiitaの見出しアンカーはHTML側のID生成に依存するため、確実性を優先して記事本体へのリンクに留める */}
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`leading-relaxed hover:text-emerald-600 ${isTop ? 'text-sm font-medium text-slate-800' : 'text-sm text-slate-700'}`}
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

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    if (Number.isNaN(d.getTime())) return '';
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <Card className="border border-slate-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">Qiita</Badge>
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
                  onClick={() => setIsExpanded(v => !v)}
                  className="text-slate-600 hover:text-emerald-600"
                >
                  <List className="w-3 h-3 mr-1" />
                  目次
                  {isExpanded ? <ChevronDown className="w-3 h-3 ml-1" /> : <ChevronRight className="w-3 h-3 ml-1" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(article.url, '_blank')}
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
                  {(toc?.length ?? 0) > 0 ? (
                    <div>
                      <h5 className="text-sm font-medium text-slate-800 mb-3 flex items-center">
                        <List className="w-4 h-4 mr-2" />
                        目次
                      </h5>
                      <div className="bg-slate-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                        {toc.map((t, idx) => renderTocItem(t, `root-${idx}`))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500 text-sm">この記事には目次がありません</div>
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