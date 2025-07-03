// React imports
import React from 'react';

// Third-party imports
import { Calendar, Tag as TagIcon, ChevronRight } from 'lucide-react';

// Local imports - types
import { Post } from '../types';

/**
 * Props for the PostCard component
 */
interface PostCardProps {
  /** Post data to display */
  post: Post;
  /** Current search term for highlighting matched text */
  searchTerm: string;
  /** Callback function when post is clicked */
  onPostClick: (slug: string) => void;
}

/**
 * Renders a card displaying post summary information
 * 
 * Features:
 * - Displays post title, summary, date, category, and tags
 * - Highlights search terms in title and summary
 * - Interactive card with hover effects
 * - Displays formatted date
 * 
 * @param props - Component properties
 * @returns React component
 */
export function PostCard({ post, searchTerm, onPostClick }: PostCardProps) {
  /**
   * Highlights search term matches in text with <mark> elements
   * @param text - The text to highlight search terms in
   * @returns React nodes with highlighted text
   */
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-600/70 text-gray-900 dark:text-gray-100 px-0.5 rounded">{part}</mark> : 
        part
    );
  };

  /**
   * Formats a date string into a readable format
   * @param dateString - Date string from post frontmatter
   * @returns Formatted date string
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    // Add timezone offset to ensure correct date
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="bg-glass-card border-0 cursor-pointer rounded-lg shadow-card hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
      onClick={() => onPostClick(post.slug)}
      tabIndex={0}
      role="button"
      aria-label={`Read post: ${post.frontmatter.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onPostClick(post.slug);
        }
      }}
    >
      <div className="p-4">
        {/* Post title with search highlighting */}
        <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-white">
          {highlightText(post.frontmatter.title)}
        </h2>
        
        {/* Post metadata */}
        <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:gap-3">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300" aria-hidden="true" />
            <span className="text-sm text-gray-600 dark:text-gray-200">
              {formatDate(post.frontmatter.date)}
            </span>
          </div>
          
          {/* Category */}
          {post.frontmatter.category && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full whitespace-nowrap font-medium">
                {post.frontmatter.category}
              </span>
            </div>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-1.5">
            <TagIcon className="h-4 w-4 text-gray-400 dark:text-gray-300 shrink-0" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5">
              {post.frontmatter.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-700/40 text-gray-700 dark:text-blue-200 rounded whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Post summary with search highlighting */}
        <p className="text-sm text-gray-600 dark:text-gray-200 mb-3 line-clamp-2">
          {highlightText(post.frontmatter.summary)}
        </p>
        
        {/* Read more link */}
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-300 font-medium">
          Read more <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}
