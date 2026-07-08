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
    if (!supabase) {
      return null;
    }

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
      console.error('Failed to get database session:', err);
    }
    return null;
  },

  /**
   * Log in with Email and Password.
   */
  async signIn(email: string, password: string): Promise<AuthSessionUser> {
    if (!supabase) {
      throw new Error('Database connection is currently unavailable.');
    }

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
      console.error('Sign-in error:', err);
      throw err;
    }
  },

  /**
   * Sign up with Email and Password.
   */
  async signUp(email: string, password: string): Promise<AuthSessionUser> {
    if (!supabase) {
      throw new Error('Database connection is currently unavailable.');
    }

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
      console.error('Sign-up error:', err);
      throw err;
    }
  },

  /**
   * Sign out current user session.
   */
  async signOut(): Promise<void> {
    if (!supabase) {
      return;
    }
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (err) {
      console.error('Sign-out error:', err);
      throw err;
    }
  },

  /**
   * Listener for auth state changes.
   */
  onAuthStateChange(callback: (user: AuthSessionUser | null) => void): () => void {
    if (!supabase) {
      callback(null);
      return () => {};
    }

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
};
