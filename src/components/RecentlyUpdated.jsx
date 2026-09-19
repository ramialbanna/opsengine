import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow } from 'date-fns';

const SOURCES = [
  { entity: 'Stage', typeLabel: 'Stage', title: (r) => r.name, link: (r) => `/stages/${r.number}` },
  { entity: 'Procedure', typeLabel: 'Procedure', title: (r) => r.title, link: (r) => `/procedures/${r.id}` },
  { entity: 'Gate', typeLabel: 'Gate', title: (r) => r.name, link: null },
  { entity: 'Control', typeLabel: 'Control', title: (r) => r.name, link: null },
  { entity: 'Department', typeLabel: 'Department', title: (r) => r.name, link: (r) => `/departments/${r.id}` },
  { entity: 'Role', typeLabel: 'Role', title: (r) => r.title, link: null },
  { entity: 'System', typeLabel: 'System', title: (r) => r.name, link: null },
  { entity: 'Location', typeLabel: 'Location', title: (r) => r.name, link: null },
  { entity: 'GlossaryTerm', typeLabel: 'Glossary term', title: (r) => r.term, link: (r) => `/glossary#term-${r.id}` },
  { entity: 'DealScenario', typeLabel: 'Deal scenario', title: (r) => `${r.code} · ${r.name}`, link: (r) => `/deal-scenarios/${r.code}` },
  { entity: 'DocumentArtifact', typeLabel: 'Document', title: (r) => r.name, link: null },
  { entity: 'TitleState', typeLabel: 'Title state', title: (r) => r.state_name, link: null },
  { entity: 'PaymentInstrument', typeLabel: 'Payment instrument', title: (r) => r.name, link: null },
  { entity: 'FundingAccount', typeLabel: 'Funding account', title: (r) => r.name, link: null },
];

export default function RecentlyUpdated() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    (async () => {
      const results = await Promise.allSettled(
        SOURCES.map(async (s) => {
          const records = await base44.entities[s.entity].list('-updated_date', 5);
          return records.map((r) => ({
            key: r.id + s.typeLabel,
            updated_date: r.updated_date,
            title: s.title(r),
            typeLabel: s.typeLabel,
            link: s.link ? s.link(r) : null,
          }));
        })
      );
      const all = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
      all.sort((a, b) => new Date(b.updated_date) - new Date(a.updated_date));
      setItems(all.slice(0, 10));
    })();
  }, []);

  if (!items) return <div className="h-24 animate-pulse rounded-lg bg-muted/40" />;
  if (items.length === 0) return null;

  return (
    <ul className="divide-y divide-border rounded-lg border border-border bg-card">
      {items.map((it) => (
        <li key={it.key} className="flex items-center justify-between gap-3 px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {it.typeLabel}
            </span>
            {it.link ? (
              <Link to={it.link} className="truncate text-sm font-medium hover:text-brand">{it.title}</Link>
            ) : (
              <span className="truncate text-sm font-medium">{it.title}</span>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground" title={new Date(it.updated_date).toLocaleString()}>
            {formatDistanceToNow(new Date(it.updated_date), { addSuffix: true })}
          </span>
        </li>
      ))}
    </ul>
  );
}