import { useState } from 'react';
import { Search } from 'lucide-react';

interface TagListProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagList({ tags, selectedTags, onTagToggle }: TagListProps) {
  const [tagSearch, setTagSearch] = useState('');
  
  const filteredTags = tags.filter(tag => 
    tag.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          value={tagSearch}
          onChange={(e) => setTagSearch(e.target.value)}
          placeholder="Filter tags"
          className="w-full h-9 pl-8 pr-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 focus:outline-none focus:border-gray-300 dark:focus:border-gray-700 rounded-md placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {filteredTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagToggle(tag)}
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
