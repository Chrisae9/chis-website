// React imports
import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Third-party imports
import Fuse from 'fuse.js';

// Local imports - types
import { Post } from '../types';
import { SortOrder } from '../components/SortControls';

// Local imports - services and utilities
import { 
  loadPosts, 
  extractAllTags, 
  extractAllCategories, 
  sortPostsByDate, 
  findPostBySlug, 
  findPostBySlugCaseInsensitive
} from '../services/postService';
import { normalizeSlug, createInternalUrl } from '../utils/routeUtils';

/**
 * Custom hook for managing the blog's posts and related state
 * Handles post loading, filtering, searching, and navigation
 *
 * @param includeDrafts - Whether to include draft posts (defaults to false)
 * @returns An object containing post data and functions for manipulating posts
 */
export function usePosts(includeDrafts: boolean = false) {
  // Post data state
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // React Router hooks
  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Load posts on initial mount or when includeDrafts changes
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const loadedPosts = await loadPosts(includeDrafts);
        setPosts(loadedPosts);
        
        // After posts are loaded, handle the current URL
        const slug = normalizeSlug(location.pathname);
        
        if (slug && slug.length > 0 && slug !== 'about') {
          const postExists = loadedPosts.some(post => post.slug === slug);
          if (postExists) {
            setSelectedPost(slug);
          } else {
            navigate('/', { replace: true });
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load posts:", error);
        setError("Failed to load posts. Please try again later.");
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [includeDrafts, location.pathname, navigate]);

  /**
   * Handle URL changes to select the correct post
   * Includes case-insensitive slug matching as a fallback
   */
  useEffect(() => {
    if (posts.length === 0 || isLoading) return; // Skip if posts aren't loaded yet
    
    const slug = normalizeSlug(location.pathname);
    
    if (slug && slug.length > 0 && slug !== 'about') {
      const matchingPost = findPostBySlug(posts, slug);
      
      if (matchingPost) {
        setSelectedPost(slug);
      } else {
        // Try a case-insensitive match as a fallback
        const caseInsensitiveMatch = findPostBySlugCaseInsensitive(posts, slug);
        
        if (caseInsensitiveMatch) {
          // Navigate to the correct case version
          navigate(`/${caseInsensitiveMatch.slug}`, { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } else {
      setSelectedPost(null);
    }
  }, [location.pathname, posts, navigate, isLoading]);

  /**
   * Create search index for fuzzy search functionality
   */
  const fuse = useMemo(() => new Fuse(posts, {
    keys: ['frontmatter.title', 'frontmatter.summary', 'content'],
    threshold: 0.3,
  }), [posts]);

  /**
   * Get all unique tags, filtered by selected category if applicable
   */
  const allTags = useMemo(() => 
    extractAllTags(posts, selectedCategory), 
    [posts, selectedCategory]
  );

  /**
   * Get all unique categories from the posts
   */
  const allCategories = useMemo(() => 
    extractAllCategories(posts), 
    [posts]
  );

  /**
   * Filter posts based on search term, tags, and category
   * Sort the filtered results by date
   */
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
    return sortPostsByDate(result, sortOrder === 'asc');
  }, [posts, searchTerm, selectedCategory, selectedTags, fuse, sortOrder]);

  /**
   * Get the currently selected post data
   */
  const selectedPostData = useMemo(() => {
    if (!selectedPost) return null;
    return findPostBySlug(posts, selectedPost);
  }, [selectedPost, posts]);

  /**
   * Toggle a tag selection (add if not selected, remove if already selected)
   * @param tag - The tag to toggle
   */
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  /**
   * Handle post selection and navigation
   * @param slug - The slug of the post to select, or null to go to home
   */
  const handlePostSelect = (slug: string | null) => {
    if (slug) {
      // Check if the post exists before navigating
      const matchingPost = findPostBySlug(posts, slug);
      if (matchingPost) {
        const url = createInternalUrl(slug);
        navigate(url);
      } else {
        console.warn(`Post with slug "${slug}" not found`);
      }
    } else {
      navigate('/');
    }
  };

  return {
    posts,
    filteredPosts,
    selectedPostData,
    searchTerm,
    setSearchTerm,
    selectedTags,
    handleTagToggle,
    selectedCategory,
    setSelectedCategory,
    allTags,
    allCategories,
    sortOrder,
    setSortOrder,
    handlePostSelect,
    isLoading,
    error
  };
}
