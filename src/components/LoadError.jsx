import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCw } from 'lucide-react';

export default function LoadError({ backTo, backLabel, onRetry }) {
  return (
    <div>
      <Link to={backTo} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> {backLabel}
      </Link>
      <div className="mt-4 rounded-lg border border-border bg-card p-6">
        <h1 className="font-heading text-lg font-bold tracking-tight">Couldn't load this page</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Something went wrong reaching the server. This page exists — it just didn't load.
        </p>
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <RotateCw className="h-4 w-4" /> Retry
        </button>
      </div>
    </div>
  );
}