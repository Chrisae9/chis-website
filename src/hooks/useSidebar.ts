// React imports
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing sidebar visibility states
 * 
 * Features:
 * - Handles both left and right sidebar visibility
 * - Implements responsive behavior based on screen size
 * - Automatically closes mobile sidebars when screen size increases to desktop
 * 
 * @returns Object containing sidebar visibility states and setter functions
 */
export function useSidebar() {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  /**
   * Handle screen size changes to properly manage sidebar visibility
   * Ensures mobile sidebars are closed when viewport width increases to desktop size
   */
  useEffect(() => {
    /**
     * Resize event handler that closes mobile sidebars when screen becomes desktop-sized
     */
    const handleResize = () => {
      // If we're at desktop size (lg breakpoint is 1024px), ensure mobile sidebars are closed
      if (window.innerWidth >= 1024) {
        // Only close if they're currently shown in mobile view
        if (showLeftSidebar || showRightSidebar) {
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        }
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Initial check on mount
    handleResize();
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showLeftSidebar, showRightSidebar]);

  return {
    showLeftSidebar,
    setShowLeftSidebar,
    showRightSidebar,
    setShowRightSidebar
  };
}
