import { useEffect, useState } from 'react';
import { useTheme } from '@/lib/ThemeContext';

let idCounter = 0;

export default function Mermaid({ chart, className }) {
  const { theme } = useTheme();
  const [svg, setSvg] = useState('');

  useEffect(() => {
    let cancelled = false;
    import('mermaid').then((m) => {
      if (cancelled) return;
      const mermaid = m.default;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: theme === 'dark' ? 'dark' : 'default',
        flowchart: { htmlLabels: true, curve: 'basis' },
      });
      const id = `mermaid-${idCounter++}`;
      mermaid
        .render(id, chart)
        .then(({ svg }) => { if (!cancelled) setSvg(svg); })
        .catch(() => { if (!cancelled) setSvg(''); });
    });
    return () => { cancelled = true; };
  }, [chart, theme]);

  if (!svg) return <div className="h-64 animate-pulse rounded-lg bg-muted/40" />;
  return <div className={className} dangerouslySetInnerHTML={{ __html: svg }} />;
}