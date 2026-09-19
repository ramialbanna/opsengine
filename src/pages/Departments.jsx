import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Building2 } from 'lucide-react';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

function DeptCard({ d, stages }) {
  return (
    <Link
      to={`/departments/${d.id}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand hover:bg-accent"
    >
      <div className="flex items-center gap-2.5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-border bg-background text-brand">
          <Building2 className="h-[18px] w-[18px]" />
        </div>
        <h3 className="font-heading text-base font-semibold leading-tight">{d.name}</h3>
      </div>
      {d.short_description && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.short_description}</p>}
      <div className="mt-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Owns stages</div>
        {stages && stages.length > 0 ? (
          <ul className="mt-1.5 space-y-1">
            {stages.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-sm">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded bg-muted text-[11px] font-bold text-foreground/80">{s.number}</span>
                <span className="truncate">{s.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-muted-foreground">No stages owned.</p>
        )}
      </div>
    </Link>
  );
}

export default function Departments() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Department.list(ENTITY_LIMITS.Department.sort, ENTITY_LIMITS.Department.limit),
      base44.entities.Stage.list(ENTITY_LIMITS.Stage.sort, ENTITY_LIMITS.Stage.limit),
    ])
      .then(([depts, stages]) => {
        const stagesByDept = {};
        stages.forEach((s) => {
          (stagesByDept[s.owner_department] ||= []).push(s);
        });
        const byId = {};
        depts.forEach((d) => { byId[d.id] = d; });
        const topLevel = depts.filter((d) => !d.parent_department || !byId[d.parent_department]);
        const groups = topLevel.map((t) => ({
          head: t,
          members: depts.filter((d) => d.parent_department === t.id && d.id !== t.id),
        }));
        setData({ groups, stagesByDept });
      })
      .catch(() => setData({ groups: [], stagesByDept: {} }));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Departments</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Purpose, ownership, and the stages each department is accountable for.
      </p>

      {data === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : data.groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No departments defined yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {data.groups.map((g, i) => (
            <section key={g.head.id} className={i === 0 ? '' : 'mt-8'}>
              {g.members.length > 0 && (
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {g.head.name}
                </h2>
              )}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DeptCard d={g.head} stages={data.stagesByDept[g.head.id]} />
                {g.members.map((c) => (
                  <DeptCard key={c.id} d={c} stages={data.stagesByDept[c.id]} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}