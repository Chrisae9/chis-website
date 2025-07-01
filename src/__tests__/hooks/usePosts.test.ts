import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { usePosts } from '../../hooks/usePosts'

// Mock the postService module
vi.mock('../../services/postService', () => ({
  loadPosts: vi.fn(),
  findPostBySlug: vi.fn(),
  extractAllTags: vi.fn(),
  extractAllCategories: vi.fn(),
  sortPostsByDate: vi.fn(),
  findReferencingPosts: vi.fn()
}))

// Mock the routeUtils module
vi.mock('../../utils/routeUtils', () => ({
  createInternalUrl: vi.fn(),
  normalizeSlug: vi.fn()
}))

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
    useParams: vi.fn(() => ({}))
  }
})

// Mock Fuse.js
vi.mock('fuse.js', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      search: vi.fn().mockReturnValue([])
    }))
  }
})

const renderHookWithRouter = (hook: any) => {
  return renderHook(hook, {
    wrapper: ({ children }: { children: React.ReactNode }) => {
      return React.createElement(BrowserRouter, null, children)
    }
  })
}

// Type for the hook result to avoid TypeScript issues
type UsePostsResult = ReturnType<typeof usePosts>

describe('usePosts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should initialize with loading state', async () => {
    const { result } = renderHookWithRouter(() => usePosts())
    
    expect((result.current as UsePostsResult).isLoading).toBe(true)
    expect((result.current as UsePostsResult).posts).toEqual([])
    expect((result.current as UsePostsResult).error).toBeNull()
  })

  it('should update search term', async () => {
    const { result } = renderHookWithRouter(() => usePosts())
    
    act(() => {
      (result.current as UsePostsResult).setSearchTerm('test search')
    })
    
    expect((result.current as UsePostsResult).searchTerm).toBe('test search')
  })
})
