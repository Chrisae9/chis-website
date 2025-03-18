import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import { Calendar, Tag as TagIcon, ChevronRight } from 'lucide-react';
import { Post } from '../types';
import 'highlight.js/styles/github.css';

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
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-400">{part}</mark> : 
        part
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
      onClick={() => onPostClick(post.slug)}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{highlightText(post.frontmatter.title)}</h2>
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.frontmatter.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <TagIcon className="h-4 w-4" />
            {post.frontmatter.tags.map((tag) => (
              <span key={tag} className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.frontmatter.summary}</p>
        <div className="flex items-center text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">
          Read more <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </article>
  );
}
