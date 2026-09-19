import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';
import LoadError from '@/components/LoadError';
import Breadcrumbs from '@/components/Breadcrumbs';

function StageRow({ stage, dept }) {
  const channels = stage.applies_to_channels || [];
  return (
    <Link
      to={`/stages/${stage.number}`}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand hover:bg-accent sm:flex-row sm:items-start sm:gap-5"
    >
      <div className="flex items-center gap-3 sm:w-56 sm:flex-none">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary font-heading text-sm font-bold text-primary-foreground">
          {stage.number}
        </div>
        <div className="min-w-0">
          <div className="font-heading text-base font-semibold leading-tight">{stage.name}</div>
          <div className="mt-0.5 truncate text-xs text-muted-foreground">{dept?.name || 'No owner set'}</div>
        </div>
      </div>
      <div className="mt-3 sm:mt-0 sm:flex-1">
        {stage.purpose ? (
          <p className="text-sm leading-relaxed text-muted-foreground">{stage.purpose}</p>
        ) : (
          <p className="text-sm text-muted-foreground/60">No purpose documented.</p>
        )}
        {channels.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {channels.map((c) => (
              <span key={c} className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function Stages() {
  const [state, setState] = useState('loading');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [stages, depts] = await Promise.all([
          base44.entities.Stage.list(ENTITY_LIMITS.Stage.sort, ENTITY_LIMITS.Stage.limit),
          base44.entities.Department.list(ENTITY_LIMITS.Department.sort, ENTITY_LIMITS.Department.limit),
        ]);
        const deptMap = {};
        depts.forEach((d) => { deptMap[d.id] = d; });
        const sorted = [...stages].sort((a, b) => a.number - b.number);
        setState({ stages: sorted, deptMap });
      } catch {
        setState('error');
      }
    })();
  }, [retryKey]);

  if (state === 'loading') return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  if (state === 'error') {
    return <LoadError backTo="/" backLabel="Home" onRetry={() => { setState('loading'); setRetryKey((k) => k + 1); }} />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'The twelve stages' }]} />
      <h1 className="font-heading text-2xl font-bold tracking-tight">The twelve stages</h1>
      <p className="mt-1 text-sm text-muted-foreground">The full lifecycle, sourcing through post-sale.</p>
      <div className="mt-6 space-y-3">
        {state.stages.map((s) => (
          <StageRow key={s.id} stage={s} dept={state.deptMap[s.owner_department]} />
        ))}
      </div>
    </div>
  );
}