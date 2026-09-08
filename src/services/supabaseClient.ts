import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (import.meta as any).env?.VITE_SUPABASE_URL ||
  (import.meta as any).env?.REACT_APP_SUPABASE_URL ||
  '';

const SUPABASE_KEY =
  (import.meta as any).env?.VITE_SUPABASE_ANON_KEY ||
  (import.meta as any).env?.VITE_SUPABASE_KEY ||
  (import.meta as any).env?.REACT_APP_SUPABASE_KEY ||
  '';

export const supabase =
  SUPABASE_URL && SUPABASE_KEY
    ? createClient(SUPABASE_URL, SUPABASE_KEY)
    : null;
