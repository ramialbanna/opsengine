import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

export default function Systems() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.System.list(ENTITY_LIMITS.System.sort, ENTITY_LIMITS.System.limit),
      base44.entities.Procedure.list(ENTITY_LIMITS.Procedure.sort, ENTITY_LIMITS.Procedure.limit),
      base44.entities.Stage.list(ENTITY_LIMITS.Stage.sort, ENTITY_LIMITS.Stage.limit),
      base44.entities.Department.list(ENTITY_LIMITS.Department.sort, ENTITY_LIMITS.Department.limit),
    ])
      .then(([systems, procedures, stages, depts]) => {
        const stageMap = {};
        stages.forEach((s) => { stageMap[s.id] = s; });
        const deptMap = {};
        depts.forEach((d) => { deptMap[d.id] = d; });
        const enriched = systems.map((sys) => ({
          ...sys,
          deps: procedures.filter((p) => (p.systems_used || []).includes(sys.id)),
          depts: (sys.departments || []).map((id) => deptMap[id]).filter(Boolean),
        }));
        setData({ systems: enriched, stageMap });
      })
      .catch(() => setData({ systems: [], stageMap: {} }));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Systems</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every system we use, what it is for, who uses it, and the procedures that depend on it.
      </p>

      {data === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : data.systems.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No systems documented yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {data.systems.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-5">
              <h2 className="font-heading text-base font-semibold">{s.name}</h2>
              {s.used_for && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.used_for}</p>}
              {s.who_uses_it && (
                <p className="mt-2 text-sm">
                  <span className="font-medium text-foreground/80">Who uses it:</span>{' '}
                  <span className="text-foreground/90">{s.who_uses_it}</span>
                </p>
              )}
              {s.depts.length > 0 && (
                <p className="mt-1 text-sm">
                  <span className="font-medium text-foreground/80">Departments:</span>{' '}
                  <span className="text-foreground/90">{s.depts.map((d) => d.name).join(', ')}</span>
                </p>
              )}
              {s.notes && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.notes}</p>}
              <div className="mt-3 border-t border-border pt-2.5">
                <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Procedures that depend on it ({s.deps.length})
                </div>
                {s.deps.length === 0 ? (
                  <p className="text-sm text-muted-foreground">None documented.</p>
                ) : (
                  <ul className="space-y-1">
                    {s.deps.map((p) => {
                      const stage = data.stageMap[p.stage];
                      return (
                        <li key={p.id} className="text-sm">
                          <Link to={`/procedures/${p.id}`} className="text-brand hover:underline">{p.title}</Link>
                          {stage && <span className="text-muted-foreground"> · {stage.name}</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}