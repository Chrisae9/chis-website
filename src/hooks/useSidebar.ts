import { useState, useEffect } from 'react';

export function useSidebar() {
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  // Handle screen size changes to properly hide/show sidebars
  useEffect(() => {
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

    window.addEventListener('resize', handleResize);
    
    // Initial check
    handleResize();
    
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
