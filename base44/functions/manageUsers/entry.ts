import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const body = await req.json().catch(() => ({}));
    const action = body?.action;

    if (action === 'list') {
      const [users, invitations] = await Promise.all([
        base44.asServiceRole.entities.User.list(),
        base44.asServiceRole.entities.Invitation.list(),
      ]);
      const safeUsers = users.map((u) => ({
        id: u.id,
        email: u.email,
        full_name: u.full_name,
        role: u.role,
        created_date: u.created_date,
      }));
      const safeInv = invitations.map((i) => ({
        id: i.id,
        email: i.email,
        role: i.role,
        status: i.status,
        invited_date: i.invited_date,
      }));
      return Response.json({ users: safeUsers, invitations: safeInv });
    }

    if (action === 'createInvitation') {
      const email = (body?.email || '').trim().toLowerCase();
      const role = body?.role || 'user';
      if (!email) return Response.json({ error: 'Missing email' }, { status: 400 });
      const existing = await base44.asServiceRole.entities.Invitation.filter({ email });
      if (!existing.length) {
        await base44.asServiceRole.entities.Invitation.create({
          email,
          role,
          status: 'pending',
          invited_date: new Date().toISOString(),
        });
      }
      return Response.json({ success: true });
    }

    if (action === 'delete') {
      const targetId = body?.id;
      if (!targetId) return Response.json({ error: 'Missing id' }, { status: 400 });
      if (targetId === user.id) return Response.json({ error: 'You cannot remove yourself' }, { status: 400 });
      await base44.asServiceRole.entities.User.delete(targetId);
      return Response.json({ success: true });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}