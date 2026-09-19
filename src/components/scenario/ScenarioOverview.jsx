import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { GROUP_COLORS } from '@/lib/scenarioGroups';

function QuestionBox({ children }) {
  return (
    <div className="rounded-lg border-2 border-dashed border-border bg-accent/40 px-4 py-3 text-center">
      <div className="mb-1 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        <HelpCircle className="h-3.5 w-3.5" /> Question
      </div>
      <div className="text-sm font-semibold text-foreground">{children}</div>
    </div>
  );
}

function ColumnHeader({ children }) {
  return (
    <div className="rounded-lg bg-primary px-4 py-2.5 text-center font-heading text-sm font-bold uppercase tracking-wide text-primary-foreground">
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex justify-center py-1">
      <ChevronDown className="h-5 w-5 text-muted-foreground" />
    </div>
  );
}

function CodeBadge({ code }) {
  const g = GROUP_COLORS[parseInt(String(code).replace(/\D/g, ''), 10)] || GROUP_COLORS[1];
  return (
    <span className={`inline-grid h-9 min-w-[2.25rem] place-items-center rounded-md px-2 font-heading text-sm font-bold ${g.solid}`}>
      {code}
    </span>
  );
}

function GroupCard({ answer, groupNum, codes, codeNames, sublabel }) {
  const g = GROUP_COLORS[groupNum];
  return (
    <div className={`rounded-lg border ${g.card} p-4`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{answer}</span>
      </div>
      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${g.badge}`}>
          Group {groupNum}
        </span>
        <span className={`text-sm font-semibold ${g.accent}`}>{codes.join(' · ')}</span>
      </div>
      {sublabel && <p className="mt-1.5 text-xs italic text-muted-foreground">{sublabel}</p>}
      <div className="mt-3 space-y-2">
        {codes.map((code) => (
          <Link
            key={code}
            to={`/deal-scenarios/${code}`}
            className="flex min-h-11 items-center gap-3 rounded-md border border-border bg-card px-3 py-2 transition-colors hover:border-brand hover:bg-accent"
          >
            <CodeBadge code={code} />
            <span className="text-xs leading-snug text-foreground">{(codeNames && codeNames[code]) || code}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ScenarioCard({ answer, code, desc }) {
  const g = GROUP_COLORS[parseInt(String(code).replace(/\D/g, ''), 10)] || GROUP_COLORS[1];
  return (
    <Link to={`/deal-scenarios/${code}`} className={`block rounded-lg border ${g.card} p-4 transition-shadow hover:shadow-md`}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{answer}</span>
        <CodeBadge code={code} />
      </div>
      {desc && <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{desc}</p>}
    </Link>
  );
}

function LienCard({ answer, result }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm font-semibold text-foreground">{answer}</div>
      <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{result}</p>
    </div>
  );
}

export default function ScenarioOverview({ scenarios }) {
  const codeNames = {};
  if (scenarios) {
    scenarios.forEach((s) => { codeNames[s.code] = s.name; });
  }
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-bold tracking-tight">How the fifteen scenarios are organised</h2>

      <div className="mt-4 mx-auto max-w-3xl">
        <QuestionBox>Is the title in hand, or is this a payoff?</QuestionBox>
        <Connector />

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column — Title in hand */}
          <div>
            <ColumnHeader>Title in hand</ColumnHeader>
            <Connector />
            <QuestionBox>Who is the seller?</QuestionBox>
            <Connector />
            <div className="space-y-2.5">
              <GroupCard answer="Individual" groupNum={1} codes={['1A', '1B', '1C']} codeNames={codeNames} />
              <ScenarioCard answer="Deceased owner" code="4A" desc="Death certificate + Letters of Testamentary/Administration" />
              <ScenarioCard answer="Trust" code="4B" desc="Trust documents" />
              <ScenarioCard answer="Dealer" code="4C" desc="Dealer licence" />
              <ScenarioCard answer="Business" code="4D" desc="Business card" />
            </div>
          </div>

          {/* Right column — Payoff */}
          <div>
            <ColumnHeader>Payoff</ColumnHeader>
            <Connector />
            <QuestionBox>Is it a title-holding state?</QuestionBox>
            <Connector />
            <div className="space-y-2.5">
              <GroupCard answer="Yes" groupNum={2} codes={['2A', '2B', '2C', '2D']} codeNames={codeNames} />
              <GroupCard
                answer="No"
                groupNum={3}
                codes={['3A', '3B', '3C', '3D']}
                codeNames={codeNames}
                sublabel="No title photos in the initial set"
              />
            </div>

            <Connector />
            <QuestionBox>How is the lien satisfied?</QuestionBox>
            <Connector />
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <LienCard answer="Signed off on the title" result="Original lien release in the final set" />
              <LienCard answer="Separate original release" result="Original lien release in the final set" />
              <LienCard answer="Mailed to TAV later" result="Consumer Loan Payoff Form" />
              <LienCard
                answer="Cashier's cheque to the lienholder"
                result={<>Cheque + payoff form, then a <span className="font-bold uppercase tracking-wide text-foreground">tracking number</span></>}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
        Five questions place every deal in exactly one of fifteen scenarios. Each scenario has an exact
        document list. Use the <Link to="/deal-scenarios" className="font-medium text-brand underline-offset-2 hover:underline">What documents do I need?</Link> tool to get yours.
      </p>
    </section>
  );
}