import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/lib/ThemeContext';

let idCounter = 0;

export default function Mermaid({ chart, className }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: theme === 'dark' ? 'dark' : 'default',
      flowchart: { htmlLabels: true, curve: 'basis' },
    });
    const id = `mermaid-${idCounter++}`;
    mermaid
      .render(id, chart)
      .then(({ svg }) => { if (!cancelled) setSvg(svg); })
      .catch(() => { if (!cancelled) setSvg(''); });
    return () => { cancelled = true; };
  }, [chart, theme]);

  if (!svg) return <div className="h-64 animate-pulse rounded-lg bg-muted/40" />;
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}