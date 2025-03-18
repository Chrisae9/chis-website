import React from 'react';
import { X, ExternalLink } from 'lucide-react';

interface SidebarProps {
  title: string;
  onClose?: () => void;
  showMobileHeader?: boolean;
  children: React.ReactNode;
}

export function Sidebar({ title, onClose, showMobileHeader = false, children }: SidebarProps) {
  return (
    <div className="p-4">
      {showMobileHeader && (
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-lg font-semibold">{title}</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
      )}
      <div className="hidden md:block">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
      </div>
      {children}
    </div>
  );
}
