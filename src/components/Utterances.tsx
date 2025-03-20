import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface UtterancesProps {
  repo: string;
  theme: string;
  slug?: string;
}

export function Utterances({ repo, theme, slug }: UtterancesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  useEffect(() => {
    const utterancesDiv = containerRef.current;
    if (!utterancesDiv || !slug) return;
    
    // Clean up any existing content
    utterancesDiv.innerHTML = '';
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    
    // Use title mapping for consistent comment threads
    script.setAttribute('issue-term', 'title');
    script.setAttribute('title', slug);
    
    script.setAttribute('theme', theme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Append script to container
    utterancesDiv.appendChild(script);
    
    // Clean up function
    return () => {
      utterancesDiv.innerHTML = '';
    };
  }, [repo, theme, slug]);
  
  return <div ref={containerRef} className="utterances-comments w-full" />;
}
