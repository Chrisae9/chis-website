import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { MessageSquare } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  hasConnectedPosts?: boolean;
  onConnectedPostsClick?: () => void;
}

export function TableOfContents({ 
  content, 
  hasConnectedPosts = false, 
  onConnectedPostsClick,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  // Extract headings from markdown content
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

  // Set up scroll event listener to update active heading
  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
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

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings]);

  // Handle clicking on TOC items
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    // Set active ID immediately for better UX
    setActiveId(id);
    
    // Calculate the position to scroll to (accounting for fixed header)
    const headerHeight = 80; // Adjust based on your header height
    const offsetPosition = element.offsetTop - headerHeight;
    
    // Smooth scroll to the element
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <div>
      {headings.length === 0 ? (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          No headings found in this post.
        </div>
      ) : (
        <nav className="space-y-2">
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
            >
              {heading.text}
            </a>
          ))}
        </nav>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        {hasConnectedPosts && onConnectedPostsClick && (
          <button
            onClick={onConnectedPostsClick}
            className="flex items-center gap-1.5 mb-3 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"

 
          >
            <span>Connected Posts</span>
            <FontAwesomeIcon icon={faLink} className="text-xs" />
          </button>
        )}
        
        <button
          onClick={() => {
            const commentsSection = document.getElementById('comments');
            if (commentsSection) {
              commentsSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
          aria-label="Scroll to comments section"
        >
          <span>Comments</span>
          <MessageSquare className="h-3.5 w-3.5 ml-1" />
        </button>
      </div>
    </div>
  );
}
