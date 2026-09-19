import { Link } from 'react-router-dom';
import { navGroups } from '@/lib/navigation';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div>
      <header className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand">Operations Manual</p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight sm:text-4xl">OpsEngine</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          The complete operating reference for Texas Auto Value — from sourcing a vehicle through
          selling it at auction and collecting the money. Built for the desk, the lot, and the field.
        </p>
      </header>

      {navGroups.map((group) => (
        <section key={group.label} className="mb-10 last:mb-0">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {group.label}
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className="group rounded-lg border border-border bg-card p-4 transition-colors hover:border-brand hover:bg-accent"
              >
                <div className="flex items-start justify-between">
                  <div className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background text-brand">
                    <item.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <h3 className="mt-3 font-heading text-base font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}