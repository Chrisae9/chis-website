import { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  hasConnectedPosts?: boolean;
  onConnectedPostsClick?: () => void;
  onCommentsClick?: () => void;
  isConnectedPostsActive?: boolean;
  isCommentsActive?: boolean;
  onHeadingClick?: () => void;
}

export function TableOfContents({ 
  content, 
  hasConnectedPosts = false, 
  onConnectedPostsClick,
  onCommentsClick,
  isConnectedPostsActive = false,
  isCommentsActive = false,
  onHeadingClick
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [headings, setHeadings] = useState<TOCItem[]>([]);

  useEffect(() => {
    const extractHeadings = () => {
      const headingRegex = /^(#{2,4})\s+(.+)$/gm;
      const matches = [...content.matchAll(headingRegex)];
      
      return matches.map((match) => {
        const level = match[1].length;
        const text = match[2].trim();
        
        const id = text
          .toLowerCase()
          .replace(/[`*_{}[\]()#+\-.!]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        return { id, text, level };
      });
    };

    setHeadings(extractHeadings());
  }, [content]);

  useEffect(() => {
    if (isConnectedPostsActive || isCommentsActive) {
      setActiveId('');
    }
  }, [isConnectedPostsActive, isCommentsActive]);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      if (isConnectedPostsActive || isCommentsActive) {
        return;
      }

      const headingElements = headings
        .map(heading => document.getElementById(heading.id))
        .filter(el => el !== null) as HTMLElement[];

      if (headingElements.length === 0) return;

      const scrollPosition = window.scrollY + 100;

      for (let i = headingElements.length - 1; i >= 0; i--) {
        const element = headingElements[i];
        if (element.offsetTop <= scrollPosition) {
          setActiveId(element.id);
          return;
        }
      }

      if (headingElements.length > 0) {
        setActiveId(headingElements[0].id);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headings, isConnectedPostsActive, isCommentsActive]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (!element) return;
    
    setActiveId(id);
    onHeadingClick?.();
    
    const headerHeight = 80;
    const offsetPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  const scrollToComments = () => {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-4">
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
                toc-link
                ${activeId === heading.id ? 'toc-link-active' : 'toc-link-inactive'}
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
        {hasConnectedPosts && onConnectedPostsClick && (
          <Button
            onClick={onConnectedPostsClick}
            variant="ghost"
            size="sm"
            className={`flex items-center gap-1.5 mb-3 text-sm transition-colors duration-200 w-full justify-start px-0 ${
              isConnectedPostsActive
                ? 'text-blue-600 dark:text-blue-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
            }`}
            aria-label="Scroll to connected posts section"
            aria-pressed={isConnectedPostsActive}
          >
            <span>Connected Posts</span>
          </Button>
        )}
        
        <Button
          onClick={onCommentsClick || scrollToComments}
          variant="ghost"
          size="sm"
          className={`flex items-center gap-1.5 text-sm transition-colors duration-200 w-full justify-start px-0 ${
            isCommentsActive
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
          }`}
          aria-label="Scroll to comments section"
          aria-pressed={isCommentsActive}
        >
          <span>Comments</span>
          <MessageSquare className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}