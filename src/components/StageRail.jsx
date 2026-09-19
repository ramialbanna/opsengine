import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

export default function StageRail() {
  const [stages, setStages] = useState(null);
  const [depts, setDepts] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const [stageList, deptList] = await Promise.all([
          base44.entities.Stage.list(ENTITY_LIMITS.Stage.sort, ENTITY_LIMITS.Stage.limit),
          base44.entities.Department.list(ENTITY_LIMITS.Department.sort, ENTITY_LIMITS.Department.limit),
        ]);
        const map = {};
        deptList.forEach((d) => { map[d.id] = d; });
        setDepts(map);
        setStages(stageList.sort((a, b) => a.number - b.number));
      } catch {
        setStages([]);
      }
    })();
  }, []);

  if (stages === null) {
    return <div className="h-24 animate-pulse rounded-lg bg-muted/40" />;
  }
  if (stages.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-6 text-sm text-muted-foreground">
        The twelve lifecycle stages will appear here once they are defined.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2 lg:flex-row lg:gap-3 lg:overflow-x-auto lg:pb-2">
      {stages.map((s) => {
        const dept = depts[s.owner_department];
        return (
          <Link
            key={s.id}
            to={`/stages/${s.number}`}
            className="group flex items-start gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent lg:min-w-[200px] lg:flex-none"
          >
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
              {s.number}
            </div>
            <div className="min-w-0">
              <div className="font-heading text-sm font-semibold leading-tight">{s.name}</div>
              <div className="mt-0.5 truncate text-xs text-muted-foreground">{dept?.name || 'No owner set'}</div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}