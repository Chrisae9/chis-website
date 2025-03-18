import React from 'react';
import { ExternalLink, Sun, Moon, Menu, X } from 'lucide-react';

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
  header
}: LayoutProps) {
  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <header className="sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {showLeftSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            {header}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {showRightSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              {darkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </header>

      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <aside className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
            showLeftSidebar ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0 md:static md:h-auto md:w-full md:shadow-none md:z-auto md:col-span-2`}>
            {leftSidebar}
          </aside>

          <div className="col-span-12 md:col-span-7">
            {children}
          </div>

          <aside className={`fixed top-0 right-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
            showRightSidebar ? 'translate-x-0' : 'translate-x-full'
          } md:translate-x-0 md:static md:h-auto md:w-full md:shadow-none md:z-auto md:col-span-3`}>
            {rightSidebar}
          </aside>
        </div>
      </main>
    </div>
  );
}
