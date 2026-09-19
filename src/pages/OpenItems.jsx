import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProcedureStatusBadge from '@/components/ProcedureStatusBadge';
import { ClipboardList } from 'lucide-react';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

function missingFields(p) {
  const missing = [];
  if (!p.department) missing.push('Department');
  if (!p.role_responsible) missing.push('Role responsible');
  if (!p.trigger) missing.push('Trigger');
  if (!p.required_actions) missing.push('Required actions');
  if (!p.required_inputs) missing.push('Required documents');
  if (!p.outputs) missing.push('Outcome');
  return missing;
}

export default function OpenItems() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [procedures, departments] = await Promise.all([
          base44.entities.Procedure.list(ENTITY_LIMITS.Procedure.sort, ENTITY_LIMITS.Procedure.limit),
          base44.entities.Department.list(ENTITY_LIMITS.Department.sort, ENTITY_LIMITS.Department.limit),
        ]);
        const deptMap = {};
        departments.forEach((d) => { deptMap[d.id] = d; });
        const open = procedures.filter((p) => p.status !== 'Current');
        const groups = {};
        open.forEach((p) => {
          const key = p.department || '__unassigned';
          if (!groups[key]) groups[key] = { name: deptMap[p.department]?.name || 'Unassigned', items: [] };
          groups[key].items.push(p);
        });
        const groupList = Object.values(groups).sort((a, b) => a.name.localeCompare(b.name));
        setData({ groupList, total: open.length });
      } catch {
        setData({ groupList: [], total: 0 });
      }
    })();
  }, []);

  if (!data) return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Open items' }]} />

      <header className="mb-6 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border bg-card text-brand">
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Open items</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Procedures still being written or reviewed — {data.total} total, grouped by department.
          </p>
        </div>
      </header>

      {data.groupList.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          Everything is marked Current — no open items.
        </div>
      ) : (
        <div className="space-y-6">
          {data.groupList.map((g) => (
            <section key={g.name}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {g.name} · {g.items.length}
              </h2>
              <div className="space-y-2">
                {g.items.map((p) => {
                  const missing = missingFields(p);
                  return (
                    <Link
                      key={p.id}
                      to={`/procedures/${p.id}`}
                      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-heading text-sm font-semibold leading-tight">{p.title}</h3>
                        <ProcedureStatusBadge status={p.status} />
                      </div>
                      {missing.length > 0 ? (
                        <p className="mt-1.5 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">Missing:</span> {missing.join(', ')}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs text-muted-foreground">All fields complete — ready for review.</p>
                      )}
                    </Link>
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