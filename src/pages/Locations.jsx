import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { MapPin } from 'lucide-react';

function LocCard({ loc, retired }) {
  return (
    <div className={retired ? 'rounded-lg border border-dashed border-border bg-muted/30 p-5' : 'rounded-lg border border-border bg-card p-5'}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-semibold leading-tight">{loc.name}</h3>
        {retired && (
          <span className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">Retired</span>
        )}
      </div>
      {loc.aliases && <p className="mt-1 text-xs text-muted-foreground">aka {loc.aliases}</p>}
      {loc.address && (
        <p className="mt-2 flex items-start gap-1.5 text-sm text-foreground/90">
          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          {loc.address}
        </p>
      )}
      {loc.what_happens_there && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{loc.what_happens_there}</p>}
    </div>
  );
}

export default function Locations() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Location.list('name', 200).then(setItems).catch(() => setItems([]));
  }, []);

  const active = items ? items.filter((l) => l.active !== false) : null;
  const retired = items ? items.filter((l) => l.active === false) : null;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Locations</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Our sites and what happens at each — including retired names that still appear on older paperwork.
      </p>

      {items === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : active.length === 0 && retired.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No locations documented yet.</p>
      ) : (
        <>
          {active.length > 0 && (
            <section className="mt-6">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Active sites</h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {active.map((l) => <LocCard key={l.id} loc={l} />)}
              </div>
            </section>
          )}
          {retired.length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Retired / legacy names</h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {retired.map((l) => <LocCard key={l.id} loc={l} retired />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}