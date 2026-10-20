import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// The public publishable key is intended for browser use. Never put a service-role
// key or other server secret in VITE_* variables.
export const supabase = url && publishableKey ? createClient(url, publishableKey) : null;
export const isSupabaseConfigured = Boolean(supabase);
