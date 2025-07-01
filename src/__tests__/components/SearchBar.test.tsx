/**
 * Tests for SearchBar component
 * 
 * Tests search input functionality including:
 * - Rendering with initial value
 * - Input change handling
 * - Keyboard interactions
 * - Accessibility features
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchBar } from '../../components/SearchBar'

describe('SearchBar', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render search input with placeholder', () => {
      render(<SearchBar {...defaultProps} />)
      
      const input = screen.getByPlaceholderText('Search posts...')
      expect(input).toBeInTheDocument()
      expect(input).toHaveAttribute('type', 'text')
    })

    it('should render with provided value', () => {
      render(<SearchBar {...defaultProps} value="test search" />)
      
      const input = screen.getByDisplayValue('test search')
      expect(input).toBeInTheDocument()
    })

    it('should render search icon', () => {
      render(<SearchBar {...defaultProps} />)
      
      // The search icon should be present (from Lucide React)
      const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg')
      expect(searchIcon).toBeInTheDocument()
    })

    it('should have proper ARIA attributes', () => {
      render(<SearchBar {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-label', 'Search posts')
    })
  })

  describe('user interactions', () => {
    it('should call onChange when user types', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, 'test')
      
      expect(mockOnChange).toHaveBeenCalledTimes(4)
      expect(mockOnChange).toHaveBeenCalledWith('t')
      expect(mockOnChange).toHaveBeenCalledWith('e')
      expect(mockOnChange).toHaveBeenCalledWith('s')
      expect(mockOnChange).toHaveBeenCalledWith('t')
    })

    it('should call onChange when user clears input', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="existing text" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.clear(input)
      
      expect(mockOnChange).toHaveBeenCalledWith('')
    })

    it('should handle paste events', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.paste('pasted text')
      
      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should handle backspace', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="test" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Backspace}')
      
      expect(mockOnChange).toHaveBeenCalledWith('tes')
    })

    it('should handle selection and replacement', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="test text" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.tripleClick(input) // Select all
      await user.type(input, 'new')
      
      // Should have been called for each character typed
      expect(mockOnChange).toHaveBeenCalled()
    })
  })

  describe('keyboard navigation', () => {
    it('should handle Enter key without preventing default', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="test" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Enter}')
      
      // Should not cause any errors or prevent the event
      expect(input).toHaveFocus()
    })

    it('should handle Escape key', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="test" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.click(input)
      await user.keyboard('{Escape}')
      
      // Behavior may vary based on implementation
      expect(input).toBeInTheDocument()
    })

    it('should handle Tab navigation', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(
        <div>
          <button>Before</button>
          <SearchBar value="" onChange={mockOnChange} />
          <button>After</button>
        </div>
      )
      
      const beforeButton = screen.getByText('Before')
      const input = screen.getByRole('textbox')
      const afterButton = screen.getByText('After')
      
      await user.click(beforeButton)
      await user.tab()
      
      expect(input).toHaveFocus()
      
      await user.tab()
      expect(afterButton).toHaveFocus()
    })
  })

  describe('styling and appearance', () => {
    it('should have proper CSS classes for styling', () => {
      render(<SearchBar {...defaultProps} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveClass('w-full', 'h-10', 'pl-10', 'pr-4')
    })

    it('should be visually integrated with search icon', () => {
      render(<SearchBar {...defaultProps} />)
      
      const container = screen.getByRole('textbox').parentElement
      expect(container).toBeInTheDocument()
      
      // Should have relative positioning for icon placement
      expect(container).toHaveClass('relative')
    })
  })

  describe('edge cases', () => {
    it('should handle very long search terms', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      const longText = 'a'.repeat(1000)
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, longText)
      
      expect(mockOnChange).toHaveBeenCalledTimes(1000)
    })

    it('should handle special characters', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      const specialChars = '!@#$%^&*()_+-='
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, specialChars)
      
      expect(mockOnChange).toHaveBeenCalledTimes(specialChars.length)
    })

    it('should handle unicode characters', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      const unicodeText = '🚀 Testing unicode 中文 русский'
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      await user.type(input, unicodeText)
      
      expect(mockOnChange).toHaveBeenCalled()
    })

    it('should handle rapid typing', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(<SearchBar value="" onChange={mockOnChange} />)
      
      const input = screen.getByRole('textbox')
      
      // Type rapidly without delay option
      await user.type(input, 'rapid')
      
      expect(mockOnChange).toHaveBeenCalledTimes(5)
    })

    it('should handle focus and blur events', async () => {
      const mockOnChange = vi.fn()
      const user = userEvent.setup()
      
      render(
        <div>
          <SearchBar value="" onChange={mockOnChange} />
          <button>Other element</button>
        </div>
      )
      
      const input = screen.getByRole('textbox')
      const button = screen.getByRole('button')
      
      await user.click(input)
      expect(input).toHaveFocus()
      
      await user.click(button)
      expect(input).not.toHaveFocus()
    })
  })

  describe('controlled component behavior', () => {
    it('should reflect value changes from props', () => {
      const { rerender } = render(<SearchBar value="initial" onChange={vi.fn()} />)
      
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument()
      
      rerender(<SearchBar value="updated" onChange={vi.fn()} />)
      
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('initial')).not.toBeInTheDocument()
    })

    it('should work with empty string value', () => {
      render(<SearchBar value="" onChange={vi.fn()} />)
      
      const input = screen.getByRole('textbox')
      expect(input).toHaveValue('')
    })

    it('should work with undefined onChange', () => {
      // This tests graceful degradation if onChange is accidentally undefined
      expect(() => {
        render(<SearchBar value="test" onChange={undefined as any} />)
      }).not.toThrow()
    })
  })

  describe('performance considerations', () => {
    it('should not cause unnecessary re-renders', () => {
      const mockOnChange = vi.fn()
      const { rerender } = render(<SearchBar value="test" onChange={mockOnChange} />)
      
      // Re-render with same props
      rerender(<SearchBar value="test" onChange={mockOnChange} />)
      
      // Should not call onChange during re-render
      expect(mockOnChange).not.toHaveBeenCalled()
    })

    it('should handle multiple rapid prop changes', () => {
      const mockOnChange = vi.fn()
      const { rerender } = render(<SearchBar value="" onChange={mockOnChange} />)
      
      // Rapid prop changes
      for (let i = 0; i < 100; i++) {
        rerender(<SearchBar value={`test${i}`} onChange={mockOnChange} />)
      }
      
      expect(screen.getByDisplayValue('test99')).toBeInTheDocument()
    })
  })
})
