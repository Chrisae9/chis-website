import React from 'react'
import { useTheme } from '../hooks/useTheme'

/**
 * ThemeProvider component that provides theme context to its children
 * 
 * This component acts as a wrapper that ensures the theme system is initialized
 * and provides theme context to all child components.
 * 
 * @param children - Child components to render within the theme provider
 */
export interface ThemeProviderProps {
  children?: React.ReactNode
}

/**
 * ThemeProvider component that wraps children with theme context
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize the theme hook to ensure theme state is active
  useTheme()

  return <>{children}</>
}

export default ThemeProvider
