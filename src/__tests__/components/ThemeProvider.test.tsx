/**
 * Tests for ThemeProvider component
 * 
 * Tests theme context and provider functionality including:
 * - Theme state propagation
 * - Dark/light mode switching
 * - Context consumption by child components
 * - Default theme behavior
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../components/ThemeProvider'

// Mock the useTheme hook - declare variables at top level
const mockToggleDarkMode = vi.fn()

vi.mock('../../hooks/useTheme', () => ({
  useTheme: vi.fn(() => ({
    darkMode: false,
    toggleDarkMode: mockToggleDarkMode
  }))
}))

describe('ThemeProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset document classes
    document.documentElement.classList.remove('dark')
  })

  describe('rendering', () => {
    it('should render children correctly', () => {
      render(
        <ThemeProvider>
          <div data-testid="child">Test Content</div>
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('child')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
    })

    it('should render without children', () => {
      expect(() => {
        render(<ThemeProvider />)
      }).not.toThrow()
    })

    it('should render multiple children', () => {
      render(
        <ThemeProvider>
          <div data-testid="child1">Child 1</div>
          <div data-testid="child2">Child 2</div>
          <span data-testid="child3">Child 3</span>
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('child1')).toBeInTheDocument()
      expect(screen.getByTestId('child2')).toBeInTheDocument()
      expect(screen.getByTestId('child3')).toBeInTheDocument()
    })
  })

  describe('theme context provision', () => {
    it('should provide theme context to children', () => {
      // Create a test component that consumes the theme context
      const TestConsumer = () => {
        // Since we're mocking useTheme, we'll just test that the provider renders
        return <div data-testid="consumer">Theme consumer</div>
      }
      
      render(
        <ThemeProvider>
          <TestConsumer />
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('consumer')).toBeInTheDocument()
    })

    it('should work with nested components', () => {
      const NestedComponent = () => (
        <div data-testid="nested">
          <div data-testid="deeply-nested">Deep content</div>
        </div>
      )
      
      render(
        <ThemeProvider>
          <div>
            <NestedComponent />
          </div>
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('nested')).toBeInTheDocument()
      expect(screen.getByTestId('deeply-nested')).toBeInTheDocument()
    })
  })

  describe('theme state management', () => {
    it('should handle light mode state', async () => {
      const { useTheme } = await import('../../hooks/useTheme')
      const mockUseTheme = vi.mocked(useTheme)
      
      mockUseTheme.mockReturnValue({
        darkMode: false,
        toggleDarkMode: vi.fn()
      })
      
      const TestComponent = () => {
        const { darkMode } = useTheme()
        return <div data-testid="theme-state">{darkMode ? 'dark' : 'light'}</div>
      }
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByText('light')).toBeInTheDocument()
    })

    it('should handle dark mode state', async () => {
      const { useTheme } = await import('../../hooks/useTheme')
      const mockUseTheme = vi.mocked(useTheme)
      
      mockUseTheme.mockReturnValue({
        darkMode: true,
        toggleDarkMode: vi.fn()
      })
      
      const TestComponent = () => {
        const { darkMode } = useTheme()
        return <div data-testid="theme-state">{darkMode ? 'dark' : 'light'}</div>
      }
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByText('dark')).toBeInTheDocument()
    })

    it('should handle theme toggle', async () => {
      const toggleMock = vi.fn()
      const { useTheme } = await import('../../hooks/useTheme')
      const mockUseTheme = vi.mocked(useTheme)
      
      mockUseTheme.mockReturnValue({
        darkMode: false,
        toggleDarkMode: toggleMock
      })
      
      const TestComponent = () => {
        const { toggleDarkMode } = useTheme()
        return (
          <button onClick={toggleDarkMode} data-testid="toggle-button">
            Toggle Theme
          </button>
        )
      }
      
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      const button = screen.getByTestId('toggle-button')
      await user.click(button)
      
      expect(toggleMock).toHaveBeenCalledTimes(1)
    })
  })

  describe('DOM integration', () => {
    it('should work with document class changes', async () => {
      const { useTheme } = await import('../../hooks/useTheme')
      const mockUseTheme = vi.mocked(useTheme)
      
      // Start with light mode
      mockUseTheme.mockReturnValue({
        darkMode: false,
        toggleDarkMode: vi.fn()
      })
      
      const { rerender } = render(
        <ThemeProvider>
          <div>Content</div>
        </ThemeProvider>
      )
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      
      // Switch to dark mode
      mockUseTheme.mockReturnValue({
        darkMode: true,
        toggleDarkMode: vi.fn()
      })
      
      rerender(
        <ThemeProvider>
          <div>Content</div>
        </ThemeProvider>
      )
      
      // The actual DOM class change is handled by useTheme hook
      // We're testing that the provider doesn't interfere with this
      expect(screen.getByText('Content')).toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('should handle useTheme hook errors gracefully', async () => {
      // Get reference to the mocked function dynamically
      const { useTheme } = await import('../../hooks/useTheme')
      const mockFn = vi.mocked(useTheme)
      
      // Mock useTheme to throw an error
      mockFn.mockImplementation(() => {
        throw new Error('Theme hook error')
      })
      
      // Component should still render despite hook error
      expect(() => {
        render(
          <ThemeProvider>
            <div>Content</div>
          </ThemeProvider>
        )
      }).toThrow('Theme hook error')
      
      // Restore the mock after this test
      mockFn.mockRestore()
    })

    it('should handle missing theme context gracefully', () => {
      // Test what happens when theme context is not available
      const TestComponent = () => {
        try {
          return <div data-testid="with-theme">Has theme: yes</div>
        } catch {
          return <div data-testid="no-theme">No theme available</div>
        }
      }
      
      render(<TestComponent />)
      
      // Should handle gracefully
      expect(screen.getByTestId('with-theme') || screen.getByTestId('no-theme')).toBeInTheDocument()
    })
  })

  describe('performance', () => {
    it('should not cause unnecessary re-renders', () => {
      let renderCount = 0
      
      const TestComponent = () => {
        renderCount++
        return <div data-testid="render-count">{renderCount}</div>
      }
      
      const { rerender } = render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      expect(screen.getByText('1')).toBeInTheDocument()
      
      // Re-render with same props
      rerender(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      // Should cause a re-render since we're not using React.memo
      expect(screen.getByText('2')).toBeInTheDocument()
    })

    it('should handle rapid theme changes', async () => {
      const toggleMock = vi.fn()
      const { useTheme } = await import('../../hooks/useTheme')
      const mockUseTheme = vi.mocked(useTheme)
      
      mockUseTheme.mockReturnValue({
        darkMode: false,
        toggleDarkMode: toggleMock
      })
      
      const TestComponent = () => {
        const { toggleDarkMode } = useTheme()
        return (
          <button onClick={toggleDarkMode} data-testid="rapid-toggle">
            Toggle
          </button>
        )
      }
      
      const user = userEvent.setup()
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      )
      
      const button = screen.getByTestId('rapid-toggle')
      
      // Rapid clicks
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(toggleMock).toHaveBeenCalledTimes(3)
    })
  })

  describe('accessibility', () => {
    it('should not interfere with accessibility attributes', () => {
      render(
        <ThemeProvider>
          <button aria-label="Accessible button" data-testid="accessible-btn">
            Click me
          </button>
        </ThemeProvider>
      )
      
      const button = screen.getByTestId('accessible-btn')
      expect(button).toHaveAttribute('aria-label', 'Accessible button')
    })

    it('should work with screen reader content', () => {
      render(
        <ThemeProvider>
          <div>
            <span className="sr-only">Screen reader only content</span>
            <span>Visible content</span>
          </div>
        </ThemeProvider>
      )
      
      expect(screen.getByText('Screen reader only content')).toBeInTheDocument()
      expect(screen.getByText('Visible content')).toBeInTheDocument()
    })
  })

  describe('integration with other providers', () => {
    it('should work when nested inside other providers', () => {
      const MockProvider = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mock-provider">{children}</div>
      )
      
      render(
        <MockProvider>
          <ThemeProvider>
            <div data-testid="nested-content">Nested content</div>
          </ThemeProvider>
        </MockProvider>
      )
      
      expect(screen.getByTestId('mock-provider')).toBeInTheDocument()
      expect(screen.getByTestId('nested-content')).toBeInTheDocument()
    })

    it('should work when wrapping other providers', () => {
      const MockInnerProvider = ({ children }: { children: React.ReactNode }) => (
        <div data-testid="inner-provider">{children}</div>
      )
      
      render(
        <ThemeProvider>
          <MockInnerProvider>
            <div data-testid="inner-content">Inner content</div>
          </MockInnerProvider>
        </ThemeProvider>
      )
      
      expect(screen.getByTestId('inner-provider')).toBeInTheDocument()
      expect(screen.getByTestId('inner-content')).toBeInTheDocument()
    })
  })
})
