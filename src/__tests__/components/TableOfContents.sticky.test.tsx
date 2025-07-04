import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableOfContents } from '../../components/TableOfContents';

/**
 * Test suite for sticky behavior of TableOfContents component
 * 
 * Tests that the table of contents remains in a fixed position
 * when the user scrolls through the page content.
 */
describe('TableOfContents - Sticky Behavior', () => {
  const mockContent = `
# Main Title

## Section One
Some content here

## Section Two
More content here

### Subsection A
Even more content

## Section Three
Final content
  `;

  beforeEach(() => {
    // Mock window.scrollTo for smooth scrolling tests
    vi.stubGlobal('scrollTo', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should have sticky positioning applied to the table of contents container', () => {
    render(
      <div>
        <TableOfContents content={mockContent} />
      </div>
    );

    // Find the table of contents navigation
    const tocNav = screen.getByRole('navigation', { name: /table of contents/i });
    const tocContainer = tocNav.closest('div');

    // Check that the container has sticky positioning classes
    expect(tocContainer).toHaveClass('sticky');
    expect(tocContainer).toHaveClass('top-4');
  });

  it('should maintain position during scroll events', () => {
    const { container } = render(
      <div>
        <TableOfContents content={mockContent} />
      </div>
    );

    const tocElement = container.querySelector('[class*="sticky"]');
    expect(tocElement).toBeTruthy();

    // Simulate scroll event
    window.dispatchEvent(new Event('scroll'));

    // Element should still be present and sticky after scroll
    expect(tocElement).toBeInTheDocument();
    expect(tocElement).toHaveClass('sticky');
  });

  it('should have appropriate z-index for layering above content', () => {
    render(
      <div>
        <TableOfContents content={mockContent} />
      </div>
    );

    const tocNav = screen.getByRole('navigation', { name: /table of contents/i });
    const tocContainer = tocNav.closest('div');

    // Check that the container has appropriate z-index
    expect(tocContainer).toHaveClass('z-10');
  });
});
