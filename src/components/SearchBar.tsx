// React imports
import React from 'react';

// Third-party imports
import { Search } from 'lucide-react';

/**
 * Props for the SearchBar component
 */
interface SearchBarProps {
  /** Current search query value */
  value: string;
  /** Callback function when search input changes */
  onChange: (value: string) => void;
}

/**
 * Renders a search input field with icon
 * 
 * Features:
 * - Clean, accessible search input
 * - Search icon for visual indication
 * - Full-width responsive design with enhanced size
 * - Theme-aware styling (light/dark mode)
 * - Enhanced shadows and depth for modern appearance
 * 
 * @param props - Component properties
 * @returns React component
 */
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search posts..."
          aria-label="Search posts"
          className="w-full h-12 pl-12 pr-4 text-base bg-glass-light text-gray-900 dark:text-gray-100 border border-white/20 dark:border-gray-300/20 rounded-xl shadow-elegant focus:outline-none focus:border-blue-300 dark:focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
        />
        <Search 
          className="absolute left-4 top-4 h-4 w-4 text-gray-400 dark:text-gray-500" 
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
