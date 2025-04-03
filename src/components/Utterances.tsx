// React imports
import { useEffect, useRef } from 'react';

/**
 * Props for the Utterances component
 */
interface UtterancesProps {
  /** GitHub repository in format 'owner/repo' where comments are stored as issues */
  repo: string;
  /** Theme name for Utterances ('github-light', 'github-dark', etc.) */
  theme: string;
  /** Optional slug for the current post to use instead of pathname */
  slug?: string;
}

/**
 * Renders a comments section powered by Utterances (GitHub issues-based comments)
 * 
 * This component dynamically loads the Utterances script and configures it
 * to use the current page path as the issue identifier.
 * 
 * @see https://utteranc.es/ for more documentation on Utterances
 * 
 * @param props - Component properties
 * @returns React component
 */
export function Utterances({ repo, theme }: UtterancesProps) {
  // Reference to the container div for the Utterances script
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const utterancesDiv = containerRef.current;
    if (!utterancesDiv) return;
    
    // Clean up any existing content
    utterancesDiv.innerHTML = '';
    
    // Create script element for Utterances
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', theme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Append script to container to initialize Utterances
    utterancesDiv.appendChild(script);
    
    // Clean up function to remove script when component unmounts
    return () => {
      utterancesDiv.innerHTML = '';
    };
  }, [repo, theme]); // Re-run when repo or theme changes
  
  return <div ref={containerRef} className="utterances-comments w-full mt-8" aria-label="Comments section" />;
}
