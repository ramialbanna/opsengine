import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useAuth } from '@/lib/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Breadcrumbs from '@/components/Breadcrumbs';
import { UserPlus, Trash2, ShieldCheck, RotateCw } from 'lucide-react';

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [inviting, setInviting] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError(false);
    try {
      const res = await base44.functions.invoke('manageUsers', { action: 'list' });
      setUsers(res.data.users);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => {
    if (user?.role === 'admin') load();
  }, [user, load]);

  if (!user) return null;

  if (user.role !== 'admin') {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Admin' }, { label: 'Users' }]} />
        <div className="mt-4 rounded-lg border border-border bg-card p-6">
          <h1 className="font-heading text-lg font-bold tracking-tight">Access denied</h1>
          <p className="mt-1 text-sm text-muted-foreground">Only admins can manage users.</p>
        </div>
      </div>
    );
  }

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setInviting(true);
    try {
      await base44.users.inviteUser(email.trim(), role);
      toast({ title: 'Invitation sent', description: `${email.trim()} invited as ${role}.` });
      setEmail('');
      setRole('user');
      load();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Invitation failed', description: err?.message || 'Could not send invite.' });
    } finally {
      setInviting(false);
    }
  };

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await base44.functions.invoke('manageUsers', { action: 'delete', id: toDelete.id });
      toast({ title: 'User removed', description: `${toDelete.email} has been removed.` });
      setToDelete(null);
      load();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Removal failed', description: err?.message || 'Could not remove user.' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Admin', to: '/admin/users' }, { label: 'Users' }]} />

      <div className="mt-4 flex items-center gap-2.5">
        <ShieldCheck className="h-5 w-5 text-brand" />
        <h1 className="font-heading text-xl font-bold tracking-tight">User management</h1>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">Invite staff to OpsEngine and remove access when they leave.</p>

      <form onSubmit={handleInvite} className="mt-5 rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <UserPlus className="h-4 w-4" /> Invite a user
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label htmlFor="invite-email" className="mb-1.5">Email</Label>
            <Input id="invite-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
          </div>
          <div className="sm:w-40">
            <Label className="mb-1.5">Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={inviting}>{inviting ? 'Sending…' : 'Send invite'}</Button>
        </div>
      </form>

      <div className="mt-6 rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Current users</h2>
          <Button variant="ghost" size="sm" onClick={load}><RotateCw className="h-4 w-4" /> Refresh</Button>
        </div>
        {error ? (
          <div className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-destructive">Couldn't load users.</span>
            <Button variant="outline" size="sm" onClick={load}>Retry</Button>
          </div>
        ) : users === null ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">Loading users…</div>
        ) : users.length === 0 ? (
          <div className="px-4 py-3 text-sm text-muted-foreground">No users found.</div>
        ) : (
          <ul className="divide-y divide-border">
            {users.map((u) => (
              <li key={u.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium">{u.full_name || u.email}</span>
                    {u.role === 'admin' && <Badge variant="secondary">Admin</Badge>}
                    {u.id === user.id && <Badge variant="outline">You</Badge>}
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{u.email}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={u.id === user.id}
                  onClick={() => setToDelete(u)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" /> Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove user?</DialogTitle>
            <DialogDescription>
              {toDelete ? `This revokes ${toDelete.email}'s access to OpsEngine. They will need a new invitation to return.` : ''}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? 'Removing…' : 'Remove user'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}