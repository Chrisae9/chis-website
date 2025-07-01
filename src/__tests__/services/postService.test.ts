import { describe, it, expect } from 'vitest'
import { findPostBySlug, extractAllTags, sortPostsByDate, findReferencingPosts } from '../../services/postService'

const createMockPost = (overrides = {}) => ({
  slug: 'test-post',
  title: 'Test Post',
  date: '2023-01-01',
  tags: ['test', 'vitest'],
  category: 'testing',
  content: 'Test content',
  excerpt: 'Test excerpt',
  readingTime: 5,
  image: '',
  frontmatter: {
    title: 'Test Post',
    date: '2023-01-01',
    summary: 'Test excerpt',
    tags: ['test', 'vitest'],
    category: 'testing',
    image: ''
  },
  ...overrides
})

describe('postService utilities', () => {
  describe('findPostBySlug', () => {
    it('should find a post by its slug', () => {
      const posts = [
        createMockPost({ slug: 'first-post' }),
        createMockPost({ slug: 'second-post' })
      ]
      
      const result = findPostBySlug(posts, 'second-post')
      expect(result).toEqual(posts[1])
    })

    it('should return undefined if post not found', () => {
      const posts = [createMockPost({ slug: 'first-post' })]
      
      const result = findPostBySlug(posts, 'nonexistent')
      expect(result).toBeUndefined()
    })
  })

  describe('extractAllTags', () => {
    it('should extract unique tags from posts', () => {
      const posts = [
        createMockPost({ 
          tags: ['test', 'vitest'],
          frontmatter: { 
            title: 'Test Post 1', 
            date: '2023-01-01', 
            summary: 'Test', 
            tags: ['test', 'vitest'], 
            category: 'test', 
            image: '' 
          }
        }),
        createMockPost({ 
          tags: ['react', 'test'],
          frontmatter: { 
            title: 'Test Post 2', 
            date: '2023-01-01', 
            summary: 'Test', 
            tags: ['react', 'test'], 
            category: 'test', 
            image: '' 
          }
        })
      ]
      
      const result = extractAllTags(posts)
      expect(result).toEqual(['test', 'vitest', 'react'])
    })

    it('should handle empty posts array', () => {
      const result = extractAllTags([])
      expect(result).toEqual([])
    })
  })

  describe('sortPostsByDate', () => {
    it('should sort posts by date in descending order', () => {
      const posts = [
        createMockPost({ 
          frontmatter: { title: 'Old', date: '2023-01-01', summary: 'Test', tags: ['test'], category: 'test', image: '' },
          slug: 'old' 
        }),
        createMockPost({ 
          frontmatter: { title: 'New', date: '2023-03-01', summary: 'Test', tags: ['test'], category: 'test', image: '' },
          slug: 'new' 
        }),
        createMockPost({ 
          frontmatter: { title: 'Middle', date: '2023-02-01', summary: 'Test', tags: ['test'], category: 'test', image: '' },
          slug: 'middle' 
        })
      ]
      
      const result = sortPostsByDate(posts)
      expect(result.map(p => p.slug)).toEqual(['new', 'middle', 'old'])
    })
  })

  describe('findReferencingPosts', () => {
    it('should find posts that reference the target post', () => {
      const posts = [
        createMockPost({ 
          slug: 'post1', 
          content: 'Check out [post3](/posts/post3)',
          frontmatter: { 
            title: 'Post 1', 
            date: '2023-01-01', 
            summary: 'Test', 
            tags: ['test'], 
            category: 'test', 
            image: '',
            backlinks: ['post3']
          }
        }),
        createMockPost({ 
          slug: 'post2', 
          content: 'No references here',
          frontmatter: { 
            title: 'Post 2', 
            date: '2023-01-01', 
            summary: 'Test', 
            tags: ['test'], 
            category: 'test', 
            image: ''
          }
        }),
        createMockPost({ 
          slug: 'post3', 
          content: 'Target post',
          frontmatter: { 
            title: 'Post 3', 
            date: '2023-01-01', 
            summary: 'Test', 
            tags: ['test'], 
            category: 'test', 
            image: ''
          }
        })
      ]
      
      const result = findReferencingPosts(posts, 'post3')
      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('post1')
    })

    it('should return empty array if no references found', () => {
      const posts = [
        createMockPost({ slug: 'post1' }),
        createMockPost({ slug: 'post2' })
      ]
      
      const result = findReferencingPosts(posts, 'post3')
      expect(result).toEqual([])
    })
  })
})
