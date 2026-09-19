import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useGlossary } from '@/lib/GlossaryContext';
import GlossaryTooltip from './GlossaryTooltip';

const SKIP_RE = /(`{3}[\s\S]*?`{3})|(`[^`\n]+`)|(\[[^\]]*\]\([^)]*\))/g;

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function annotateSegment(seg, re, map) {
  re.lastIndex = 0;
  let out = '';
  let last = 0;
  let m;
  while ((m = re.exec(seg)) !== null) {
    const term = map[m[0].toLowerCase()];
    if (!term) { re.lastIndex = m.index + 1; continue; }
    if (m.index > last) out += seg.slice(last, m.index);
    out += `[${m[0]}](glossary:${term.id})`;
    last = m.index + m[0].length;
  }
  if (last < seg.length) out += seg.slice(last);
  return out;
}

function annotateMarkdown(md, re, map) {
  SKIP_RE.lastIndex = 0;
  const out = [];
  let last = 0;
  let sm;
  while ((sm = SKIP_RE.exec(md)) !== null) {
    const start = sm.index;
    if (start > last) out.push(annotateSegment(md.slice(last, start), re, map));
    out.push(sm[0]);
    last = start + sm[0].length;
  }
  if (last < md.length) out.push(annotateSegment(md.slice(last), re, map));
  return out.join('');
}

const baseComponents = {
  h1: ({ node, ...p }) => <h1 className="font-heading text-xl font-bold tracking-tight mt-4 mb-2" {...p} />,
  h2: ({ node, ...p }) => <h2 className="font-heading text-lg font-semibold tracking-tight mt-4 mb-2" {...p} />,
  h3: ({ node, ...p }) => <h3 className="font-heading text-base font-semibold mt-3 mb-1.5" {...p} />,
  p: ({ node, ...p }) => <p className="text-sm leading-relaxed text-foreground/90" {...p} />,
  ul: ({ node, ...p }) => <ul className="list-disc pl-5 space-y-1 text-sm leading-relaxed text-foreground/90" {...p} />,
  ol: ({ node, ...p }) => <ol className="list-decimal pl-5 space-y-1 text-sm leading-relaxed text-foreground/90" {...p} />,
  li: ({ node, ...p }) => <li {...p} />,
  strong: ({ node, ...p }) => <strong className="font-semibold text-foreground" {...p} />,
  a: ({ node, ...p }) => <a className="text-brand underline underline-offset-2" {...p} />,
  code: ({ node, ...p }) => <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono" {...p} />,
  blockquote: ({ node, ...p }) => <blockquote className="border-l-2 border-border pl-3 text-muted-foreground" {...p} />,
};

export default function Markdown({ children }) {
  const glossary = useGlossary();
  const terms = glossary?.terms;
  const glossaryFailed = glossary?.status === 'failed';
  const matcher = useMemo(() => {
    if (!terms || !terms.length) return null;
    const map = {};
    terms.forEach((t) => { map[t.term.toLowerCase()] = t; });
    const byId = {};
    terms.forEach((t) => { byId[t.id] = t; });
    const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
    const pattern = sorted.map((t) => escapeRegex(t.term)).join('|');
    return { re: new RegExp(`\\b(?:${pattern})\\b`, 'gi'), map, byId };
  }, [terms]);

  const components = useMemo(() => {
    if (!matcher) return baseComponents;
    const { byId } = matcher;
    return {
      ...baseComponents,
      a: ({ node, href, children: linkChildren, ...p }) => {
        if (typeof href === 'string' && href.startsWith('glossary:')) {
          const term = byId[href.slice('glossary:'.length)];
          if (term) return <GlossaryTooltip term={term.term} definition={term.definition}>{linkChildren}</GlossaryTooltip>;
        }
        return <a className="text-brand underline underline-offset-2" href={href} {...p}>{linkChildren}</a>;
      },
    };
  }, [matcher]);

  const content = useMemo(() => {
    if (!children || !matcher) return children;
    if (typeof children !== 'string') return children;
    return annotateMarkdown(children, matcher.re, matcher.map);
  }, [children, matcher]);

  return (
    <div className="space-y-3">
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
      {glossaryFailed && (
        <p className="text-xs text-muted-foreground/60">Glossary tooltips unavailable.</p>
      )}
    </div>
  );
}