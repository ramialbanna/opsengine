import { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { ChevronRight } from 'lucide-react';

function buildChain(role, roleMap) {
  const chain = [];
  let cur = role;
  const seen = new Set();
  while (cur && !seen.has(cur.id)) {
    seen.add(cur.id);
    chain.push(cur);
    cur = cur.escalates_to ? roleMap[cur.escalates_to] : null;
  }
  return chain;
}

function Chain({ chain }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {chain.map((r, i) => (
          <Fragment key={r.id}>
            <span
              className={
                i === 0
                  ? 'rounded-md bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground'
                  : 'rounded-md border border-border bg-card px-2 py-0.5 text-xs font-medium text-foreground/90'
              }
            >
              {r.title}
            </span>
            {i < chain.length - 1 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
          </Fragment>
        ))}
      </div>
      {chain.length === 1 && (
        <p className="mt-1.5 text-xs text-muted-foreground">Top of this chain — does not escalate further.</p>
      )}
    </div>
  );
}

export default function Roles() {
  const [data, setData] = useState(null);

  useEffect(() => {
    Promise.all([
      base44.entities.Role.list('title', 300),
      base44.entities.Department.list(),
    ])
      .then(([roles, depts]) => {
        const deptMap = {};
        depts.forEach((d) => { deptMap[d.id] = d; });
        const roleMap = {};
        roles.forEach((r) => { roleMap[r.id] = r; });
        const groups = {};
        roles.forEach((r) => {
          const d = r.department ? deptMap[r.department] : null;
          const key = d ? d.id : 'unassigned';
          (groups[key] ||= { dept: d, roles: [] }).roles.push(r);
        });
        const sorted = Object.values(groups).sort(
          (a, b) => (a.dept?.sort_order ?? 99) - (b.dept?.sort_order ?? 99) || (a.dept?.name || '').localeCompare(b.dept?.name || '')
        );
        sorted.forEach((g) => g.roles.sort((a, b) => a.title.localeCompare(b.title)));
        setData({ groups: sorted, roleMap });
      })
      .catch(() => setData({ groups: [], roleMap: {} }));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold tracking-tight">Roles</h1>
      <p className="mt-1 text-sm text-muted-foreground">Who decides what, and who they go to. Posts, not people.</p>

      {data === null ? (
        <div className="mt-6 h-40 animate-pulse rounded-lg bg-muted/40" />
      ) : data.groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No roles documented yet.</p>
      ) : (
        <div className="mt-6 space-y-8">
          {data.groups.map((g) => (
            <section key={g.dept?.id || 'unassigned'}>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {g.dept ? (
                  <Link to={`/departments/${g.dept.id}`} className="hover:text-foreground">{g.dept.name}</Link>
                ) : (
                  'Unassigned'
                )}
              </h2>
              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                {g.roles.map((r) => {
                  const chain = buildChain(r, data.roleMap);
                  return (
                    <div key={r.id} className="rounded-lg border border-border bg-card p-5">
                      <h3 className="font-heading text-base font-semibold">{r.title}</h3>
                      {r.responsibilities && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{r.responsibilities}</p>}
                      {r.decision_authority && (
                        <div className="mt-3">
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Decision authority</div>
                          <p className="mt-1 text-sm leading-relaxed text-foreground/90">{r.decision_authority}</p>
                        </div>
                      )}
                      <div className="mt-3 border-t border-border pt-2.5">
                        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Escalation path</div>
                        <Chain chain={chain} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}