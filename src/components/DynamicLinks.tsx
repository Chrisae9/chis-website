import React from 'react';

interface DynamicLink {
  name: string;
  url: string;
  icon?: {
    prefix: string;
    name: string;
  };
}

interface DynamicLinksProps {
  links: DynamicLink[];
}

export function DynamicLinks({ links }: DynamicLinksProps) {
  return (
    <div className="space-y-2">
      {links.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {link.name}
        </a>
      ))}
    </div>
  );
}