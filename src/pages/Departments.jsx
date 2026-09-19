import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Building2 } from 'lucide-react';

export default function Departments() {
  const [items, setItems] = useState(null);

  useEffect(() => {
    base44.entities.Department.list('sort_order', 200).then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Departments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Purpose, ownership, and what each department is accountable for.
      </p>

      {items === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : items.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No departments defined yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((d) => (
            <div key={d.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background text-brand">
                  <Building2 className="h-[18px] w-[18px]" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold leading-tight">{d.name}</h2>
                  {d.short_description && <p className="text-xs text-muted-foreground">{d.short_description}</p>}
                </div>
              </div>
              {d.purpose && (
                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Purpose</div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{d.purpose}</p>
                </div>
              )}
              {d.what_it_owns && (
                <div className="mt-3">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns</div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/90">{d.what_it_owns}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}