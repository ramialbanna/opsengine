import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * @param {{ items: Array<{ label: string; to?: string }> }} props
 */
export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-xs text-muted-foreground print:hidden">
      {items.map((c, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
            {last || !c.to ? (
              <span className="font-medium text-foreground">{c.label}</span>
            ) : (
              <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}