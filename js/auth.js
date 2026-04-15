// ===== Auth Utilities =====

async function getSession() {
  const { data: { session } } = await db.auth.getSession();
  return session;
}

async function getUserProfile(userId) {
  const { data, error } = await db
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  await db.auth.signOut();
  window.location.href = '/signin.html';
}

async function resetPassword(email) {
  const { error } = await db.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/signin.html'
  });
  if (error) throw error;
}

async function requireAuth(allowedRoles) {
  const session = await getSession();
  if (!session) {
    window.location.href = '/signin.html';
    return null;
  }
  const profile = await getUserProfile(session.user.id);
  if (!profile || !allowedRoles.includes(profile.role)) {
    window.location.href = '/signin.html';
    return null;
  }
  return { session, profile };
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str || '';
  return div.innerHTML;
}

function showToast(message, type) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'success');
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3000);
}
