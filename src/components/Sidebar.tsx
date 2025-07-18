import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SidebarProps {
  title: string;
  showMobileHeader?: boolean;
  children: React.ReactNode;
}

export function Sidebar({ title, showMobileHeader = false, children }: SidebarProps) {
  return (
    <Card 
      className={cn(
        "sticky top-4 bg-glass-light rounded-2xl shadow-sidebar z-10 border-0",
        "py-4 gap-3"
      )}
      role="complementary" 
      aria-label={title}
    >
      {/* Mobile header without close button - only visible on small screens */}
      {showMobileHeader && (
        <CardHeader className="flex items-center justify-center pb-0 md:hidden px-4">
          <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      
      {/* Desktop header - hidden on mobile */}
      <CardHeader className="hidden md:block pb-0 px-4">
        <CardTitle className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {title}
        </CardTitle>
      </CardHeader>
      
      {/* Sidebar content */}
      <CardContent className="overflow-visible px-4">
        {children}
      </CardContent>
    </Card>
  );
}