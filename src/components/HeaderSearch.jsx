import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Search, X, Hash, Layers, Building2, FileText, BookText } from 'lucide-react';

const ORDER = ['stage', 'procedure', 'department', 'document', 'glossary'];
const META = {
  stage: { label: 'Stages', icon: Hash },
  procedure: { label: 'Procedures', icon: Layers },
  department: { label: 'Departments', icon: Building2 },
  document: { label: 'Documents', icon: FileText },
  glossary: { label: 'Glossary', icon: BookText },
};

export default function HeaderSearch() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const cache = useRef(null);
  const boxRef = useRef(null);
  const navigate = useNavigate();

  async function ensureCache() {
    if (cache.current) return cache.current;
    const [stages, procedures, departments, documents, glossary] = await Promise.all([
      base44.entities.Stage.list('number', 200),
      base44.entities.Procedure.list('-updated_date', 200),
      base44.entities.Department.list(),
      base44.entities.DocumentArtifact.list('-updated_date', 200),
      base44.entities.GlossaryTerm.list('term', 500),
    ]);
    const stageById = {};
    stages.forEach((s) => { stageById[s.id] = s; });
    cache.current = { stages, procedures, departments, documents, glossary, stageById };
    return cache.current;
  }

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); setOpen(false); return; }
    let active = true;
    setLoading(true);
    ensureCache()
      .then((c) => {
        if (!active) return;
        const r = [];
        c.stages.forEach((s) => {
          if ((s.name || '').toLowerCase().includes(q)) r.push({ type: 'stage', id: s.id, title: s.name, sub: `Stage ${s.number}`, ref: s });
        });
        c.procedures.forEach((p) => {
          if ((p.title || '').toLowerCase().includes(q)) {
            const st = c.stageById[p.stage];
            r.push({ type: 'procedure', id: p.id, title: p.title, sub: st ? `Stage ${st.number} · ${st.name}` : 'Procedure', ref: p });
          }
        });
        c.departments.forEach((d) => {
          if ((d.name || '').toLowerCase().includes(q)) r.push({ type: 'department', id: d.id, title: d.name, sub: d.short_description || 'Department', ref: d });
        });
        c.documents.forEach((d) => {
          if ((d.name || '').toLowerCase().includes(q)) r.push({ type: 'document', id: d.id, title: d.name, sub: d.what_it_is || 'Document', ref: d });
        });
        c.glossary.forEach((g) => {
          if ((g.term || '').toLowerCase().includes(q) || (g.definition || '').toLowerCase().includes(q)) {
            r.push({ type: 'glossary', id: g.id, title: g.term, sub: g.category || 'Glossary', ref: g });
          }
        });
        setResults(r.slice(0, 30));
        setLoading(false);
        setOpen(true);
      })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query]);

  useEffect(() => {
    function onDoc(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  function go(r) {
    setOpen(false);
    setQuery('');
    if (r.type === 'stage') navigate(`/stages/${r.ref.number}`);
    else if (r.type === 'procedure') {
      const st = cache.current?.stageById[r.ref.stage];
      navigate(st ? `/stages/${st.number}` : '/');
    } else if (r.type === 'department') navigate('/departments');
    else if (r.type === 'document') navigate('/deal-scenarios');
    else if (r.type === 'glossary') navigate('/glossary');
  }

  const grouped = ORDER
    .map((t) => ({ type: t, items: results.filter((r) => r.type === t) }))
    .filter((g) => g.items.length);

  return (
    <div ref={boxRef} className="relative w-full max-w-md">
      <div className="flex items-center gap-2 rounded-md border border-input bg-muted/40 px-3 py-2 transition-colors focus-within:border-ring focus-within:bg-background">
        <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false);
            if (e.key === 'Enter' && results[0]) go(results[0]);
          }}
          placeholder="Search stages, procedures, documents, terms…"
          className="w-full bg-transparent text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        {query && (
          <button onClick={() => { setQuery(''); setOpen(false); }} aria-label="Clear search" className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-y-auto rounded-md border border-border bg-popover shadow-lg">
          {loading && <div className="px-4 py-6 text-center text-sm text-muted-foreground">Searching…</div>}
          {!loading && results.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-muted-foreground">No matches.</div>
          )}
          {!loading && grouped.map((g) => {
            const Icon = META[g.type].icon;
            return (
              <div key={g.type}>
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {META[g.type].label}
                </div>
                {g.items.map((r) => (
                  <button
                    key={r.type + r.id}
                    onClick={() => go(r)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-accent"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{r.sub}</span>
                    </span>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}