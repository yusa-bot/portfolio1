"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QiitaArticleCard } from './Updates/Articles/Qiita/QiitaArticleCard';
import { QiitaArticle } from './Updates/Articles/Qiita/type';
import { ZennArticleCard } from './Updates/Articles/Zenn/ZennArticleCard';
import { ZennArticle } from './Updates/Articles/Zenn/type';
import { ZennScrap } from './Updates/ZennScrap/type';
import { ZennScrapMain } from './Updates/ZennScrap/ZennScrapMain';

export const BlogSection = () => {
  const [articles, setArticles] = useState<QiitaArticle[]>([]);
  const [zennArticles, setZennArticles] = useState<ZennArticle[]>([]);
  const [zennScrap, setZennScrap] = useState<ZennScrap | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQiitaArticles = async (): Promise<QiitaArticle[]> => {
    try {
      const response = await fetch('/api/updates/articles/qiita');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const articles = await response.json();
      return articles;
    } catch (error) {
      console.error('Error fetching Qiita articles:', error);
      throw error;
    }
  };

  const fetchZennArticles = async (): Promise<ZennArticle[]> => {
    try {
      const response = await fetch('/api/updates/articles/zenn');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const articles = await response.json();
      return articles;
    } catch (error) {
      console.error('Error fetching Zenn articles:', error);
      throw error;
    }
  };

  const fetchZennScrap = async (): Promise<ZennScrap | null> => {
    try {
      const response = await fetch('/api/updates/zenn_scrap');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.scrap;
    } catch (error) {
      console.error('Error fetching Zenn scrap:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [fetchedQiitaArticles, fetchedZennArticles, fetchedZennScrap] = await Promise.all([
          fetchQiitaArticles(),
          fetchZennArticles(),
          fetchZennScrap()
        ]);
        setArticles(fetchedQiitaArticles);
        setZennArticles(fetchedZennArticles);
        setZennScrap(fetchedZennScrap);
      } catch (err) {
        setError('記事の取得に失敗しました');
        console.error('Error loading articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [fetchedQiitaArticles, fetchedZennArticles, fetchedZennScrap] = await Promise.all([
        fetchQiitaArticles(),
        fetchZennArticles(),
        fetchZennScrap()
      ]);
      setArticles(fetchedQiitaArticles);
      setZennArticles(fetchedZennArticles);
      setZennScrap(fetchedZennScrap);
    } catch (err) {
      setError('記事の取得に失敗しました');
      console.error('Error refreshing articles:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="blog" className="py-24 bg-slate-50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-16">
            <h2 className="text-center mb-8 font-thin md:text-5xl tracking-tighter">
              Updates
            </h2>
          </div>

          {/* メインコンテンツ: 現在のアジェンダ（Scrap） */}
          {!isLoading && !error && zennScrap && (
            <div className="mb-16">
              <ZennScrapMain scrap={zennScrap} />
            </div>
          )}

          {/* 最新記事セクション */}
          <div className="mb-12">
            <h1 className="text-3xl font-thin text-slate-800 mb-8">
              最新記事
            </h1>
            <p className="text-lg text-slate-600 font-light">
              各サービスのAPIから最新記事を取得し、表示しています。<br />
              取得タイミング
              目次
            </p>

            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin text-slate-400" />
                <span className="ml-2 text-slate-600">読み込み中...</span>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={handleRefresh} variant="outline">
                  再試行
                </Button>
              </div>
            )}

            {!isLoading && !error && (articles.length > 0 || zennArticles.length > 0) && (
              <div className="space-y-12 mt-12">
                {/* Qiita記事 */}
                {articles.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 rounded text-white text-sm flex items-center justify-center">Q</span>
                      Qiita記事
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {articles.map((article) => (
                        <QiitaArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Zenn記事 */}
                {zennArticles.length > 0 && (
                  <div>
                    <h4 className="text-xl font-semibold text-slate-700 mb-6 flex items-center gap-2">
                      <span className="w-6 h-6 bg-blue-500 rounded text-white text-sm flex items-center justify-center">Z</span>
                      Zenn記事
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {zennArticles.map((article) => (
                        <ZennArticleCard key={article.id} article={article} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isLoading && !error && articles.length === 0 && zennArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-600">記事が見つかりませんでした</p>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-4 mb-12">
            <Button
              variant="outline"
              className="text-slate-600 hover:text-green-600 border-slate-200"
              onClick={() => window.open('https://qiita.com/yusa_a', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Qiita でもっと見る
            </Button>
            <Button
              variant="outline"
              className="text-slate-600 hover:text-blue-600 border-slate-200"
              onClick={() => window.open('https://zenn.dev/ayusa', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Zenn でもっと見る
            </Button>
            <Button
              variant="outline"
              className="text-slate-600 hover:text-purple-600 border-slate-200"
              onClick={() => window.open('https://zenn.dev/ayusa/scraps', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Scrap でもっと見る
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="text-slate-600 hover:text-slate-800 border-slate-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              更新
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
