import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

/**
 * Fetches StandingRule records filtered by applies_to, sorted by sort_order.
 * Returns { rules, status } where status is 'loading' | 'loaded' | 'failed'.
 * On failure, rules is empty and status is 'failed' so callers can surface it.
 */
export function useStandingRules(appliesTo) {
  const [rules, setRules] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let alive = true;
    setStatus('loading');
    base44.entities.StandingRule
      .filter({ applies_to: appliesTo }, ENTITY_LIMITS.StandingRule.sort, ENTITY_LIMITS.StandingRule.limit)
      .then((records) => {
        if (!alive) return;
        setRules(records ? records.map((r) => r.rule_text) : []);
        setStatus('loaded');
      })
      .catch(() => {
        if (!alive) return;
        setRules([]);
        setStatus('failed');
      });
    return () => { alive = false; };
  }, [appliesTo]);

  return { rules, status };
}