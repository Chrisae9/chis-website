import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SearchBar } from './components/SearchBar';
import { TagList } from './components/TagList';
import { PostCard } from './components/PostCard';
import { PostContent } from './components/PostContent';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { DynamicLinks } from './components/DynamicLinks';
import { TableOfContents } from './components/TableOfContents';
import { links } from './config/links';
import { Post } from './types';
import { loadPosts } from './utils/posts';
import { SortOrder, SortControls } from './components/SortControls';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  useEffect(() => {
    const slug = window.location.pathname.slice(1);
    if (slug) {
      setSelectedPost(slug);
    }
  }, []);

  useEffect(() => {
    const newPath = selectedPost ? `/${selectedPost}` : '/';
    if (window.location.pathname !== newPath) {
      window.history.pushState({ slug: selectedPost }, '', newPath);
    }
  }, [selectedPost]);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const slug = event.state?.slug || null;
      setSelectedPost(slug);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach(post => {
      post.frontmatter.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts]);

  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['frontmatter.title', 'frontmatter.summary', 'content'],
    threshold: 0.3,
  }), [posts]);

  const filteredPosts = useMemo(() => {
    let result = posts;

    if (searchTerm) {
      result = fuse.search(searchTerm).map(({ item }) => item);
    }

    if (selectedTags.length > 0) {
      result = result.filter(post =>
        selectedTags.every(tag => post.frontmatter.tags.includes(tag))
      );
    }

    // Sort posts by date
    result = [...result].sort((a, b) => {
      const dateA = new Date(a.frontmatter.date).getTime();
      const dateB = new Date(b.frontmatter.date).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return result;
  }, [posts, searchTerm, selectedTags, fuse, sortOrder]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const selectedPostData = useMemo(() => {
    if (!selectedPost) return null;
    return posts.find(post => post.slug === selectedPost);
  }, [selectedPost, posts]);

  // Check if the selected post has connected posts
  const hasConnectedPosts = useMemo(() => {
    if (!selectedPostData) return false;
    
    const referencingPosts = posts.filter(p => 
      p.frontmatter.backlinks?.includes(selectedPostData.slug) && p.slug !== selectedPostData.slug
    );
    
    return (
      (selectedPostData.frontmatter.backlinks?.length > 0 || referencingPosts.length > 0)
    );
  }, [selectedPostData, posts]);

  // Function to scroll to connected posts section
  const scrollToConnectedPosts = () => {
    const connectedPostsSection = document.querySelector('[data-connected-posts]');
    if (connectedPostsSection) {
      connectedPostsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Left sidebar content - show table of contents when viewing a post
  const leftSidebarContent = selectedPostData ? (
    <Sidebar
      title="Table of Contents"
      onClose={() => setShowLeftSidebar(false)}
      showMobileHeader={true}
    >
      <div className="sticky top-20">
        <TableOfContents 
          content={selectedPostData.content} 
          hasConnectedPosts={hasConnectedPosts}
          onConnectedPostsClick={scrollToConnectedPosts}
        />
      </div>
    </Sidebar>
  ) : (
    <Sidebar
      title="Tags"
      onClose={() => setShowLeftSidebar(false)}
      showMobileHeader={true}
    >
      <TagList
        tags={allTags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />
    </Sidebar>
  );

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      setShowLeftSidebar={setShowLeftSidebar}
      setShowRightSidebar={setShowRightSidebar}
      header={
        selectedPostData ? (
          <button
            onClick={() => setSelectedPost(null)}
            className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to posts
          </button>
        ) : (
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        )
      }
      leftSidebar={leftSidebarContent}
      rightSidebar={
        <Sidebar
          title="Links"
          onClose={() => setShowRightSidebar(false)}
          showMobileHeader={true}
        >
          <div className="space-y-3">
            <DynamicLinks links={links} />
          </div>
        </Sidebar>
      }
      isPostView={!!selectedPostData}
    >
      {selectedPostData ? (
        <PostContent
          post={selectedPostData}
          onBack={() => setSelectedPost(null)}
          darkMode={darkMode}
          onPostClick={setSelectedPost}
          allPosts={posts}
        />
      ) : (
        <div className="space-y-8">
          <SortControls sortOrder={sortOrder} onSortChange={setSortOrder} />
          {filteredPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              searchTerm={searchTerm}
              onPostClick={setSelectedPost}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}

export default App;
