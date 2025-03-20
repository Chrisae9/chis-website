import React from 'react';
import { Link, Sun, Moon, Menu, X } from 'lucide-react';
import { BackToTop } from './BackToTop';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  showLeftSidebar: boolean;
  showRightSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;
  setShowRightSidebar: (show: boolean) => void;
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
  header: React.ReactNode;
  isPostView: boolean;
}

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
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-3 md:w-64">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
            >
              {showLeftSidebar ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
            {header}
          </div>
          
          <div className="flex-1 max-w-2xl">
            {/* Search bar container */}
          </div>

          <div className="flex items-center gap-3 md:w-64 justify-end">
            <BackToTop />
            {!isPostView && (
              <button
                onClick={() => setShowRightSidebar(!showRightSidebar)}
                className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
              >
                {showRightSidebar ? <X className="h-4 w-4" /> : <Link className="h-4 w-4" />}
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-700 dark:text-gray-100"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          <aside className={`col-span-2 md:block ${
            showLeftSidebar 
              ? 'fixed inset-y-0 left-0 w-64 z-50 sidebar-gradient border-r border-gray-200 dark:border-gray-800' 
              : 'hidden'
          }`}>
            {leftSidebar}
          </aside>

          <main className={`${isPostView ? 'col-span-12 md:col-span-10 md:col-start-3' : 'col-span-12 md:col-span-7'} space-y-4`}>
            {children}
          </main>

          {!isPostView && (
            <aside className={`col-span-3 md:block ${
              showRightSidebar 
                ? 'fixed inset-y-0 right-0 w-64 z-50 sidebar-gradient border-l border-gray-200 dark:border-gray-800' 
                : 'hidden'
            }`}>
              {rightSidebar}
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
