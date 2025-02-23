// Precompute trigrams for better fuzzy matching
export function createTrigrams(text: string): Set<string> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9]/g, '');
  const trigrams = new Set<string>();
  for (let i = 0; i <= cleaned.length - 3; i++) {
    trigrams.add(cleaned.substring(i, i + 3));
  }
  return trigrams;
}

// Advanced markdown cleaning with HTML escaping
export function stripMarkdown(content: string): string {
  return content
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/(#+ )/g, '')
    .replace(/!?\[([^\]]*)\]\([^\)]*\)/g, '$1')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\b(a|an|the|and|or|but)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Cache layer for search index
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
export function getSearchIndexCache(): SearchDocument[] | null {
  const cached = localStorage.getItem('searchIndex');
  const timestamp = localStorage.getItem('searchIndexTimestamp');
  
  if (cached && timestamp && Date.now() - Number(timestamp) < CACHE_TTL) {
    return JSON.parse(cached);
  }
  return null;
}

export function saveSearchIndexCache(index: SearchDocument[]): void {
  localStorage.setItem('searchIndex', JSON.stringify(index));
  localStorage.setItem('searchIndexTimestamp', Date.now().toString());
}
