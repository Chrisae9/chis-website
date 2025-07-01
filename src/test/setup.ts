/**
 * Test setup file
 * 
 * This file is loaded before each test suite and configures the testing environment
 */

import '@testing-library/jest-dom'
import { Buffer } from 'buffer'

// Make Buffer available globally for markdown processing libraries (same as main.tsx)
global.Buffer = Buffer

// Mock window.matchMedia for responsive design tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock scrollTo for navigation tests
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: () => {},
})

// Mock localStorage
const localStorageMock = {
  getItem: (key: string) => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
})

// Mock IntersectionObserver for Table of Contents tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  disconnect() {}
  unobserve() {}
}

// Reset all mocks after each test
import { afterEach } from 'vitest'
afterEach(() => {
  // Reset localStorage
  localStorageMock.getItem = () => null
  localStorageMock.setItem = () => {}
  localStorageMock.removeItem = () => {}
  localStorageMock.clear = () => {}
})
