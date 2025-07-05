/**
 * @fileoverview Tests for mobile Table of Contents accessibility and button visibility
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { TableOfContents } from '../../components/TableOfContents';
import { Sidebar } from '../../components/Sidebar';

/**
 * Wrapper component for testing
 */
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <BrowserRouter>{children}</BrowserRouter>;
}

/**
 * Mock data for testing
 */
const mockContent = `
# Main Title

## Prerequisites

Some content here.

## Installation Steps

More content.

### 1. First Step

Details here.

### 2. Second Step

More details.

## Conclusion

Final thoughts.
`;

describe('Mobile TOC Layout', () => {
  let originalInnerWidth: number;
  let originalInnerHeight: number;

  beforeEach(() => {
    // Store original dimensions
    originalInnerWidth = window.innerWidth;
    originalInnerHeight = window.innerHeight;
    
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: 812, writable: true });
    
    // Mock getBoundingClientRect for testing button positions
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      bottom: 700, // Simulate button near bottom
      height: 40,
      left: 0,
      right: 375,
      top: 660,
      width: 375,
      x: 0,
      y: 660,
      toJSON: () => {}
    }));
  });

  afterEach(() => {
    // Restore original dimensions
    Object.defineProperty(window, 'innerWidth', { value: originalInnerWidth, writable: true });
    Object.defineProperty(window, 'innerHeight', { value: originalInnerHeight, writable: true });
  });

  it('should render TOC with action buttons in mobile view', () => {
    const mockProps = {
      darkMode: false,
      toggleDarkMode: vi.fn(),
      showLeftSidebar: true,
      showRightSidebar: false,
      setShowLeftSidebar: vi.fn(),
      setShowRightSidebar: vi.fn(),
      isPostView: true,
      leftSidebar: (
        <Sidebar title="Table of Contents" showMobileHeader={true}>
          <TableOfContents 
            content={mockContent}
            hasConnectedPosts={true}
            onConnectedPostsClick={vi.fn()}
            onCommentsClick={vi.fn()}
          />
        </Sidebar>
      ),
      rightSidebar: null,
      header: null,
      children: <div>Test content</div>
    };

    render(
      <TestWrapper>
        <Layout {...mockProps} />
      </TestWrapper>
    );

    // Verify TOC sections are rendered
    expect(screen.getByText('Prerequisites')).toBeInTheDocument();
    expect(screen.getByText('Installation Steps')).toBeInTheDocument();
    expect(screen.getByText('Conclusion')).toBeInTheDocument();

    // Verify action buttons are rendered
    expect(screen.getByLabelText('Scroll to connected posts section')).toBeInTheDocument();
    expect(screen.getByLabelText('Scroll to comments section')).toBeInTheDocument();
  });

  it('should position mobile sidebar with adequate bottom margin', () => {
    const mockProps = {
      darkMode: false,
      toggleDarkMode: vi.fn(),
      showLeftSidebar: true,
      showRightSidebar: false,
      setShowLeftSidebar: vi.fn(),
      setShowRightSidebar: vi.fn(),
      isPostView: true,
      leftSidebar: (
        <Sidebar title="Table of Contents">
          <TableOfContents content={mockContent} />
        </Sidebar>
      ),
      rightSidebar: null,
      header: null,
      children: <div>Test content</div>
    };

    const { container } = render(
      <TestWrapper>
        <Layout {...mockProps} />
      </TestWrapper>
    );

    // Find the mobile sidebar
    const mobileSidebar = container.querySelector('aside.fixed.bottom-20');
    expect(mobileSidebar).toBeInTheDocument();
    
    // Verify it has proper mobile positioning classes
    expect(mobileSidebar).toHaveClass('fixed', 'bottom-20', 'left-4', 'right-4');
  });

  it('should make action buttons accessible on mobile', () => {
    const onConnectedPostsClick = vi.fn();
    const onCommentsClick = vi.fn();

    const mockProps = {
      darkMode: false,
      toggleDarkMode: vi.fn(),
      showLeftSidebar: true,
      showRightSidebar: false,
      setShowLeftSidebar: vi.fn(),
      setShowRightSidebar: vi.fn(),
      isPostView: true,
      leftSidebar: (
        <Sidebar title="Table of Contents">
          <TableOfContents 
            content={mockContent}
            hasConnectedPosts={true}
            onConnectedPostsClick={onConnectedPostsClick}
            onCommentsClick={onCommentsClick}
          />
        </Sidebar>
      ),
      rightSidebar: null,
      header: null,
      children: <div>Test content</div>
    };

    render(
      <TestWrapper>
        <Layout {...mockProps} />
      </TestWrapper>
    );

    // Test clicking the action buttons
    const connectedPostsButton = screen.getByLabelText('Scroll to connected posts section');
    const commentsButton = screen.getByLabelText('Scroll to comments section');

    fireEvent.click(connectedPostsButton);
    expect(onConnectedPostsClick).toHaveBeenCalledOnce();

    fireEvent.click(commentsButton);
    expect(onCommentsClick).toHaveBeenCalledOnce();
  });

  it('should prevent action buttons from being blocked by mobile browser UI', () => {
    const mockProps = {
      darkMode: false,
      toggleDarkMode: vi.fn(),
      showLeftSidebar: true,
      showRightSidebar: false,
      setShowLeftSidebar: vi.fn(),
      setShowRightSidebar: vi.fn(),
      isPostView: true,
      leftSidebar: (
        <Sidebar title="Table of Contents">
          <TableOfContents 
            content={mockContent}
            hasConnectedPosts={true}
            onConnectedPostsClick={vi.fn()}
            onCommentsClick={vi.fn()}
          />
        </Sidebar>
      ),
      rightSidebar: null,
      header: null,
      children: <div>Test content</div>
    };

    const { container } = render(
      <TestWrapper>
        <Layout {...mockProps} />
      </TestWrapper>
    );

    // Check that the sidebar has enough bottom margin to avoid mobile browser UI
    const mobileSidebar = container.querySelector('aside.fixed');
    
    // The sidebar should not be positioned too close to the bottom
    // This test verifies the styling approach rather than exact pixels
    expect(mobileSidebar).toHaveClass('bottom-20'); // Improved: 80px from bottom
    
    // This provides generous spacing to prevent blocking by mobile browser UI areas
    // and contextual menus while maintaining excellent UX
  });
});
