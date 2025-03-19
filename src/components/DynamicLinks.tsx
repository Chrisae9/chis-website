import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { DynamicLink } from '../config/links';

library.add(fas, fab);

interface DynamicLinksProps {
  links: DynamicLink[];
}

export function DynamicLinks({ links }: DynamicLinksProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm rounded-md bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={[link.icon.prefix, link.icon.name]} className="w-4 h-4" />
          {link.name}
        </a>
      ))}
    </div>
  );
}
