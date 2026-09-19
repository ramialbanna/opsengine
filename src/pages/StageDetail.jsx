import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Markdown from '@/components/Markdown';
import { ArrowLeft } from 'lucide-react';

function Field({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{value}</dd>
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
        const [depts, stagesAll] = await Promise.all([
          base44.entities.Department.list(),
          base44.entities.Stage.list('number', 100),
        ]);
        const dept = depts.find((d) => d.id === stage.owner_department);
        const next = stagesAll.find((s) => s.id === stage.handoff_to);
        setData({ stage, dept, next });
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

  const { stage, dept, next } = data;

  return (
    <div>
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All stages
      </Link>

      <div className="mt-4 flex items-center gap-3.5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary font-heading text-lg font-bold text-primary-foreground">
          {stage.number}
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{stage.name}</h1>
          <p className="text-sm text-muted-foreground">{dept ? `Owned by ${dept.name}` : 'Owning department not set'}</p>
        </div>
      </div>

      <dl className="mt-6 grid gap-5">
        <Field label="Purpose" value={stage.purpose} />
        <Field label="Entry condition" value={stage.entry_condition} />
        <Field label="What closes it" value={stage.what_closes_it} />
        {next && <Field label="Handoff to" value={`${next.number}. ${next.name}`} />}
        {stage.applies_to_channels && stage.applies_to_channels.length > 0 && (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Applies to channels</dt>
            <dd className="mt-1.5 flex flex-wrap gap-1.5">
              {stage.applies_to_channels.map((c) => (
                <span key={c} className="rounded-md border border-border bg-muted px-2 py-0.5 text-xs">{c}</span>
              ))}
            </dd>
          </div>
        )}
      </dl>

      {stage.detail && (
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Detail</div>
          <Markdown>{stage.detail}</Markdown>
        </div>
      )}
    </div>
  );
}