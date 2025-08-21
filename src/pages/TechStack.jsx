import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code2, Server, Database, Cloud, Shield, Zap, Monitor, Globe, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TechStack() {
  const [selectedCategory, setSelectedCategory] = useState('frontend');

  const techCategories = {
    frontend: {
      title: 'フロントエンド',
      icon: Globe,
      color: 'blue',
      description: 'ユーザーインターフェースとユーザーエクスペリエンスを担当する技術群',
      technologies: [
        {
          name: 'React',
          description: 'コンポーネントベースのUI構築ライブラリ。状態管理と仮想DOMによる効率的な描画',
          use_case: 'SPAの構築、再利用可能なUIコンポーネントの作成',
          pros: ['高いパフォーマンス', '豊富なエコシステム', '学習リソースが豊富'],
          cons: ['学習コストが高い', 'ビルドツールの設定が複雑']
        },
        {
          name: 'Tailwind CSS',
          description: 'ユーティリティファーストのCSSフレームワーク。カスタムデザインシステムを効率的に構築',
          use_case: 'レスポンシブデザイン、一貫性のあるスタイリング',
          pros: ['開発速度の向上', '一貫性のあるデザイン', '小さなバンドルサイズ'],
          cons: ['HTMLが冗長になる', '初期学習が必要']
        }
      ]
    },
    backend: {
      title: 'バックエンド',
      icon: Server,
      color: 'green',
      description: 'サーバーサイドロジック、API、データ処理を担当する技術群',
      technologies: [
        {
          name: 'Deno',
          description: 'TypeScript/JavaScriptランタイム。セキュアでモダンな実行環境',
          use_case: 'サーバーレス関数、API開発、Edge Computing',
          pros: ['TypeScriptネイティブ', 'セキュア', 'モダンなWeb API'],
          cons: ['Node.jsほど成熟していない', 'パッケージエコシステムが小さい']
        }
      ]
    },
    infrastructure: {
      title: 'インフラ・運用',
      icon: Cloud,
      color: 'purple',
      description: 'アプリケーションの稼働を支える基盤技術とモニタリング',
      technologies: [
        {
          name: 'Base44 Platform',
          description: 'フルスタック開発プラットフォーム。認証、データベース、デプロイを統合',
          use_case: 'RAD（迅速アプリケーション開発）、プロトタイピング',
          pros: ['開発速度の向上', '統合された機能', '運用の簡素化'],
          cons: ['プラットフォーム依存', 'カスタマイズ性の制限']
        }
      ]
    },
    observability: {
      title: '監視・観測性',
      icon: Monitor,
      color: 'orange',
      description: 'アプリケーションの性能とユーザー体験を可視化する技術',
      technologies: [
        {
          name: 'Server-Timing API',
          description: 'サーバー側の処理時間をブラウザに送信するWeb標準API',
          use_case: 'パフォーマンス分析、ボトルネック特定',
          pros: ['標準API', 'DevToolsとの統合', '詳細な計測'],
          cons: ['サーバー実装が必要', 'ブラウザサポート依存']
        }
      ]
    }
  };

  const colorClasses = {
    blue: 'border-blue-200 bg-blue-50 text-blue-800',
    green: 'border-green-200 bg-green-50 text-green-800',
    purple: 'border-purple-200 bg-purple-50 text-purple-800',
    orange: 'border-orange-200 bg-orange-50 text-orange-800',
    indigo: 'border-indigo-200 bg-indigo-50 text-indigo-800'
  };

  const selectedCategoryData = techCategories[selectedCategory];
  const IconComponent = selectedCategoryData.icon;

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-thin text-slate-800 mb-6 tracking-wide">
              使用技術の説明
            </h1>
            <p className="text-xl text-slate-600 font-light max-w-3xl mx-auto">
              このポートフォリオサイトで使用している技術スタックの詳細説明と、選択理由、実装上の考慮点をご紹介します。
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {Object.entries(techCategories).map(([key, category]) => {
              const CategoryIcon = category.icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                      selectedCategory === key ? 'ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${colorClasses[category.color]}`}>
                        <CategoryIcon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-xl font-light text-slate-800">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {category.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-50 rounded-2xl p-8"
          >
            <div className="flex items-center mb-8">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${colorClasses[selectedCategoryData.color]}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-3xl font-thin text-slate-800">
                  {selectedCategoryData.title}
                </h2>
                <p className="text-slate-600 font-light">
                  {selectedCategoryData.description}
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {selectedCategoryData.technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="text-xl font-light text-slate-800">{tech.name}</span>
                        <Badge variant="outline" className={colorClasses[selectedCategoryData.color]}>
                          {selectedCategoryData.title}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">概要</h4>
                        <p className="text-slate-600 leading-relaxed">{tech.description}</p>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 mb-2">使用場面</h4>
                        <p className="text-slate-600 leading-relaxed">{tech.use_case}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            メリット
                          </h4>
                          <ul className="space-y-1">
                            {tech.pros.map((pro, proIndex) => (
                              <li key={proIndex} className="text-sm text-slate-600 flex items-center">
                                <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-slate-800 mb-3 flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                            注意点
                          </h4>
                          <ul className="space-y-1">
                            {tech.cons.map((con, conIndex) => (
                              <li key={conIndex} className="text-sm text-slate-600 flex items-center">
                                <div className="w-1 h-1 bg-orange-400 rounded-full mr-2"></div>
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="mt-16"
          >
            <Card className="bg-gradient-to-r from-slate-50 to-blue-50 border-slate-200">
              <CardHeader>
                <CardTitle className="text-2xl font-thin text-slate-800 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-blue-600" />
                  技術選定の思想
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">開発効率を重視</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      TypeScriptの型安全性、フレームワークの生産性、開発体験の向上を重視した技術選択を行っています。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">パフォーマンス最適化</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      エッジコンピューティング、効率的なキャッシング、軽量なライブラリ選択により高速な体験を実現。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">モダンWeb標準準拠</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Web標準に準拠したAPI使用、プログレッシブな機能強化、アクセシビリティの考慮。
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-800 mb-3">運用・保守性</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      構造化ログ、適切な監視、自動化により長期的な運用コストの削減を図っています。
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>

        </div>
      </div>
    </div>
  );
}