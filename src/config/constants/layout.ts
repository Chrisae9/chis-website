/**
 * Spacing and Layout Constants
 * 
 * These constants define standard spacing values and layout parameters
 * to maintain consistent spacing throughout the application.
 */

/**
 * Standard spacing values in pixels
 * Following an 8px grid system
 */
export const SPACING = {
  /** Extra small spacing (4px) */
  XS: 4,
  /** Small spacing (8px) */
  SM: 8,
  /** Medium spacing (16px) */
  MD: 16,
  /** Large spacing (24px) */
  LG: 24,
  /** Extra large spacing (32px) */
  XL: 32,
  /** Double extra large spacing (48px) */
  XXL: 48,
  /** Triple extra large spacing (64px) */
  XXXL: 64
};

/**
 * Z-index values for controlling the stacking order of elements
 */
export const Z_INDEX = {
  /** Base level elements */
  BASE: 0,
  /** Low-priority UI elements that should appear above the base content */
  LOW: 10,
  /** Mid-priority UI elements like sticky headers */
  MEDIUM: 100,
  /** High-priority UI elements like dropdowns */
  HIGH: 1000,
  /** Very high-priority elements like modals */
  MODAL: 2000,
  /** Top-level elements like notifications and tooltips */
  TOOLTIP: 3000,
  /** Absolute highest level for critical UI elements */
  HIGHEST: 9999
};

/**
 * Standard border radius values in pixels
 */
export const BORDER_RADIUS = {
  /** Subtle rounded corners (2px) */
  SUBTLE: 2,
  /** Small rounded corners (4px) */
  SMALL: 4,
  /** Medium rounded corners (8px) */
  MEDIUM: 8,
  /** Large rounded corners (12px) */
  LARGE: 12,
  /** Extra large rounded corners (16px) */
  EXTRA_LARGE: 16,
  /** Pill shape (9999px) */
  PILL: 9999
};