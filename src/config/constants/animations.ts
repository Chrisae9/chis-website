/**
 * Animation Constants
 * 
 * These constants define standard animation durations and easing functions
 * for maintaining consistent motion throughout the application.
 */

/**
 * Standard animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  /** Very quick animations (50ms) - for micro-interactions */
  EXTRA_FAST: 50,
  /** Fast animations (150ms) - for small UI elements */
  FAST: 150,
  /** Default animation duration (300ms) - for most UI elements */
  DEFAULT: 300,
  /** Slow animations (500ms) - for larger UI elements */
  SLOW: 500,
  /** Very slow animations (800ms) - for page transitions */
  EXTRA_SLOW: 800
};

/**
 * Standard CSS timing functions for animations
 */
export const ANIMATION_EASING = {
  /** Linear timing - constant speed */
  LINEAR: 'linear',
  /** Standard ease - starts slow, speeds up, then slows down */
  EASE: 'ease',
  /** Ease in - starts slow, ends fast */
  EASE_IN: 'ease-in',
  /** Ease out - starts fast, ends slow */
  EASE_OUT: 'ease-out',
  /** Ease in-out - starts and ends slow, fast in the middle */
  EASE_IN_OUT: 'ease-in-out'
};

/**
 * CSS transition strings for common animations
 */
export const TRANSITIONS = {
  /** Default transition for most UI elements */
  DEFAULT: `all ${ANIMATION_DURATION.DEFAULT}ms ${ANIMATION_EASING.EASE}`,
  /** Quick transition for hover effects */
  HOVER: `all ${ANIMATION_DURATION.FAST}ms ${ANIMATION_EASING.EASE_OUT}`,
  /** Smooth fade for opacity changes */
  FADE: `opacity ${ANIMATION_DURATION.DEFAULT}ms ${ANIMATION_EASING.EASE}`,
  /** Transition for modals and dialogs */
  MODAL: `transform ${ANIMATION_DURATION.SLOW}ms ${ANIMATION_EASING.EASE_OUT}, opacity ${ANIMATION_DURATION.SLOW}ms ${ANIMATION_EASING.EASE_OUT}`
};