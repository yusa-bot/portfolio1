"use client";

import React, { useState, useEffect } from 'react';
import { List } from 'lucide-react';
import { extractQiitaToc } from '../../../../../../features/ArticlesToc/Qiita';
import { TocProps, TocItem } from './type';

export const QiitaToc: React.FC<TocProps> = ({ article }) => {
  const [toc, setToc] = useState<TocItem[]>([]);

  useEffect(() => {
    if (article?.body) {
      const extractedToc = extractQiitaToc(article.body);
      setToc(extractedToc);
    }
  }, [article?.body]);

  if (toc.length === 0) {
    return null;
  }

  const handleTocItemClick = (e: React.MouseEvent, url: string, itemId: string) => {
    e.stopPropagation(); // カード全体のクリックイベントを阻止
    const fullUrl = `${url}#${itemId}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-medium text-slate-700">contents</span>
      </div>

      <div className="space-y-1">
          {toc.map((item, index) => {
            const indentPx = Math.max(0, (item.level || 2) - (item.base || 2)) * 16;
            const isTopLevel = (item.level || 2) === (item.base || 2);

            return (
              <div
                key={`${item.id}-${index}`}
                className="mb-1"
                style={{ marginLeft: `${indentPx}px` }}
              >
                <div className="flex items-center py-1">
                  <span
                    className={`mr-2 inline-block rounded-full ${
                      isTopLevel ? 'bg-green-500' : 'bg-green-300'
                    }`}
                    style={{ width: 6, height: 6 }}
                  />
                  <button
                    onClick={(e) => handleTocItemClick(e, article.url, item.id)}
                    className="text-xs text-left text-slate-600 hover:text-green-600 hover:underline transition-colors duration-200 leading-relaxed"
                  >
                    {item.text}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
    </div>
  );
};
