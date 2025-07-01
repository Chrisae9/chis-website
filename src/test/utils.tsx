/**
 * Test utilities and helpers
 * 
 * Common utilities used across test suites
 */

import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Post } from '../types'

/**
 * Custom render function that includes providers
 */
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

/**
 * Custom render method that includes necessary providers
 * @param ui - The component to render
 * @param options - Additional render options
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  return render(ui, { wrapper: AllTheProviders, ...options })
}

/**
 * Creates a mock post for testing
 * @param overrides - Properties to override in the mock post
 */
export const createMockPost = (overrides: Partial<Post> = {}): Post => {
  const defaultPost: Post = {
    slug: 'test-post',
    content: '# Test Post\n\nThis is a test post content.',
    frontmatter: {
      title: 'Test Post',
      date: '2023-01-01',
      summary: 'A test post for testing purposes',
      tags: ['test', 'example'],
      category: 'Testing',
      draft: false,
      hidden: false,
      backlinks: []
    }
  }

  return {
    ...defaultPost,
    ...overrides,
    frontmatter: {
      ...defaultPost.frontmatter,
      ...(overrides.frontmatter || {})
    }
  }
}

/**
 * Creates multiple mock posts for testing
 * @param count - Number of posts to create
 * @param baseOverrides - Base properties to apply to all posts
 */
export const createMockPosts = (
  count: number, 
  baseOverrides: Partial<Post> = {}
): Post[] => {
  return Array.from({ length: count }, (_, index) => 
    createMockPost({
      ...baseOverrides,
      slug: `test-post-${index + 1}`,
      frontmatter: {
        title: `Test Post ${index + 1}`,
        date: `2023-01-${String(index + 1).padStart(2, '0')}`,
        summary: `Summary for test post ${index + 1}`,
        tags: ['test'],
        backlinks: []
      }
    })
  )
}

/**
 * Mock localStorage for testing
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key])
    },
    get store() {
      return { ...store }
    }
  }
}

/**
 * Waits for a specified amount of time
 * @param ms - Milliseconds to wait
 */
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

/**
 * Mock window resize for responsive tests
 * @param width - New window width
 * @param height - New window height
 */
export const mockWindowResize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  })
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  })
  
  window.dispatchEvent(new Event('resize'))
}

// Re-export everything from testing library
export * from '@testing-library/react'
export { default as userEvent } from '@testing-library/user-event'
