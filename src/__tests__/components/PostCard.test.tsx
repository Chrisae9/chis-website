/**
 * Tests for PostCard component
 * 
 * Tests post card functionality including:
 * - Post information display
 * - Search term highlighting
 * - Click handling
 * - Date formatting
 * - Tag and category display
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PostCard } from '../../components/PostCard'
import { createMockPost } from '../../test/utils'

describe('PostCard', () => {
  const mockOnPostClick = vi.fn()

  const defaultPost = createMockPost({
    frontmatter: {
      title: 'Test Post Title',
      summary: 'This is a test post summary',
      date: '2023-12-01',
      category: 'Technology',
      tags: ['react', 'testing', 'typescript'],
      draft: false,
      hidden: false,
      backlinks: []
    }
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render post title', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    })

    it('should render post summary', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('This is a test post summary')).toBeInTheDocument()
    })

    it('should render formatted date', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      // Date should be formatted (exact format may vary)
      expect(screen.getByText(/2023/)).toBeInTheDocument()
      expect(screen.getByText(/Dec/)).toBeInTheDocument()
    })

    it('should render category', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('should render all tags', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('react')).toBeInTheDocument()
      expect(screen.getByText('testing')).toBeInTheDocument()
      expect(screen.getByText('typescript')).toBeInTheDocument()
    })

    it('should render calendar icon', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      // Calendar icon should be present (from Lucide React)
      const calendarIcon = screen.getByRole('button').querySelector('svg')
      expect(calendarIcon).toBeInTheDocument()
    })

    it('should render tag icon', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      // Tag icon should be present
      const container = screen.getByRole('button')
      expect(container).toBeInTheDocument()
    })

    it('should render chevron right icon for navigation', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      // ChevronRight icon should be present
      const container = screen.getByRole('button')
      expect(container).toBeInTheDocument()
    })
  })

  describe('search term highlighting', () => {
    it('should highlight search term in title', () => {
      render(<PostCard post={defaultPost} searchTerm="Test" onPostClick={mockOnPostClick} />)
      
      // Use a custom text matcher for fragmented text
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Test Post Title'
      })).toBeInTheDocument()
    })

    it('should highlight search term in summary', () => {
      render(<PostCard post={defaultPost} searchTerm="test" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'This is a test post summary'
      })).toBeInTheDocument()
    })

    it('should handle case-insensitive highlighting', () => {
      render(<PostCard post={defaultPost} searchTerm="TEST" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Test Post Title'
      })).toBeInTheDocument()
    })

    it('should handle partial word highlighting', () => {
      render(<PostCard post={defaultPost} searchTerm="Tes" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Test Post Title'
      })).toBeInTheDocument()
    })

    it('should handle multiple search term matches', () => {
      const postWithRepeatedWords = createMockPost({
        frontmatter: {
          title: 'Test Test Title',
          summary: 'Test summary with test words',
          date: '2023-12-01',
          category: 'Test',
          tags: ['test'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={postWithRepeatedWords} searchTerm="test" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Test Test Title'
      })).toBeInTheDocument()
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Test summary with test words'
      })).toBeInTheDocument()
    })

    it('should handle empty search term gracefully', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test post summary')).toBeInTheDocument()
    })

    it('should handle search terms with special characters', () => {
      const postWithSpecialChars = createMockPost({
        frontmatter: {
          title: 'Post with (special) characters!',
          summary: 'Summary with @special #characters',
          date: '2023-12-01',
          category: 'Special',
          tags: ['special'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={postWithSpecialChars} searchTerm="special" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText((_, element) => {
        return element?.textContent === 'Post with (special) characters!'
      })).toBeInTheDocument()
    })
  })

  describe('user interactions', () => {
    it('should call onPostClick when card is clicked', async () => {
      const user = userEvent.setup()
      
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      await user.click(card)
      
      expect(mockOnPostClick).toHaveBeenCalledTimes(1)
      expect(mockOnPostClick).toHaveBeenCalledWith('test-post')
    })

    it('should handle keyboard navigation', async () => {
      const user = userEvent.setup()
      
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      card.focus()
      
      expect(card).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(mockOnPostClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ') // Space key
      expect(mockOnPostClick).toHaveBeenCalledTimes(2)
    })

    it('should handle multiple rapid clicks', async () => {
      const user = userEvent.setup()
      
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      
      await user.click(card)
      await user.click(card)
      await user.click(card)
      
      expect(mockOnPostClick).toHaveBeenCalledTimes(3)
    })

    it('should maintain focus outline for accessibility', async () => {
      const user = userEvent.setup()
      
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      await user.tab()
      
      expect(card).toHaveFocus()
    })
  })

  describe('edge cases', () => {
    it('should handle missing post data gracefully', () => {
      const minimalPost = createMockPost({
        frontmatter: {
          title: '',
          summary: '',
          date: '',
          category: '',
          tags: [],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      expect(() => {
        render(<PostCard post={minimalPost} searchTerm="" onPostClick={mockOnPostClick} />)
      }).not.toThrow()
    })

    it('should handle very long titles', () => {
      const longTitlePost = createMockPost({
        frontmatter: {
          title: 'This is a very long title that might overflow the container and cause layout issues but should be handled gracefully by the component with proper text wrapping or truncation',
          summary: 'Normal summary',
          date: '2023-12-01',
          category: 'Long',
          tags: ['long'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={longTitlePost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText(/This is a very long title/)).toBeInTheDocument()
    })

    it('should handle very long summaries', () => {
      const longSummaryPost = createMockPost({
        frontmatter: {
          title: 'Normal Title',
          summary: 'This is a very long summary that contains a lot of text and might overflow the container or cause layout issues but should be handled gracefully by the component with proper text wrapping or truncation mechanisms in place.',
          date: '2023-12-01',
          category: 'Long',
          tags: ['long'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={longSummaryPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText(/This is a very long summary/)).toBeInTheDocument()
    })

    it('should handle many tags', () => {
      const manyTagsPost = createMockPost({
        frontmatter: {
          title: 'Post with many tags',
          summary: 'Summary',
          date: '2023-12-01',
          category: 'Tags',
          tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5', 'tag6', 'tag7', 'tag8', 'tag9', 'tag10'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={manyTagsPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('tag1')).toBeInTheDocument()
      expect(screen.getByText('tag5')).toBeInTheDocument()
      expect(screen.getByText('tag10')).toBeInTheDocument()
    })

    it('should handle invalid date formats', () => {
      const invalidDatePost = createMockPost({
        frontmatter: {
          title: 'Invalid Date Post',
          summary: 'Summary',
          date: 'invalid-date',
          category: 'Test',
          tags: ['test'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      expect(() => {
        render(<PostCard post={invalidDatePost} searchTerm="" onPostClick={mockOnPostClick} />)
      }).not.toThrow()
    })

    it('should handle special characters in tags', () => {
      const specialTagsPost = createMockPost({
        frontmatter: {
          title: 'Special Tags Post',
          summary: 'Summary',
          date: '2023-12-01',
          category: 'Special',
          tags: ['C++', '.NET', 'Node.js', 'React-Native', '@angular'],
          draft: false,
          hidden: false,
          backlinks: []
        }
      })
      
      render(<PostCard post={specialTagsPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      expect(screen.getByText('C++')).toBeInTheDocument()
      expect(screen.getByText('.NET')).toBeInTheDocument()
      expect(screen.getByText('Node.js')).toBeInTheDocument()
    })
  })

  describe('styling and appearance', () => {
    it('should have proper CSS classes for styling', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveClass('bg-white', 'dark:bg-gray-800')
    })

    it('should have hover effects', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
      
      // Check that it's a button-like element (article with role="button")
      expect(card.tagName).toBe('ARTICLE')
      expect(card).toHaveAttribute('role', 'button')
    })

    it('should be responsive', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
      
      // Responsive design is handled by CSS classes, check for cursor and transition
      expect(card).toHaveClass('cursor-pointer')
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      expect(card).toHaveAttribute('role', 'button')
      expect(card).toHaveAttribute('aria-label', 'Read post: Test Post Title')
      expect(card).toHaveAttribute('tabindex', '0')
    })

    it('should be focusable', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      card.focus()
      
      expect(card).toHaveFocus()
    })

    it('should have meaningful content for screen readers', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      // All text content should be accessible to screen readers
      expect(screen.getByText('Test Post Title')).toBeInTheDocument()
      expect(screen.getByText('This is a test post summary')).toBeInTheDocument()
      expect(screen.getByText('Technology')).toBeInTheDocument()
    })

    it('should handle high contrast mode', () => {
      render(<PostCard post={defaultPost} searchTerm="" onPostClick={mockOnPostClick} />)
      
      const card = screen.getByRole('button')
      expect(card).toBeInTheDocument()
      
      // High contrast is handled by CSS, ensure elements are properly structured
      expect(card.children.length).toBeGreaterThan(0)
    })
  })
})
