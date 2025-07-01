// React imports
import { useState, useEffect } from 'react';

/**
 * Custom hook for managing the application's theme (dark/light mode)
 * 
 * Features:
 * - Persists theme preference in localStorage
 * - Updates document class for CSS styling
 * - Provides toggle function for switching themes
 * 
 * @returns Object containing current theme state and toggle function
 */
export function useTheme() {
  // Initialize state from localStorage or default to light mode
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const storedMode = localStorage.getItem('darkMode');
      return storedMode ? JSON.parse(storedMode) : false;
    } catch {
      // Return default value if localStorage data is invalid
      return false;
    }
  });

  /**
   * Apply theme changes to DOM and persist to localStorage
   */
  useEffect(() => {
    try {
      // Save preference to localStorage
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
    } catch {
      // Silently handle localStorage errors (e.g., quota exceeded)
      console.warn('Failed to save theme preference to localStorage');
    }
    
    // Update document class for CSS styling
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  /**
   * Toggle between dark and light mode
   */
  const toggleDarkMode = () => setDarkMode(!darkMode);

  return { darkMode, toggleDarkMode };
}
