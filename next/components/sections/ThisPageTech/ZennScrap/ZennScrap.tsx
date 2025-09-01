import React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  ArrowRight,
  CheckCircle,
  Settings,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const ZennScrap: React.FC = () => {
  const scrapProcessFlow = [
    {
      step: 1,
      title: 'API RouteでのZenn Scrap取得',
      path: '/app/api/updates/zenn_scrap/route.ts',
      description: 'Zenn APIからScrapリストを取得し、型安全にバリデーション',
      details: [
        'fetch()でZenn公式APIにリクエスト',
        'Zodスキーマによる実行時型検証',
        'ISRキャッシュ（1時間）でパフォーマンス向上'
      ],
      code: `const response = await fetch(
  \`https://zenn.dev/api/scraps?username=\${username}&order=latest\`,
  { next: { revalidate: 3600 } }
);
const validatedData = ZennScrapSchema.parse(data);`
    },
    {
      step: 2,
      title: 'コメントデータの抽出',
      path: '/features/zenn-scrap/comment-fetcher.ts',
      description: 'ScrapページのHTMLから__NEXT_DATA__を解析してコメント取得',
      details: [
        'ScrapページのHTMLを取得',
        '__NEXT_DATA__スクリプトからJSONデータ抽出',
        'pagePropsからコメント配列を取得'
      ],
      code: `const html = await response.text();
const nextDataMatch = html.match(
  /<script id="__NEXT_DATA__".*?>(.*?)<\/script>/
);
const comments = JSON.parse(nextDataMatch[1]).props.pageProps.comments;`
    },
    {
      step: 3,
      title: 'HTML解析と構造化',
      path: '/features/zenn-scrap/html-processor.ts',
      description: 'CheerioでHTMLを解析し、要素タイプ別に構造化データへ変換',
      details: [
        'Cheerioによるサーバーサイド DOM操作',
        '見出し・段落・コードブロックの自動分類',
        '不要な属性とクラスのクリーニング'
      ],
      code: `const $ = load(html);
$('body').children().each((_, element) => {
  const tagName = element.tagName?.toLowerCase();
  switch (tagName) {
    case 'h1': case 'h2': case 'h3':
      structured.push({
        type: 'heading',
        content: $el.text(),
        level: parseInt(tagName.charAt(1))
      });
  }
});`
    },
    {
      step: 4,
      title: 'React コンポーネント表示',
      path: '/components/updates/zenn_scrap/',
      description: '構造化データを美しいUIコンポーネントとしてレンダリング',
      details: [
        '要素タイプに応じた動的コンポーネント選択',
        'Tailwind CSSによる統一されたスタイリング',
        'レスポンシブデザインとアクセシビリティ対応'
      ],
      code: `const renderElement = (element: StructuredElement) => {
  switch (element.type) {
    case 'heading':
      const HeadingTag = \`h\${element.level}\`;
      return <HeadingTag className="font-semibold mb-4">
        {element.content}
      </HeadingTag>;
  }
};`
    }
  ];

  return (
    <div className="space-y-8">
      {/* データフロー概要 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Zenn Scrap 処理フロー
        </h3>
        <div className="flex items-center justify-between text-sm text-slate-600 overflow-x-auto mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded">Zenn API</div>
            <ArrowRight className="w-4 h-4" />
            <div className="p-2 bg-green-100 rounded">HTML解析</div>
            <ArrowRight className="w-4 h-4" />
            <div className="p-2 bg-purple-100 rounded">構造化</div>
            <ArrowRight className="w-4 h-4" />
            <div className="p-2 bg-orange-100 rounded">React表示</div>
          </div>
        </div>
        <p className="text-slate-600">
          ZennのScrapデータを安全かつ効率的に取得し、美しいUIで表示するまでの4段階プロセス
        </p>
      </div>

      {/* 詳細ステップ */}
      {scrapProcessFlow.map((process, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                    {process.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {process.title}
                  </h3>
                  <Badge variant="outline" className="text-xs mb-2">
                    {process.path}
                  </Badge>
                  <p className="text-slate-600">{process.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    処理詳細
                  </h4>
                  <ul className="space-y-2">
                    {process.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    実装例
                  </h4>
                  <div className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-xs text-slate-100">
                      <code>{process.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* 技術的な工夫点 */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-800">🎯 技術的な工夫点</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-slate-800 mb-2">パフォーマンス最適化</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• ISRによる1時間キャッシュ</li>
                <li>• Promise.allでの並行処理</li>
                <li>• コンポーネントレベルの遅延読み込み</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-slate-800 mb-2">セキュリティ対策</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Zodスキーマによる型安全性</li>
                <li>• HTMLサニタイゼーション</li>
                <li>• CORS対応のプロキシ化</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
