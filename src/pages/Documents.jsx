import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import Markdown from '@/components/Markdown';
import { AlertTriangle, Pin } from 'lucide-react';
import { groupStyleForCode } from '@/lib/scenarioGroups';

const STANDING_RULES = [
  'Black or blue ink only.',
  'No mark-throughs on legal documents — a mistake means a fresh form.',
  'An original lien release must carry an original signature and be dated; a copy is not accepted.',
  'A second signer is added on the form, not on a second form.',
];

const BADGES = [
  { key: 'legal_document', label: 'Legal' },
  { key: 'travels_back_physically', label: 'Original travels back' },
  { key: 'is_universal', label: 'Universal' },
];

function DocCard({ doc, scenarios }) {
  const badges = BADGES.filter((b) => doc[b.key]);
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading text-base font-semibold leading-tight">{doc.name}</h3>
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1">
            {badges.map((b) => (
              <span key={b.key} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{b.label}</span>
            ))}
          </div>
        )}
      </div>
      {doc.what_it_is && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{doc.what_it_is}</p>}
      {doc.when_it_is_collected && (
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground/80">Collected:</span> {doc.when_it_is_collected}
        </p>
      )}
      {doc.completion_rules && (
        <div className="mt-3 border-t border-border pt-2.5">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completion rules</div>
          <Markdown>{doc.completion_rules}</Markdown>
        </div>
      )}
      {scenarios.length > 0 && (
        <div className="mt-3 border-t border-border pt-2.5">
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Required by scenarios</div>
          <div className="flex flex-wrap gap-1.5">
            {scenarios.map((s) => (
              <span key={s.id} title={s.name} className={`rounded-md border px-2 py-0.5 text-xs font-bold ${groupStyleForCode(s.code).badge}`}>{s.code}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Documents() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.DocumentArtifact.list('-updated_date', 500),
      base44.entities.DealScenario.list('code', 200),
    ])
      .then(([docs, scenarios]) => {
        const docScenarios = {};
        scenarios.forEach((s) => {
          const ids = new Set([...(s.initial_submission_set || []), ...(s.final_submission_set || [])]);
          ids.forEach((id) => { (docScenarios[id] ||= new Set()).add(s); });
        });
        setData({
          universal: docs.filter((d) => d.is_universal),
          others: docs.filter((d) => !d.is_universal),
          docScenarios,
        });
      })
      .catch(() => setData({ universal: [], others: [], docScenarios: {} }));
  }, []);

  const scenariosFor = (doc) => {
    const set = data?.docScenarios[doc.id];
    return set ? Array.from(set) : [];
  };

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Document library</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Every document TAV collects, when it is collected, and which deals require it.
      </p>

      <div className="mt-5 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
        <div className="mb-2 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <h2 className="font-heading text-sm font-semibold uppercase tracking-wider text-amber-800 dark:text-amber-300">Standing rules</h2>
        </div>
        <ul className="space-y-1 text-sm leading-relaxed text-foreground/90">
          {STANDING_RULES.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="shrink-0 text-amber-600 dark:text-amber-400">•</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <section className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Pin className="h-4 w-4 text-brand" />
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Required on every deal</h2>
        </div>
        {data === null ? (
          <div className="h-32 animate-pulse rounded-lg bg-muted/40" />
        ) : data.universal.length === 0 ? (
          <p className="text-sm text-muted-foreground">No universal documents have been marked yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.universal.map((d) => <DocCard key={d.id} doc={d} scenarios={scenariosFor(d)} />)}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Scenario-specific documents</h2>
        {data === null ? (
          <div className="h-32 animate-pulse rounded-lg bg-muted/40" />
        ) : data.others.length === 0 ? (
          <p className="text-sm text-muted-foreground">No other documents defined yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.others.map((d) => <DocCard key={d.id} doc={d} scenarios={scenariosFor(d)} />)}
          </div>
        )}
      </section>
    </div>
  );
}