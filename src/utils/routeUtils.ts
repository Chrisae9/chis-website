/**
 * Utility functions for handling routes in the application
 */

/**
 * Creates a proper URL for internal navigation
 * This helps ensure consistency between development and production environments
 * 
 * @param path The relative path to navigate to
 * @returns A properly formatted URL for the current environment
 */
export function createInternalUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // In development or production, we want to use relative paths
  return `/${cleanPath}`;
}

/**
 * Normalizes a slug for consistent URL handling
 * 
 * @param slug The slug to normalize
 * @returns A normalized slug
 */
export function normalizeSlug(slug: string): string {
  // Remove any leading or trailing slashes and get the last segment
  const parts = slug.replace(/^\/+|\/+$/g, '').split('/');
  
  // Get the last part of the path (the actual slug)
  const lastPart = parts[parts.length - 1] || '';
  
  // Remove any query parameters or hash fragments
  return lastPart.split('?')[0].split('#')[0];
}

/**
 * Checks if a URL is an internal link
 * 
 * @param url The URL to check
 * @returns True if the URL is internal
 */
export function isInternalUrl(url: string): boolean {
  return !url.startsWith('http://') && !url.startsWith('https://');
}
