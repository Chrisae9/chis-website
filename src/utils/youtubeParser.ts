/**
 * YouTube URL Parser Utilities
 * Helper functions for extracting information from YouTube URLs
 */

/**
 * Extracts the video ID from various YouTube URL formats
 * 
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://www.youtube.com/v/VIDEO_ID
 * - https://www.youtube.com/user/USERNAME/VIDEO_ID
 * 
 * @param url - The YouTube URL to parse
 * @returns The extracted video ID or null if no valid ID is found
 */
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle youtu.be format (short links)
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    return id || null;
  }
  
  // Handle standard youtube.com formats with regex
  // This captures the video ID which is always 11 characters long
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}
