import React from 'react';
import { Calendar, Tag as TagIcon, ChevronRight } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  searchTerm: string;
  onPostClick: (slug: string) => void;
}

export function PostCard({ post, searchTerm, onPostClick }: PostCardProps) {
  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchTerm.toLowerCase() ? 
        <mark key={i} className="bg-yellow-100 dark:bg-yellow-900/50 text-gray-900 dark:text-gray-100 px-0.5">{part}</mark> : 
        part
    );
  };

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
      className="bg-gradient-blue-subtle border border-blue-100 dark:border-blue-900/30 hover:border-blue-200 dark:hover:border-blue-800/30 cursor-pointer rounded-lg shadow-sm transition-all hover:shadow-md"
      onClick={() => onPostClick(post.slug)}
    >
      <div className="p-4">
        <h2 className="text-base font-medium mb-3 text-gray-900 dark:text-gray-100">{highlightText(post.frontmatter.title)}</h2>
        
        <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {formatDate(post.frontmatter.date)}
            </span>
          </div>
          
          {post.frontmatter.category && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-full whitespace-nowrap font-medium">
                {post.frontmatter.category}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            <TagIcon className="h-4 w-4 text-gray-400 shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {post.frontmatter.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-gray-700 dark:text-gray-200 rounded whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {highlightText(post.frontmatter.summary)}
        </p>
        
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium">
          Read more <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </article>
  );
}
