import { useState, useEffect, useMemo } from 'react';
import { SectionState, defaultSectionState, scrollToSection } from '../utils/sectionUtils';
import { Post } from '../types';
import { findReferencingPosts } from '../services/postService';

export function useSectionNavigation(selectedPost: Post | null, allPosts: Post[]) {
  const [sectionState, setSectionState] = useState<SectionState>(defaultSectionState);

  // Reset section state when changing posts
  useEffect(() => {
    setSectionState(defaultSectionState);
  }, [selectedPost?.slug]);

  // Check if the selected post has connected posts
  const hasConnectedPosts = useMemo(() => {
    if (!selectedPost) return false;
    
    const referencingPosts = findReferencingPosts(allPosts, selectedPost.slug);
    
    return (
      (selectedPost.frontmatter.backlinks?.length > 0 || referencingPosts.length > 0)
    );
  }, [selectedPost, allPosts]);

  // Function to scroll to connected posts section
  const scrollToConnectedPosts = () => {
    scrollToSection('connected-posts');
    setSectionState({ connected: true, comments: false });
  };

  // Function to scroll to comments section
  const scrollToComments = () => {
    scrollToSection('comments');
    setSectionState({ connected: false, comments: true });
  };

  // Custom scroll handling for synchronized sidebar navigation
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
