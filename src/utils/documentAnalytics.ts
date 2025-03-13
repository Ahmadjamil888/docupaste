
export interface DocumentStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  readingTimeMinutes: number;
  sentenceCount: number;
}

export const analyzeDocument = (content: string): DocumentStats => {
  if (!content) {
    return {
      wordCount: 0,
      charCount: 0,
      paragraphCount: 0,
      readingTimeMinutes: 0,
      sentenceCount: 0
    };
  }

  const words = content.trim().split(/\s+/).filter(word => word.length > 0);
  const paragraphs = content
    .split(/\n+/)
    .filter(paragraph => paragraph.trim().length > 0);
  
  // Simple sentence detection based on punctuation
  const sentences = content
    .split(/[.!?]+/)
    .filter(sentence => sentence.trim().length > 0);

  // Calculate reading time (average reading speed is ~200-250 words per minute)
  const readingTimeMinutes = Math.max(1, Math.ceil(words.length / 225));

  return {
    wordCount: words.length,
    charCount: content.length,
    paragraphCount: paragraphs.length,
    readingTimeMinutes,
    sentenceCount: sentences.length
  };
};

export const highlightSearchResults = (content: string, searchTerm: string): string => {
  if (!searchTerm || !content) return content;
  
  // This is a simple implementation - a production app would use a more robust approach
  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return content.replace(regex, '<span class="bg-yellow-200">$1</span>');
};
