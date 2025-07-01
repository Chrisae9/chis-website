/**
 * Tests for useTheme hook
 * 
 * Tests theme management functionality including:
 * - Initial theme state from localStorage
 * - Theme persistence
 * - DOM class updates
 * - Toggle functionality
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTheme } from '../../hooks/useTheme'
import { mockLocalStorage } from '../../test/utils'

describe('useTheme', () => {
  let mockStorage: ReturnType<typeof mockLocalStorage>

  beforeEach(() => {
    // Reset DOM classes
    document.documentElement.classList.remove('dark')
    
    // Mock localStorage
    mockStorage = mockLocalStorage()
    vi.stubGlobal('localStorage', mockStorage)
  })

  describe('initial state', () => {
    it('should default to light mode when no stored preference exists', () => {
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should load dark mode from localStorage when stored', () => {
      mockStorage.setItem('darkMode', JSON.stringify(true))
      
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should load light mode from localStorage when stored', () => {
      mockStorage.setItem('darkMode', JSON.stringify(false))
      
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should handle invalid localStorage data gracefully', () => {
      mockStorage.setItem('darkMode', 'invalid-json')
      
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('theme toggling', () => {
    it('should toggle from light to dark mode', () => {
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(false)
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(result.current.darkMode).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(mockStorage.getItem('darkMode')).toBe('true')
    })

    it('should toggle from dark to light mode', () => {
      mockStorage.setItem('darkMode', JSON.stringify(true))
      const { result } = renderHook(() => useTheme())
      
      expect(result.current.darkMode).toBe(true)
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(result.current.darkMode).toBe(false)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
      expect(mockStorage.getItem('darkMode')).toBe('false')
    })

    it('should toggle multiple times correctly', () => {
      const { result } = renderHook(() => useTheme())
      
      // Start in light mode
      expect(result.current.darkMode).toBe(false)
      
      // Toggle to dark
      act(() => {
        result.current.toggleDarkMode()
      })
      expect(result.current.darkMode).toBe(true)
      
      // Toggle back to light
      act(() => {
        result.current.toggleDarkMode()
      })
      expect(result.current.darkMode).toBe(false)
      
      // Toggle to dark again
      act(() => {
        result.current.toggleDarkMode()
      })
      expect(result.current.darkMode).toBe(true)
    })
  })

  describe('DOM class management', () => {
    it('should add dark class to document element when dark mode is enabled', () => {
      const { result } = renderHook(() => useTheme())
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove dark class from document element when dark mode is disabled', () => {
      // Start with dark mode
      mockStorage.setItem('darkMode', JSON.stringify(true))
      const { result } = renderHook(() => useTheme())
      
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })
  })

  describe('localStorage persistence', () => {
    it('should persist theme preference to localStorage on change', () => {
      const { result } = renderHook(() => useTheme())
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(mockStorage.getItem('darkMode')).toBe('true')
      
      act(() => {
        result.current.toggleDarkMode()
      })
      
      expect(mockStorage.getItem('darkMode')).toBe('false')
    })

    it('should handle localStorage setItem errors gracefully', () => {
      // Mock localStorage to throw an error
      const originalSetItem = mockStorage.setItem
      mockStorage.setItem = vi.fn().mockImplementation(() => {
        throw new Error('localStorage full')
      })
      vi.stubGlobal('localStorage', mockStorage)
      
      const { result } = renderHook(() => useTheme())
      
      // Should not throw error when localStorage fails
      expect(() => {
        act(() => {
          result.current.toggleDarkMode()
        })
      }).not.toThrow()
      
      // Restore original implementation
      mockStorage.setItem = originalSetItem
    })
  })

  describe('edge cases', () => {
    it('should handle rapid successive toggles', () => {
      const { result } = renderHook(() => useTheme())
      
      // Rapid toggles
      act(() => {
        result.current.toggleDarkMode()
        result.current.toggleDarkMode()
        result.current.toggleDarkMode()
      })
      
      expect(result.current.darkMode).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
      expect(mockStorage.getItem('darkMode')).toBe('true')
    })

    it('should maintain state across hook unmount and remount', () => {
      // First hook instance
      const { result: result1, unmount } = renderHook(() => useTheme())
      
      act(() => {
        result1.current.toggleDarkMode()
      })
      
      expect(result1.current.darkMode).toBe(true)
      
      // Unmount first instance
      unmount()
      
      // Mount new instance - should load from localStorage
      const { result: result2 } = renderHook(() => useTheme())
      
      expect(result2.current.darkMode).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })
  })
})
