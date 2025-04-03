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
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${link.name} (opens in new tab)`}
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={[link.icon.prefix, link.icon.name]} className="w-4 h-4" aria-hidden="true" />
          {link.name}
        </a>
      ))}
    </div>
  );
}
