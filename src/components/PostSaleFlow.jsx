import { ChevronDown, Diamond, CheckCircle2, Clock } from 'lucide-react';
import { useStandingRules } from '@/hooks/useStandingRules';

const TRACKS = {
  title: {
    name: 'Title track',
    header: 'bg-blue-500 text-white',
    box: 'border-blue-300 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/20',
    accent: 'text-blue-700 dark:text-blue-300',
    decision: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
  },
  psi: {
    name: 'PSI track',
    header: 'bg-violet-500 text-white',
    box: 'border-violet-300 bg-violet-50/60 dark:border-violet-900 dark:bg-violet-950/20',
    accent: 'text-violet-700 dark:text-violet-300',
    decision: 'border-violet-500 bg-violet-50 dark:bg-violet-950/30',
  },
  money: {
    name: 'Money track',
    header: 'bg-emerald-500 text-white',
    box: 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-900 dark:bg-emerald-950/20',
    accent: 'text-emerald-700 dark:text-emerald-300',
    decision: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30',
  },
};

function Connector() {
  return (
    <div className="flex justify-center py-1">
      <ChevronDown className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function TopBox({ children }) {
  return (
    <div className="rounded-lg border-2 border-foreground/80 bg-foreground/5 px-4 py-3 text-center font-heading text-sm font-bold uppercase tracking-wide text-foreground">
      {children}
    </div>
  );
}

function TrackHeader({ track }) {
  const t = TRACKS[track];
  return (
    <div className={`rounded-lg ${t.header} px-4 py-2.5 text-center font-heading text-sm font-bold uppercase tracking-wide`}>
      {t.name}
    </div>
  );
}

function TrackBox({ track, children }) {
  const t = TRACKS[track];
  return (
    <div className={`rounded-lg border ${t.box} px-3 py-2.5 text-center text-sm font-medium text-foreground shadow-sm`}>
      {children}
    </div>
  );
}

function DecisionBox({ track, children }) {
  const t = TRACKS[track];
  return (
    <div className={`rounded-lg border-2 ${t.decision} px-3 py-2.5 text-center`}>
      <div className={`mb-1 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider ${t.accent}`}>
        <Diamond className="h-3.5 w-3.5" /> Decision
      </div>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function EndBox({ track, children, muted }) {
  if (muted) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/60 px-3 py-2.5 text-center text-sm font-medium text-muted-foreground">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>{children}</span>
      </div>
    );
  }
  const t = TRACKS[track];
  return (
    <div className={`flex items-center justify-center gap-2 rounded-lg border ${t.box} px-3 py-2.5 text-center text-sm font-medium text-foreground`}>
      <CheckCircle2 className={`h-4 w-4 shrink-0 ${t.accent}`} />
      <span>{children}</span>
    </div>
  );
}

function DeadlineBox({ children }) {
  return (
    <div className="rounded-lg border-2 border-amber-500 bg-amber-50 px-3 py-3 text-center dark:border-amber-500 dark:bg-amber-950/30">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
        <Clock className="h-3.5 w-3.5" /> Deadline
      </div>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function BranchLabel({ children }) {
  return (
    <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

const POST_SALE_FALLBACK = ['30 days to turn in the title, or the buyer may arbitrate'];

function TitleTrack() {
  return (
    <div>
      <TrackHeader track="title" />
      <Connector />
      <TrackBox track="title">Daily iDMS report — units with a held title</TrackBox>
      <Connector />
      <TrackBox track="title">Round-robin assignment to a title clerk</TrackBox>
      <Connector />
      <TrackBox track="title">Runner takes titles to Manheim, several times daily, with a manifest</TrackBox>
      <Connector />
      <TrackBox track="title">Manheim scans them in and signs the manifest</TrackBox>
      <Connector />
      <EndBox track="title">TAV collects</EndBox>
    </div>
  );
}

function PsiTrack() {
  return (
    <div>
      <TrackHeader track="psi" />
      <Connector />
      <DecisionBox track="psi">Did the buyer purchase a PSI?</DecisionBox>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <BranchLabel>No</BranchLabel>
          <EndBox muted>No inspection</EndBox>
        </div>
        <div className="flex flex-col items-center">
          <BranchLabel>Yes</BranchLabel>
          <Connector />
        </div>
      </div>
      <DecisionBox track="psi">Fault found?</DecisionBox>
      <div className="mt-2 space-y-1">
        <BranchLabel>Yes</BranchLabel>
        <EndBox track="psi">TAV decides: pay to fix, or reduce the sale price</EndBox>
      </div>
    </div>
  );
}

function MoneyTrack({ rules }) {
  return (
    <div>
      <TrackHeader track="money" />
      <Connector />
      <DeadlineBox>{rules.map((r, i) => <div key={i}>{r}</div>)}</DeadlineBox>
      <Connector />
      <EndBox track="money">Monthly reconciliation — iDMS against the Manheim Selling Summary</EndBox>
    </div>
  );
}

export default function PostSaleFlow() {
  const rules = useStandingRules('Post-sale', POST_SALE_FALLBACK);
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-bold tracking-tight">What happens after a unit sells</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        A sale splits into three tracks that run in parallel and close independently.
      </p>

      <div className="mt-5 mx-auto max-w-4xl">
        <TopBox>Unit sold at auction</TopBox>
        <div className="py-1">
          <div className="hidden gap-5 lg:grid lg:grid-cols-3">
            <div className="flex justify-center"><ChevronDown className="h-5 w-5 text-muted-foreground" /></div>
            <div className="flex justify-center"><ChevronDown className="h-5 w-5 text-muted-foreground" /></div>
            <div className="flex justify-center"><ChevronDown className="h-5 w-5 text-muted-foreground" /></div>
          </div>
          <div className="flex justify-center lg:hidden"><ChevronDown className="h-5 w-5 text-muted-foreground" /></div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-5">
          <TitleTrack />
          <PsiTrack />
          <MoneyTrack rules={rules} />
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        The three tracks run at the same time and close independently. A unit is not finished when it sells —
        it is finished when the title is delivered, the money is collected, and the arbitration window has
        passed.
      </p>
    </section>
  );
}