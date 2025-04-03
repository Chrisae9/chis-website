// React imports
import React, { useState, useEffect, useRef } from 'react';

// Third-party imports
import { Search } from 'lucide-react';

/**
 * Props for the CategoryFilter component
 */
interface CategoryFilterProps {
  /** List of all available categories to display */
  categories: string[];
  /** Currently selected category or null for "All" */
  selectedCategory: string | null;
  /** Callback function when a category is selected */
  onCategoryChange: (category: string | null) => void;
}

/**
 * Renders a searchable dropdown for filtering posts by category
 * 
 * Features:
 * - Dropdown with current selection display
 * - Search input for filtering categories
 * - Visual indication of selected category
 * - Handles click outside to close dropdown
 * - Keyboard navigation support
 * 
 * @param props - Component properties
 * @returns React component
 */
export function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  // State for dropdown visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for category search term
  const [searchTerm, setSearchTerm] = useState('');
  // Reference to the dropdown container for click outside detection
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Reference to the search input for focus management
  const searchInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle click outside to close dropdown
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  /**
   * Focus search input when dropdown opens
   */
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Filter categories based on search term
   */
  const filteredCategories = categories.filter(category => 
    category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /**
   * Handle category selection and close dropdown
   */
  const handleSelectCategory = (category: string | null) => {
    onCategoryChange(category);
    setIsOpen(false);
    setSearchTerm('');
  };

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef} onKeyDown={handleKeyDown}>
      {/* Dropdown trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Category filter, currently ${selectedCategory || 'All'}`}
        className="flex items-center justify-between w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800"
      >
        <span className="text-gray-700 dark:text-gray-300">
          {selectedCategory || 'All'}
        </span>
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md shadow-lg"
          role="listbox"
          aria-label="Category options"
        >
          <div className="p-2">
            {/* Search input */}
            <div className="relative mb-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories"
                aria-label="Search categories"
                className="w-full h-9 pl-8 pr-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </div>
            
            {/* Category options */}
            <div className="max-h-60 overflow-y-auto">
              {/* "All" option */}
              <button
                onClick={() => handleSelectCategory(null)}
                role="option"
                aria-selected={selectedCategory === null}
                className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                  selectedCategory === null
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                All
              </button>
              
              {/* Category list */}
              {filteredCategories.map(category => (
                <button
                  key={category}
                  onClick={() => handleSelectCategory(category)}
                  role="option"
                  aria-selected={selectedCategory === category}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    selectedCategory === category
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {category}
                </button>
              ))}
              
              {/* Empty state */}
              {filteredCategories.length === 0 && (
                <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                  No categories found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
