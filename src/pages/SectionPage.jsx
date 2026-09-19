import { allSections } from '@/lib/navigation';

export default function SectionPage({ sectionId }) {
  const section = allSections.find((s) => s.id === sectionId);

  if (!section) {
    return <p className="text-muted-foreground">Section not found.</p>;
  }

  const Icon = section.icon;

  return (
    <div>
      <div className="flex items-center gap-3.5">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-md border border-border bg-card text-brand">
          <Icon className="h-5 w-5" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">{section.label}</h1>
          <p className="text-sm text-muted-foreground">{section.description}</p>
        </div>
      </div>

      <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
        <p className="max-w-md mx-auto text-sm leading-relaxed text-muted-foreground">
          This section is being documented. Procedures, checklists, forms, and role-specific guidance
          will appear here.
        </p>
      </div>
    </div>
  );
}