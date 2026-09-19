import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ScenarioResult from '@/components/scenario/ScenarioResult';
import ScenarioOverview from '@/components/scenario/ScenarioOverview';
import { groupStyleForCode } from '@/lib/scenarioGroups';
import { ChevronRight, ChevronLeft, FileText, AlertCircle } from 'lucide-react';

const QUESTIONS = {
  title_status: {
    key: 'title_status',
    prompt: 'Does the customer have the title in hand, or is this a payoff?',
    options: [
      { label: 'Title in hand', value: 'Title in hand' },
      { label: 'Payoff', value: 'Payoff' },
    ],
  },
  title_holding_state: {
    key: 'title_holding_state',
    prompt: 'Is the vehicle titled in a title-holding state?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  original_lien_release: {
    key: 'original_lien_release_obtained_today',
    prompt: 'Will you get an original lien release today?',
    options: [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ],
  },
  lien_method: {
    key: 'lien_satisfaction_method',
    prompt: 'How is the lien being satisfied?',
    options: [
      { label: 'Signed off on the title', value: 'Signed off on title' },
      { label: 'Separate original lien release', value: 'Separate original release' },
      { label: 'Mailed to TAV later', value: 'Mailed to TAV later' },
      { label: "Cashier's cheque to the lienholder", value: "Cashier's cheque to lienholder" },
    ],
  },
  seller_capacity: {
    key: 'seller_capacity',
    prompt: 'Who is the seller?',
    options: [
      { label: 'The individual owner', value: 'Individual' },
      { label: 'The estate of someone deceased', value: 'Estate' },
      { label: 'A trust', value: 'Trust' },
      { label: 'A dealer', value: 'Dealer' },
      { label: 'A business', value: 'Business' },
    ],
  },
};

function nextQuestionKey(currentKey, answers) {
  switch (currentKey) {
    case 'title_status':
      return answers.title_status === 'Payoff' ? 'title_holding_state' : 'seller_capacity';
    case 'title_holding_state':
      return 'original_lien_release';
    case 'original_lien_release':
      return 'lien_method';
    case 'lien_method':
      return 'seller_capacity';
    default:
      return null;
  }
}

function matchScenario(scenarios, a) {
  return scenarios.filter((s) => {
    if (s.title_status !== a.title_status) return false;
    if (a.title_status === 'Payoff') {
      if (s.title_holding_state !== a.title_holding_state) return false;
      if (s.original_lien_release_obtained_today !== a.original_lien_release_obtained_today) return false;
      if (s.lien_satisfaction_method !== a.lien_satisfaction_method) return false;
    } else {
      if (s.seller_capacity !== a.seller_capacity) return false;
    }
    return true;
  });
}

function OptionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card px-5 py-4 text-left text-lg font-medium transition-colors hover:border-brand active:bg-accent"
    >
      <span>{label}</span>
      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
    </button>
  );
}

