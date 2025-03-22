import { Post } from '../types';
import matter from 'gray-matter';

/**
 * Extracts backlinks from content using the {{backlink}} syntax
 */
function extractBacklinks(content: string): string[] {
  const backlinks = new Set<string>();
  const backlinkRegex = /\{\{((?!youtube\.)[^{}]*?)\}\}/g;
  let match;

  while ((match = backlinkRegex.exec(content)) !== null) {
    backlinks.add(match[1].trim());
  }

  return Array.from(backlinks);
}

/**
 * Processes backlink syntax in content, converting {{text}} to markdown links
 */
function processBacklinkSyntax(content: string): string {
  // Process only regular backlinks, excluding YouTube embeds
  return content.replace(/\{\{((?!youtube\.)[^{}]*?)\}\}/g, (_, text) => {
    // Convert to a markdown link
    const linkText = text.trim();
    
    // Generate the slug for the link - this exactly matches the filename-based slug
    const slug = linkText.toLowerCase()
      .replace(/\s+/g, '-')      // Replace spaces with dashes
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/-+/g, '-')       // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
    
    return `[${linkText}](/${slug})`;  // Add leading slash for proper routing
  });
}

/**
 * Loads all posts from the filesystem
 */
export async function loadPosts(): Promise<Post[]> {
  const postFiles = import.meta.glob('../posts/*.md', { 
    query: '?raw',
    import: 'default'
  });
  
  const posts = await Promise.all(
    Object.entries(postFiles).map(async ([filepath, loader]) => {
      const content = await loader();
      const slug = filepath.replace('../posts/', '').replace('.md', '');
      const { data, content: markdownContent } = matter(content as string);
      const backlinks = extractBacklinks(markdownContent);
      const processedContent = processBacklinkSyntax(markdownContent);
      
      return {
        slug,
        content: processedContent,
        frontmatter: {
          ...data as Post['frontmatter'],
          backlinks
        },
      };
    })
  );
  
  return posts;
}

/**
 * Finds a post by its slug
 */
export function findPostBySlug(posts: Post[], slug: string): Post | undefined {
  return posts.find(post => post.slug === slug);
}

/**
 * Finds a post by its slug, case-insensitive
 */
export function findPostBySlugCaseInsensitive(posts: Post[], slug: string): Post | undefined {
  return posts.find(post => post.slug.toLowerCase() === slug.toLowerCase());
}

/**
 * Finds posts that reference a given post
 */
export function findReferencingPosts(posts: Post[], targetSlug: string): Post[] {
  return posts.filter(post => 
    post.frontmatter.backlinks?.includes(targetSlug) && 
    post.slug !== targetSlug
  );
}

/**
 * Extracts all unique tags from posts
 */
export function extractAllTags(posts: Post[], categoryFilter?: string | null): string[] {
  const tags = new Set<string>();
  const postsToConsider = categoryFilter 
    ? posts.filter(post => post.frontmatter.category === categoryFilter)
    : posts;
    
  postsToConsider.forEach(post => {
    post.frontmatter.tags.forEach(tag => tags.add(tag));
  });
  
  return Array.from(tags);
}

/**
 * Extracts all unique categories from posts
 */
export function extractAllCategories(posts: Post[]): string[] {
  const categories = new Set<string>();
  
  posts.forEach(post => {
    if (post.frontmatter.category) {
      categories.add(post.frontmatter.category);
    }
  });
  
  return Array.from(categories);
}

/**
 * Sorts posts by date
 */
export function sortPostsByDate(posts: Post[], ascending: boolean = false): Post[] {
  return [...posts].sort((a, b) => {
    const dateA = new Date(a.frontmatter.date).getTime();
    const dateB = new Date(b.frontmatter.date).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}
