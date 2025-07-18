import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types';
import { BlogApp } from '@/components/BlogApp';

async function getPosts(): Promise<Post[]> {
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => {
      const filePath = path.join(postsDirectory, filename);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug: filename.replace('.md', ''),
        content,
        frontmatter: {
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString().split('T')[0],
          summary: data.summary || '',
          tags: data.tags || [],
          backlinks: data.backlinks || [],
          category: data.category || 'General',
          draft: data.draft || false,
          hidden: data.hidden || false,
        },
      };
    })
    .filter(post => !post.frontmatter.draft && !post.frontmatter.hidden)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
  
  return posts;
}

export default async function Home() {
  const posts = await getPosts();

  return <BlogApp posts={posts} />;
}
