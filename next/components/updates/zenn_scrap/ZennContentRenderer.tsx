"use client";

import React from 'react';
import { StructuredElement } from './type';

interface ZennContentRendererProps {
  elements: StructuredElement[];
  className?: string;
}

export const ZennContentRenderer: React.FC<ZennContentRendererProps> = ({
  elements,
  className = ''
}) => {
  const renderElement = (element: StructuredElement, index: number) => {
    const baseClasses = "mb-4";

    switch (element.type) {
      case 'heading':
        const HeadingTag = `h${Math.min(element.level || 1, 6)}` as keyof JSX.IntrinsicElements;
        const headingClasses = {
          1: "text-3xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-purple-200",
          2: "text-2xl font-bold text-slate-800 mb-5 pb-2 border-b border-purple-100",
          3: "text-xl font-semibold text-slate-700 mb-4",
          4: "text-lg font-semibold text-slate-700 mb-3",
          5: "text-base font-semibold text-slate-700 mb-3",
          6: "text-sm font-semibold text-slate-700 mb-2"
        };

        return (
          <HeadingTag
            key={index}
            className={headingClasses[element.level as keyof typeof headingClasses] || headingClasses[1]}
          >
            {element.content}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <div
            key={index}
            className={`${baseClasses} text-slate-700 leading-relaxed prose-p`}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );

      case 'unordered-list':
        return (
          <div
            key={index}
            className={`${baseClasses} ml-4`}
          >
            <ul
              className="space-y-2 list-disc list-outside marker:text-purple-500"
              dangerouslySetInnerHTML={{ __html: element.content }}
            />
          </div>
        );

      case 'ordered-list':
        return (
          <div
            key={index}
            className={`${baseClasses} ml-4`}
          >
            <ol
              className="space-y-2 list-decimal list-outside marker:text-purple-500 marker:font-semibold"
              dangerouslySetInnerHTML={{ __html: element.content }}
            />
          </div>
        );

      case 'blockquote':
        return (
          <blockquote
            key={index}
            className={`${baseClasses} border-l-4 border-purple-300 pl-4 py-2 bg-purple-50/50 rounded-r-lg italic text-slate-600`}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );

      case 'code-block':
        return (
          <div
            key={index}
            className={`${baseClasses} rounded-lg overflow-hidden`}
          >
            <pre className="bg-slate-800 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm leading-relaxed">
              <code dangerouslySetInnerHTML={{ __html: element.content }} />
            </pre>
          </div>
        );

      default:
        return (
          <div
            key={index}
            className={`${baseClasses} text-slate-700`}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );
    }
  };

  return (
    <div className={`zenn-content-structured ${className}`}>
      {elements.map((element, index) => renderElement(element, index))}
    </div>
  );
};
