
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, MessageCircle, Target, Clock, User, TrendingUp, BookOpen, Zap, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// バックエンド関数をインポート
import { getQiitaArticles } from "@/api/functions";
import QiitaArticleCard from "../components/articles/QiitaArticleCard";

import { getNoteArticles } from "@/api/functions";
import { fetchNoteToc } from "@/api/functions";
import NoteTocCard from "../components/articles/NoteTocCard";

import { fetchZennToc } from "@/api/functions";
import ZennTocCard from "../components/articles/ZennTocCard";

import { getZennScraps } from "@/api/functions";
import { getZennScrapDetails } from "@/api/functions";

import { getXPosts } from "@/api/functions";


export default function Updates() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentScrap, setCurrentScrap] = useState(null);
  const [currentGoalComment, setCurrentGoalComment] = useState(null);
  const [qiitaArticles, setQiitaArticles] = useState([]);
  const [noteArticles, setNoteArticles] = useState([]);
  const [xPosts, setXPosts] = useState([]);
  const [error, setError] = useState(null);
  const [qiitaTocArticles, setQiitaTocArticles] = useState([]);
  const [zennTocItems, setZennTocItems] = useState([]);
  const [noteTocItems, setNoteTocItems] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 並列でAPIを呼び出し - Zennも追加
      const [
        qiitaResponse,
        zennScrapsResponse,
        xPostsResponse,
        noteResponse,
        zennTocResponse
      ] = await Promise.allSettled([
        getQiitaArticles(),
        getZennScraps({ username: 'ayusa' }),
        getXPosts({ username: 'rowuprowup' }),
        getNoteArticles({ username: 'qqqqqppppp' }),
        fetchZennToc({ username: 'ayusa', count: 2 })
      ]);

      // Qiita記事 - rendered_bodyを正しく処理
      if (qiitaResponse.status === 'fulfilled') {
        const raw = qiitaResponse.value.data || qiitaResponse.value || [];
        // 最新順（APIが既に降順ならsliceだけでOK）
        const latestTwo = raw.slice(0, 3);

        // 本文冒頭　表示用
        setQiitaArticles(raw.slice(0, 3).map(article => {
          let description = '記事の概要';
          if (article.rendered_body) {
            // HTMLタグを除去
            const textContent = article.rendered_body
              .replace(/<[^>]*>/g, '')  // HTMLタグ除去
              .replace(/&lt;/g, '<')    // HTML entities デコード
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&')
              .replace(/&quot;/g, '"')
              .replace(/&#x27;/g, "'") // シングルクォート
              .replace(/&#x2F;/g, '/')  // スラッシュ
              .trim();

            // 最初の100文字を抽出し、省略記号を追加
            if (textContent.length > 0) {
              description = textContent.substring(0, 100);
              if (textContent.length > 100) {
                description += '...';
              }
            }
          }

          return {
            title: article.title,
            description: description,
            published_at: article.created_at,
            tags: article.tags?.map(tag => tag.name) || [],
            url: article.url,
            platform: 'Qiita',
            likes_count: article.likes_count || 0,
            stocks_count: article.stocks_count || 0
          };
        }));

        // TOC用（本文Markdownから見出し抽出に使うため body を保持）
        setQiitaTocArticles(latestTwo.map(a => ({
          title: a.title,
          body: a.body || '', // Pass the raw markdown body
          url: a.url,
          published_at: a.created_at,
          description: '', // 省略 or derive in the card component
        })));
      } else {
        console.error('Failed to load Qiita articles:', qiitaResponse.reason);
      }

      // Zenn記事（TOC付き）- 混合リストに統合
      if (zennTocResponse.status === 'fulfilled') {
        const payload = zennTocResponse.value?.data || zennTocResponse.value || {};
        if (Array.isArray(payload.items)) {
          setZennTocItems(payload.items);
        } else {
          console.warn('Zenn TOC response missing items or invalid format:', payload);
          setZennTocItems([]);
        }
      } else {
        console.error('Failed to fetch Zenn TOC:', zennTocResponse.reason);
      }

      // Zennスクラップ（現在の取り組み）
      if (zennScrapsResponse.status === 'fulfilled') {
        const scrapsData = zennScrapsResponse.value.data;
        if (scrapsData && scrapsData.scraps && scrapsData.scraps.length > 0) {
          const latestScrap = scrapsData.scraps[0];
          setCurrentScrap({
            title: latestScrap.title,
            comments_count: latestScrap.comments_count || 0,
            created_at: latestScrap.published_at,
            path: latestScrap.path
          });

          // スクラップの詳細を取得
          try {
            const scrapDetailsResponse = await getZennScrapDetails({
              scrapPath: latestScrap.path
            });
            if (scrapDetailsResponse.status === 200 && scrapDetailsResponse.data) {
              const details = scrapDetailsResponse.data;
              if (details.targetComment) {
                setCurrentGoalComment({
                  body: details.targetComment.body,
                  created_at: details.targetComment.created_at
                });
              } else {
                // Fallback to first comment if targetComment isn't explicitly defined
                const comments = details.comments;
                if (comments && comments.length > 0) {
                  setCurrentGoalComment({
                    body: comments[0].body,
                    created_at: comments[0].published_at
                  });
                } else {
                  console.warn('No target comment or comments found for the latest scrap.');
                }
              }
            } else {
              console.warn('Failed to load scrap details or no data:', scrapDetailsResponse.status);
            }
          } catch (detailError) {
            console.warn('Failed to load scrap details:', detailError);
          }
        }
      } else {
        console.error('Failed to load Zenn scraps:', zennScrapsResponse.reason);
      }

      // X投稿
      if (xPostsResponse.status === 'fulfilled') {
        const posts = xPostsResponse.value.data || xPostsResponse.value || [];
        setXPosts(posts.slice(0, 4));
      } else {
        console.error('Failed to load X posts:', xPostsResponse.reason);
      }

      // Note記事 - 実際のAPIから取得
      if (noteResponse.status === 'fulfilled') {
        const articles = noteResponse.value.data || [];
        const latestTwo = articles.slice(0, 2).map(article => ({
          title: article.title,
          description: article.description,
          published_at: article.published_at,
          url: article.url,
          platform: 'Note'
        }));
        setNoteArticles(latestTwo);

        // ここで公開HTMLからTOCを取得（サーバー関数）
        const tocResults = await Promise.allSettled(
          latestTwo.map(a => fetchNoteToc({ url: a.url }))
        );

        const tocItems = tocResults.map((res, idx) => {
          if (res.status === 'fulfilled') {
            const data = res.value?.data || res.value;
            if (data && !data.error) {
              return {
                url: latestTwo[idx].url,
                title: data.title || latestTwo[idx].title,
                toc: Array.isArray(data.toc) ? data.toc : []
              };
            }
          }
          console.warn(`Failed to fetch TOC for Note article: ${latestTwo[idx].title}`, res.reason);
          return {
            url: latestTwo[idx].url,
            title: latestTwo[idx].title,
            toc: [],
            error: '取得失敗'
          };
        });
        setNoteTocItems(tocItems);
      } else {
        console.error('Failed to load Note articles:', noteResponse.reason);
        // フォールバックとしてモックデータを使用
        setNoteArticles([
          {
            title: "プロダクト開発における意思決定の重要性",
            description: "技術選択から事業戦略まで、迷った時に立ち返るべき原則について",
            published_at: "2025-01-11T20:30:00Z",
            url: "https://note.com/qqqqqppppp/n/abc123",
            platform: "Note"
          },
          {
            title: "エンジニアとしての成長について考える",
            description: "技術力向上と事業理解のバランスを取りながら成長していくためのアプローチ",
            published_at: "2025-01-09T18:45:00Z",
            url: "https://note.com/qqqqqppppp/n/def456",
            platform: "Note"
          }
        ]);
        // 失敗時はTOCなし
        setNoteTocItems([]);
      }

    } catch (err) {
      console.error('An unexpected error occurred during data loading:', err);
      setError('データの取得に失敗しました。');
    } finally {
      setIsLoading(false);
    }
  };

  // フォールバックデータ
  const fallbackScrap = {
    title: "プロダクト開発スプリント #3 (データ取得失敗)",
    comments_count: 0,
    created_at: new Date().toISOString(),
    path: "/ayusa/scraps/example"
  };

  const fallbackGoalComment = {
    body: `今期は以下のような技術習得と実践を目標としています：

• MCPサーバー組み込みアプリケーションの開発
• AIワークフローを活用した効率的な実装手法の確立
• プロダクト戦略と事業開発スキルの向上
• 新しいフレームワークの学習と実践

これらの目標を通じて、技術的な成長と事業価値の創出を両立させていきます。
（※データ取得に失敗したため、こちらはダミーデータです。）`,
    created_at: new Date().toISOString()
  };

  const contentAnalysis = {
    overview: "技術的な深掘りとプロダクト開発への実践的なアプローチが特徴的です。",
    trends: [
      { platform: "X", theme: "日々の学びと気づき", percentage: 85, color: "text-slate-700" },
      { platform: "Zenn", theme: "技術深掘り・アーキテクチャ", percentage: 78, color: "text-blue-600" },
      { platform: "Qiita", theme: "実装Tips・体験談", percentage: 82, color: "text-green-600" },
      { platform: "Note", theme: "思考整理・エッセイ", percentage: 75, color: "text-amber-600" }
    ],
    keywords: ["React", "TypeScript", "アーキテクチャ", "プロダクト開発", "AI活用", "パフォーマンス", "フルスタック"]
  };

  const formatDate = (dateString) => {
    if (!dateString) return "日付不明";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "日付不明";
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const formatXDate = (dateString) => {
    if (!dateString) return "日付不明";
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return '数分前';
    if (hours < 24) return `${hours}時間前`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}日前`;
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'Qiita': return <BookOpen className="w-4 h-4 text-white" />;
      case 'Zenn': return <BookOpen className="w-4 h-4 text-white" />;
      case 'Note': return <FileText className="w-4 h-4 text-white" />;
      default: return <BookOpen className="w-4 h-4 text-white" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'Qiita': return 'bg-green-600';
      case 'Zenn': return 'bg-blue-600';
      case 'Note': return 'bg-amber-600';
      default: return 'bg-gray-600';
    }
  };

  // 全記事をミックスして最新順に並べる（すべてのプラットフォーム統合）
  const allTocArticles = [...qiitaTocArticles, ...zennTocItems, ...noteTocItems]; // This variable isn't directly used in filter, but for conceptual grouping
  const qiitaUrlsForToc = new Set(qiitaTocArticles.map(a => a.url));
  const noteUrlsForToc = new Set(noteTocItems.map(i => i.url));
  const zennUrlsForToc = new Set(zennTocItems.map(i => i.url)); // Zenn items also have URLs/slugs

  const mixedFiltered = [...qiitaArticles, ...noteArticles]
    .filter(a =>
      !qiitaUrlsForToc.has(a.url) &&
      !noteUrlsForToc.has(a.url) &&
      !zennUrlsForToc.has(a.url) // Added Zenn filter for robustness, though Qiita/Note articles won't have Zenn URLs
    )
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());


  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-thin text-slate-800 mb-6 tracking-wide">
                Updates
              </h1>
              <p className="text-xl text-slate-600 font-light">
                現在の取り組みと最新の発信内容
              </p>
            </div>

            <div className="space-y-8">
              <Skeleton className="h-48 w-full rounded-lg" /> {/* Current Scrap */}
              <Skeleton className="h-28 w-full rounded-lg" /> {/* Platform Usage */}
              <Skeleton className="h-48 w-full rounded-lg" /> {/* AI Analysis */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                  <Skeleton className="h-20 w-full rounded-lg" />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-md border border-red-200">
          <h2 className="text-2xl font-light text-red-600 mb-4">データの取得に失敗しました</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <Button onClick={loadAllData} className="bg-red-500 hover:bg-red-600 text-white">再試行</Button>
        </div>
      </div>
    );
  }

  // Fallback for currentScrap if API fetch fails or returns null
  const displayedScrap = currentScrap || fallbackScrap;
  const displayedGoalComment = currentGoalComment || fallbackGoalComment;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">

          {/* ヘッダー */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-thin text-slate-800 mb-6 tracking-wide">
              Updates
            </h1>
            <p className="text-xl text-slate-600 font-light">
              現在の取り組みと最新の発信内容
            </p>
          </motion.div>

          {/* 1. Current Scrap - 最重要セクション */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-light text-slate-800">現在の取り組み</h2>
                    <p className="text-slate-600">Current Sprint Goal</p>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6">
                  <h3 className="text-xl font-medium text-slate-800 mb-3">{displayedScrap.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {displayedScrap.comments_count}件のコメント
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(displayedScrap.created_at)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`https://zenn.dev${displayedScrap.path}`, '_blank')}
                    className="text-blue-600 border-blue-300 hover:bg-blue-50"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    スクラップを見る
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
                  <div className="flex items-center mb-4">
                    <Target className="w-5 h-5 text-blue-600 mr-2" />
                    <h4 className="text-lg font-medium text-slate-800">今期の目標</h4>
                  </div>
                  <div className="prose prose-slate max-w-none">
                    <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg text-sm font-sans">
                      {displayedGoalComment.body}
                    </pre>
                  </div>
                  <div className="mt-4 text-xs text-slate-500">
                    更新: {formatDate(displayedGoalComment.created_at)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 2. プラットフォーム使い分け */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <Card className="bg-slate-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-light text-slate-800 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-amber-500" />
                  使い分けイメージ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">X</h3>
                    <p className="text-sm text-slate-600">残しておきたい考え・言葉</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Zenn</h3>
                    <p className="text-sm text-slate-600">大きめのテーマの記事・スクラム</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Qiita</h3>
                    <p className="text-sm text-slate-600">小さいテーマの記事や体験談</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-medium text-slate-800 mb-2">Note</h3>
                    <p className="text-sm text-slate-600">思考整理・エッセイ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 3. AI分析による発信内容傾向 */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl font-light text-slate-800 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                  AI分析：発信内容傾向
                </CardTitle>
                <p className="text-slate-600 font-light">{contentAnalysis.overview}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  {contentAnalysis.trends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="font-medium text-slate-800 w-16">{trend.platform}</span>
                        <span className="text-slate-600 ml-4">{trend.theme}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-24 h-2 bg-slate-200 rounded-full mr-3">
                          <div
                            className={`h-2 rounded-full bg-gradient-to-r ${
                              trend.platform === 'X' ? 'from-slate-400 to-slate-600' :
                              trend.platform === 'Zenn' ? 'from-blue-400 to-blue-600' :
                              trend.platform === 'Qiita' ? 'from-green-400 to-green-600' :
                              'from-amber-400 to-amber-600'
                            }`}
                            style={{ width: `${trend.percentage}%` }}
                          ></div>
                        </div>
                        <span className={`text-sm font-medium ${trend.color}`}>{trend.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 mb-3">主要キーワード</h4>
                  <div className="flex flex-wrap gap-2">
                    {contentAnalysis.keywords.map((keyword, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          {/* 4. 最新投稿セクション - 新しいレイアウト */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid lg:grid-cols-3 gap-8">

              {/* 左側: Note, Qiita, Zenn 記事 (2/3幅) */}
              <div className="lg:col-span-2">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                    <BookOpen className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-light text-slate-800">最新記事</h3>
                  <span className="text-sm text-slate-500 ml-2">Note・Qiita・Zenn</span>
                </div>

                <div className="space-y-4">
                  {/* Qiita（最新2件）はTOC付きカードで表示 */}
                  {qiitaTocArticles.map((article, index) => (
                    <QiitaArticleCard key={article.url || `qiita-toc-${index}`} article={article} defaultExpanded={true} />
                  ))}

                  {/* Zenn（最新2件）はTOC付きカードで表示 */}
                  {zennTocItems.map((item, idx) => (
                    <ZennTocCard key={item.slug || `zenn-toc-${idx}`} item={item} defaultExpanded={true} />
                  ))}

                  {/* Note（最新2件） */}
                  {noteTocItems.map((item, idx) => (
                    <NoteTocCard key={item.url || `note-toc-${idx}`} item={item} defaultExpanded={true} />
                  ))}

                  {/* 混合記事（TOC対象は除外済み） */}
                  {mixedFiltered.map((article, index) => (
                    <Card key={article.url || `${article.platform}-${index}`} className="border border-slate-200 hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 ${getPlatformColor(article.platform)} rounded-full flex items-center justify-center flex-shrink-0`}>
                            {getPlatformIcon(article.platform)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {article.platform}
                              </Badge>
                              {article.emoji && (
                                <span className="text-lg">{article.emoji}</span>
                              )}
                            </div>
                            <h4 className="font-medium text-slate-800 mb-2 line-clamp-2">
                              {article.title}
                            </h4>
                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                              {article.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {article.tags && (
                                  <div className="flex flex-wrap gap-1">
                                    {article.tags.slice(0, 2).map((tag, tagIndex) => (
                                      <Badge key={tagIndex} variant="outline" className="text-xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                                <span className="text-xs text-slate-500">
                                  {formatDate(article.published_at)}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(article.url, '_blank')}
                              >
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {/* 全ての記事リストが空の場合にのみ表示 */}
                  {qiitaTocArticles.length === 0 && zennTocItems.length === 0 && mixedFiltered.length === 0 && noteTocItems.length === 0 && (
                    <div className="text-center py-8 text-slate-500">
                      まだ記事がありません。
                    </div>
                  )}
                </div>
              </div>

              {/* 右側: X タイムライン (1/3幅) */}
              <div className="lg:col-span-1">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center mr-3">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-slate-800">X タイムライン</h3>
                    <span className="text-sm text-slate-500">@rowuprowup</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {xPosts.length > 0 ? xPosts.map((post, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="border border-slate-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-medium text-slate-900 text-sm">Yusa Aihara</span>
                                <span className="text-slate-500 text-xs">@rowuprowup</span>
                                <span className="text-slate-400 text-xs">·</span>
                                <span className="text-slate-500 text-xs">{formatXDate(post.created_at)}</span>
                              </div>
                              <p className="text-slate-800 leading-relaxed mb-3 text-sm">
                                {post.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 text-slate-500 text-xs">
                                  {post.engagement ? (
                                    <>
                                      <span>{post.engagement.likes || 0} いいね</span>
                                      <span>{post.engagement.retweets || 0} リツイート</span>
                                    </>
                                  ) : (
                                    <span>エンゲージメント不明</span>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(post.url, '_blank')}
                                  className="text-slate-500 hover:text-blue-600"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )) : (
                    <div className="text-center py-8 text-slate-500">
                      まだX投稿がありません。
                    </div>
                  )}
                </div>

                <div className="text-center mt-6">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://twitter.com/rowuprowup', '_blank')}
                    className="text-slate-600 hover:text-blue-600 border-slate-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    もっと見る on X
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>

        </div>
      </div>
    </div>
  );
}
