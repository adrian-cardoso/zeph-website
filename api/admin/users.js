import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const ALLOWED_ROLES = ['admin', 'patient'];

export default async function handler(req, res) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(500).json({ error: 'Server is missing Supabase environment variables' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  if (!token) return res.status(401).json({ error: 'Missing bearer token' });

  const anonClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data: userData, error: userErr } = await anonClient.auth.getUser(token);
  if (userErr || !userData?.user) return res.status(401).json({ error: 'Invalid session' });
  const callerId = userData.user.id;

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: callerProfile, error: profErr } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', callerId)
    .single();
  if (profErr || callerProfile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  try {
    if (req.method === 'GET') {
      const { data, error: listErr } = await adminClient
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (listErr) return res.status(400).json({ error: listErr.message });
      return res.status(200).json({ users: data || [] });
    }

    if (req.method === 'POST') {
      const { email, password, full_name, role } = req.body || {};
      if (!email || !password || !role) {
        return res.status(400).json({ error: 'email, password, and role are required' });
      }
      if (!ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }

      const { data: created, error: createErr } = await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || '', role },
      });
      if (createErr) return res.status(400).json({ error: createErr.message });

      await adminClient.from('profiles').upsert({
        id: created.user.id,
        email,
        full_name: full_name || '',
        role,
        updated_at: new Date().toISOString(),
      });

      return res.status(200).json({
        success: true,
        user: { id: created.user.id, email, full_name: full_name || '', role },
      });
    }

    if (req.method === 'PATCH') {
      const { id, role, full_name } = req.body || {};
      if (!id) return res.status(400).json({ error: 'User id required' });
      if (role && !ALLOWED_ROLES.includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      if (id === callerId && role && role !== 'admin') {
        return res.status(400).json({ error: 'You cannot demote yourself' });
      }

      const updates = { updated_at: new Date().toISOString() };
      if (role !== undefined) updates.role = role;
      if (full_name !== undefined) updates.full_name = full_name;

      const { error: updErr } = await adminClient.from('profiles').update(updates).eq('id', id);
      if (updErr) return res.status(400).json({ error: updErr.message });

      return res.status(200).json({ success: true });
    }

    if (req.method === 'DELETE') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'User id required' });
      if (id === callerId) return res.status(400).json({ error: 'You cannot delete yourself' });

      const { error: delErr } = await adminClient.auth.admin.deleteUser(id);
      if (delErr) return res.status(400).json({ error: delErr.message });

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('admin/users error:', err);
    return res.status(500).json({ error: err?.message || 'Server error' });
  }
}
