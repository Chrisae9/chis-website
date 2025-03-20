// Extract YouTube video ID from various YouTube URL formats
export function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  
  // Handle youtu.be format
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?&]/)[0];
    return id || null;
  }
  
  // Handle youtube.com/watch?v= format
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
}
