// React imports
import React from 'react';

// Third-party imports
import { Link, Sun, Moon, Menu, X } from 'lucide-react';

// Local imports
import { BackToTop } from './BackToTop';
import { SidebarConfig } from '../types';

/**
 * Props for the Layout component
 * Extends SidebarConfig to include sidebar visibility state and controls
 */
interface LayoutProps extends SidebarConfig {
  /** Main content to render in the layout */
  children: React.ReactNode;
  /** Current theme state (true for dark mode, false for light mode) */
  darkMode: boolean;
  /** Function to toggle between dark and light mode */
  toggleDarkMode: () => void;
  /** Content to render in the left sidebar */
  leftSidebar: React.ReactNode;
  /** Content to render in the right sidebar */
  rightSidebar: React.ReactNode;
  /** Content to render in the header (e.g., search bar, back button) */
  header: React.ReactNode;
  /** Whether the current view is a post detail view */
  isPostView: boolean;
}

/**
 * Main layout component for the application
 * 
 * Features:
 * - Responsive layout with sidebars that collapse on mobile
 * - Sticky header with navigation controls
 * - Dark/light mode toggle
 * - Different layouts for post view vs. list view
 * 
 * @param props - Component properties
 * @returns React component
 */
export function Layout({
  children,
  darkMode,
  toggleDarkMode,
  showLeftSidebar,
  showRightSidebar,
  setShowLeftSidebar,
  setShowRightSidebar,
  leftSidebar,
  rightSidebar,
  header,
  isPostView
}: LayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900`}>
      {/* Sticky header with navigation controls */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4 px-4">
          {/* Left section: sidebar toggle and header content */}
          <div className="flex items-center gap-3 lg:w-64">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
              aria-label={showLeftSidebar ? "Close left sidebar" : "Open left sidebar"}
            >
              {showLeftSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            {header}
          </div>
          
          {/* Middle section: flexible space */}
          <div className="flex-1 max-w-2xl">
            {/* Search bar container */}
          </div>

          {/* Right section: action buttons */}
          <div className="flex items-center gap-3 lg:w-64 justify-end">
            <BackToTop />
            {!isPostView && (
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
                aria-label={showRightSidebar ? "Close right sidebar" : "Open right sidebar"}
              >
                {showRightSidebar ? <X className="h-4 w-4" /> : <Link className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Overlay for mobile sidebars - visible only on small screens when sidebar is open */}
      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
          aria-hidden="true"
        />
      )}

      {/* Main content grid */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left sidebar */}
          <aside 
            className={`col-span-2 ${
              showLeftSidebar 
                ? 'fixed inset-y-0 left-0 w-64 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-800 lg:relative lg:inset-auto lg:w-auto' 
                : 'hidden lg:block'
            }`}
          >
            {leftSidebar}
          </aside>

          {/* Main content area - different column spans based on view type */}
          <main className={`${isPostView ? 'col-span-12 lg:col-span-10 lg:col-start-3' : 'col-span-12 lg:col-span-7'} space-y-4`}>
            {children}
          </main>

          {/* Right sidebar - only visible in list view (not post view) */}
          {!isPostView && (
            <aside 
              className={`col-span-3 ${
                showRightSidebar 
                  ? 'fixed inset-y-0 right-0 w-64 z-50 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-800 lg:relative lg:inset-auto lg:w-auto' 
                  : 'hidden lg:block'
              }`}
            >
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
