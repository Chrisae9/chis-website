// React imports
import React from 'react';

// Local imports - types
import { Post } from '../types';
import { SortOrder } from './SortControls';

// Local imports - components
import { PostCard } from './PostCard';
import { CategoryFilter } from './CategoryFilter';
import { SortControls } from './SortControls';

/**
 * Props for the PostList component
 */
interface PostListProps {
  /** Array of posts to display */
  posts: Post[];
  /** Current search term for highlighting matches */
  searchTerm: string;
  /** Callback function when a post is clicked */
  onPostClick: (slug: string) => void;
  /** All available categories for filtering */
  categories: string[];
  /** Currently selected category or null for "All" */
  selectedCategory: string | null;
  /** Callback function when category selection changes */
  onCategoryChange: (category: string | null) => void;
  /** Current sort order for post listing */
  sortOrder: SortOrder;
  /** Callback function when sort order changes */
  onSortChange: (order: SortOrder) => void;
}

/**
 * Renders a list of post cards with filtering and sorting controls
 * 
 * Features:
 * - Category filtering dropdown
 * - Sort order controls
 * - Responsive grid layout
 * - Empty state when no posts match criteria
 * 
 * @param props - Component properties
 * @returns React component
 */
export function PostList({
  posts,
  searchTerm,
  onPostClick,
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange
}: PostListProps) {
  return (
    <div className="space-y-8">
      {/* Filter and sort controls */}
      <div className="flex flex-row gap-4 mb-6 items-center">
        {/* Category filter */}
        <div className="flex-1">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        {/* Sort controls */}
        <div className="flex-shrink-0">
          <SortControls sortOrder={sortOrder} onSortChange={onSortChange} />
        </div>
      </div>
      
      {/* Post list */}
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          post={post}
          searchTerm={searchTerm}
          onPostClick={onPostClick}
        />
      ))}
      
      {/* Empty state */}
      {posts.length === 0 && (
        <div 
          className="text-center py-8 text-gray-500 dark:text-gray-400"
          aria-live="polite"
        >
          No posts found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}
