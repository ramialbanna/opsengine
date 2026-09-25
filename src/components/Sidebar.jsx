import { NavLink } from 'react-router-dom';
import { navGroups } from '@/lib/navigation';
import { useAuth } from '@/lib/AuthContext';
import { cn } from '@/lib/utils';

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary font-heading text-base font-bold tracking-tight text-primary-foreground">
          OE
        </div>
        <div className="leading-tight">
          <div className="font-heading text-sm font-semibold tracking-tight text-sidebar-foreground">OpsEngine</div>
          <div className="text-[11px] text-muted-foreground">Texas Auto Value</div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Sections">
        {navGroups.map((group) => {
          const items = group.items.filter((it) => !it.adminOnly || user?.role === 'admin');
          if (!items.length) return null;
          return (
          <div key={group.label} className="mb-6 last:mb-0">
            <div className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            <ul className="space-y-0.5">
              {items.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                          : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                      )
                    }
                  >
                    <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={2} />
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border px-5 py-3 text-[11px] text-muted-foreground">
        Texas Auto Value · Internal use only
      </div>
    </div>
  );
}