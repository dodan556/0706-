/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DatabaseProject {
  id: string;
  title: string;
  description: string;
  long_description?: string;
  cover_image: string;
  images?: string[];
  category: string;
  tags: string[];
  role?: string;
  client?: string;
  year: string;
  link?: string;
  github?: string;
  featured: boolean;
  created_at?: string;
  
  // NEW CMS detail fields
  detail_title?: string;
  detail_quote?: string;
  software_programs?: any; // jsonb Array of ProgramInfo
  project_highlights?: string[]; // text[]
}

export interface DatabaseContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at?: string;
  status: 'unread' | 'read' | 'archived';
}

export interface DatabaseHomeSettings {
  id: string;
  line1: string;
  line2: string;
  line3: string;
  sub_headline: string;
  experience: string;
  location: string;
  primary_stack: string;
  infrastructure: string;
  updated_at?: string;
}

export interface DatabaseAboutSettings {
  id: string;
  title: string;
  subtitle: string;
  p1: string;
  p2: string;
  p3: string;
  updated_at?: string;
}

export interface DatabaseSkill {
  id: string;
  name: string;
  category: 'design' | 'development' | 'tools';
  level: number;
  icon_name?: string;
  sort_order: number;
  created_at?: string;
}

export interface DatabaseCertification {
  id: string;
  name: string;
  authority: string;
  date: string;
  code: string;
  sort_order: number;
  created_at?: string;
}

export interface DatabaseContactChannel {
  id: string;
  label: string;
  value: string;
  icon_name: string;
  type: 'contact' | 'social';
  sort_order: number;
  created_at?: string;
}

export interface DatabaseSchema {
  public: {
    Tables: {
      projects: {
        Row: DatabaseProject;
        Insert: Omit<DatabaseProject, 'created_at'> & { created_at?: string };
        Update: Partial<DatabaseProject>;
      };
      contact_submissions: {
        Row: DatabaseContactSubmission;
        Insert: Omit<DatabaseContactSubmission, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DatabaseContactSubmission>;
      };
      home_settings: {
        Row: DatabaseHomeSettings;
        Insert: DatabaseHomeSettings;
        Update: Partial<DatabaseHomeSettings>;
      };
      about_settings: {
        Row: DatabaseAboutSettings;
        Insert: DatabaseAboutSettings;
        Update: Partial<DatabaseAboutSettings>;
      };
      skills: {
        Row: DatabaseSkill;
        Insert: Omit<DatabaseSkill, 'created_at'> & { created_at?: string };
        Update: Partial<DatabaseSkill>;
      };
      certifications: {
        Row: DatabaseCertification;
        Insert: Omit<DatabaseCertification, 'created_at'> & { created_at?: string };
        Update: Partial<DatabaseCertification>;
      };
      contact_channels: {
        Row: DatabaseContactChannel;
        Insert: Omit<DatabaseContactChannel, 'created_at'> & { created_at?: string };
        Update: Partial<DatabaseContactChannel>;
      };
    };
  };
}
