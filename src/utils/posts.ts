import { Post } from '../types';
import matter from 'gray-matter';

function extractBacklinks(content: string): string[] {
  const backlinks = new Set<string>();
  const backlinkRegex = /\{\{((?!youtube\.)[^{}]*?)\}\}/g;
  let match;

  while ((match = backlinkRegex.exec(content)) !== null) {
    backlinks.add(match[1].trim());
  }

  return Array.from(backlinks);
}

function processBacklinkSyntax(content: string): string {
  // Process only regular backlinks, excluding YouTube embeds
  // Use a more specific regex that won't match regular markdown links [text](url)
  let processed = content.replace(/\{\{((?!youtube\.)[^{}]*?)\}\}/g, (_, text) => {
    // Convert to a markdown link
    const linkText = text.trim();
    
    // Generate the slug for the link - this exactly matches the filename-based slug
    // Just convert to kebab-case (lowercase with dashes)
    const slug = linkText.toLowerCase()
      .replace(/\s+/g, '-')      // Replace spaces with dashes
      .replace(/[^\w\s-]/g, '')  // Remove special characters
      .replace(/-+/g, '-')       // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
    
    return `[${linkText}](/${slug})`;  // Add leading slash to ensure proper routing
  });
  
  return processed;
}

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
