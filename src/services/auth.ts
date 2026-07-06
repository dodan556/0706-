/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface AuthSessionUser {
  id: string;
  email: string;
}

export const authService = {
  /**
   * Check current session.
   */
  async getSession(): Promise<AuthSessionUser | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        if (session && session.user) {
          return {
            id: session.user.id,
            email: session.user.email || ''
          };
        }
      } catch (err) {
        console.error('Failed to get Supabase session:', err);
      }
    }

    // Fallback local storage session
    const localSession = localStorage.getItem('admin_session');
    if (localSession === 'authenticated') {
      return { id: 'local-admin', email: 'admin@portfolio.com' };
    }
    return null;
  },

  /**
   * Log in with Email and Password.
   */
  async signIn(email: string, password: string): Promise<AuthSessionUser> {
    // Check master password override
    if (password === '1111') {
      localStorage.setItem('admin_session', 'authenticated');
      return { id: 'local-admin', email: email || 'admin@portfolio.com' };
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          throw new Error(`[Auth Error] ${error.message}`);
        }

        if (data && data.user) {
          return {
            id: data.user.id,
            email: data.user.email || ''
          };
        }
        throw new Error('Authentication returned empty user data.');
      } catch (err: any) {
        console.error('Supabase signIn error:', err);
        throw err;
      }
    }

    // Fallback static validation
    if (email === 'admin@portfolio.com' && password === 'admin123') {
      localStorage.setItem('admin_session', 'authenticated');
      return { id: 'local-admin', email: 'admin@portfolio.com' };
    } else {
      throw new Error('Invalid local credentials. Use password 1111');
    }
  },

  /**
   * Sign up with Email and Password.
   */
  async signUp(email: string, password: string): Promise<AuthSessionUser> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password
        });

        if (error) {
          throw new Error(`[Auth Error] ${error.message}`);
        }

        if (data && data.user) {
          return {
            id: data.user.id,
            email: data.user.email || ''
          };
        }
        throw new Error('Registration returned empty user data.');
      } catch (err: any) {
        console.error('Supabase signUp error:', err);
        throw err;
      }
    }

    throw new Error('Sign-up is only available with active Supabase connection cloud mode.');
  },

  /**
   * Sign out current user session.
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    localStorage.removeItem('admin_session');
  },

  /**
   * Listener for auth state changes.
   */
  onAuthStateChange(callback: (user: AuthSessionUser | null) => void): () => void {
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          callback({
            id: session.user.id,
            email: session.user.email || ''
          });
        } else {
          callback(null);
        }
      });
      // Return unsubscribe closure
      return () => subscription.unsubscribe();
    }

    // Poller fallback for LocalStorage
    const interval = setInterval(() => {
      const active = localStorage.getItem('admin_session') === 'authenticated';
      callback(active ? { id: 'local-admin', email: 'admin@portfolio.com' } : null);
    }, 1200);

    return () => clearInterval(interval);
  }
};
