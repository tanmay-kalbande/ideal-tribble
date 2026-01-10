// src/lib/supabaseClient.ts
// Supabase client initialization

import { createClient } from '@supabase/supabase-js';
import config from '../config';

// Debug logging
console.log('🔧 Supabase Config:', {
  url: config.supabase.url ? '✓ Set' : '✗ Missing',
  key: config.supabase.anonKey ? '✓ Set' : '✗ Missing',
  configured: config.isSupabaseConfigured
});

if (!config.isSupabaseConfigured) {
  console.warn(
    '⚠️ Supabase credentials not found. Auth features will be disabled.',
    'Set K_SUPABASE_URL and K_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = config.isSupabaseConfigured
  ? createClient(config.supabase.url, config.supabase.anonKey, {
    auth: {
      persistSession: true, // Persist session to localStorage
      autoRefreshToken: true, // Auto refresh expired tokens
      detectSessionInUrl: true, // Handle OAuth redirects
      storageKey: 'kitaab-auth', // Unique storage key for this app
    }
  })
  : null;

export const isSupabaseConfigured = (): boolean => config.isSupabaseConfigured;
