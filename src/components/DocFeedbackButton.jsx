import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Flag } from 'lucide-react';

export default function DocFeedbackButton({ pageRef }) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function submit() {
    if (!note.trim()) return;
    setSubmitting(true);
    try {
      await base44.entities.DocFeedback.create({
        page_ref: pageRef,
        note: note.trim(),
        date_submitted: new Date().toISOString().slice(0, 10),
      });
      setNote('');
      setSubmitting(false);
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setOpen(false);
      }, 1800);
    } catch {
      setSubmitting(false);
    }
  }

  function handleOpenChange(v) {
    setOpen(v);
    if (!v) {
      setNote('');
      setDone(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline print:hidden"
      >
        <Flag className="h-4 w-4" /> Is this page wrong or out of date?
      </button>

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent>
          {done ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Thanks — your note has been recorded.
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Is this page wrong or out of date?</DialogTitle>
                <DialogDescription>
                  Tell us what is incorrect or stale. No name needed — the page is captured automatically.
                </DialogDescription>
              </DialogHeader>
              <p className="text-xs text-muted-foreground">Regarding: {pageRef}</p>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="What is wrong or out of date?"
                rows={4}
                autoFocus
              />
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={submitting}>
                  Cancel
                </Button>
                <Button onClick={submit} disabled={submitting || !note.trim()}>
                  {submitting ? 'Submitting…' : 'Submit'}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}