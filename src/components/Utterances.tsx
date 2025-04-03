import { useEffect, useRef } from 'react';

interface UtterancesProps {
  repo: string;
  theme: string;
  slug?: string; // Added slug as an optional property
}

export function Utterances({ repo, theme }: UtterancesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const utterancesDiv = containerRef.current;
    if (!utterancesDiv) return;
    
    // Clean up any existing content
    utterancesDiv.innerHTML = '';
    
    // Create script element
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.setAttribute('repo', repo);
    script.setAttribute('issue-term', 'pathname');
    script.setAttribute('theme', theme);
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;
    
    // Append script to container
    utterancesDiv.appendChild(script);
    
    // Clean up function
    return () => {
      utterancesDiv.innerHTML = '';
    };
  }, [repo, theme]);
  
  return <div ref={containerRef} className="utterances-comments w-full mt-8" />;
}
