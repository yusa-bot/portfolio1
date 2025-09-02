"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ZennArticleCardProps, ZennArticle } from './type';
import { ZennToc } from './Toc';

export const ZennArticleCard: React.FC<ZennArticleCardProps> = ({ article }) => {
  const [articleWithToc, setArticleWithToc] = useState<ZennArticle>(article);
  const [isLoadingToc, setIsLoadingToc] = useState(false);

  // 記事詳細（TOC付き）を取得
  useEffect(() => {
    const fetchArticleToc = async () => {
      if (article.toc && article.toc.length > 0) {
        return; // 既にTOCがある場合はスキップ
      }

      try {
        setIsLoadingToc(true);

        // URLからslugを抽出
        const slug = article.url.split('/').pop();
        if (!slug) {
          return;
        }

        const response = await fetch(`/api/updates/articles/zenn/detail?slug=${slug}`);
        if (!response.ok) {
          return;
        }

        const articleDetail = await response.json();
        setArticleWithToc(articleDetail);
      } catch (error) {
        // TOC取得に失敗してもエラーを表示しない
      } finally {
        setIsLoadingToc(false);
      }
    };

    fetchArticleToc();
  }, [article.id, article.toc, article.url]);
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBodyLength = (count: number) => {
    if (count >= 1000) {
      return `${Math.floor(count / 1000)}k字`;
    }
    return `${count}字`;
  };

  const handleCardClick = () => {
    window.open(articleWithToc.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 bg-white"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xl flex-shrink-0">{articleWithToc.emoji}</span>
              <h3 className="text-lg font-semibold text-slate-800 leading-snug overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {articleWithToc.title}
              </h3>
            </div>
            <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0" />
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {articleWithToc.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <span>{formatDate(articleWithToc.createdAt)}</span>
            </div>
          </div>

          {/* TOC表示 */}
          {isLoadingToc && (
            <div className="mt-4 text-xs text-slate-500">記事詳細を読み込み中...</div>
          )}
          {articleWithToc.toc && articleWithToc.toc.length > 0 && (
            <div className="mt-4">
              <ZennToc article={articleWithToc} />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
