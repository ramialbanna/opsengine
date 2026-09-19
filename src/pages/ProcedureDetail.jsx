import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Markdown from '@/components/Markdown';
import Breadcrumbs from '@/components/Breadcrumbs';
import { Printer, ArrowLeft } from 'lucide-react';

const STATUS_STYLES = {
  Current: 'text-emerald-700 border-emerald-300 bg-emerald-50 dark:text-emerald-400 dark:border-emerald-900 dark:bg-emerald-950/40',
  Draft: 'text-muted-foreground border-border bg-muted',
  'Needs review': 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-400 dark:border-amber-900 dark:bg-amber-950/40',
};

function Meta({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{children}</dd>
    </div>
  );
}

export default function ProcedureDetail() {
  const { id } = useParams();
  const [state, setState] = useState('loading');

  useEffect(() => {
    (async () => {
      try {
        const proc = await base44.entities.Procedure.get(id);
        const [stages, depts, roles, systems] = await Promise.all([
          base44.entities.Stage.list('number', 100),
          base44.entities.Department.list(),
          base44.entities.Role.list(),
          base44.entities.System.list(),
        ]);
        const stage = stages.find((s) => s.id === proc.stage);
        const dept = depts.find((d) => d.id === proc.department);
        const role = roles.find((r) => r.id === proc.role_responsible);
        const systemMap = {};
        systems.forEach((s) => { systemMap[s.id] = s; });
        setState({ proc, stage, dept, role, systemMap });
      } catch {
        setState('notfound');
      }
    })();
  }, [id]);

  if (state === 'loading') return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  if (state === 'notfound') {
    return (
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">Procedure not found.</p>
      </div>
    );
  }

  const { proc, stage, dept, role, systemMap } = state;

  const crumbs = [
    { label: 'Home', to: '/' },
    { label: 'Stages', to: '/' },
  ];
  if (stage) crumbs.push({ label: stage.name, to: `/stages/${stage.number}` });
  crumbs.push({ label: proc.title });

  const systemsUsed = (proc.systems_used || []).map((sid) => systemMap[sid]).filter(Boolean);

  return (
    <div>
      <Breadcrumbs items={crumbs} />

      <div className="mb-4 flex items-center justify-between gap-3 print:hidden">
        <Link to={stage ? `/stages/${stage.number}` : '/'} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> {stage ? `Back to ${stage.name}` : 'Back'}
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          <Printer className="h-4 w-4" /> Print
        </button>
      </div>

      <article className="print:break-after-page">
        <div className="flex flex-wrap items-center gap-2">
          {proc.status && (
            <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[proc.status] || STATUS_STYLES.Draft}`}>
              {proc.status}
            </span>
          )}
          {proc.source && (
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {proc.source}
            </span>
          )}
        </div>

        <h1 className="mt-2 font-heading text-2xl font-bold tracking-tight">{proc.title}</h1>

        <dl className="mt-5 grid gap-5">
          <Meta label="Department">{dept && dept.name}</Meta>
          <Meta label="Role responsible">{role && role.title}</Meta>
          <Meta label="Trigger">{proc.trigger}</Meta>
        </dl>

        {proc.required_actions && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Required actions</h2>
            <div className="mt-2 rounded-lg border border-border bg-card p-5">
              <Markdown>{proc.required_actions}</Markdown>
            </div>
          </section>
        )}

        {proc.required_inputs && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Required documents</h2>
            <div className="mt-2 rounded-lg border border-border bg-card p-5">
              <Markdown>{proc.required_inputs}</Markdown>
            </div>
          </section>
        )}

        <dl className="mt-6 grid gap-5">
          <Meta label="Outcome">{proc.outputs}</Meta>
          <Meta label="Decision made">{proc.decision_made}</Meta>
        </dl>

        {systemsUsed.length > 0 && (
          <section className="mt-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Systems used</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {systemsUsed.map((s) => (
                <span key={s.id} className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-medium">{s.name}</span>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}