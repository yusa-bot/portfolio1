"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle, ExternalLink, Users, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ZennScrapCardProps } from '@/components/updates/zenn_scrap/type';

export const ZennScrapCard: React.FC<ZennScrapCardProps> = ({ scrap }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return '1時間以内';
    if (diffInHours < 24) return `${diffInHours}時間前`;
    if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}日前`;
    return formatDate(dateString);
  };

  const handleCardClick = () => {
    window.open(scrap.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card
        className="h-full cursor-pointer border-slate-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 bg-white"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2">
              <div className="flex items-center gap-1 text-purple-600 text-sm font-medium">
                📝 Scrap
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 leading-snug mt-2">
            {scrap.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {scrap.closed && (
              <Badge className="text-xs bg-gray-100 text-gray-600">
                <Lock className="w-3 h-3 mr-1" />
                クローズ済み
              </Badge>
            )}
            {scrap.canOthersPost && (
              <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                <Users className="w-3 h-3 mr-1" />
                コラボ可能
              </Badge>
            )}
            {scrap.archived && (
              <Badge variant="outline" className="text-xs text-slate-500">
                アーカイブ済み
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(scrap.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{scrap.likesCount}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{scrap.commentsCount}</span>
            </div>
          </div>

          {scrap.lastCommentAt && (
            <div className="mt-2 text-xs text-slate-400">
              最終更新: {formatRelativeTime(scrap.lastCommentAt)}
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0">
          <div className="flex items-center gap-3 w-full">
            <img
              src={scrap.author.profileImageUrl}
              alt={scrap.author.name}
              className="w-8 h-8 rounded-full border-2 border-purple-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                {scrap.author.name}
              </span>
              <span className="text-xs text-slate-500">@{scrap.author.id}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
