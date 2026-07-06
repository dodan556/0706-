/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

// Check if credentials are default placeholder strings
const isPlaceholderUrl = !supabaseUrl || 
  supabaseUrl.includes('your-project-id') || 
  supabaseUrl.includes('placeholder') || 
  supabaseUrl === '';

const isPlaceholderKey = !supabaseAnonKey || 
  supabaseAnonKey.includes('your-anon-key') || 
  supabaseAnonKey.includes('placeholder') || 
  supabaseAnonKey === '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !isPlaceholderUrl && 
  !isPlaceholderKey
);

let supabaseInstance: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
  }
} else {
  console.warn(
    'Supabase is not configured or is using placeholder credentials. File uploads will run in local/base64 demo mode.'
  );
}

export const supabase = supabaseInstance;
