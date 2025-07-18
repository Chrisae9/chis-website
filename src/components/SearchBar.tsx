import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
      <div className="relative w-full">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search posts..."
          aria-label="Search posts"
          className={cn(
            "w-full h-12 pl-12 pr-4 text-base bg-glass-light",
            "border-white/20 dark:border-gray-300/20 rounded-xl shadow-elegant",
            "focus:border-blue-300 dark:focus:border-blue-600",
            "focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800",
            "placeholder-gray-500 dark:placeholder-gray-400",
            "transition-all duration-200"
          )}
        />
        <Search 
          className="absolute left-4 top-4 h-4 w-4 text-muted-foreground" 
          aria-hidden="true"
        />
      </div>
    </div>
  );
}