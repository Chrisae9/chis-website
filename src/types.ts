export interface Post {
  slug: string;
  content: string;
  frontmatter: {
    title: string;
    date: string;
    summary: string;
    tags: string[];
    backlinks?: string[];
  };
}
