// React imports
import React from 'react';

// Third-party imports
import { X } from 'lucide-react';

/**
 * Props for the Sidebar component
 */
interface SidebarProps {
  /** Title displayed at the top of the sidebar */
  title: string;
  /** Optional callback function when the close button is clicked */
  onClose?: () => void;
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
 * - Optional back button above title
 * - Consistent padding and spacing
 * - Adapts to both left and right sidebar positions
 * 
 * @param props - Component properties
 * @returns React component
 */
export function Sidebar({ title, onClose, showMobileHeader = false, children }: SidebarProps) {
  return (
    <div className="h-full p-4 bg-glass-light rounded-2xl shadow-sidebar" role="complementary" aria-label={title}>
      {/* Mobile header with close button - only visible on small screens */}
      {showMobileHeader && (
        <div className="flex items-center justify-between mb-3 md:hidden">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-100 rounded shadow-elegant transition-all duration-200"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      )}
      
      {/* Desktop header - hidden on mobile */}
      <div className="hidden md:block mb-3">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      
      {/* Sidebar content */}
      {children}
    </div>
  );
}
