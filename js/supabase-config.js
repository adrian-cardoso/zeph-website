// ===== Supabase Configuration =====
const SUPABASE_URL = 'https://hqyukitequuckblhgzbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxeXVraXRlcXV1Y2tibGhnemJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5OTkxMzEsImV4cCI6MjA5MDU3NTEzMX0.cUwmDNwwUxndHjvSVbr4iHUyK_teK_Im1d6wNU4oLRY';

const db = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