export default function DealScenarios() {
  const [data, setData] = useState(null);
  const [view, setView] = useState('home');
  const [answers, setAnswers] = useState({});
  const [currentKey, setCurrentKey] = useState('title_status');
  const [history, setHistory] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.DealScenario.list('code', 200),
      base44.entities.DocumentArtifact.list('-updated_date', 200),
      base44.entities.TitleState.filter({ title_holding: true }, 'state_name', 200).catch(() => []),
    ])
      .then(([scenarios, docs, titleStates]) => {
        const docMap = {};
        docs.forEach((d) => { docMap[d.id] = d; });
        setData({ scenarios, docMap, titleStates });
      })
      .catch(() => setData({ scenarios: [], docMap: {}, titleStates: [] }));
  }, []);

  function startWizard() {
    setAnswers({});
    setHistory([]);
    setCurrentKey('title_status');
    setView('wizard');
  }

  function selectOption(value) {
    const newAnswers = { ...answers, [QUESTIONS[currentKey].key]: value };
    const next = nextQuestionKey(currentKey, newAnswers);
    if (!next) {
      const matches = matchScenario(data.scenarios, newAnswers);
      setAnswers(newAnswers);
      if (matches.length === 0) { setView('noMatch'); }
      else if (matches.length === 1) { setScenario(matches[0]); setView('results'); }
      else { setCandidates(matches); setView('disambiguate'); }
    } else {
      setAnswers(newAnswers);
      setHistory((h) => [...h, currentKey]);
      setCurrentKey(next);
    }
  }

  function goBack() {
    if (history.length === 0) { setView('home'); return; }
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentKey(prev);
  }

  function restart() {
    setAnswers({});
    setHistory([]);
    setCurrentKey('title_status');
    setScenario(null);
    setView('home');
  }

  function pickCode(s) {
    setScenario(s);
    setView('results');
  }

  if (!data) {
    return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;
  }

  if (view === 'home') {
    return (
      <div>
        <div className="rounded-lg border border-border bg-card p-6">
          <div className="grid h-12 w-12 place-items-center rounded-md bg-primary text-primary-foreground">
            <FileText className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">What documents do I need?</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Answer a few questions to find the exact documents this deal requires. Nothing is saved —
            this is a lookup, not a record.
          </p>
          {data.scenarios.length === 0 ? (
            <p className="mt-5 text-sm text-muted-foreground">No deal scenarios have been documented yet.</p>
          ) : (
            <div className="mt-5 space-y-2.5">
              <OptionButton label="Help me find it" onClick={startWizard} />
              <OptionButton label="I already know the code" onClick={() => setView('codes')} />
            </div>
          )}
        </div>

        <ScenarioOverview />
      </div>
    );
  }

  if (view === 'codes') {
    return (
      <div>
        <button onClick={() => setView('home')} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="font-heading text-xl font-bold tracking-tight">Pick your scenario code</h1>
        <p className="mt-1 text-sm text-muted-foreground">Tap the code you already have.</p>
        <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {data.scenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => pickCode(s)}
              className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4 text-left transition-colors hover:border-brand active:bg-accent"
            >
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-md text-sm font-bold ${groupStyleForCode(s.code).solid}`}>{s.code}</span>
              <span className="min-w-0 font-heading text-sm font-semibold">{s.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'wizard') {
    const q = QUESTIONS[currentKey];
    const total = answers.title_status ? (answers.title_status === 'Payoff' ? 5 : 2) : null;
    const stepNum = history.length + 1;
    return (
      <div>
        <div className="mb-4 flex items-center justify-between">
          <button onClick={goBack} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
          <span className="text-xs text-muted-foreground">
            {total ? `Question ${stepNum} of ${total}` : `Question ${stepNum}`}
          </span>
        </div>
        <h1 className="font-heading text-xl font-bold tracking-tight">{q.prompt}</h1>
        {currentKey === 'title_holding_state' && data.titleStates && data.titleStates.length > 0 && (
          <div className="mt-3 rounded-md border border-border bg-muted/40 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Title-holding states</div>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {data.titleStates.map((st) => (
                <span key={st.id} className="rounded-md border border-border bg-card px-2 py-0.5 text-xs">
                  {st.state_name} ({st.two_letter_code})
                </span>
              ))}
            </div>
            {data.titleStates.filter((st) => st.special_rules).map((st) => (
              <p key={st.id} className="mt-2 text-xs text-muted-foreground">{st.state_name}: {st.special_rules}</p>
            ))}
          </div>
        )}
        <div className="mt-5 space-y-2.5">
          {q.options.map((o) => (
            <OptionButton key={o.value} label={o.label} onClick={() => selectOption(o.value)} />
          ))}
        </div>
      </div>
    );
  }

  if (view === 'noMatch') {
    return (
      <div>
        <button onClick={restart} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground" />
          <h1 className="mt-3 font-heading text-lg font-bold">No documented scenario matches</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            These answers don't match a documented deal scenario. Check with the office or try again.
          </p>
          <button onClick={restart} className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Start over
          </button>
        </div>
      </div>
    );
  }

  if (view === 'disambiguate') {
    return (
      <div>
        <button onClick={goBack} className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="font-heading text-xl font-bold tracking-tight">More than one scenario fits — which is yours?</h1>
        <div className="mt-5 space-y-2.5">
          {candidates.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenario(s); setView('results'); }}
              className="flex w-full items-center justify-between rounded-xl border-2 border-border bg-card px-5 py-4 text-left transition-colors hover:border-brand active:bg-accent"
            >
              <span>
                <span className="block font-heading text-lg font-bold tracking-tight">{s.code}</span>
                <span className="mt-0.5 block text-sm font-normal text-muted-foreground">{s.name}</span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // results
  return (
    <ScenarioResult
      scenario={scenario}
      docMap={data.docMap}
      onRestart={restart}
      onPickAnother={() => setView('codes')}
    />
  );
}