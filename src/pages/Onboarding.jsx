import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

export default function Onboarding() {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'New hire onboarding' }]} />
      <div className="flex items-center gap-3.5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border bg-card text-brand">
          <BookOpen className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">New hire onboarding</h1>
          <p className="text-sm text-muted-foreground">Role learning paths and ramp guides.</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground">
          New hire onboarding is being written. In the meantime, start with{' '}
          <Link to="/stages" className="text-brand underline underline-offset-2">The twelve stages</Link>{' '}
          and your own{' '}
          <Link to="/departments" className="text-brand underline underline-offset-2">department page</Link>.
        </p>
      </div>
    </div>
  );
}