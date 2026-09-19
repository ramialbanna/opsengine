import ReactMarkdown from 'react-markdown';

const components = {
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
  return (
    <div className="space-y-3">
      <ReactMarkdown components={components}>{children || ''}</ReactMarkdown>
    </div>
  );
}