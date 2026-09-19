import { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ENTITY_LIMITS } from '@/lib/entity-limits';

const GlossaryContext = createContext(null);

export function useGlossary() {
  return useContext(GlossaryContext);
}

export function GlossaryProvider({ children }) {
  const [state, setState] = useState({ terms: null, status: 'loading' });
  const [retryKey, setRetryKey] = useState(0);
  useEffect(() => {
    let alive = true;
    base44.entities.GlossaryTerm.list(ENTITY_LIMITS.GlossaryTerm.sort, ENTITY_LIMITS.GlossaryTerm.limit)
      .then((t) => { if (alive) setState({ terms: t, status: 'loaded' }); })
      .catch(() => { if (alive) setState({ terms: null, status: 'failed' }); });
    return () => { alive = false; };
  }, [retryKey]);
  const retry = () => { setState({ terms: null, status: 'loading' }); setRetryKey((k) => k + 1); };
  return <GlossaryContext.Provider value={{ ...state, retry }}>{children}</GlossaryContext.Provider>;
}