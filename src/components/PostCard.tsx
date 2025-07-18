import React from 'react';
import { Calendar, Tag as TagIcon, ChevronRight } from 'lucide-react';
import { Post } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        <mark key={i} className="search-highlight">{part}</mark> : 
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
    <Card 
      className={cn(
        "bg-glass-card border-0 cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1",
        "shadow-card"
      )}
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
      <CardHeader className="pb-3">
        {/* Post title with search highlighting */}
        <h2 className="text-base font-medium mb-3 text-card-foreground">
          {highlightText(post.frontmatter.title)}
        </h2>
        
        {/* Post metadata */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="text-sm text-muted-foreground">
              {formatDate(post.frontmatter.date)}
            </span>
          </div>
          
          {/* Category */}
          {post.frontmatter.category && (
            <Badge variant="secondary" className="text-xs rounded-full">
              {post.frontmatter.category}
            </Badge>
          )}
          
          {/* Tags */}
          <div className="flex items-center gap-1.5">
            <TagIcon className="h-4 w-4 text-muted-foreground shrink-0" aria-hidden="true" />
            <div className="flex flex-wrap gap-1.5">
              {post.frontmatter.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="text-xs bg-blue-50 dark:bg-blue-900/40 border-blue-100 dark:border-blue-700/40 text-gray-700 dark:text-blue-200"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Post summary with search highlighting */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {highlightText(post.frontmatter.summary)}
        </p>
        
        {/* Read more link */}
        <div className="flex items-center text-sm text-card-foreground hover:text-primary font-medium">
          Read more <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}