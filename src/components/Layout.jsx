import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r border-sidebar-border bg-sidebar">
        <Sidebar />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative flex w-72 max-w-[82%] flex-col bg-sidebar shadow-2xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close navigation"
              className="absolute right-2.5 top-3.5 inline-flex h-9 w-9 items-center justify-center rounded-md text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X className="h-5 w-5" />
            </button>
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur lg:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
            className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground hover:bg-accent"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex flex-1 items-center justify-center lg:justify-start">
            <HeaderSearch />
          </div>

          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-5xl px-4 py-6 lg:px-8 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}