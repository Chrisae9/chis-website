import React from 'react';
import { Post } from '../types';
import { PostCard } from './PostCard';
import { CategoryFilter } from './CategoryFilter';
import { SortControls, SortOrder } from './SortControls';

interface PostListProps {
  posts: Post[];
  searchTerm: string;
  onPostClick: (slug: string) => void;
  categories: string[];
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

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
      <div className="flex flex-row gap-4 mb-6 items-center justify-between">
        <div className="w-1/2 sm:w-64">
          <CategoryFilter 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        <div className="w-1/2 sm:flex-1 flex justify-end">
          <SortControls sortOrder={sortOrder} onSortChange={onSortChange} />
        </div>
      </div>
      
      {posts.map((post) => (
        <PostCard
          key={post.slug}
          post={post}
          searchTerm={searchTerm}
          onPostClick={onPostClick}
        />
      ))}
      
      {posts.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No posts found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}
