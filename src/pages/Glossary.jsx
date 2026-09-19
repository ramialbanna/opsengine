import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import LoadError from '@/components/LoadError';

const CATEGORIES = ['Document', 'Financial', 'Operational', 'System', 'Title', 'Vehicle', 'Auction'];
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export default function Glossary() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    base44.entities.GlossaryTerm.list('term', 500)
      .then((t) => { setItems(t); setError(false); })
      .catch(() => { setError(true); });
  }, [retryKey]);

  const termMap = useMemo(() => {
    const m = {};
    (items || []).forEach((t) => { m[t.id] = t; });
    return m;
  }, [items]);

  const filtered = useMemo(() => {
    if (!items) return null;
    const q = query.trim().toLowerCase();
    return items.filter((t) => {
      if (filter !== 'All' && t.category !== filter) return false;
      if (!q) return true;
      return (
        (t.term || '').toLowerCase().includes(q) ||
        (t.also_known_as || '').toLowerCase().includes(q) ||
        (t.definition || '').toLowerCase().includes(q)
      );
    });
  }, [items, query, filter]);

  const groups = useMemo(() => {
    if (!filtered) return [];
    const map = {};
    filtered.forEach((t) => {
      const first = (t.term || '?').trim()[0]?.toUpperCase() || '#';
      const key = /[A-Z]/.test(first) ? first : '#';
      (map[key] ||= []).push(t);
    });
    return Object.keys(map)
      .sort()
      .map((letter) => ({ letter, terms: map[letter].sort((a, b) => a.term.localeCompare(b.term)) }));
  }, [filtered]);

  const availableLetters = useMemo(() => new Set(groups.map((g) => g.letter)), [groups]);

  if (error) {
    return <LoadError backTo="/" backLabel="Back" onRetry={() => { setError(false); setRetryKey((k) => k + 1); }} />;
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Glossary</h1>
      <p className="mt-1 text-sm text-muted-foreground">Definitions and acronyms used across the operation.</p>

      <div className="relative mt-5 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full rounded-md border border-input bg-card py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {['All', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              filter === c ? 'bg-primary text-primary-foreground' : 'border border-border text-foreground hover:bg-accent'
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered !== null && (
        <div className="sticky top-16 z-20 mt-4 flex flex-wrap gap-0.5 rounded-md border border-border bg-background/90 px-1 py-1.5 backdrop-blur">
          {ALPHABET.map((L) => {
            const enabled = availableLetters.has(L);
            return (
              <a
                key={L}
                href={enabled ? `#letter-${L}` : undefined}
                className={cn(
                  'grid h-7 w-7 place-items-center rounded text-xs font-medium',
                  enabled ? 'text-foreground hover:bg-accent' : 'pointer-events-none text-muted-foreground/40'
                )}
              >
                {L}
              </a>
            );
          })}
        </div>
      )}

      {filtered === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : filtered.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No terms match your search.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map((g) => (
            <section key={g.letter} id={`letter-${g.letter}`} className="scroll-mt-28">
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{g.letter}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {g.terms.map((t) => (
                  <div key={t.id} id={`term-${t.id}`} className="scroll-mt-28 rounded-lg border border-border bg-card p-4">
                    <h3 className="font-heading text-sm font-semibold">{t.term}</h3>
                    {t.also_known_as && <p className="text-xs text-muted-foreground">aka {t.also_known_as}</p>}
                    {t.definition && <p className="mt-2 text-sm leading-relaxed text-foreground/90">{t.definition}</p>}
                    {t.related_terms && t.related_terms.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-border pt-2.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Related:</span>
                        {t.related_terms.map((id) => {
                          const r = termMap[id];
                          if (!r) return null;
                          return (
                            <Link
                              key={id}
                              to={`/glossary#term-${id}`}
                              className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs hover:border-brand hover:bg-accent"
                            >
                              {r.term}
                            </Link>
                          );
                        })}
                      </div>
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