import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Document', 'Financial', 'Operational', 'System', 'Title', 'Vehicle', 'Auction'];

export default function Glossary() {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    base44.entities.GlossaryTerm.list('term', 500).then(setItems).catch(() => setItems([]));
  }, []);

  const filtered = items ? items.filter((g) => filter === 'All' || g.category === filter) : null;
  const groups = CATEGORIES
    .map((c) => ({ category: c, terms: filtered ? filtered.filter((g) => g.category === c) : [] }))
    .filter((g) => g.terms.length > 0);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Glossary</h1>
      <p className="mt-1 text-sm text-muted-foreground">Definitions and acronyms used across the operation.</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              filter === c
                ? 'bg-primary text-primary-foreground'
                : 'border border-border text-foreground hover:bg-accent'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No terms defined yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((g) => (
            <section key={g.category}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {g.category}
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {g.terms.map((t) => (
                  <div key={t.id} className="rounded-lg border border-border bg-card p-4">
                    <h3 className="font-heading text-sm font-semibold">{t.term}</h3>
                    {t.also_known_as && (
                      <p className="text-xs text-muted-foreground">aka {t.also_known_as}</p>
                    )}
                    {t.definition && (
                      <p className="mt-2 text-sm leading-relaxed text-foreground/90">{t.definition}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}