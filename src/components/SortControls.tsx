// React imports
import React from 'react';

// Third-party imports
import { ArrowDown, ArrowUp } from 'lucide-react';

/**
 * Type definition for sort order options
 * - 'asc' - Ascending order (oldest first)
 * - 'desc' - Descending order (newest first)
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Props for the SortControls component
 */
interface SortControlsProps {
  /** Current sort order */
  sortOrder: SortOrder;
  /** Callback function when sort order changes */
  onSortChange: (order: SortOrder) => void;
}

/**
 * Renders controls for sorting posts by date
 * 
 * Features:
 * - Toggle between ascending and descending order
 * - Visual indication of active sort method
 * - Accessible button controls with icons
 * 
 * @param props - Component properties
 * @returns React component
 */
export function SortControls({ sortOrder, onSortChange }: SortControlsProps) {
  return (
    <div className="flex items-center justify-end text-sm">
      <div className="flex items-center bg-glass-light rounded-lg p-1 shadow-elegant">
        <button
          onClick={() => onSortChange('desc')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
            sortOrder === 'desc'
              ? 'text-white bg-blue-600 shadow-md font-medium'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
          }`}
          aria-label="Sort by newest first"
          aria-pressed={sortOrder === 'desc'}
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Newest</span>
        </button>
        <button
          onClick={() => onSortChange('asc')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all duration-200 ${
            sortOrder === 'asc'
              ? 'text-white bg-blue-600 shadow-md font-medium'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-gray-700'
          }`}
          aria-label="Sort by oldest first"
          aria-pressed={sortOrder === 'asc'}
        >
          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Oldest</span>
        </button>
      </div>
    </div>
  );
}
