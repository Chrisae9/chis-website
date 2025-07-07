// React imports
import React from 'react';

// Third-party imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';

// Local imports
import { DynamicLink } from '../config/links';

// Initialize FontAwesome library with both solid and brand icons
library.add(fas, fab);

/**
 * Props for the DynamicLinks component
 */
interface DynamicLinksProps {
  /** Array of link objects to display */
  links: DynamicLink[];
}

/**
 * Renders a collection of external links with icons
 * 
 * Features:
 * - Responsive grid layout that wraps on smaller screens
 * - Icon support via FontAwesome
 * - Consistent styling with theme support
 * - Proper security attributes for external links
 * 
 * @param props - Component properties
 * @returns React component
 */
export function DynamicLinks({ links }: DynamicLinksProps) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${link.name} (opens in new tab)`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md bg-glass-light text-gray-700 dark:text-gray-100 border border-white/20 dark:border-gray-300/20 hover:border-gray-300 dark:hover:border-gray-700 shadow-elegant hover:shadow-card transition-all duration-200 hover:scale-105"
        >
          <FontAwesomeIcon icon={[link.icon.prefix, link.icon.name]} className="w-3 h-3" aria-hidden="true" />
          {link.name}
        </a>
      ))}
    </div>
  );
}
