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
    <div className="flex items-center justify-end mb-3 text-xs">
      <div className="text-gray-500 dark:text-gray-400 mr-2">
        Sort:
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSortChange('desc')}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
            sortOrder === 'desc'
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          aria-label="Sort by newest first"
          aria-pressed={sortOrder === 'desc'}
        >
          <ArrowDown className="h-3 w-3" aria-hidden="true" />
          <span>Newest</span>
        </button>
        <span className="text-gray-300 dark:text-gray-600" aria-hidden="true">|</span>
        <button
          onClick={() => onSortChange('asc')}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
            sortOrder === 'asc'
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
          aria-label="Sort by oldest first"
          aria-pressed={sortOrder === 'asc'}
        >
          <ArrowUp className="h-3 w-3" aria-hidden="true" />
          <span>Oldest</span>
        </button>
      </div>
    </div>
  );
}
