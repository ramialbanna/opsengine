import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

function Row({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="text-foreground/90">{value}</dd>
    </div>
  );
}

function DocList({ label, ids, docMap }) {
  const names = (ids || []).map((id) => docMap[id]?.name).filter(Boolean);
  if (names.length === 0) return null;
  return (
    <div>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <ul className="mt-1 space-y-0.5 text-sm text-foreground/90">
        {names.map((n) => <li key={n}>· {n}</li>)}
      </ul>
    </div>
  );
}

export default function DealScenarios() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.DealScenario.list('code', 200),
      base44.entities.DocumentArtifact.list('-updated_date', 200),
    ])
      .then(([scenarios, docs]) => {
        const docMap = {};
        docs.forEach((d) => { docMap[d.id] = d; });
        setData({ scenarios, docMap });
      })
      .catch(() => setData({ scenarios: [], docMap: {} }));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Deal scenarios</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Find the scenario that matches your deal to see the documents it requires.
      </p>

      {data === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : data.scenarios.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No deal scenarios defined yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.scenarios.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary px-2 font-heading text-xs font-bold text-primary-foreground">
                  {s.code}
                </div>
                <h2 className="font-heading text-base font-semibold leading-tight">{s.name}</h2>
              </div>
              <dl className="mt-3 space-y-1">
                <Row label="Title" value={s.title_status} />
                <Row label="Seller" value={s.seller_capacity} />
                <Row label="Lien method" value={s.lien_satisfaction_method} />
                <Row label="Title-holding state" value={s.title_holding_state} />
                <Row label="Lien release today" value={s.original_lien_release_obtained_today} />
              </dl>
              <div className="mt-3 space-y-3 border-t border-border pt-3">
                <DocList label="Initial submission" ids={s.initial_submission_set} docMap={data.docMap} />
                <DocList label="Final submission" ids={s.final_submission_set} docMap={data.docMap} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}