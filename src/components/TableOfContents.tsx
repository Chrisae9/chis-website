// React imports
import { useState, useEffect } from 'react';

// Third-party imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { MessageSquare } from 'lucide-react';

/**
 * Structure for table of contents item extracted from headings
 */
interface TOCItem {
  /** ID of the heading element (derived from heading text) */
  id: string;
  /** Text content of the heading */
  text: string;
  /** Heading level (2-4 corresponding to h2-h4) */
  level: number;
}

/**
 * Props for the TableOfContents component
 */
interface TableOfContentsProps {
  /** Markdown content from which to extract headings */
  content: string;
  /** Whether the post has connected posts section */
  hasConnectedPosts?: boolean;
  /** Callback when connected posts link is clicked */
  onConnectedPostsClick?: () => void;
  /** Callback when comments link is clicked */
  onCommentsClick?: () => void;
  /** Whether connected posts section is currently active */
  isConnectedPostsActive?: boolean;
  /** Whether comments section is currently active */
  isCommentsActive?: boolean;
  /** Callback when a heading is clicked - should clear section states */
  onHeadingClick?: () => void;
}

/**
 * Renders a table of contents for post navigation
 * 
 * Features:
 * - Automatically extracts h2-h4 headings from markdown content
 * - Highlights the currently active section during scrolling
 * - Smooth scrolling to sections on click
 * - Links to special sections (connected posts, comments)
 * - Visual indication of heading hierarchy through indentation
 * 
 * @param props - Component properties
 * @returns React component
 */
export function TableOfContents({ 
  content, 
  hasConnectedPosts = false, 
  onConnectedPostsClick,
  onCommentsClick,
  isConnectedPostsActive = false,
  isCommentsActive = false,
  onHeadingClick
}: TableOfContentsProps) {
  // Currently active heading ID for highlighting
  const [activeId, setActiveId] = useState<string>('');
  // Extracted headings from content
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  /**
   * Extract headings from markdown content
   */
  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /^(#{2,4})\s+(.+)$/gm;
      const matches = [...content.matchAll(headingRegex)];
      
      return matches.map((match) => {
        const level = match[1].length;
        const text = match[2].trim();
        
        // Create an ID from the heading text with improved sanitization
        // This handles backticks and other special characters
        const id = text
          .toLowerCase()
          // Replace backticks and other code-related characters
          .replace(/[`*_{}[\]()#+\-.!]/g, '')
          // Replace non-alphanumeric characters
          .replace(/[^\w\s-]/g, '')
          // Replace whitespace with hyphens
          .replace(/\s+/g, '-')
          // Remove consecutive hyphens
          .replace(/-+/g, '-')
          // Remove leading/trailing hyphens
          .replace(/^-+|-+$/g, '');
        
        return { id, text, level };
      });
    };

    setHeadings(extractHeadings());
  }, [content]);

  /**
   * Clear active heading when special sections are active
   */
  useEffect(() => {
    if (isConnectedPostsActive || isCommentsActive) {
      setActiveId('');
    }
  }, [isConnectedPostsActive, isCommentsActive]);

  /**
   * Set up scroll event listener to update active heading
   */
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      // Don't update active heading if special sections are active
      if (isConnectedPostsActive || isCommentsActive) {
        return;
      }

      // Get all heading elements that have IDs matching our extracted headings
      const headingElements = headings
        .map(heading => document.getElementById(heading.id))
        .filter(el => el !== null) as HTMLElement[];

      if (headingElements.length === 0) return;

      // Find the heading that's currently in view
      const scrollPosition = window.scrollY + 100; // Adding offset for header

      // Find the heading closest to the top but still in/above view
      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          return;
        }
      }

      // If no heading is found, set the first one as active
      if (headingElements.length > 0) {
        setActiveId(headingElements[0].id);
      }
    };

    // Initial check
    handleScroll();

    // Add scroll event listener with performance optimization
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings, isConnectedPostsActive, isCommentsActive]);

  /**
   * Handle clicking on TOC items - smooth scroll to section
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Set active ID immediately for better UX
    setActiveId(id);
    
    // Notify parent that a heading was clicked to clear section states
    onHeadingClick?.();
    
    // Calculate the position to scroll to (accounting for fixed header)
    const headerHeight = 80; // Adjust based on your header height
    const offsetPosition = element.offsetTop - headerHeight;
    
    // Smooth scroll to the element
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  /**
   * Scroll to comments section
   */
  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="sticky top-4 z-10">
      {/* Heading navigation */}
      {headings.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          No headings found in this post.
        </div>
      ) : (
        <nav aria-label="Table of contents" className="space-y-2">
          {headings.map((heading) => (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={`
                block text-sm py-1 border-l-2 pl-3 transition-colors duration-200
                ${activeId === heading.id 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
                ${heading.level === 2 ? '' : 'ml-' + (heading.level - 2) * 3}
              `}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(heading.id);
              }}
              aria-current={activeId === heading.id ? 'location' : undefined}
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
      
      {/* Special section links */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {/* Connected posts link */}
        {hasConnectedPosts && onConnectedPostsClick && (
          <button
            onClick={onConnectedPostsClick}
            className={`flex items-center gap-1.5 mb-3 text-sm transition-colors duration-200 ${
              isConnectedPostsActive
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            aria-label="Scroll to connected posts section"
            aria-pressed={isConnectedPostsActive}
          >
            <span>Connected Posts</span>
            <FontAwesomeIcon icon={faLink} className="text-xs" aria-hidden="true" />
          </button>
        )}
        
        {/* Comments link */}
        <button
          onClick={onCommentsClick || scrollToComments}
          className={`flex items-center gap-1.5 text-sm transition-colors duration-200 ${
            isCommentsActive
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          aria-label="Scroll to comments section"
          aria-pressed={isCommentsActive}
        >
          <span>Comments</span>
          <MessageSquare className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
