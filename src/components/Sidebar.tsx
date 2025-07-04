// React imports
import React from 'react';

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  /** Title displayed at the top of the sidebar */
  title: string;
  /** Whether to show the mobile header with close button */
  showMobileHeader?: boolean;
  /** Content to render inside the sidebar */
  children: React.ReactNode;
}

/**
 * Renders a sidebar container with title and optional close button
 * 
 * Features:
 * - Responsive design with mobile-specific header
 * - Optional close button for mobile view
 * - Consistent padding and spacing
 * - Adapts to both left and right sidebar positions
 * 
 * @param props - Component properties
 * @returns React component
 */
export function Sidebar({ title, showMobileHeader = false, children }: SidebarProps) {
  return (
    <div className="sticky top-4 max-h-[calc(100vh-2rem)] p-4 bg-glass-light rounded-2xl shadow-sidebar overflow-hidden z-10" role="complementary" aria-label={title}>
      {/* Mobile header without close button - only visible on small screens */}
      {showMobileHeader && (
        <div className="flex items-center justify-center mb-3 md:hidden">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
        </div>
      )}
      
      {/* Desktop header - hidden on mobile */}
      <div className="hidden md:block mb-3">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      
      {/* Sidebar content */}
      <div className="overflow-y-auto max-h-full">
        {children}
      </div>
    </div>
  );
}
