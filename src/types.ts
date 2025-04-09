/**
 * Core type definitions for the blog application
 */

/**
 * Represents the frontmatter metadata for a blog post
 * Contains post metadata extracted from markdown files
 */
export interface PostFrontmatter {
  /** Post title displayed in UI */
  title: string;
  /** Publication date in ISO format (YYYY-MM-DD) */
  date: string;
  /** Brief description of the post content */
  summary: string;
  /** List of tags associated with the post for categorization */
  tags: string[];
  /** Optional list of other posts that this post links to */
  backlinks?: string[];
  /** Optional category for the post */
  category?: string;
  /** Optional flag to mark the post as a draft (not published) */
  draft?: boolean;
  /** Optional flag to hide the post from listing pages while still allowing direct URL access */
  hidden?: boolean;
}

/**
 * Represents a complete blog post with content and metadata
 */
export interface Post {
  /** Unique identifier for the post, derived from filename */
  slug: string;
  /** Full markdown content of the post */
  content: string;
  /** Metadata extracted from the post's frontmatter */
  frontmatter: PostFrontmatter;
}

/**
 * Configuration for the sidebar components
 * Handles the visibility state and toggle functions for both sidebars
 */
export interface SidebarConfig {
  /** Whether the left sidebar is currently visible */
  showLeftSidebar: boolean;
  /** Whether the right sidebar is currently visible */
  showRightSidebar: boolean;
  /** Function to toggle the left sidebar visibility */
  setShowLeftSidebar: (show: boolean) => void;
  /** Function to toggle the right sidebar visibility */
  setShowRightSidebar: (show: boolean) => void;
}
