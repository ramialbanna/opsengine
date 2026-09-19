import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Markdown from '@/components/Markdown';
import CustomerStepsFlow from '@/components/CustomerStepsFlow';
import PostSaleFlow from '@/components/PostSaleFlow';
import Breadcrumbs from '@/components/Breadcrumbs';
import ProcedureStatusBadge from '@/components/ProcedureStatusBadge';
import { ArrowLeft, ArrowRight, ChevronRight, Layers, Lock } from 'lucide-react';

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{value}</dd>
    </div>
  );
}

function ChannelBadges({ channels }) {
  if (!channels || channels.length === 0) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Applies to</span>
      {channels.map((c) => (
        <span key={c} className="rounded-full border border-brand/40 bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand">
          {c}
        </span>
      ))}
    </div>
  );
}

function ProcedureItem({ p, roleMap }) {
  const role = roleMap[p.role_responsible];
  return (
    <Link to={`/procedures/${p.id}`} className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent">
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-heading text-sm font-semibold leading-tight">{p.title}</h4>
        <ProcedureStatusBadge status={p.status} />
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {role && <span>Owner: {role.title}</span>}
        {p.trigger && <span className="truncate">Trigger: {p.trigger}</span>}
      </div>
    </Link>
  );
}

function GateItem({ g }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-4 w-4 shrink-0 text-muted-foreground" />
        <h4 className="font-heading text-sm font-semibold leading-tight">{g.name}</h4>
      </div>
      {g.condition_that_opens_it && (
        <p className="mt-2 text-sm leading-relaxed text-foreground/90">{g.condition_that_opens_it}</p>
      )}
      {g.who_decides && (
        <p className="mt-1.5 text-xs text-muted-foreground">Decided by: {g.who_decides}</p>
      )}
    </div>
  );
}

function StageNav({ prev, next }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-2">
      {prev ? (
        <Link to={`/stages/${prev.number}`} className="group flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent">
          <ArrowLeft className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Previous</div>
            <div className="truncate text-sm font-medium">{prev.number}. {prev.name}</div>
          </div>
        </Link>
      ) : <div className="hidden sm:block" />}
      {next ? (
        <Link to={`/stages/${next.number}`} className="group flex items-center justify-end gap-3 rounded-lg border border-border bg-card p-4 text-right transition-colors hover:border-brand hover:bg-accent sm:col-start-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Next</div>
            <div className="truncate text-sm font-medium">{next.number}. {next.name}</div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-brand" />
        </Link>
      ) : <div className="hidden sm:block" />}
    </div>
  );
}

export default function StageDetail() {
  const { number } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const matches = await base44.entities.Stage.filter({ number: Number(number) });
        const stage = matches[0];
        if (!stage) { setNotFound(true); return; }
        const [depts, stagesAll, procedures, gates, roles] = await Promise.all([
          base44.entities.Department.list(),
          base44.entities.Stage.list('number', 100),
          base44.entities.Procedure.list('-updated_date', 200),
          base44.entities.Gate.list('-updated_date', 200),
          base44.entities.Role.list(),
        ]);
        const sorted = stagesAll.sort((a, b) => a.number - b.number);
        const idx = sorted.findIndex((s) => s.id === stage.id);
        const dept = depts.find((d) => d.id === stage.owner_department);
        const handoff = sorted.find((s) => s.id === stage.handoff_to);
        const roleMap = {};
        roles.forEach((r) => { roleMap[r.id] = r; });
        setData({
          stage,
          dept,
          prev: sorted[idx - 1] || null,
          next: sorted[idx + 1] || null,
          handoff,
          procedures: procedures.filter((p) => p.stage === stage.id),
          gates: gates.filter((g) => g.stage === stage.id),
          roleMap,
        });
      } catch {
        setNotFound(true);
      }
    })();
  }, [number]);

  if (notFound) {
    return (
      <div>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All stages
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">Stage {number} has not been defined yet.</p>
      </div>
    );
  }
  if (!data) return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  const { stage, dept, prev, next, handoff, procedures, gates, roleMap } = data;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Stages', to: '/' }, { label: stage.name }]} />

      <div className="mt-4 flex items-start gap-3.5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary font-heading text-lg font-bold text-primary-foreground">
          {stage.number}
        </div>
        <div className="min-w-0">
          <h1 className="font-heading text-2xl font-bold tracking-tight">{stage.name}</h1>
          <p className="text-sm text-muted-foreground">{dept ? `Owned by ${dept.name}` : 'Owning department not set'}</p>
          <ChannelBadges channels={stage.applies_to_channels} />
        </div>
      </div>

      <dl className="mt-6 grid gap-5">
        <Field label="Purpose" value={stage.purpose} />
        <Field label="Entry condition" value={stage.entry_condition} />
        <Field label="What closes it" value={stage.what_closes_it} />
        {handoff && <Field label="Handoff to" value={`${handoff.number}. ${handoff.name}`} />}
      </dl>

      {stage.detail && (
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Detail</div>
          <Markdown>{stage.detail}</Markdown>
        </div>
      )}

      {stage.number === 6 && <CustomerStepsFlow />}
      {stage.number === 12 && <PostSaleFlow />}

      {procedures.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Procedures in this stage
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {procedures.map((p) => <ProcedureItem key={p.id} p={p} roleMap={roleMap} />)}
          </div>
        </section>
      )}

      {gates.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Gates in this stage
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {gates.map((g) => <GateItem key={g.id} g={g} />)}
          </div>
        </section>
      )}

      <StageNav prev={prev} next={next} />
    </div>
  );
}