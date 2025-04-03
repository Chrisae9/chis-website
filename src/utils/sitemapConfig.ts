/**
 * Sitemap Configuration Utilities
 * Helpers for generating sitemap entries for the website
 */

// Node.js imports
import fs from 'fs';
import path from 'path';

/**
 * Generates the sitemap entries for the website
 * 
 * This function:
 * 1. Reads all markdown files from the posts directory
 * 2. Converts them to URL paths
 * 3. Combines them with static routes
 * 
 * @returns Array of string paths for the sitemap (e.g., ['/', '/about', '/post-slug'])
 */
export function getSitemapEntries() {
  // Get all markdown files from the posts directory
  const postsDir = path.join(process.cwd(), 'src/posts');
  const postFiles = fs.readdirSync(postsDir)
    .filter(file => file.endsWith('.md'))
    // Convert filenames to URL paths by removing .md extension
    .map(file => `/${path.parse(file).name}`);

  // Add static routes that should always be in the sitemap
  const staticRoutes = ['/', '/about'];

  // Combine all routes for the complete sitemap
  return [...staticRoutes, ...postFiles];
}