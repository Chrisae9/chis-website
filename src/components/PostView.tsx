'use client'

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Post } from '@/types';
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { TableOfContents } from './TableOfContents';
import { Utterances } from './Utterances';
import { useTheme } from '@/hooks/useTheme';
import { useSidebar } from '@/hooks/useSidebar';
import { useRouter } from 'next/navigation';
import { utterancesConfig } from '@/config/utterances';
import { ArrowLeft, Calendar, Tag as TagIcon } from 'lucide-react';

interface PostViewProps {
  post: Post;
}

export function PostView({ post }: PostViewProps) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { showLeftSidebar, setShowLeftSidebar, showRightSidebar, setShowRightSidebar } = useSidebar();
  const router = useRouter();
  const [sectionState, setSectionState] = useState({ connected: false, comments: false });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleBack = () => {
    router.push('/');
  };

  const scrollToComments = () => {
    setSectionState({ connected: false, comments: true });
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSectionChange = (newState: { connected: boolean; comments: boolean }) => {
    setSectionState(newState);
  };

  const leftSidebarContent = (
    <Sidebar title="Table of Contents" showMobileHeader={true}>
      <div className="space-y-2">
        <button
          onClick={handleBack}
          className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to posts
        </button>
        <TableOfContents
          content={post.content}
          hasConnectedPosts={false}
          onCommentsClick={scrollToComments}
          isConnectedPostsActive={sectionState.connected}
          isCommentsActive={sectionState.comments}
          onHeadingClick={() => handleSectionChange({ connected: false, comments: false })}
        />
      </div>
    </Sidebar>
  );

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      setShowLeftSidebar={setShowLeftSidebar}
      setShowRightSidebar={setShowRightSidebar}
      header={null}
      leftSidebar={leftSidebarContent}
      rightSidebar={null}
      isPostView={true}
    >
      <article className="bg-glass-card rounded-lg shadow-card p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {post.frontmatter.title}
          </h1>
          
          {/* Post metadata */}
          <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:gap-4">
            {/* Date */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              <span className="text-sm text-gray-600 dark:text-gray-200">
                {formatDate(post.frontmatter.date)}
              </span>
            </div>
            
            {/* Category */}
            {post.frontmatter.category && (
              <span className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium">
                {post.frontmatter.category}
              </span>
            )}
          </div>
          
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <TagIcon className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            {post.frontmatter.tags.map((tag) => (
              <span 
                key={tag} 
                className="text-sm px-2 py-1 bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-700/40 text-gray-700 dark:text-blue-200 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
      
      {/* Comments section */}
      <Utterances
        repo={utterancesConfig.repo}
        theme={darkMode ? utterancesConfig.theme.dark : utterancesConfig.theme.light}
      />
    </Layout>
  );
}