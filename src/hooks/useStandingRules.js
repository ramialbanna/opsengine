import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

/**
 * Fetches StandingRule records filtered by applies_to, sorted by sort_order.
 * Returns the fallback array until records arrive; stays on fallback if the
 * fetch fails or returns nothing.
 */
export function useStandingRules(appliesTo, fallback = []) {
  const [rules, setRules] = useState(fallback);

  useEffect(() => {
    let alive = true;
    base44.entities.StandingRule
      .filter({ applies_to: appliesTo }, ENTITY_LIMITS.StandingRule.sort, ENTITY_LIMITS.StandingRule.limit)
      .then((records) => {
        if (!alive || !records || records.length === 0) return;
        setRules(records.map((r) => r.rule_text));
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [appliesTo]);

  return rules;
}