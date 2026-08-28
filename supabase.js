
const SUPABASE_URL = 'https://lpxqytvxkspisynnxclx.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxweHF5dHZ4a3NwaXN5bm54Y2x4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzQ4NzgsImV4cCI6MjEwMzMxMDg3OH0.K1BvP5Sw6b1XNKz7FEXDjvc0ZQf8SRu4wBkE2mErRqQ';

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);
