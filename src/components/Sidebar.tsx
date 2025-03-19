import React from 'react';
import { X } from 'lucide-react';

interface SidebarProps {
  title: string;
  onClose?: () => void;
  showMobileHeader?: boolean;
  children: React.ReactNode;
}

export function Sidebar({ title, onClose, showMobileHeader = false, children }: SidebarProps) {
  return (
    <div className="h-full p-4">
      {showMobileHeader && (
        <div className="flex items-center justify-between mb-3 md:hidden">
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
      <div className="hidden md:block mb-3">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  );
}
