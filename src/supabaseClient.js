import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client
// You need to replace these with your actual Supabase project URL and anon key.
// Ideally, store these in a .env file as REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://pbowfuwmeziybftgzdfy.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_yBbUdGwLtg0dHwqUMLq3aA_9LLUn_sl';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
