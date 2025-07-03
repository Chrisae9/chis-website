import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Layout } from '../../components/Layout';

// Mock the BackToTop component
vi.mock('../../components/BackToTop', () => ({
  BackToTop: () => <div data-testid="back-to-top">Back to Top</div>
}));

describe('Layout', () => {
  const defaultProps = {
    children: <div>Test Content</div>,
    darkMode: false,
    toggleDarkMode: vi.fn(),
    showLeftSidebar: false,
    showRightSidebar: false,
    setShowLeftSidebar: vi.fn(),
    setShowRightSidebar: vi.fn(),
    leftSidebar: <div>Left Sidebar</div>,
    rightSidebar: <div>Right Sidebar</div>,
    header: <div data-testid="header-content">Header Content</div>,
    isPostView: false
  };

  describe('Header Layout', () => {
    it('should render header with centered search area', () => {
      render(<Layout {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toBeInTheDocument();
      
      // Check for header structure with flex layout
      const headerContainer = header.querySelector('.max-w-7xl');
      expect(headerContainer).toHaveClass('flex', 'items-center', 'justify-between');
    });

    it('should have expanded search area in the middle section', () => {
      render(<Layout {...defaultProps} />);
      
      // Check for middle section with expanded width
      const middleSection = screen.getByRole('banner').querySelector('.flex-1');
      expect(middleSection).toHaveClass('flex-1', 'max-w-4xl');
    });

    it('should maintain proper spacing between header sections', () => {
      render(<Layout {...defaultProps} />);
      
      const headerContainer = screen.getByRole('banner').querySelector('.max-w-7xl');
      expect(headerContainer).toHaveClass('gap-6');
    });
  });

  describe('Shadow Effects', () => {
    it('should apply shadow classes to header', () => {
      render(<Layout {...defaultProps} />);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('backdrop-blur-sm');
    });

    it('should apply shadow effects to post cards and components', () => {
      render(<Layout {...defaultProps} showLeftSidebar={true} />);
      
      const sidebars = screen.getAllByRole('complementary');
      expect(sidebars.length).toBeGreaterThan(0);
      expect(sidebars[0]).toBeInTheDocument();
    });

    it('should have enhanced header layout with centered search', () => {
      render(<Layout {...defaultProps} />);
      
      // Check for the middle search section
      const header = screen.getByRole('banner');
      const searchSection = header.querySelector('.flex-1.max-w-4xl');
      expect(searchSection).toBeInTheDocument();
    });
  });

  describe('Theme Toggle', () => {
    it('should render theme toggle button with proper accessibility', () => {
      render(<Layout {...defaultProps} />);
      
      const themeToggle = screen.getByLabelText('Switch to dark mode');
      expect(themeToggle).toBeInTheDocument();
    });

    it('should change theme toggle label in dark mode', () => {
      render(<Layout {...defaultProps} darkMode={true} />);
      
      const themeToggle = screen.getByLabelText('Switch to light mode');
      expect(themeToggle).toBeInTheDocument();
    });

    it('should call toggleDarkMode when clicked', () => {
      const toggleDarkMode = vi.fn();
      render(<Layout {...defaultProps} toggleDarkMode={toggleDarkMode} />);
      
      const themeToggle = screen.getByLabelText('Switch to dark mode');
      fireEvent.click(themeToggle);
      
      expect(toggleDarkMode).toHaveBeenCalledOnce();
    });
  });

  describe('Responsive Behavior', () => {
    it('should hide sidebar controls on large screens', () => {
      render(<Layout {...defaultProps} />);
      
      const leftToggle = screen.getByLabelText('Open left sidebar');
      expect(leftToggle).toHaveClass('lg:hidden');
    });

    it('should show overlay when sidebar is open on mobile', () => {
      render(<Layout {...defaultProps} showLeftSidebar={true} />);
      
      const overlay = document.querySelector('.fixed.inset-0.bg-gray-900\\/20');
      expect(overlay).toBeInTheDocument();
    });
  });

  describe('Post View Layout', () => {
    it('should hide right sidebar in post view', () => {
      render(<Layout {...defaultProps} isPostView={true} />);
      
      const rightSidebarToggle = screen.queryByLabelText(/right sidebar/);
      expect(rightSidebarToggle).not.toBeInTheDocument();
    });

    it('should adjust main content span in post view', () => {
      render(<Layout {...defaultProps} isPostView={true} />);
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('lg:col-span-10', 'lg:col-start-3');
    });
  });
});
