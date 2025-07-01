/**
 * Tests for useSidebar hook
 * 
 * Tests sidebar state management including:
 * - Initial sidebar states
 * - Responsive behavior on window resize
 * - Mobile sidebar auto-close on desktop breakpoint
 * - State setters functionality
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSidebar } from '../../hooks/useSidebar'
import { mockWindowResize } from '../../test/utils'

describe('useSidebar', () => {
  let originalInnerWidth: number
  let originalInnerHeight: number

  beforeEach(() => {
    // Store original window dimensions
    originalInnerWidth = window.innerWidth
    originalInnerHeight = window.innerHeight
    
    // Start with desktop size by default
    mockWindowResize(1200, 800)
  })

  afterEach(() => {
    // Restore original window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth,
    })
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: originalInnerHeight,
    })
  })

  describe('initial state', () => {
    it('should initialize with both sidebars closed', () => {
      const { result } = renderHook(() => useSidebar())
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })
  })

  describe('sidebar state management', () => {
    it('should allow setting left sidebar visibility', () => {
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(false)
    })

    it('should allow setting right sidebar visibility', () => {
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowRightSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(true)
    })

    it('should allow both sidebars to be open simultaneously', () => {
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
        result.current.setShowRightSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(true)
    })

    it('should allow closing individual sidebars', () => {
      const { result } = renderHook(() => useSidebar())
      
      // Open both sidebars
      act(() => {
        result.current.setShowLeftSidebar(true)
        result.current.setShowRightSidebar(true)
      })
      
      // Close left sidebar
      act(() => {
        result.current.setShowLeftSidebar(false)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(true)
      
      // Close right sidebar
      act(() => {
        result.current.setShowRightSidebar(false)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })
  })

  describe('responsive behavior', () => {
    it('should close mobile sidebars when resizing to desktop width', () => {
      // Start with mobile size and open sidebars
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
        result.current.setShowRightSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(true)
      
      // Resize to desktop (1024px is the lg breakpoint)
      act(() => {
        mockWindowResize(1200, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })

    it('should not close sidebars when already at desktop size', () => {
      // Start with desktop size
      mockWindowResize(1200, 800)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
        result.current.setShowRightSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(true)
      
      // Resize to larger desktop
      act(() => {
        mockWindowResize(1400, 900)
      })
      
      // Sidebars should remain open
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(true)
    })

    it('should not affect closed sidebars on resize', () => {
      // Start with mobile size and closed sidebars
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
      
      // Resize to desktop
      act(() => {
        mockWindowResize(1200, 800)
      })
      
      // Sidebars should remain closed
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })

    it('should handle resize from mobile to tablet to desktop', () => {
      // Start mobile with open sidebars
      mockWindowResize(375, 667)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      
      // Resize to tablet (still mobile)
      act(() => {
        mockWindowResize(768, 1024)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      
      // Resize to desktop
      act(() => {
        mockWindowResize(1024, 768)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
    })

    it('should handle only left sidebar being open during resize', () => {
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
      expect(result.current.showRightSidebar).toBe(false)
      
      act(() => {
        mockWindowResize(1200, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })

    it('should handle only right sidebar being open during resize', () => {
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowRightSidebar(true)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(true)
      
      act(() => {
        mockWindowResize(1200, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
      expect(result.current.showRightSidebar).toBe(false)
    })
  })

  describe('breakpoint edge cases', () => {
    it('should handle exactly 1024px width (breakpoint boundary)', () => {
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      // Resize to exactly 1024px (lg breakpoint)
      act(() => {
        mockWindowResize(1024, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
    })

    it('should not close sidebars when resizing from desktop to slightly smaller desktop', () => {
      mockWindowResize(1400, 900)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      // Resize to smaller but still desktop size
      act(() => {
        mockWindowResize(1200, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(true)
    })

    it('should close sidebars when resizing from desktop to just below breakpoint', () => {
      mockWindowResize(1200, 800)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      // Resize to just below lg breakpoint
      act(() => {
        mockWindowResize(1023, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(true) // Should stay open since we're not going TO desktop
      
      // Then resize back to desktop
      act(() => {
        mockWindowResize(1024, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false) // Should close when going to desktop
    })
  })

  describe('cleanup and lifecycle', () => {
    it('should clean up resize event listener on unmount', () => {
      const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
      
      const { unmount } = renderHook(() => useSidebar())
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      
      unmount()
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
      
      addEventListenerSpy.mockRestore()
      removeEventListenerSpy.mockRestore()
    })

    it('should handle multiple rapid resize events', () => {
      mockWindowResize(768, 600)
      const { result } = renderHook(() => useSidebar())
      
      act(() => {
        result.current.setShowLeftSidebar(true)
      })
      
      // Fire multiple resize events rapidly
      act(() => {
        mockWindowResize(1024, 800)
        mockWindowResize(1025, 800)
        mockWindowResize(1026, 800)
      })
      
      expect(result.current.showLeftSidebar).toBe(false)
    })
  })
})
