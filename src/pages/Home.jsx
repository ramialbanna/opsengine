import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import StageRail from '@/components/StageRail';
import Mermaid from '@/components/Mermaid';
import RecentlyUpdated from '@/components/RecentlyUpdated';
import { Building2, FileText, BookText, ArrowRight } from 'lucide-react';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

function buildFlowchart(stages) {
  const safeLabel = (name) => String(name ?? '').replace(/"/g, '&quot;').replace(/[\]\[<>|#]/g, '');
  const sorted = [...stages].sort((a, b) => a.number - b.number);
  const nodes = sorted.map((s) => `    S${s.number}["${s.number} · ${safeLabel(s.name)}"]`).join('\n');
  const mainChainStages = sorted.filter((s) => s.number !== 4 && s.number !== 10);
  const mainChain = mainChainStages.map((s) => `S${s.number}`).join(' --> ');
  return `flowchart TD
    D[Dealer]
    A[Auction]
    C[Consignment]
    CO[Consumer]
    D --> S1
    A --> S1
    C --> S1
    CO --> S1
${nodes}
    ${mainChain}
    S3 -->|consumer| S4
    S4 --> S5
    S10 -.- S5
    S10 -.- S12`;
}

const entryPoints = [
  { to: '/departments', title: 'Find my department', desc: 'Browse the department directory — purpose, ownership, and roles.', icon: Building2 },
  { to: '/deal-scenarios', title: 'What documents do I need?', desc: 'Identify your deal scenario and see the documents it requires.', icon: FileText },
  { to: '/glossary', title: 'Look up a term', desc: 'Search the glossary for definitions and acronyms.', icon: BookText },
];

export default function Home() {
  const [stages, setStages] = useState(null);

  useEffect(() => {
    base44.entities.Stage.list(ENTITY_LIMITS.Stage.sort, ENTITY_LIMITS.Stage.limit)
      .then(setStages)
      .catch(() => setStages([]));
  }, []);

  return (
    <div>
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Operations Manual</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">OpsEngine</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          Every vehicle Texas Auto Value buys moves through these twelve stages, from the moment a buyer
          finds it to the moment the money is collected.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          The vehicle lifecycle
        </h2>
        <StageRail />
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Process flow
        </h2>
        <div className="overflow-x-auto rounded-lg border border-border bg-card p-4 [&_svg]:max-w-none">
          {stages && stages.length > 0 ? (
            <Mermaid chart={buildFlowchart(stages)} />
          ) : (
            <div className="h-48 animate-pulse rounded-lg bg-muted/40" />
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Where to start
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {entryPoints.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex flex-col rounded-lg border border-border bg-card p-5 transition-colors hover:border-brand hover:bg-accent"
            >
              <div className="flex items-center justify-between">
                <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background text-brand">
                  <c.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
              <h3 className="mt-3 font-heading text-base font-semibold">{c.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          Recently updated
        </h2>
        <RecentlyUpdated />
      </section>
    </div>
  );
}