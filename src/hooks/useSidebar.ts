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
  const [previousWidth, setPreviousWidth] = useState(window.innerWidth);

  /**
   * Handle screen size changes to properly manage sidebar visibility
   * Ensures mobile sidebars are closed when viewport width increases to desktop size
   */
  useEffect(() => {
    /**
     * Resize event handler that closes mobile sidebars when screen becomes desktop-sized
     */
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      
      // Only close sidebars if we transitioned from mobile to desktop
      // and the sidebars are currently shown
      if (previousWidth < 1024 && currentWidth >= 1024) {
        if (showLeftSidebar || showRightSidebar) {
          setShowLeftSidebar(false);
          setShowRightSidebar(false);
        }
      }
      
      setPreviousWidth(currentWidth);
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [showLeftSidebar, showRightSidebar, previousWidth]);

  return {
    showLeftSidebar,
    setShowLeftSidebar,
    showRightSidebar,
    setShowRightSidebar
  };
}
