"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ArticleCardProps } from './type';

export const QiitaArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
        className="h-full cursor-pointer border-slate-200 hover:border-green-300 hover:shadow-lg transition-all duration-300 bg-white"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-800 leading-snug overflow-hidden" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {article.title}
            </h3>
            <ExternalLink className="w-5 h-5 text-slate-400 flex-shrink-0 mt-1" />
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
              >
                {tag}
              </Badge>
            ))}
            {article.tags.length > 3 && (
              <Badge variant="outline" className="text-xs text-slate-500">
                +{article.tags.length - 3}
              </Badge>
            )}
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
              <MessageCircle className="w-4 h-4" />
              <span>{article.commentsCount}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-3 w-full">
            <img
              src={article.author.profileImageUrl}
              alt={article.author.name}
              className="w-8 h-8 rounded-full border-2 border-green-100"
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
