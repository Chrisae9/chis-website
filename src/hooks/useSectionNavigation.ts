// React imports
import { useState, useEffect, useMemo } from 'react';

// Local imports - types and utilities
import { SectionState, defaultSectionState, scrollToSection } from '../utils/sectionUtils';
import { Post } from '../types';
import { findReferencingPosts } from '../services/postService';

/**
 * Custom hook for managing section navigation within posts
 * Handles section state, scrolling, and connected post detection
 * 
 * @param selectedPost - The currently selected post or null if no post is selected
 * @param allPosts - Array of all available posts for finding connections
 * @returns Object containing section state and navigation functions
 */
export function useSectionNavigation(selectedPost: Post | null, allPosts: Post[]) {
  // Track which section is currently active
  const [sectionState, setSectionState] = useState<SectionState>(defaultSectionState);

  /**
   * Reset section state when changing posts
   */
  useEffect(() => {
    setSectionState(defaultSectionState);
  }, [selectedPost?.slug]);

  /**
   * Determine if the selected post has connected posts
   * A post has connections if it either:
   * 1. Links to other posts (outgoing links)
   * 2. Is linked from other posts (incoming links)
   */
  const hasConnectedPosts = useMemo(() => {
    if (!selectedPost) return false;
    
    const referencingPosts = findReferencingPosts(allPosts, selectedPost.slug);
    
    return (
      (selectedPost.frontmatter.backlinks && selectedPost.frontmatter.backlinks.length > 0) || 
      (referencingPosts && referencingPosts.length > 0)
    );
  }, [selectedPost, allPosts]);

  /**
   * Scroll to the connected posts section and update section state
   */
  const scrollToConnectedPosts = () => {
    scrollToSection('connected-posts');
    setSectionState({ connected: true, comments: false });
  };

  /**
   * Scroll to the comments section and update section state
   */
  const scrollToComments = () => {
    scrollToSection('comments');
    setSectionState({ connected: false, comments: true });
  };

  /**
   * Update section state based on scroll position or manual navigation
   * Used for synchronizing the sidebar navigation with the current view
   * 
   * @param section - Object containing the active state for each section
   */
  const handleSectionChange = (section: { connected: boolean, comments: boolean }) => {
    setSectionState(section);
  };

  return {
    sectionState,
    hasConnectedPosts,
    scrollToConnectedPosts,
    scrollToComments,
    handleSectionChange
  };
}
