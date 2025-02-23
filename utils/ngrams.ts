export function createSearchTokens(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/g).filter(Boolean);
  const tokens = new Set<string>();
  
  words.forEach(word => {
    // Split words into trigrams
    if (word.length > 2) {
      for (let i = 0; i <= word.length - 3; i++) {
        tokens.add(word.substr(i, 3));
      }
    }
    // Add whole words with fuzzy variants
    tokens.add(word);
    if (word.length > 4) {
      tokens.add(word.substr(0, word.length - 1)); // Match plural versions
    }
  });
  
  return Array.from(tokens);
}
