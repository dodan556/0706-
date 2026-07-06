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
    if (isSupabaseConfigured && supabase) {
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
    }

    // Fallback
    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    return cached ? JSON.parse(cached) : [];
  },

  /**
   * Submit a new contact message.
   */
  async submitMessage(submission: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<ContactSubmission> {
    const newId = String(Date.now() + Math.floor(Math.random() * 1000));
    const completeSubmission: ContactSubmission = {
      ...submission,
      id: newId,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    if (isSupabaseConfigured && supabase) {
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
    }

    // Fallback
    const existing = await this.getSubmissions();
    const updated = [completeSubmission, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return completeSubmission;
  },

  /**
   * Update the status of an inquiry (e.g. read, archived).
   */
  async updateStatus(id: string, newStatus: 'unread' | 'read' | 'archived'): Promise<ContactSubmission> {
    if (isSupabaseConfigured && supabase) {
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
    }

    // Fallback
    const existing = await this.getSubmissions();
    const index = existing.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Submission with ID ${id} not found.`);
    }

    const updatedItem = { ...existing[index], status: newStatus };
    const updatedList = [...existing];
    updatedList[index] = updatedItem;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
    return updatedItem;
  },

  /**
   * Delete a submission.
   */
  async deleteSubmission(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
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

    // Fallback
    const existing = await this.getSubmissions();
    const filtered = existing.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  }
};
