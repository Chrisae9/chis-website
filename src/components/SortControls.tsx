import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

export type SortOrder = 'asc' | 'desc';

interface SortControlsProps {
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

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
        >
          <ArrowDown className="h-3 w-3" />
          <span>Newest</span>
        </button>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <button
          onClick={() => onSortChange('asc')}
          className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded ${
            sortOrder === 'asc'
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          <ArrowUp className="h-3 w-3" />
          <span>Oldest</span>
        </button>
      </div>
    </div>
  );
}
