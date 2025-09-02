"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Calendar, Heart, MessageCircle, ExternalLink, Users, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ZennScrap } from './type';
import { ZennContentRenderer } from './ZennContentRenderer';

interface ZennScrapMainProps {
  scrap: ZennScrap;
}

export const ZennScrapMain: React.FC<ZennScrapMainProps> = ({ scrap }) => {
  const router = useRouter();

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

  const handleViewTech = () => {
    router.push('/techstack#zenn-scrap');
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-thin  text-slate-600 mb-4">
          今期のアジェンダ
        </h1>
        <p className="text-lg text-slate-600 font-light">
          Zennのscrap機能はリアルタイムで進行中の議題の情報発信ツールとして最適です。<br />
          そのため個人スクラムシートとして活用し、今期の個人目標を記載しています。<br />
          API取得からの表示までの実装工夫を記載しています。
          <Button
              onClick={handleViewTech}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
              size="sm"
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            技術詳細
          </Button>
        </p>
      </div>
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white shadow-lg">
        <CardHeader className="border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {/* ユーザー情報 */}
              <div className="flex items-center gap-3 mb-3">
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
                {scrap.closed && (
                  <Badge className="text-xs bg-gray-100 text-gray-600 ml-2">
                    <Lock className="w-3 h-3 mr-1" />
                    クローズ済み
                  </Badge>
                )}
              </div>

              {/* 日付情報 */}
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1">
                  <span>開始: {formatDate(scrap.createdAt)}</span>
                </div>
                {scrap.lastCommentAt && (
                  <div className="flex items-center gap-1">
                    <span>最終更新: {formatRelativeTime(scrap.lastCommentAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* 詳細ボタン */}
            <Button
              onClick={handleViewScrap}
              className="bg-purple-600 hover:bg-purple-700 text-white flex items-center"
              size="sm"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              詳細を見る
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

              <div className="mt-6 pt-4 border-t border-purple-100 flex justify-center">
                <Button
                  onClick={handleViewScrap}
                  variant="outline"
                  className="border-purple-200 text-purple-600 hover:bg-purple-50 flex items-center"
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
