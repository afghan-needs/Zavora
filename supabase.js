const SUPABASE_URL = 'https://lpxqytvxkspisynnxclx.supabase.co';

const SUPABASE_ANON_KEY = 'sb_publishable_i-CDJUvlDbzkfXF1_dq-PA_XSyZnsTR';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log('ZAVORA Supabase client initialized');
