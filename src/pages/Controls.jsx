import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Hand } from 'lucide-react';

const FREQ_ORDER = ['Continuous', 'Multiple times daily', 'Daily', 'Weekly', 'Monthly'];

export default function Controls() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Control.list('name', 200),
      base44.entities.Role.list('title', 200),
    ])
      .then(([controls, roles]) => {
        const roleMap = {};
        roles.forEach((r) => { roleMap[r.id] = r; });
        const groups = {};
        controls.forEach((c) => { (groups[c.frequency || 'Other'] ||= []).push(c); });
        const ordered = FREQ_ORDER.filter((f) => groups[f]).map((f) => ({ frequency: f, controls: groups[f] }));
        Object.keys(groups)
          .filter((f) => !FREQ_ORDER.includes(f))
          .forEach((f) => ordered.push({ frequency: f, controls: groups[f] }));
        setData({ groups: ordered, roleMap });
      })
      .catch(() => setData({ groups: [], roleMap: {} }));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Controls</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every check that runs in the business, grouped by how often it runs.
      </p>

      {data === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : data.groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No controls documented yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {data.groups.map((g) => (
            <section key={g.frequency}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{g.frequency}</h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {g.controls.map((c) => {
                  const owner = data.roleMap[c.owner_role];
                  return (
                    <div key={c.id} className="rounded-lg border border-border bg-card p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-semibold leading-tight">{c.name}</h3>
                        {c.currently_manual && (
                          <span className="inline-flex items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            <Hand className="h-3 w-3" /> Manual
                          </span>
                        )}
                      </div>
                      {c.what_it_checks && <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{c.what_it_checks}</p>}
                      {c.what_it_catches && (
                        <p className="mt-2 text-sm">
                          <span className="font-medium text-foreground/80">Catches:</span>{' '}
                          <span className="text-muted-foreground">{c.what_it_catches}</span>
                        </p>
                      )}
                      {owner && (
                        <p className="mt-1 text-sm">
                          <span className="font-medium text-foreground/80">Owner:</span>{' '}
                          <span className="text-foreground/90">{owner.title}</span>
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}