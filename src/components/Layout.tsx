// React imports
import React from 'react';

// Third-party imports
import { Sun, Moon, Menu, X, Link } from 'lucide-react';

// Local imports
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
    <div className={`min-h-screen bg-gradient-blue`}>
      {/* Floating controls - positioned at bottom right */}
      <div className="fixed bottom-4 right-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-2">
          {/* Links button - only show on list view */}
          {!isPostView && (
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center lg:hidden"
              aria-label={showRightSidebar ? "Close links sidebar" : "Open links sidebar"}
            >
              {showRightSidebar ? <X className="h-5 w-5" /> : <Link className="h-5 w-5" />}
            </button>
          )}
          
          {/* Theme toggle */}
          <button
            onClick={toggleDarkMode}
            className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile sidebar controls - positioned at bottom left */}
      <div className="fixed bottom-4 left-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-200 lg:hidden">
        <button
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
          className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 flex items-center justify-center"
          aria-label={showLeftSidebar ? "Close left sidebar" : "Open left sidebar"}
        >
          {showLeftSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

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
                ? 'fixed top-4 bottom-4 left-4 w-64 z-50 lg:relative lg:inset-auto lg:w-auto lg:top-auto lg:bottom-auto lg:left-auto' 
                : 'hidden lg:block'
            }`}
          >
            {leftSidebar}
          </aside>

          {/* Main content area - different column spans based on view type */}
          <main className={`${isPostView ? 'col-span-12 lg:col-span-10 lg:col-start-3' : 'col-span-12 lg:col-span-7'} space-y-4`}>
            {/* Header content (search bar or back button) */}
            {header && (
              <div className="flex justify-center mb-4">
                {header}
              </div>
            )}
            {children}
          </main>

          {/* Right sidebar - only visible in list view (not post view) */}
          {!isPostView && (
            <aside 
              className={`col-span-3 ${
                showRightSidebar 
                  ? 'fixed top-4 bottom-4 right-4 w-64 z-50 lg:relative lg:inset-auto lg:w-auto lg:top-auto lg:bottom-auto lg:right-auto' 
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
