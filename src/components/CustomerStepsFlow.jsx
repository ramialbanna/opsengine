import { ChevronDown, Lock, Diamond, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStandingRules } from '@/hooks/useStandingRules';

function Arrow({ label, size = 'h-5 w-5' }) {
  return (
    <div className="flex flex-col items-center gap-0.5 py-1">
      {label && (
        <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      )}
      <ChevronDown className={`${size} text-muted-foreground`} />
    </div>
  );
}

function PlainBox({ children }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-center text-sm font-medium text-foreground shadow-sm">
      {children}
    </div>
  );
}

function DecisionBox({ children }) {
  return (
    <div className="rounded-lg border-2 border-amber-500/70 bg-amber-50 px-4 py-3 text-center dark:border-amber-500/50 dark:bg-amber-950/30">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
        <Diamond className="h-3.5 w-3.5" /> Decision
      </div>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function GateBox({ id, children }) {
  return (
    <div className="rounded-lg border-2 border-brand bg-brand/10 px-4 py-4 text-center shadow-sm ring-1 ring-brand/30">
      <div className="mb-1.5 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-brand">
        <Lock className="h-3.5 w-3.5" /> Gate {id}
      </div>
      <div className="font-heading text-sm font-bold uppercase tracking-wide text-brand">{children}</div>
    </div>
  );
}

function EndBox({ children }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/60 px-4 py-3 text-center text-sm font-medium text-foreground">
      <CheckCircle2 className="h-4 w-4 shrink-0 text-brand" />
      <span>{children}</span>
    </div>
  );
}

function SideBox({ children, tone = 'warn' }) {
  const tones = {
    warn: 'border-amber-500/50 bg-amber-50 text-foreground dark:border-amber-500/40 dark:bg-amber-950/20',
    danger: 'border-destructive/50 bg-destructive/10 text-destructive dark:bg-destructive/15',
  };
  return (
    <div className={`rounded-md border px-3 py-2 text-center text-xs font-semibold ${tones[tone]}`}>
      {children}
    </div>
  );
}

function NotConfirmedBranch() {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-50/60 p-3 dark:border-amber-500/30 dark:bg-amber-950/10">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" /> Not confirmed
      </div>
      <div className="space-y-1">
        <SideBox>Inspection Manager</SideBox>
        <Arrow size="h-4 w-4" />
        <SideBox>Closer VP</SideBox>
        <Arrow size="h-4 w-4" />
        <div className="grid grid-cols-2 gap-1.5">
          <SideBox tone="warn">Renegotiate</SideBox>
          <SideBox tone="danger">Walk away</SideBox>
        </div>
      </div>
    </div>
  );
}

export default function CustomerStepsFlow() {
  const rules = useStandingRules('Purchase execution');
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-bold tracking-tight">The four steps at the customer</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        The on-site sequence from arrival to release, including the two gates that mark irreversible releases.
      </p>

      <div className="mt-5 mx-auto max-w-md">
        <PlainBox>Transporter arrives — meets the customer inside the bank</PlainBox>
        <Arrow />
        <PlainBox>Step 1 · Pre-Buy Inspection</PlainBox>
        <Arrow />

        <div className="grid gap-3 sm:grid-cols-2 sm:items-start">
          <DecisionBox>FaceTime QA call — coordinator confirms</DecisionBox>
          <NotConfirmedBranch />
        </div>

        <Arrow label="Confirmed" />
        <PlainBox>Step 2 · QA Document &amp; Deal Review</PlainBox>
        <Arrow />
        <PlainBox>Initial submission set</PlainBox>
        <Arrow />
        <GateBox id="2a">Funds may be released</GateBox>
        <Arrow />
        <PlainBox>Step 3 · Funds Distribution</PlainBox>
        <Arrow />
        <PlainBox>Final submission set</PlainBox>
        <Arrow />
        <GateBox id="2b">You may leave the customer</GateBox>
        <Arrow />
        <PlainBox>Step 4 · Inventory Control</PlainBox>
        <Arrow />
        <EndBox>Unit delivered · keys together · paper tag in packet</EndBox>
      </div>

      {rules.length > 0 && (
        <div className="mt-4 space-y-1 text-center text-xs leading-relaxed text-muted-foreground">
          {rules.map((r, i) => <p key={i}>{r}</p>)}
        </div>
      )}
    </section>
  );
}