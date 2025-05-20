import { describe, it, expect } from 'vitest';
import { extractYouTubeVideoId } from './youtubeParser';

describe('extractYouTubeVideoId', () => {
  const testVideoId = 'ABCDEFGHI_K'; // 11-character placeholder

  // Test cases for supported YouTube URL formats
  it('should extract video ID from standard URL', () => {
    expect(extractYouTubeVideoId(`https://www.youtube.com/watch?v=${testVideoId}`)).toBe(testVideoId);
  });

  it('should extract video ID from short URL', () => {
    expect(extractYouTubeVideoId(`https://youtu.be/${testVideoId}`)).toBe(testVideoId);
  });

  it('should extract video ID from embed URL', () => {
    expect(extractYouTubeVideoId(`https://www.youtube.com/embed/${testVideoId}`)).toBe(testVideoId);
  });

  it('should extract video ID from shorts URL', () => {
    expect(extractYouTubeVideoId(`https://www.youtube.com/shorts/${testVideoId}`)).toBe(testVideoId);
  });

  it('should extract video ID from URL with extra query parameters', () => {
    expect(extractYouTubeVideoId(`https://www.youtube.com/watch?v=${testVideoId}&feature=youtu.be`)).toBe(testVideoId);
  });

  // Test cases for invalid inputs
  it('should return null for null input', () => {
    expect(extractYouTubeVideoId(null)).toBeNull();
  });

  it('should return null for empty string input', () => {
    expect(extractYouTubeVideoId('')).toBeNull();
  });

  it('should return null for non-YouTube URL', () => {
    expect(extractYouTubeVideoId('https://www.google.com')).toBeNull();
  });

  it('should return null for URL with malformed video ID', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?v=')).toBeNull();
  });

  it('should return null for URL with missing video ID', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/watch?')).toBeNull();
  });

  it('should return null for unrelated path', () => {
    expect(extractYouTubeVideoId('https://www.youtube.com/feed/subscriptions')).toBeNull();
  });
});
