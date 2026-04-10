import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Credenciais do projeto Supabase
// A anon key é segura para expor no frontend (é pública por design)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  "https://bsssfdqroqrvbvfjztbr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzc3NmZHFyb3FydmJ2Zmp6dGJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMDE3OTEsImV4cCI6MjA5MDg3Nzc5MX0.KKqJ8GAczlGZ1YjiMnHzMrzDGe_GQrC6J6jCswWoEiY";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
