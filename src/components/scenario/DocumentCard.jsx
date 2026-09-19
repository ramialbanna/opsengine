import Markdown from '@/components/Markdown';

const BADGES = [
  { key: 'legal_document', label: 'Legal' },
  { key: 'travels_back_physically', label: 'Original travels back' },
  { key: 'is_universal', label: 'Universal' },
];

export default function DocumentCard({ doc }) {
  if (!doc) return null;
  const badges = BADGES.filter((b) => doc[b.key]);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <h4 className="font-heading text-sm font-semibold leading-tight">{doc.name}</h4>
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-end gap-1">
            {badges.map((b) => (
              <span key={b.key} className="rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {doc.what_it_is && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{doc.what_it_is}</p>}
      {doc.completion_rules && (
        <div className="mt-3 border-t border-border pt-2.5">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Completion rules</div>
          <Markdown>{doc.completion_rules}</Markdown>
        </div>
      )}
    </div>
  );
}