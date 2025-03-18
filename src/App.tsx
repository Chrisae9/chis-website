import React, { useState, useMemo, useEffect } from 'react';
import Fuse from 'fuse.js';
import { ExternalLink } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { TagList } from './components/TagList';
import { PostCard } from './components/PostCard';
import { PostContent } from './components/PostContent';
import { Layout } from './components/Layout';
import { Sidebar } from './components/Sidebar';
import { Post } from './types';
import { loadPosts } from './utils/posts';

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

  useEffect(() => {
    loadPosts().then(setPosts);
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

    return result;
  }, [posts, searchTerm, selectedTags, fuse]);

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

  const socialLinks = [
    { href: "https://github.com/yourusername", label: "GitHub" },
    { href: "https://twitter.com/yourusername", label: "Twitter" },
    { href: "https://linkedin.com/in/yourusername", label: "LinkedIn" }
  ];

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={() => setDarkMode(!darkMode)}
      showLeftSidebar={showLeftSidebar}
      showRightSidebar={showRightSidebar}
      setShowLeftSidebar={setShowLeftSidebar}
      setShowRightSidebar={setShowRightSidebar}
      header={<SearchBar value={searchTerm} onChange={setSearchTerm} />}
      leftSidebar={
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
      }
      rightSidebar={
        <Sidebar
          title="Links"
          onClose={() => setShowRightSidebar(false)}
          showMobileHeader={true}
        >
          <ul className="space-y-3">
            {socialLinks.map(({ href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  {label}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </Sidebar>
      }
    >
      {selectedPostData ? (
        <PostContent
          post={selectedPostData}
          onBack={() => setSelectedPost(null)}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-8">
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
