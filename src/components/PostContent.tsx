import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { Post } from '../types';
import { TableOfContents } from './TableOfContents';

interface PostContentProps {
  post: Post;
  onBack: () => void;
  darkMode: boolean;
  onPostClick: (slug: string) => void;
  allPosts: Post[];
}

export function PostContent({ post, onBack, darkMode, onPostClick, allPosts }: PostContentProps) {
  const [copyStatus, setCopyStatus] = useState<string>('');
  const contentWithoutTitle = post.content.replace(/^#\s+.*$/m, '').trim();
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const referencingPosts = allPosts.filter(p => 
    p.frontmatter.backlinks?.includes(post.slug) && p.slug !== post.slug
  );

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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (href?.startsWith('#')) {
      e.preventDefault();
      const slug = href.slice(1);
      onPostClick(slug);
    }
  };

  const copyToClipboard = (text: string) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);

    try {
      textarea.select();
      document.execCommand('copy');
      setCopyStatus('Copied!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
      setCopyStatus('Failed to copy');
    } finally {
      document.body.removeChild(textarea);
      setTimeout(() => setCopyStatus(''), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <article className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
        <div className="p-4">
          <button
            onClick={onBack}
            className="mb-4 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ← Back to posts
          </button>
          
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-medium text-gray-900 dark:text-gray-100">
                {post.frontmatter.title}
              </h1>
              <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {formattedDate}
              </div>
            </div>
            {post.frontmatter.tags && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {post.frontmatter.tags.map(tag => (
                    <span 
                      key={tag}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                a: ({ node, ...props }) => (
                  <a {...props} onClick={handleLinkClick} className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" />
                ),
                pre: ({ node, children }) => {
                  const code = React.Children.toArray(children).find(
                    child => React.isValidElement(child) && child.type === 'code'
                  ) as React.ReactElement;

                  // Extract the actual text content from the code element
                  const codeContent = React.Children.toArray(code?.props?.children || [])
                    .map(child => {
                      if (typeof child === 'string') return child;
                      if (React.isValidElement(child)) {
                        return child.props.children;
                      }
                      return '';
                    })
                    .join('');

                  return (
                    <div className="relative group">
                      <button
                        onClick={() => copyToClipboard(codeContent)}
                        className="absolute right-2 top-2 px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 dark:text-gray-300 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        {copyStatus || 'Copy'}
                      </button>
                      <pre>{children}</pre>
                    </div>
                  );
                },
                h2: ({ node, ...props }) => <h2 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                h3: ({ node, ...props }) => <h3 {...props} id={props.id || sanitizeId(props.children?.toString())} />,
                h4: ({ node, ...props }) => <h4 {...props} id={props.id || sanitizeId(props.children?.toString())} />
              }}
            >
              {contentWithoutTitle}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {(post.frontmatter.backlinks?.length > 0 || referencingPosts.length > 0) && (
        <aside className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden">
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
    </div>
  );
}
