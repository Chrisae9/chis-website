import fs from 'fs';
import path from 'path';

/**
 * Generates the sitemap entries for the website
 * @returns Array of string paths for the sitemap
 */
export function getSitemapEntries() {
  // Get all markdown files from the posts directory
  const postsDir = path.join(process.cwd(), 'src/posts');
  const postFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    .map(file => `/${path.parse(file).name}`);

  // Add static routes
  const staticRoutes = ['/', '/about'];

  // Combine all routes
  return [...staticRoutes, ...postFiles];
}