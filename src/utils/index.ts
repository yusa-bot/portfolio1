export function createPageUrl(pageName: string): string {
  return '/' + String(pageName).toLowerCase().replace(/ /g, '-');
}
