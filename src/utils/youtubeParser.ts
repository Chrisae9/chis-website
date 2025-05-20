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
export function extractYouTubeVideoId(url: string | null | undefined): string | null {
  if (!url) return null;

  let videoId: string | null = null;

  // Regular expression to cover:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  // - And variations with query parameters or different TLDs.
  // It looks for a 11-character base64-like string.
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:watch\?v=|embed\/|shorts\/|v\/|user\/.+\/|playlist\?.+list=)([^#&?]{11})/,
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^#&?]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      videoId = match[1];
      break; 
    }
  }

  // Fallback for URLs like /v/VIDEO_ID or /e/VIDEO_ID (less common, but good to have)
  // and also handles cases where the above regex might miss due to URL structure changes.
  if (!videoId) {
    const legacyMatch = url.match(/(?:\/|%3D|v=|vi=)([0-9A-Za-z_-]{11})(?:[%#?&]|$)/);
    if (legacyMatch && legacyMatch[1] && legacyMatch[1].length === 11) {
      videoId = legacyMatch[1];
    }
  }
  
  // Final check for common invalid patterns that might slip through
  if (videoId && (videoId === "videoseries" || videoId.includes("playlist"))) {
    return null;
  }

  return videoId;
}
