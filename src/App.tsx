import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Fuse from 'fuse.js';
import { SearchBar } from './components/SearchBar';
import { TagList } from './components/TagList';
import { PostCard } from './components/PostCard';
import { PostContent } from './components/PostContent';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { DynamicLinks } from './components/DynamicLinks';
import { TableOfContents } from './components/TableOfContents';
import { CategoryFilter } from './components/CategoryFilter';
import { Utterances } from './components/Utterances';
import { utterancesConfig } from './config/utterances';
import { links } from './config/links';
import { Post } from './types';
import { loadPosts } from './utils/posts';
import { SortOrder, SortControls } from './components/SortControls';

function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const storedMode = localStorage.getItem('darkMode');
    return storedMode ? JSON.parse(storedMode) : false;
  });
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const location = useLocation();
  const navigate = useNavigate();

  // Load posts only once on initial mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const loadedPosts = await loadPosts();
        setPosts(loadedPosts);
        
        // After posts are loaded, handle the current URL
        const slug = location.pathname.slice(1);
        if (slug && slug.length > 0) {
          const postExists = loadedPosts.some(post => post.slug === slug);
          if (postExists) {
            setSelectedPost(slug);
          } else {
            console.warn(`Post with slug "${slug}" not found`);
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
      }
    };
    
    loadData();
  }, []); // Empty dependency array - only run once on mount

  // Handle URL changes separately
  useEffect(() => {
    if (posts.length === 0) return; // Skip if posts aren't loaded yet
    
    const slug = location.pathname.slice(1);
    if (slug && slug.length > 0) {
      const postExists = posts.some(post => post.slug === slug);
      if (postExists) {
        setSelectedPost(slug);
      } else {
        console.warn(`Post with slug "${slug}" not found`);
        navigate('/', { replace: true });
      }
    } else {
      setSelectedPost(null);
    }
  }, [location.pathname, posts, navigate]);

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
    const postsToConsider = selectedCategory 
      ? posts.filter(post => post.frontmatter.category === selectedCategory)
      : posts;
      
    postsToConsider.forEach(post => {
      post.frontmatter.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [posts, selectedCategory]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    posts.forEach(post => {
      if (post.frontmatter.category) {
        categories.add(post.frontmatter.category);
      }
    });
    return Array.from(categories);
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

    if (selectedCategory) {
      result = result.filter(post => post.frontmatter.category === selectedCategory);
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
  }, [posts, searchTerm, selectedCategory, selectedTags, fuse, sortOrder]);

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

  // Function to handle post selection
  const handlePostSelect = (slug: string | null) => {
    if (slug) {
      // Check if the post exists before navigating
      const postExists = posts.some(post => post.slug === slug);
      if (postExists) {
        navigate(`/${slug}`);
      } else {
        console.warn(`Post with slug "${slug}" not found`);
      }
    } else {
      navigate('/');
    }
  };

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
            onClick={() => handlePostSelect(null)}
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
          onBack={() => handlePostSelect(null)}
          darkMode={darkMode}
          onPostClick={handlePostSelect}
          allPosts={posts}
        />
      ) : (
        <div className="space-y-8">
          <div className="flex flex-row gap-4 mb-6 items-center justify-between">
            <div className="w-1/2 sm:w-64">
              <CategoryFilter 
                categories={allCategories}
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
            </div>
            <div className="w-1/2 sm:flex-1 flex justify-end">
              <SortControls sortOrder={sortOrder} onSortChange={setSortOrder} />
            </div>
          </div>
          
          {filteredPosts.map((post) => (
            <PostCard
              key={post.slug}
              post={post}
              searchTerm={searchTerm}
              onPostClick={handlePostSelect}
            />
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No posts found. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}

export default App;
