/**
 * Utility functions for handling section changes in the post content
 */

/**
 * Tracks which sections of a post are currently active in the viewport
 */
export interface SectionState {
  connected: boolean;
  comments: boolean;
}

/**
 * Default section state with nothing active
 */
export const defaultSectionState: SectionState = {
  connected: false,
  comments: false
};

/**
 * Scrolls to a specific section of the post
 * @param sectionId The ID of the section to scroll to
 * @param behavior The scroll behavior (smooth or auto)
 */
export function scrollToSection(sectionId: string, behavior: ScrollBehavior = 'smooth'): void {
  const section = document.getElementById(sectionId) || document.querySelector(`[data-${sectionId}]`);
  if (section) {
    // Get the position of the element relative to the document
    const yPosition = section.getBoundingClientRect().top + window.scrollY;
    
    // Calculate position with offset for fixed header (64px)
    const offsetPosition = yPosition - 64;
    
    // Scroll to the position
    window.scrollTo({
      top: offsetPosition,
      behavior
    });
  }
}
