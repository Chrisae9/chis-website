export interface PostFrontmatter {
  title: string;
  date: string;
  summary: string;
  tags: string[];
  backlinks?: string[];
  category?: string;
  draft?: boolean;
}

export interface Post {
  slug: string;
  content: string;
  frontmatter: PostFrontmatter;
}

export interface SidebarConfig {
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  setShowRightSidebar: (show: boolean) => void;
}
