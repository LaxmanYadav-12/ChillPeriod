'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

const MermaidDiagram = ({ chart }) => {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const containerRef = useRef(null);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart) return;

      try {
        // Ensure mermaid is loaded
        if (!window.mermaid) {
            await new Promise((resolve, reject) => {
                const existingScript = document.getElementById('mermaid-script');
                if (existingScript) {
                    if (window.mermaid) resolve();
                    else existingScript.addEventListener('load', resolve);
                } else {
                    const script = document.createElement('script');
                    script.id = 'mermaid-script';
                    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
                    script.async = true;
                    script.onload = () => resolve();
                    script.onerror = (e) => reject(e);
                    document.body.appendChild(script);
                }
            });
        }

        // Initialize if needed (safe to call multiple times with new mermaid versions, or check if initialized)
        // We re-initialize on theme change to update colors
        const mermaidVariables = theme === 'light' ? {
            darkMode: false,
            background: '#FAFBFC',
            primaryColor: '#8b5cf6',
            lineColor: '#D0D7DE',
            textColor: '#1F2937',
            mainBkg: '#FAFBFC',
          } : {
            darkMode: true,
            background: '#0a0a0f',
            primaryColor: '#8b5cf6',
            lineColor: '#2a2a3a',
            textColor: '#ffffff',
            mainBkg: '#0a0a0f',
          };
          
        window.mermaid.initialize({
            startOnLoad: false,
            theme: 'base',
            themeVariables: mermaidVariables,
            fontFamily: 'Outfit, sans-serif',
            securityLevel: 'loose',
        });

        // Unique ID for this render
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Render
        const { svg } = await window.mermaid.render(id, chart);
        setSvg(svg);
        setError(null);

      } catch (err) {
        console.error('Mermaid Render Error:', err);
        setError(err.message);
      }
    };

    renderChart();
  }, [chart, theme]);

  if (error) {
    return (
        <div style={{ color: '#ef4444', padding: '20px', textAlign: 'center', border: '1px dashed #ef4444', borderRadius: '8px' }}>
            <p style={{ fontWeight: 'bold' }}>Diagram Error</p>
            <code style={{ fontSize: '12px' }}>{error}</code>
            <pre style={{ marginTop: '10px', fontSize: '10px', textAlign: 'left', overflow: 'auto' }}>{chart}</pre>
        </div>
    );
  }

  return (
    <div 
        ref={containerRef}
        dangerouslySetInnerHTML={{ __html: svg }} 
        style={{ display: 'flex', justifyContent: 'center', opacity: 0.9, width: '100%' }}
    />
  );
};

export default MermaidDiagram;
