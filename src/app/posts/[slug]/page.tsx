import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Post } from '@/types';
import { notFound } from 'next/navigation';
import { PostView } from '@/components/PostView';

async function getPost(slug: string): Promise<Post | null> {
  try {
    const filePath = path.join(process.cwd(), 'src/posts', `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug,
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
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const postsDirectory = path.join(process.cwd(), 'src/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  return filenames
    .filter(filename => filename.endsWith('.md'))
    .map(filename => ({
      slug: filename.replace('.md', ''),
    }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    notFound();
  }

  return <PostView post={post} />;
}