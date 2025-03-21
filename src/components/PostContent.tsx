import React, { useState, useEffect } from 'react';
import { Tag as TagIcon, Copy, Check } from 'lucide-react';
import { Utterances } from './Utterances';
import { utterancesConfig } from '../config/utterances';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Post } from '../types';
import { TableOfContents } from './TableOfContents';
import { YouTubeEmbed } from './YouTubeEmbed';
import { extractYouTubeVideoId } from '../utils/youtubeParser';

interface PostContentProps {
  post: Post;
  onBack: () => void;
  darkMode: boolean;
  onPostClick: (slug: string) => void;
  allPosts: Post[];
  onSectionChange?: (section: { connected: boolean, comments: boolean }) => void;
  isConnectedPostsActive?: boolean;
  isCommentsActive?: boolean;
}

export function PostContent({ 
  post, 
  onBack, 
  darkMode, 
  onPostClick, 
  allPosts,
  onSectionChange,
  isConnectedPostsActive: externalIsConnectedPostsActive,
  isCommentsActive
}: PostContentProps) {
  const [copyStatus, setCopyStatus] = useState<string>('');
  const contentWithoutTitle = post.content.replace(/^#\s+.*$/m, '').trim();
  const formattedDate = (() => {
    const date = new Date(post.frontmatter.date);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    return localDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  })();

  const referencingPosts = allPosts.filter(p => 
    p.frontmatter.backlinks?.includes(post.slug) && p.slug !== post.slug
  );

  const hasConnectedPosts = (post.frontmatter.backlinks?.length > 0 || referencingPosts.length > 0);

  // Improved ID sanitization function
  const sanitizeId = (text: string | undefined): string => {
    if (!text) return '';
    return text
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
  };

  // Process content to handle YouTube embeds outside of code blocks
  const processContent = (content: string): React.ReactNode[] => {
    // Split content by code blocks to avoid processing embeds inside them
    const parts: Array<{ type: 'code' | 'text', content: string }> = [];
    let currentIndex = 0;
    
    // Find all code blocks
    const codeBlockRegex = /```[\s\S]*?```/g;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > currentIndex) {
        parts.push({
          type: 'text',
          content: content.substring(currentIndex, match.index)
        });
      }
      
      // Add code block
      parts.push({
        type: 'code',
        content: match[0]
      });
      
      currentIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (currentIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(currentIndex)
      });
    }
    
    // Process each part
    return parts.map((part, index) => {
      if (part.type === 'code') {
        // Wrap code blocks with custom component that includes copy button
        return (
          <div key={index} className="relative group">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeHighlight]}
            >
              {part.content}
            </ReactMarkdown>
            <button
              onClick={() => {
                // Extract code content without the markdown code fence syntax
                const codeContent = part.content
                  .replace(/^```.*\n/, '') // Remove opening fence with optional language
                  .replace(/```$/, '')     // Remove closing fence
                  .trim();                 // Remove extra whitespace
                copyToClipboard(codeContent);
              }}
              className="absolute top-2 right-2 p-1.5 bg-gray-700/50 hover:bg-gray-700/80 text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Copy code"
              title="Copy code"
            >
              {copyStatus && part.content.includes(copyStatus.substring(0, 20)) ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        );
      } else {
        // Process YouTube embeds in text parts
        const segments: React.ReactNode[] = [];
        let lastIndex = 0;
        const youtubeRegex = /{{youtube\.(.*?)}}/g;
        let embedMatch;
        
        while ((embedMatch = youtubeRegex.exec(part.content)) !== null) {
          // Add text before embed
          if (embedMatch.index > lastIndex) {
            segments.push(
              <ReactMarkdown 
                key={`text-${index}-${lastIndex}`}
                remarkPlugins={[remarkGfm]} 
                rehypePlugins={[rehypeHighlight]}
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} onClick={handleLinkClick} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                  ),
                  h2: ({ node, ...props }) => <h2 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                  h3: ({ node, ...props }) => <h3 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                  h4: ({ node, ...props }) => <h4 {...props} id={props.id || sanitizeId(props.children?.toString())} />
                }}
              >
                {part.content.substring(lastIndex, embedMatch.index)}
              </ReactMarkdown>
            );
          }
          
          // Extract YouTube URL and add embed
          const youtubeUrl = embedMatch[1].trim();
          const videoId = extractYouTubeVideoId(youtubeUrl);
          
          if (videoId) {
            segments.push(<YouTubeEmbed key={`youtube-${index}-${embedMatch.index}`} videoId={videoId} />);
          } else {
            // If invalid YouTube URL, just show the original text
            segments.push(
              <span key={`invalid-${index}-${embedMatch.index}`}>
                {embedMatch[0]}
              </span>
            );
          }
          
          lastIndex = embedMatch.index + embedMatch[0].length;
        }
        
        // Add remaining text
        if (lastIndex < part.content.length) {
          segments.push(
            <ReactMarkdown 
              key={`text-${index}-${lastIndex}`}
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} onClick={handleLinkClick} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                ),
                h2: ({ node, ...props }) => <h2 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                h3: ({ node, ...props }) => <h3 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                h4: ({ node, ...props }) => <h4 {...props} id={props.id || sanitizeId(props.children?.toString())} />
              }}
            >
              {part.content.substring(lastIndex)}
            </ReactMarkdown>
          );
        }
        
        return segments;
      }
    }).flat();
  };

  // Add IDs to headings in the markdown content
  useEffect(() => {
    // This function adds IDs to all h2, h3, and h4 elements in the article
    const addIdsToHeadings = () => {
      const article = document.querySelector('article');
      if (!article) return;

      const headings = article.querySelectorAll('h2, h3, h4');
      headings.forEach(heading => {
        if (!heading.id) {
          const id = sanitizeId(heading.textContent);
          if (id) heading.id = id;
        }
      });
    };

    // Run once after initial render
    addIdsToHeadings();

    // Also run after a short delay to ensure markdown has fully rendered
    const timer = setTimeout(addIdsToHeadings, 200);
    return () => clearTimeout(timer);
  }, [post.content]);

  const [localIsConnectedPostsActive, setLocalIsConnectedPostsActive] = useState(false);
  
  // Use external state if provided, otherwise use local state
  const isConnectedPostsActive = externalIsConnectedPostsActive !== undefined 
    ? externalIsConnectedPostsActive 
    : localIsConnectedPostsActive;
  
  // Scroll to top when post changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [post.slug]);

  // Add keyboard shortcut to navigate to Connected Posts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Use 'c' key as shortcut to navigate to Connected Posts
      if (e.key === 'c' && hasConnectedPosts && !isInputElement(e.target as HTMLElement)) {
        e.preventDefault();
        scrollToConnectedPosts();
      }
    };

    // Helper function to check if the target is an input element
    const isInputElement = (element: HTMLElement | null): boolean => {
      if (!element) return false;
      const tagName = element.tagName.toLowerCase();
      return tagName === 'input' || tagName === 'textarea' || element.isContentEditable;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [hasConnectedPosts]);

  // Helper function to scroll to connected posts
  const scrollToConnectedPosts = () => {
    const connectedPostsSection = document.getElementById('connected-posts');
    
    if (connectedPostsSection) {
      // Get the position of the element relative to the document
      const yPosition = connectedPostsSection.getBoundingClientRect().top + window.pageYOffset;
      
      // Calculate position with offset for fixed header (64px)
      const offsetPosition = yPosition - 64;
      
      // Scroll to the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      setLocalIsConnectedPostsActive(true);
      if (onSectionChange) {
        onSectionChange({ connected: true, comments: false });
      }
    }
  };
  
  // Helper function to scroll to comments
  const scrollToCommentsSection = () => {
    const commentsSection = document.getElementById('comments');
    
    if (commentsSection) {
      // Get the position of the element relative to the document
      const yPosition = commentsSection.getBoundingClientRect().top + window.pageYOffset;
      
      // Calculate position with offset for fixed header (64px)
      const offsetPosition = yPosition - 64;
      
      // Scroll to the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      if (onSectionChange) {
        onSectionChange({ connected: false, comments: true });
      }
    }
  };

  // Set up scroll event listener to detect when connected posts section is active
  useEffect(() => {
    if (!hasConnectedPosts) return;

    const handleScroll = () => {
      const connectedPostsSection = document.getElementById('connected-posts');
      const commentsSection = document.getElementById('comments');
      if (!connectedPostsSection || !commentsSection) return;

      // Get current scroll position
      const scrollY = window.scrollY;
      
      // Get the positions of each section
      const connectedPostsTop = connectedPostsSection.offsetTop - 100; // Offset for header
      const commentsTop = commentsSection.offsetTop - 100; // Offset for header
      
      // Determine which section is active based on scroll position
      const isAtConnectedPosts = scrollY >= connectedPostsTop && scrollY < commentsTop;
      const isAtComments = scrollY >= commentsTop;
      
      setLocalIsConnectedPostsActive(isAtConnectedPosts);
      
      // If we have an external handler, call it
      if (onSectionChange) {
        onSectionChange({ 
          connected: isAtConnectedPosts, 
          comments: isAtComments 
        });
      }
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasConnectedPosts, onSectionChange]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const slug = href.slice(1);
      onPostClick(slug);
    }
  };

  const copyToClipboard = (text: string) => {
    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopyStatus(text.substring(0, 20)); // Store part of the copied text to identify which block was copied
          setTimeout(() => setCopyStatus(''), 2000);
        })
        .catch(err => {
          console.error('Failed to copy text: ', err);
          setCopyStatus('Failed to copy');
          setTimeout(() => setCopyStatus(''), 2000);
        });
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);

      try {
        textarea.select();
        document.execCommand('copy');
        setCopyStatus(text.substring(0, 20)); // Store part of the copied text to identify which block was copied
      } catch (err) {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Failed to copy');
      } finally {
        document.body.removeChild(textarea);
        setTimeout(() => setCopyStatus(''), 2000);
      }
    }
  };

  return (
    <div className="space-y-4">
      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-4">
          
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100">
                {post.frontmatter.title}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {formattedDate}
              </div>
            </div>
            <div className="mt-3">
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.category && (
                  <span 
                    className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full font-medium mr-3"
                  >
                    {post.frontmatter.category}
                  </span>
                )}
                {post.frontmatter.tags && post.frontmatter.tags.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <TagIcon className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                    <div className="flex flex-wrap gap-1.5">
                      {post.frontmatter.tags.map(tag => (
                        <span 
                          key={tag}
                          className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-gray-700 dark:text-gray-200 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
            {processContent(contentWithoutTitle)}
          </div>
        </div>
      </article>


      {hasConnectedPosts && (
        <aside 
          id="connected-posts"
          data-connected-posts
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden"
        >
          <div className="p-4">
            <h2 className="text-base font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Connected Posts
            </h2>
            
            <div className="space-y-4">
              {post.frontmatter.backlinks?.length > 0 && (
                <div className="pb-3">
                  <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Links in this post
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.frontmatter.backlinks.map(slug => {
                      const linkedPost = allPosts.find(p => p.slug === slug);
                      return linkedPost ? (
                        <button
                          key={slug}
                          onClick={() => onPostClick(slug)}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-200 dark:border-gray-700 rounded-md"
                        >
                          {linkedPost.frontmatter.title}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {referencingPosts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Referenced by
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {referencingPosts.map(referencingPost => (
                      <button
                        key={referencingPost.slug}
                        onClick={() => onPostClick(referencingPost.slug)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border border-gray-200 dark:border-gray-700 rounded-md"
                      >
                        {referencingPost.frontmatter.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>
      )}
      
      <div id="comments" data-comments className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-4">
          <Utterances 
            repo={utterancesConfig.repo}
            slug={post.slug}
            theme={darkMode ? utterancesConfig.theme.dark : utterancesConfig.theme.light}
          />
        </div>
      </div>
    </div>
  );
}
