/**
 * Application Configuration
 * 
 * This file serves as the central export point for all application configuration.
 * Configuration is organized by feature area for maintainability.
 */

// Feature-specific configuration
import { links } from './links';
import { utterancesConfig } from './utterances';

// Constants and environment variables
import { 
  APP_NAME, 
  SITE_URL, 
  DEFAULT_DESCRIPTION, 
  MAX_CONTENT_WIDTH, 
  BREAKPOINT_LARGE 
} from './constants/site';

// Animation and layout constants
import {
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSITIONS
} from './constants/animations';

import {
  SPACING,
  Z_INDEX,
  BORDER_RADIUS
} from './constants/layout';

/**
 * Export all configuration for easy access throughout the application
 */
export {
  // Feature configurations
  links,
  utterancesConfig,
  
  // Site constants
  APP_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  MAX_CONTENT_WIDTH,
  BREAKPOINT_LARGE,
  
  // Animation constants
  ANIMATION_DURATION,
  ANIMATION_EASING,
  TRANSITIONS,
  
  // Layout constants
  SPACING,
  Z_INDEX,
  BORDER_RADIUS,
};