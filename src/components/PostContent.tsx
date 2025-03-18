import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Post } from '../types';

interface PostContentProps {
  post: Post;
  onBack: () => void;
  darkMode: boolean;
}

export function PostContent({ post, onBack, darkMode }: PostContentProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 transition-colors duration-300`}>
      <button
        onClick={onBack}
        className="mb-6 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
      >
        ← Back to posts
      </button>
      <h1 className="text-4xl font-bold mb-4">{post.frontmatter.title}</h1>
      <div className={`prose dark:prose-invert max-w-none`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
