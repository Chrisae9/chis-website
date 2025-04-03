/**
 * Common React PropTypes
 * 
 * This file contains shared interface definitions for React component props
 * that can be reused across multiple components.
 */

import { ReactNode } from 'react';
import { Post } from './types';

/**
 * Common props for components that handle children elements
 */
export interface ChildrenProps {
  /** Child React elements */
  children: ReactNode;
}

/**
 * Common props for components with click handlers
 */
export interface ClickableProps {
  /** Callback function when element is clicked */
  onClick: () => void;
  /** Optional label for accessibility */
  ariaLabel?: string;
  /** Optional disabled state */
  disabled?: boolean;
}

/**
 * Common props for components that display loading states
 */
export interface LoadingProps {
  /** Whether data is currently loading */
  isLoading: boolean;
  /** Optional custom loading message */
  loadingMessage?: string;
}

/**
 * Common props for components that handle errors
 */
export interface ErrorProps {
  /** Error message to display, or null if no error */
  error: string | null;
  /** Optional callback to retry the operation */
  onRetry?: () => void;
}

/**
 * Common props for components that display post data
 */
export interface PostDisplayProps {
  /** The post data to display */
  post: Post;
  /** Optional callback for when post is clicked */
  onPostClick?: (slug: string) => void;
  /** Current search term for highlighting */
  searchTerm?: string;
}

/**
 * Common props for components that handle theme state
 */
export interface ThemeProps {
  /** Whether dark mode is currently active */
  darkMode: boolean;
  /** Optional callback to toggle theme */
  toggleDarkMode?: () => void;
}

/**
 * Common props for components that have a title
 */
export interface TitleProps {
  /** Title text to display */
  title: string;
}