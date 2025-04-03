// React imports
import { useState } from 'react';

// Third-party imports
import { Search } from 'lucide-react';

/**
 * Props for the TagList component
 */
interface TagListProps {
  /** List of all available tags to display */
  tags: string[];
  /** Currently selected tags */
  selectedTags: string[];
  /** Callback function when a tag is toggled */
  onTagToggle: (tag: string) => void;
}

/**
 * Renders a filterable list of tags with selection state
 * 
 * Features:
 * - Interactive tag buttons with selected state
 * - Search filter for finding specific tags
 * - Visual indication of selected tags
 * - Responsive layout that wraps on smaller screens
 * 
 * @param props - Component properties
 * @returns React component
 */
export function TagList({ tags, selectedTags, onTagToggle }: TagListProps) {
  // State for the tag search filter
  const [tagSearch, setTagSearch] = useState('');
  
  // Filter tags based on search input
  const filteredTags = tags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-3">
      {/* Search input for filtering tags */}
      <div className="relative">
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Filter tags"
          aria-label="Filter tags"
          className="w-full h-9 pl-8 pr-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-gray-300 dark:focus:border-gray-700 rounded-md placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>

      {/* Tag buttons */}
      <div className="flex flex-wrap gap-1.5">
        {filteredTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
            aria-pressed={selectedTags.includes(tag)}
            className={`px-2.5 py-1 text-sm rounded transition-colors ${
              selectedTags.includes(tag)
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-100 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
