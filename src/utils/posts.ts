import { Post } from '../types';
import matter from 'gray-matter';

function extractBacklinks(content: string): string[] {
  const backlinks = new Set<string>();
  const backlinkRegex = /\[\[(.*?)\]\]/g;
  let match;

  while ((match = backlinkRegex.exec(content)) !== null) {
    backlinks.add(match[1].trim());
  }

  return Array.from(backlinks);
}

function processBacklinkSyntax(content: string): string {
  // Process backlinks but exclude YouTube embeds
  let processed = content.replace(/\[\[((?!youtube\.)[^[\]]*?)\]\]/g, (_, text) => {
    return `[${text}](${text})`;
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
