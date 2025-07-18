'use client'

import React, { useState, useMemo } from 'react';
import { Post } from '@/types';
import { Layout } from './Layout';
import { Sidebar } from './Sidebar';
import { SearchBar } from './SearchBar';
import { PostCard } from './PostCard';
import { DynamicLinks } from './DynamicLinks';
import { useTheme } from '@/hooks/useTheme';
import { useSidebar } from '@/hooks/useSidebar';
import { useRouter } from 'next/navigation';
import { links } from '@/config/links';
import Fuse from 'fuse.js';

interface BlogAppProps {
  posts: Post[];
}

export function BlogApp({ posts }: BlogAppProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const { showLeftSidebar, setShowLeftSidebar, showRightSidebar, setShowRightSidebar } = useSidebar();
  const router = useRouter();

  // Create Fuse instance for search
  const fuse = useMemo(() => {
    return new Fuse(posts, {
      keys: ['frontmatter.title', 'frontmatter.summary', 'frontmatter.tags'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [posts]);

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm) return posts;
    
    const searchResults = fuse.search(searchTerm);
    return searchResults.map(result => result.item);
  }, [searchTerm, fuse, posts]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.frontmatter.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const handlePostClick = (slug: string) => {
    router.push(`/posts/${slug}`);
  };

  const leftSidebarContent = (
    <Sidebar title="Tags" showMobileHeader={true}>
      <div className="space-y-2">
        {allTags.map(tag => (
          <div
            key={tag}
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            onClick={() => setSearchTerm(tag)}
          >
            {tag}
          </div>
        ))}
      </div>
    </Sidebar>
  );

  const rightSidebarContent = (
    <Sidebar title="Links" showMobileHeader={true}>
      <DynamicLinks links={links} />
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
      header={<SearchBar value={searchTerm} onChange={setSearchTerm} />}
      leftSidebar={leftSidebarContent}
      rightSidebar={rightSidebarContent}
      isPostView={false}
    >
      <div className="space-y-8">
        {filteredPosts.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            searchTerm={searchTerm}
            onPostClick={handlePostClick}
          />
        ))}
        
        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div 
            className="text-center py-8 text-gray-500 dark:text-gray-400"
            aria-live="polite"
          >
            No posts found. Try adjusting your search.
          </div>
        )}
      </div>
    </Layout>
  );
}