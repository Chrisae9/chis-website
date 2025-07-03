// React imports
import { useState, useEffect } from 'react';

// Third-party imports
import { ArrowUp } from 'lucide-react';

/**
 * Renders a "Back to Top" button that appears when scrolling down the page
 * 
 * Features:
 * - Automatically shows/hides based on scroll position
 * - Smooth scrolling animation to the top of the page
 * - Accessible with proper aria labels
 * - Theme-aware styling
 * 
 * @returns React component
 */
export function BackToTop() {
  // Controls visibility of the button based on scroll position
  const [isVisible, setIsVisible] = useState(false);

  /**
   * Add scroll event listener to show/hide button based on scroll position
   */
  useEffect(() => {
    // Show button when scrolled down past threshold, hide when near top
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Add scroll event listener with performance optimization
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Cleanup event listener on component unmount
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  /**
   * Scroll to the top of the page with smooth animation
   */
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-100 shadow-elegant hover:shadow-card"
          aria-label="Back to top"
          title="Scroll back to top"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </>
  );
}
