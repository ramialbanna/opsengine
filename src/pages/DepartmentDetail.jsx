import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Breadcrumbs from '@/components/Breadcrumbs';
import { ArrowLeft, Users, Hash, ListChecks, Server, ShieldCheck } from 'lucide-react';

function Section({ icon: Icon, title, count, children }) {
  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2>
        {typeof count === 'number' && <span className="text-xs text-muted-foreground">· {count}</span>}
      </div>
      {children}
    </section>
  );
}

function EmptyNote() {
  return <p className="text-sm text-muted-foreground">None defined yet.</p>;
}

export default function DepartmentDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const dept = await base44.entities.Department.get(id);
        const [stages, roles, procedures, controls, systems] = await Promise.all([
          base44.entities.Stage.list('number', 100),
          base44.entities.Role.list(),
          base44.entities.Procedure.list('-updated_date', 200),
          base44.entities.Control.list('-updated_date', 200),
          base44.entities.System.list('-updated_date', 200),
        ]);
        const roleMap = {};
        roles.forEach((r) => { roleMap[r.id] = r; });
        const stageMap = {};
        stages.forEach((s) => { stageMap[s.id] = s; });
        const ownedStages = stages.filter((s) => s.owner_department === id);
        const deptRoles = roles.filter((r) => r.department === id);
        const roleIds = new Set(deptRoles.map((r) => r.id));
        setData({
          dept,
          ownedStages,
          deptRoles,
          deptProcedures: procedures.filter((p) => p.department === id),
          deptControls: controls.filter((c) => roleIds.has(c.owner_role)),
          deptSystems: systems.filter((s) => (s.departments || []).includes(id)),
          roleMap,
          stageMap,
        });
      } catch {
        setNotFound(true);
      }
    })();
  }, [id]);

  if (notFound) {
    return (
      <div>
        <Link to="/departments" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> All departments
        </Link>
        <p className="mt-4 text-sm text-muted-foreground">Department not found.</p>
      </div>
    );
  }
  if (!data) return <div className="h-48 animate-pulse rounded-lg bg-muted/40" />;

  const { dept, ownedStages, deptRoles, deptProcedures, deptControls, deptSystems, roleMap, stageMap } = data;

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Departments', to: '/departments' }, { label: dept.name }]} />

      <h1 className="mt-4 font-heading text-2xl font-bold tracking-tight">{dept.name}</h1>
      {dept.short_description && <p className="mt-1 text-sm text-muted-foreground">{dept.short_description}</p>}

      <dl className="mt-6 grid gap-5">
        {dept.purpose && (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Purpose</dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{dept.purpose}</dd>
          </div>
        )}
        {dept.what_it_owns && (
          <div>
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">What it owns</dt>
            <dd className="mt-1 text-sm leading-relaxed text-foreground/90">{dept.what_it_owns}</dd>
          </div>
        )}
      </dl>

      <Section icon={Users} title="Roles" count={deptRoles.length}>
        {deptRoles.length === 0 ? <EmptyNote /> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deptRoles.map((r) => (
              <div key={r.id} className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-heading text-sm font-semibold">{r.title}</h3>
                {r.responsibilities && <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{r.responsibilities}</p>}
                {r.decision_authority && (
                  <p className="mt-2 text-xs text-muted-foreground"><span className="font-medium text-foreground/80">Authority:</span> {r.decision_authority}</p>
                )}
                {r.escalates_to && roleMap[r.escalates_to] && (
                  <p className="mt-1 text-xs text-muted-foreground">Escalates to: {roleMap[r.escalates_to].title}</p>
                )}
                {r.group_contact && (
                  <p className="mt-1 text-xs text-muted-foreground">Contact: {r.group_contact}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={Hash} title="Stages it owns" count={ownedStages.length}>
        {ownedStages.length === 0 ? <EmptyNote /> : (
          <ul className="space-y-1.5">
            {ownedStages.map((s) => (
              <li key={s.id}>
                <Link to={`/stages/${s.number}`} className="inline-flex items-center gap-2 text-sm hover:text-brand">
                  <span className="grid h-5 w-5 place-items-center rounded bg-muted text-[11px] font-bold text-foreground/80">{s.number}</span>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={ListChecks} title="Procedures" count={deptProcedures.length}>
        {deptProcedures.length === 0 ? <EmptyNote /> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deptProcedures.map((p) => (
              <Link key={p.id} to={`/procedures/${p.id}`} className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent">
                <h3 className="font-heading text-sm font-semibold">{p.title}</h3>
                {stageMap[p.stage] && (
                  <p className="mt-1 text-xs text-muted-foreground">Stage {stageMap[p.stage].number} · {stageMap[p.stage].name}</p>
                )}
                {p.trigger && <p className="mt-1.5 text-xs text-muted-foreground">Trigger: {p.trigger}</p>}
              </Link>
            ))}
          </div>
        )}
      </Section>

      <Section icon={Server} title="Systems it uses" count={deptSystems.length}>
        {deptSystems.length === 0 ? <EmptyNote /> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deptSystems.map((s) => (
              <div key={s.id} className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-heading text-sm font-semibold">{s.name}</h3>
                {s.used_for && <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{s.used_for}</p>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section icon={ShieldCheck} title="Controls it runs" count={deptControls.length}>
        {deptControls.length === 0 ? <EmptyNote /> : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deptControls.map((c) => (
              <div key={c.id} className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-heading text-sm font-semibold">{c.name}</h3>
                {c.what_it_checks && <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{c.what_it_checks}</p>}
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {c.frequency}{c.owner_role && roleMap[c.owner_role] ? ` · ${roleMap[c.owner_role].title}` : ''}
                </p>
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}