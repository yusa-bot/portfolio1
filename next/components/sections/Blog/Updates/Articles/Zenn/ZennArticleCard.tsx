"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle, ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ZennArticleCardProps } from '@/components/updates/articles/zenn/type';

export const ZennArticleCard: React.FC<ZennArticleCardProps> = ({ article }) => {
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
    window.open(article.url, '_blank', 'noopener,noreferrer');
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
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <span className="text-xl flex-shrink-0">{article.emoji}</span>
              <h3 className="text-lg font-semibold text-slate-800 leading-snug overflow-hidden" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {article.title}
              </h3>
            </div>
            <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((tag) => (
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
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{article.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span>{formatBodyLength(article.bodyLettersCount)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-3 w-full">
            <img
              src={article.author.profileImageUrl}
              alt={article.author.name}
              className="w-8 h-8 rounded-full border-2 border-blue-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {article.author.name}
              </span>
              <span className="text-xs text-slate-500">@{article.author.id}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
