"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart, MessageCircle, ExternalLink, Users, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZennScrap } from '@/components/updates/zenn_scrap/type';
import { ZennContentRenderer } from '@/components/updates/zenn_scrap/ZennContentRenderer';

interface ZennScrapMainProps {
  scrap: ZennScrap;
}

export const ZennScrapMain: React.FC<ZennScrapMainProps> = ({ scrap }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
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

  const handleViewScrap = () => {
    window.open(scrap.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
        <CardHeader className="border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-purple-600 text-sm font-medium flex items-center gap-1">
                  📝 現在のアジェンダ（Scrap）
                </span>
                <div className="flex gap-2">
                  {scrap.closed && (
                    <Badge className="text-xs bg-gray-100 text-gray-600">
                      <Lock className="w-3 h-3 mr-1" />
                      クローズ済み
                    </Badge>
                  )}
                  {scrap.canOthersPost && (
                    <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700">
                      <Users className="w-3 h-3 mr-1" />
                      コラボ可能
                    </Badge>
                  )}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
                {scrap.title}
              </h2>

              <div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>開始: {formatDate(scrap.createdAt)}</span>
                </div>
                {scrap.lastCommentAt && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>最終更新: {formatRelativeTime(scrap.lastCommentAt)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{scrap.likesCount} いいね</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{scrap.commentsCount} コメント</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={scrap.author.profileImageUrl}
                  alt={scrap.author.name}
                  className="w-10 h-10 rounded-full border-2 border-purple-200"
                />
                <div>
                  <span className="text-sm font-medium text-slate-700">
                    {scrap.author.name}
                  </span>
                  <span className="text-xs text-slate-500 block">@{scrap.author.id}</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handleViewScrap}
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="lg"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Scrapで詳細を見る
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {scrap.content && scrap.content.structured.length > 0 ? (
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              <ZennContentRenderer
                elements={scrap.content.structured}
                className="mb-6"
              />

              <div className="mt-6 pt-4 border-t border-purple-100 text-center">
                <Button
                  onClick={handleViewScrap}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Zennで続きを読む
                </Button>
              </div>
            </div>
          ) : scrap.bodyMarkdown ? (
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              <div
                className="zenn-scrap-content-fallback"
                dangerouslySetInnerHTML={{ __html: scrap.bodyMarkdown }}
              />

              <div className="mt-4 text-center">
                <Button
                  onClick={handleViewScrap}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50"
                >
                  続きを読む
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 mb-4">本文の取得に失敗しました</p>
              <Button
                onClick={handleViewScrap}
                variant="outline"
                className="border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                Scrapで確認する
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
