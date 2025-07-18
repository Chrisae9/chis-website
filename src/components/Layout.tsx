'use client'

import React from 'react';
import { Sun, Moon, Menu, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarConfig } from '@/types';

interface LayoutProps extends SidebarConfig {
  children: React.ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
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
      {/* Floating controls - positioned at bottom right */}
      <div className="fixed bottom-4 right-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-200">
        <div className="flex gap-2">
          {/* Links button - only show on list view */}
          {!isPostView && (
            <Button
              onClick={() => {
                if (showRightSidebar) {
                  setShowRightSidebar(false);
                } else {
                  setShowLeftSidebar(false); // Close left sidebar if open
                  setShowRightSidebar(true);
                }
              }}
              variant="ghost"
              size="icon"
              className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30 lg:hidden"
              aria-label={showRightSidebar ? "Close links sidebar" : "Open links sidebar"}
            >
              <Link className="h-5 w-5" />
            </Button>
          )}
          
          {/* Theme toggle */}
          <Button
            onClick={toggleDarkMode}
            variant="ghost"
            size="icon"
            className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile sidebar controls - positioned at bottom left */}
      <div className="fixed bottom-4 left-4 z-50 opacity-60 hover:opacity-100 transition-opacity duration-200 lg:hidden">
        <Button
          onClick={() => {
            if (showLeftSidebar) {
              setShowLeftSidebar(false);
            } else {
              setShowRightSidebar(false); // Close right sidebar if open
              setShowLeftSidebar(true);
            }
          }}
          variant="ghost"
          size="icon"
          className="w-12 h-12 bg-white/60 dark:bg-gray-900/60 hover:bg-white/90 dark:hover:bg-gray-900/90 rounded-full transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30"
          aria-label={showLeftSidebar ? "Close left sidebar" : "Open left sidebar"}
        >
          <Menu className="h-5 w-5" />
        </Button>
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
            className={`col-span-2 overflow-visible ${
              showLeftSidebar 
                ? 'fixed bottom-20 left-4 right-4 w-auto z-60 lg:relative lg:inset-auto lg:w-auto lg:top-auto lg:bottom-auto lg:left-auto lg:right-auto' 
                : 'hidden lg:block'
            }`}
          >
            {leftSidebar}
          </aside>

          {/* Main content area - different column spans based on view type */}
          <main className={`${isPostView ? 'col-span-12 lg:col-span-10 lg:col-start-3' : 'col-span-12 lg:col-span-7'} space-y-4`}>
            {/* Header content (search bar or back button) */}
            {header && (
              <div className="flex justify-center lg:justify-start mb-4">
                {header}
              </div>
            )}
            {children}
          </main>

          {/* Right sidebar - only visible in list view (not post view) */}
          {!isPostView && (
            <aside 
              className={`col-span-3 overflow-visible ${
                showRightSidebar 
                  ? 'fixed bottom-20 left-4 right-4 w-auto z-60 lg:relative lg:inset-auto lg:w-auto lg:top-auto lg:bottom-auto lg:left-auto lg:right-auto' 
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