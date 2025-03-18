import { Post } from '../types';
import matter from 'gray-matter';

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
      
      return {
        slug,
        content: markdownContent,
        frontmatter: data as Post['frontmatter'],
      };
    })
  );
  
  return posts;
}
