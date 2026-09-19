import { createContext, useContext, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

const GlossaryContext = createContext(null);

export function useGlossary() {
  return useContext(GlossaryContext);
}

export function GlossaryProvider({ children }) {
  const [terms, setTerms] = useState(null);
  useEffect(() => {
    let alive = true;
    base44.entities.GlossaryTerm.list('term', 500)
      .then((t) => { if (alive) setTerms(t); })
      .catch(() => { if (alive) setTerms([]); });
    return () => { alive = false; };
  }, []);
  return <GlossaryContext.Provider value={terms}>{children}</GlossaryContext.Provider>;
}