"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThisPageTechProps } from './types';
import { TechStack } from './TechStack';
import { ZennScrap } from './ZennScrap';

export const ThisPageTech: React.FC<ThisPageTechProps> = ({ className = '' }) => {
  return (
    <section className={`py-12 bg-gradient-to-br from-slate-50 to-white ${className}`}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
              Technical Overview
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              このサイトの技術構成とScrap処理フローの実装工夫
            </p>
          </div>

          {/* 技術スタック */}
          <div className="mb-20">
            <h3 className="text-2xl font-semibold text-slate-800 mb-8 text-center">
              技術スタック
            </h3>
            <TechStack />
          </div>

          {/* 区切り線 */}
          <div id="zenn-scrap" className="border-t border-slate-200 mb-16"></div>

          {/* Scrap処理フロー */}
          <div className="mb-12">
            <div className="mb-12">
              <h3 className="text-2xl font-semibold text-slate-800 mb-4">
                Zenn Scrap 表示機能の実装
              </h3>
              <p className="text-lg text-slate-600 max-w-3xl">
                <a
                  href="/updates"
                  className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2"
                >
                  Updates
                </a>
                で実装している Zenn Scrap 取得・解析・表示の技術的な実装工夫と処理フロー
              </p>
            </div>
            <ZennScrap />
          </div>

          {/* フッター */}
          <div className="text-center pt-6 border-t border-slate-200">
            <Button
              variant="outline"
              className="text-slate-600 hover:text-slate-900"
              onClick={() => window.open('https://github.com/yusa-bot/portfolio1', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              GitHubで詳細を見る
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
