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
    if (!utterancesDiv) return;
    
    // Clean up any existing content
    utterancesDiv.innerHTML = '';
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    
    // Use the slug as the issue term to ensure comments are tied to the post
    // regardless of the URL structure
    if (slug) {
      script.setAttribute('issue-term', slug);
    } else {
      // Fallback to pathname if no slug is provided
      script.setAttribute('issue-term', 'pathname');
    }
    
    script.setAttribute('theme', theme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Append script to container
    utterancesDiv.appendChild(script);
    
    // Clean up function
    return () => {
      utterancesDiv.innerHTML = '';
    };
  }, [repo, theme, slug, location.pathname]);
  
  return <div ref={containerRef} className="utterances-comments w-full mt-8" />;
}
