import { load } from 'cheerio';

export interface StructuredElement {
  type: string;
  content: string;
  level?: number;
}

export interface ProcessedHtml {
  raw: string;
  cleaned: string;
  structured: StructuredElement[];
}

export function processHtml(html: string): ProcessedHtml {
  const cleaned = cleanZennHtml(html);
  const structured = structureZennContent(html);

  return {
    raw: html,
    cleaned,
    structured
  };
}

function cleanZennHtml(html: string): string {
  const $ = load(html);

  // 不要なdata属性とクラスを削除
  $('*').each((_, element) => {
    $(element).removeAttr('data-line');
  });
  $('.code-line').removeClass('code-line');
  $('.header-anchor-link').removeAttr('aria-hidden');

  return $.html();
}

function structureZennContent(html: string): StructuredElement[] {
  const $ = load(html);
  const structured: StructuredElement[] = [];

  $('body').children().each((_, element) => {
    const $el = $(element);
    const tagName = element.tagName?.toLowerCase();

    switch (tagName) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        structured.push({
          type: 'heading',
          content: $el.text(),
          level: parseInt(tagName.charAt(1))
        });
        break;
      case 'p':
        const text = $el.text().trim();
        if (text) {
          structured.push({
            type: 'paragraph',
            content: $el.html() || ''
          });
        }
        break;
      case 'ul':
      case 'ol':
        structured.push({
          type: tagName === 'ul' ? 'unordered-list' : 'ordered-list',
          content: $el.html() || ''
        });
        break;
      case 'blockquote':
        structured.push({
          type: 'blockquote',
          content: $el.html() || ''
        });
        break;
      case 'pre':
        structured.push({
          type: 'code-block',
          content: $el.html() || ''
        });
        break;
      default:
        if ($el.text().trim()) {
          structured.push({
            type: 'other',
            content: $el.html() || ''
          });
        }
    }
  });

  return structured;
}
