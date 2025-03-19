import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="max-w-2xl mx-auto w-full px-4">
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search posts..."
          className="w-full h-10 pl-10 pr-4 text-base bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm focus:outline-none focus:border-gray-300 dark:focus:border-gray-700 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700 placeholder-gray-500 dark:placeholder-gray-400"
        />
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
}
