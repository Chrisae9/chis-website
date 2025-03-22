// This file is now deprecated. All functionality has been moved to src/services/postService.ts
// Keeping this file as a re-export to maintain backward compatibility

import { 
  loadPosts as loadPostsService,
  extractAllTags,
  extractAllCategories,
  sortPostsByDate,
  findPostBySlug,
  findPostBySlugCaseInsensitive,
  findReferencingPosts
} from '../services/postService';

export const loadPosts = loadPostsService;

// Re-export other functions for backward compatibility
export {
  extractAllTags,
  extractAllCategories,
  sortPostsByDate,
  findPostBySlug,
  findPostBySlugCaseInsensitive,
  findReferencingPosts
};
