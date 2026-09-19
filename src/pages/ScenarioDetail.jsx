import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import ScenarioResult from '@/components/scenario/ScenarioResult';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowLeft } from 'lucide-react';
import LoadError from '@/components/LoadError';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

export default function ScenarioDetail() {
  const { code } = useParams();
  const navigate = useNavigate();
  /**
   * @typedef {'loading' | 'notfound' | 'error' | { scenario: any; docMap: Record<string, any> }} ScenarioDetailState
   */
  const [state, setState] = useState(/** @type {ScenarioDetailState} */ ('loading'));
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [scenarios, docs] = await Promise.all([
          base44.entities.DealScenario.filter({ code }),
          base44.entities.DocumentArtifact.list(ENTITY_LIMITS.DocumentArtifact.sort, ENTITY_LIMITS.DocumentArtifact.limit),
        ]);
        const docMap = {};
        docs.forEach((d) => { docMap[d.id] = d; });
        const scenario = scenarios[0];
        if (!scenario) { setState('notfound'); return; }
        setState({ scenario, docMap });
      } catch {
        setState('error');
      }
    })();
  }, [code, retryKey]);

  if (state === 'loading') return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  if (state === 'notfound') {
    return (
      <div>
        <Link to="/deal-scenarios" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All scenarios
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">Scenario {code} has not been documented yet.</p>
      </div>
    );
  }

  if (state === 'error') {
    return <LoadError backTo="/deal-scenarios" backLabel="All scenarios" onRetry={() => { setState('loading'); setRetryKey((k) => k + 1); }} />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Deal scenarios', to: '/deal-scenarios' }, { label: `${state.scenario.code} · ${state.scenario.name}` }]} />
      <ScenarioResult
        scenario={state.scenario}
        docMap={state.docMap}
        onRestart={() => navigate('/deal-scenarios')}
        onPickAnother={() => navigate('/deal-scenarios')}
      />
    </div>
  );
}