export default function GlossaryTooltip({ term, definition, children }) {
  return (
    <span className="group relative inline-block">
      <span
        tabIndex={0}
        className="cursor-help border-b border-dotted border-brand/60 text-foreground outline-none focus-visible:border-brand"
      >
        {children}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-40 mt-1 hidden w-64 max-w-[80vw] rounded-md border border-border bg-popover p-3 text-left text-xs leading-relaxed text-foreground shadow-lg group-hover:block group-focus-within:block"
      >
        <span className="block font-semibold text-foreground">{term}</span>
        {definition && <span className="mt-1 block text-muted-foreground">{definition}</span>}
      </span>
    </span>
  );
}