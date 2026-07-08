/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactSubmission } from '../types';

const LOCAL_STORAGE_KEY = 'supabase_fallback_contact_submissions';

export const contactService = {
  /**
   * Fetch all submissions from Supabase or local storage.
   */
  async getSubmissions(): Promise<ContactSubmission[]> {
    if (!supabase) {
      throw new Error('Database connection required.');
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.message,
        createdAt: item.created_at || new Date().toISOString(),
        status: item.status || 'unread'
      }));
    } catch (err: any) {
      console.error('Failed to load contact submissions from Supabase:', err);
      throw err;
    }
  },

  /**
   * Submit a new contact message.
   */
  async submitMessage(submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    if (!supabase) {
      throw new Error('Database connection required.');
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: submission.name,
            email: submission.email,
            subject: submission.subject,
            message: submission.message,
            status: 'unread'
          }
        ])
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: data.created_at,
        status: data.status || 'unread'
      };
    } catch (err: any) {
      console.error('Failed to submit message to Supabase:', err);
      throw err;
    }
  },

  /**
   * Update the status of an inquiry (e.g. read, archived).
   */
  async updateStatus(id: string, newStatus: 'unread' | 'read' | 'archived'): Promise<ContactSubmission> {
    if (!supabase) {
      throw new Error('Database connection required.');
    }

    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update({ status: newStatus })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
      }

      return {
        id: data.id,
        name: data.name,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: data.created_at,
        status: data.status || 'unread'
      };
    } catch (err: any) {
      console.error(`Failed to update submission ${id} status:`, err);
      throw err;
    }
  },

  /**
   * Delete a submission.
   */
  async deleteSubmission(id: string): Promise<boolean> {
    if (!supabase) {
      throw new Error('Database connection required.');
    }

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`[Supabase Error] ${error.message} (${error.code})`);
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete submission ${id} from Supabase:`, err);
      throw err;
    }
  }
};
