import Markdown from '@/components/Markdown';
import DocumentCard from './DocumentCard';
import { groupStyleForCode } from '@/lib/scenarioGroups';
import { RotateCcw, ListOrdered, Info } from 'lucide-react';

function StepHeader({ n, title }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-xs font-bold text-primary-foreground">{n}</span>
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function Divider({ children }) {
  return (
    <div className="my-6 rounded-md border border-brand/30 bg-brand/5 px-4 py-3 text-center text-sm font-medium text-foreground">
      {children}
    </div>
  );
}

export default function ScenarioResult({ scenario, docMap, onRestart, onPickAnother }) {
  const initial = (scenario.initial_submission_set || []).map((id) => docMap[id]).filter(Boolean);
  const final = (scenario.final_submission_set || []).map((id) => docMap[id]).filter(Boolean);
  const isCashier = scenario.lien_satisfaction_method === "Cashier's cheque to lienholder";

  return (
    <div>
      <div className="flex items-center gap-3">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-md font-heading text-base font-bold ${groupStyleForCode(scenario.code).solid}`}>
          {scenario.code}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand">Matched scenario</p>
          <h1 className="font-heading text-xl font-bold leading-tight tracking-tight">{scenario.name}</h1>
        </div>
      </div>

      <div className="mt-6">
        <StepHeader n={1} title="Initial submission" />
        {initial.length > 0 ? (
          <div className="space-y-2.5">{initial.map((d) => <DocumentCard key={d.id} doc={d} />)}</div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents listed.</p>
        )}
      </div>

      <Divider>Once approved, funds may be released or requested</Divider>

      <div>
        <StepHeader n={2} title="Final submission" />
        {final.length > 0 ? (
          <div className="space-y-2.5">{final.map((d) => <DocumentCard key={d.id} doc={d} />)}</div>
        ) : (
          <p className="text-sm text-muted-foreground">No documents listed.</p>
        )}
      </div>

      <Divider>Once approved, you may leave and part ways with the customer</Divider>

      {isCashier && (
        <div>
          <StepHeader n={3} title="Tracking" />
          <div className="rounded-lg border border-border bg-card p-4 text-sm leading-relaxed text-foreground/90">
            Submit the cashier's cheque tracking number to TAV.
          </div>
        </div>
      )}

      {scenario.qa_instructions && (
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">QA instructions</div>
          <Markdown>{scenario.qa_instructions}</Markdown>
        </div>
      )}

      <div className="mt-6 rounded-lg border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/40">
        <div className="flex items-start gap-2.5">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <p className="text-sm leading-relaxed text-foreground/90">
            If the title names two owners joined by <strong>AND</strong>, every owner signs every document.
            If joined by <strong>OR</strong>, one signer is enough. Collect a driver's licence for every
            person named on the title regardless of who signs.
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <RotateCcw className="h-4 w-4" /> Start over
        </button>
        <button onClick={onPickAnother} className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2.5 text-sm font-medium hover:bg-accent">
          <ListOrdered className="h-4 w-4" /> Pick a different code
        </button>
      </div>
    </div>
  );
}