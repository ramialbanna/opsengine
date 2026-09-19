const STYLES = {
  Current: 'text-muted-foreground border-border bg-muted',
  Draft: 'text-amber-700 border-amber-300 bg-amber-50 dark:text-amber-300 dark:border-amber-800 dark:bg-amber-950/40',
  'Needs review': 'text-red-700 border-red-300 bg-red-50 dark:text-red-300 dark:border-red-800 dark:bg-red-950/40',
};

export default function ProcedureStatusBadge({ status, className }) {
  const value = status || 'Draft';
  return (
    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-medium ${STYLES[value] || STYLES.Draft} ${className || ''}`}>
      {value}
    </span>
  );
}