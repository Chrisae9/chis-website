/**
 * Tests for useSectionNavigation hook
 * 
 * Tests section navigation functionality including:
 * - Section state management
 * - Connected posts detection
 * - Scroll navigation functions
 * - Section change handling
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useSectionNavigation } from '../../hooks/useSectionNavigation'
import { createMockPost, createMockPosts } from '../../test/utils'
import * as sectionUtils from '../../utils/sectionUtils'

// Mock the sectionUtils module
vi.mock('../../utils/sectionUtils', () => ({
  defaultSectionState: { connected: false, comments: false },
  scrollToSection: vi.fn()
}))

// Mock the postService module
vi.mock('../../services/postService', () => ({
  findReferencingPosts: vi.fn()
}))

describe('useSectionNavigation', () => {
  const mockScrollToSection = vi.mocked(sectionUtils.scrollToSection)
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initial state', () => {
    it('should initialize with default section state when no post selected', () => {
      const { result } = renderHook(() => useSectionNavigation(null, []))
      
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: false
      })
      expect(result.current.hasConnectedPosts).toBe(false)
    })

    it('should reset section state when selectedPost changes', () => {
      const post1 = createMockPost({ slug: 'post-1' })
      const post2 = createMockPost({ slug: 'post-2' })
      const { result, rerender } = renderHook(
        ({ selectedPost, allPosts }) => useSectionNavigation(selectedPost, allPosts),
        {
          initialProps: { selectedPost: post1, allPosts: [post1, post2] }
        }
      )
      
      // Manually set section state
      act(() => {
        result.current.handleSectionChange({ connected: true, comments: false })
      })
      
      expect(result.current.sectionState.connected).toBe(true)
      
      // Change selected post
      rerender({ selectedPost: post2, allPosts: [post1, post2] })
      
      // Section state should reset
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: false
      })
    })
  })

  describe('connected posts detection', () => {
    it('should detect connected posts when post has outgoing backlinks', () => {
      const post = createMockPost({
        frontmatter: {
          backlinks: ['other-post']
        }
      })
      const allPosts = [post]
      
      const { result } = renderHook(() => useSectionNavigation(post, allPosts))
      
      expect(result.current.hasConnectedPosts).toBe(true)
    })

    it('should detect connected posts when post has incoming references', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const targetPost = createMockPost({ slug: 'target-post' })
      const referencingPost = createMockPost({ slug: 'referencing-post' })
      const allPosts = [targetPost, referencingPost]
      
      // Mock that referencingPost references targetPost
      mockFindReferencingPosts.mockReturnValue([referencingPost])
      
      const { result } = renderHook(() => useSectionNavigation(targetPost, allPosts))
      
      expect(result.current.hasConnectedPosts).toBe(true)
      expect(mockFindReferencingPosts).toHaveBeenCalledWith(allPosts, 'target-post')
    })

    it('should detect no connected posts when post has no links', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const post = createMockPost({
        frontmatter: {
          backlinks: []
        }
      })
      const allPosts = [post]
      
      mockFindReferencingPosts.mockReturnValue([])
      
      const { result } = renderHook(() => useSectionNavigation(post, allPosts))
      
      expect(result.current.hasConnectedPosts).toBe(false)
    })

    it('should detect connected posts when post has both outgoing and incoming links', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const post = createMockPost({
        frontmatter: {
          backlinks: ['outgoing-post']
        }
      })
      const referencingPost = createMockPost({ slug: 'incoming-post' })
      const allPosts = [post, referencingPost]
      
      mockFindReferencingPosts.mockReturnValue([referencingPost])
      
      const { result } = renderHook(() => useSectionNavigation(post, allPosts))
      
      expect(result.current.hasConnectedPosts).toBe(true)
    })

    it('should handle empty backlinks array correctly', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const post = createMockPost({
        frontmatter: {
          backlinks: []
        }
      })
      
      mockFindReferencingPosts.mockReturnValue([])
      
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      expect(result.current.hasConnectedPosts).toBe(false)
    })

    it('should handle undefined backlinks correctly', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const post = createMockPost({
        frontmatter: {
          backlinks: undefined as any
        }
      })
      
      mockFindReferencingPosts.mockReturnValue([])
      
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      expect(result.current.hasConnectedPosts).toBe(false)
    })
  })

  describe('scroll navigation functions', () => {
    it('should scroll to connected posts section and update state', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.scrollToConnectedPosts()
      })
      
      expect(mockScrollToSection).toHaveBeenCalledWith('connected-posts')
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: false
      })
    })

    it('should scroll to comments section and update state', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.scrollToComments()
      })
      
      expect(mockScrollToSection).toHaveBeenCalledWith('comments')
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: true
      })
    })

    it('should handle multiple scroll actions correctly', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      // Scroll to connected posts
      act(() => {
        result.current.scrollToConnectedPosts()
      })
      
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: false
      })
      
      // Scroll to comments
      act(() => {
        result.current.scrollToComments()
      })
      
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: true
      })
      
      // Scroll back to connected posts
      act(() => {
        result.current.scrollToConnectedPosts()
      })
      
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: false
      })
    })
  })

  describe('section change handling', () => {
    it('should update section state when handleSectionChange is called', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.handleSectionChange({ connected: true, comments: false })
      })
      
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: false
      })
    })

    it('should handle comments section activation', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.handleSectionChange({ connected: false, comments: true })
      })
      
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: true
      })
    })

    it('should handle both sections being active', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.handleSectionChange({ connected: true, comments: true })
      })
      
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: true
      })
    })

    it('should handle both sections being inactive', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      // First set some active state
      act(() => {
        result.current.handleSectionChange({ connected: true, comments: true })
      })
      
      // Then deactivate both
      act(() => {
        result.current.handleSectionChange({ connected: false, comments: false })
      })
      
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: false
      })
    })

    it('should handle rapid section changes', () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, [post]))
      
      act(() => {
        result.current.handleSectionChange({ connected: true, comments: false })
        result.current.handleSectionChange({ connected: false, comments: true })
        result.current.handleSectionChange({ connected: true, comments: true })
      })
      
      expect(result.current.sectionState).toEqual({
        connected: true,
        comments: true
      })
    })
  })

  describe('edge cases and error handling', () => {
    it('should handle null selectedPost gracefully', () => {
      const { result } = renderHook(() => useSectionNavigation(null, []))
      
      expect(result.current.sectionState).toEqual({
        connected: false,
        comments: false
      })
      expect(result.current.hasConnectedPosts).toBe(false)
      
      // Should not throw when calling scroll functions
      expect(() => {
        act(() => {
          result.current.scrollToConnectedPosts()
          result.current.scrollToComments()
        })
      }).not.toThrow()
    })

    it('should handle empty allPosts array', async () => {
      const post = createMockPost()
      const { result } = renderHook(() => useSectionNavigation(post, []))
      
      expect(result.current.hasConnectedPosts).toBe(false)
    })

    it('should handle large number of posts efficiently', async () => {
      const { findReferencingPosts } = await import('../../services/postService')
      const mockFindReferencingPosts = vi.mocked(findReferencingPosts)
      
      const targetPost = createMockPost({ slug: 'target' })
      const manyPosts = createMockPosts(1000)
      const allPosts = [targetPost, ...manyPosts]
      
      mockFindReferencingPosts.mockReturnValue([])
      
      const { result } = renderHook(() => useSectionNavigation(targetPost, allPosts))
      
      expect(result.current.hasConnectedPosts).toBe(false)
      expect(mockFindReferencingPosts).toHaveBeenCalledWith(allPosts, 'target')
    })
  })
})
