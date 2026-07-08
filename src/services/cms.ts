/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  HomeSettings, 
  AboutSettings, 
  Skill, 
  Certification, 
  ContactChannel,
  BiographyCard,
  BiographyLeftSettings
} from '../types';
import { 
  DatabaseHomeSettings, 
  DatabaseAboutSettings, 
  DatabaseSkill, 
  DatabaseCertification, 
  DatabaseContactChannel 
} from '../types/supabase';

// --- Mappings ---
function mapDbToUiHome(db: DatabaseHomeSettings): HomeSettings {
  return {
    id: db.id,
    line1: db.line1,
    line2: db.line2,
    line3: db.line3,
    subHeadline: db.sub_headline,
    experience: db.experience,
    location: db.location,
    primaryStack: db.primary_stack,
    infrastructure: db.infrastructure,
  };
}

function mapUiToDbHome(ui: HomeSettings): DatabaseHomeSettings {
  return {
    id: ui.id,
    line1: ui.line1,
    line2: ui.line2,
    line3: ui.line3,
    sub_headline: ui.subHeadline,
    experience: ui.experience,
    location: ui.location,
    primary_stack: ui.primaryStack,
    infrastructure: ui.infrastructure,
  };
}

function mapDbToUiAbout(db: DatabaseAboutSettings): AboutSettings {
  return {
    id: db.id,
    title: db.title,
    subtitle: db.subtitle,
    p1: db.p1,
    p2: db.p2,
    p3: db.p3,
  };
}

function mapUiToDbAbout(ui: AboutSettings): DatabaseAboutSettings {
  return {
    id: ui.id,
    title: ui.title,
    subtitle: ui.subtitle,
    p1: ui.p1,
    p2: ui.p2,
    p3: ui.p3,
  };
}

function mapDbToUiSkill(db: DatabaseSkill): Skill {
  return {
    id: db.id,
    name: db.name,
    category: db.category,
    level: db.level,
    iconName: db.icon_name,
    sortOrder: db.sort_order,
  };
}

function mapUiToDbSkill(ui: Skill, index: number): DatabaseSkill {
  return {
    id: ui.id,
    name: ui.name,
    category: ui.category,
    level: ui.level,
    icon_name: ui.iconName,
    sort_order: ui.sortOrder !== undefined ? ui.sortOrder : index,
  };
}

function mapDbToUiCert(db: DatabaseCertification): Certification {
  return {
    id: db.id,
    name: db.name,
    authority: db.authority,
    date: db.date,
    code: db.code,
    sortOrder: db.sort_order,
  };
}

function mapUiToDbCert(ui: Certification, index: number): DatabaseCertification {
  return {
    id: ui.id,
    name: ui.name,
    authority: ui.authority,
    date: ui.date,
    code: ui.code,
    sort_order: ui.sortOrder !== undefined ? ui.sortOrder : index,
  };
}

function mapDbToUiContact(db: DatabaseContactChannel): ContactChannel {
  return {
    id: db.id,
    label: db.label,
    value: db.value,
    iconName: db.icon_name,
    type: db.type,
    sortOrder: db.sort_order,
  };
}

function mapUiToDbContact(ui: ContactChannel, index: number): DatabaseContactChannel {
  return {
    id: ui.id,
    label: ui.label,
    value: ui.value,
    icon_name: ui.iconName,
    type: ui.type,
    sort_order: ui.sortOrder !== undefined ? ui.sortOrder : index,
  };
}

// --- Defaults (Blank Initial States) ---
const BLANK_HOME: HomeSettings = {
  id: 'main',
  line1: '',
  line2: '',
  line3: '',
  subHeadline: '',
  experience: 'Career Years||||||0',
  location: 'Location Hub||||||1',
  primaryStack: 'Core Tech Stack||||||2',
  infrastructure: 'Infrastructure Node||||||3',
};

const BLANK_ABOUT: AboutSettings = {
  id: 'main',
  title: '',
  subtitle: '',
  p1: '',
  p2: '',
  p3: '',
};

const BLANK_BIO_LEFT: BiographyLeftSettings = {
  id: 'main',
  sectionLabel: '',
  mainHeading: '',
  p1: '',
  p2: '',
  p3: '',
  buttonText: '',
};

function checkConfig() {
  if (!supabase) {
    throw new Error('Database connection required.');
  }
}

export const cmsService = {
  // ==========================================
  // 1. Home Settings Services
  // ==========================================
  async getHomeSettings(): Promise<HomeSettings> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('home_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data) {
        return mapDbToUiHome(data);
      }

      return BLANK_HOME;
    } catch (err: any) {
      console.error('Supabase getHomeSettings failed:', err);
      throw err;
    }
  },

  async updateHomeSettings(settings: Partial<HomeSettings>): Promise<HomeSettings> {
    checkConfig();
    const current = await this.getHomeSettings();
    const updated = { ...current, ...settings };

    try {
      const { data, error } = await supabase!
        .from('home_settings')
        .upsert(mapUiToDbHome(updated))
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiHome(data);
    } catch (err: any) {
      console.error('Failed to update home settings in Supabase:', err);
      throw err;
    }
  },

  // ==========================================
  // 2. About Settings Services
  // ==========================================
  async getAboutSettings(): Promise<AboutSettings> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('about_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data) {
        return mapDbToUiAbout(data);
      }

      return BLANK_ABOUT;
    } catch (err: any) {
      console.error('Supabase getAboutSettings failed:', err);
      throw err;
    }
  },

  async updateAboutSettings(settings: Partial<AboutSettings>): Promise<AboutSettings> {
    checkConfig();
    const current = await this.getAboutSettings();
    const updated = { ...current, ...settings };

    try {
      const { data, error } = await supabase!
        .from('about_settings')
        .upsert(mapUiToDbAbout(updated))
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiAbout(data);
    } catch (err: any) {
      console.error('Failed to update about settings in Supabase:', err);
      throw err;
    }
  },

  // ==========================================
  // 3. Skills Services
  // ==========================================
  async getSkills(): Promise<Skill[]> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('skills')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data && data.length > 0) {
        return data.map(mapDbToUiSkill);
      }

      return [];
    } catch (err: any) {
      console.error('Supabase getSkills failed:', err);
      throw err;
    }
  },

  async createSkill(skill: Omit<Skill, 'id'> & { id?: string }): Promise<Skill> {
    checkConfig();
    const id = skill.id || String(Date.now());
    const skills = await this.getSkills();
    const sortOrder = skills.length;
    const newSkill: Skill = { ...skill, id, sortOrder };

    try {
      const { data, error } = await supabase!
        .from('skills')
        .insert([mapUiToDbSkill(newSkill, sortOrder)])
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiSkill(data);
    } catch (err: any) {
      console.error('Failed to create skill in Supabase:', err);
      throw err;
    }
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    checkConfig();
    try {
      const dbUpdates: Partial<DatabaseSkill> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.level !== undefined) dbUpdates.level = updates.level;
      if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

      const { data, error } = await supabase!
        .from('skills')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiSkill(data);
    } catch (err: any) {
      console.error(`Failed to update skill ${id}:`, err);
      throw err;
    }
  },

  async deleteSkill(id: string): Promise<boolean> {
    checkConfig();
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session || !session.user) {
        throw new Error('No active database session found. Please log in first to perform deletions.');
      }

      const { data, error } = await supabase!
        .from('skills')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Deletion failed. The row was not deleted. Row Level Security (RLS) policies might be blocking deletes, or the ID does not exist.');
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete skill ${id} from Supabase:`, err);
      throw err;
    }
  },

  async reorderSkills(orderedIds: string[]): Promise<boolean> {
    checkConfig();
    try {
      const promises = orderedIds.map((id, index) => 
        supabase!
          .from('skills')
          .update({ sort_order: index })
          .eq('id', id)
      );
      await Promise.all(promises);
      return true;
    } catch (err: any) {
      console.error('Failed to reorder skills in Supabase:', err);
      throw err;
    }
  },

  // ==========================================
  // 4. Certifications Services
  // ==========================================
  async getCertifications(): Promise<Certification[]> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('certifications')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data && data.length > 0) {
        return data.map(mapDbToUiCert);
      }

      return [];
    } catch (err: any) {
      console.error('Supabase getCertifications failed:', err);
      throw err;
    }
  },

  async createCertification(cert: Omit<Certification, 'id'> & { id?: string }): Promise<Certification> {
    checkConfig();
    const id = cert.id || String(Date.now());
    const certs = await this.getCertifications();
    const sortOrder = certs.length;
    const newCert: Certification = { ...cert, id, sortOrder };

    try {
      const { data, error } = await supabase!
        .from('certifications')
        .insert([mapUiToDbCert(newCert, sortOrder)])
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiCert(data);
    } catch (err: any) {
      console.error('Failed to create certification in Supabase:', err);
      throw err;
    }
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    checkConfig();
    try {
      const dbUpdates: Partial<DatabaseCertification> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.authority !== undefined) dbUpdates.authority = updates.authority;
      if (updates.date !== undefined) dbUpdates.date = updates.date;
      if (updates.code !== undefined) dbUpdates.code = updates.code;
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

      const { data, error } = await supabase!
        .from('certifications')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiCert(data);
    } catch (err: any) {
      console.error(`Failed to update certification ${id}:`, err);
      throw err;
    }
  },

  async deleteCertification(id: string): Promise<boolean> {
    checkConfig();
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session || !session.user) {
        throw new Error('No active database session found. Please log in first to perform deletions.');
      }

      const { data, error } = await supabase!
        .from('certifications')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Deletion failed. Row Level Security (RLS) policies might be blocking deletes, or the ID does not exist.');
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete certification ${id} from Supabase:`, err);
      throw err;
    }
  },

  async reorderCertifications(orderedIds: string[]): Promise<boolean> {
    checkConfig();
    try {
      const promises = orderedIds.map((id, index) => 
        supabase!
          .from('certifications')
          .update({ sort_order: index })
          .eq('id', id)
      );
      await Promise.all(promises);
      return true;
    } catch (err: any) {
      console.error('Failed to reorder certifications in Supabase:', err);
      throw err;
    }
  },

  // ==========================================
  // 5. Contact Channels Services
  // ==========================================
  async getContactChannels(): Promise<ContactChannel[]> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('contact_channels')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data && data.length > 0) {
        return data.map(mapDbToUiContact);
      }

      return [];
    } catch (err: any) {
      console.error('Supabase getContactChannels failed:', err);
      throw err;
    }
  },

  async createContactChannel(channel: Omit<ContactChannel, 'id'> & { id?: string }): Promise<ContactChannel> {
    checkConfig();
    const id = channel.id || String(Date.now());
    const channels = await this.getContactChannels();
    const sortOrder = channels.length;
    const newChannel: ContactChannel = { ...channel, id, sortOrder };

    try {
      const { data, error } = await supabase!
        .from('contact_channels')
        .insert([mapUiToDbContact(newChannel, sortOrder)])
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiContact(data);
    } catch (err: any) {
      console.error('Failed to create contact channel in Supabase:', err);
      throw err;
    }
  },

  async updateContactChannel(id: string, updates: Partial<ContactChannel>): Promise<ContactChannel> {
    checkConfig();
    try {
      const dbUpdates: Partial<DatabaseContactChannel> = {};
      if (updates.label !== undefined) dbUpdates.label = updates.label;
      if (updates.value !== undefined) dbUpdates.value = updates.value;
      if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

      const { data, error } = await supabase!
        .from('contact_channels')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return mapDbToUiContact(data);
    } catch (err: any) {
      console.error(`Failed to update contact channel ${id}:`, err);
      throw err;
    }
  },

  async deleteContactChannel(id: string): Promise<boolean> {
    checkConfig();
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session || !session.user) {
        throw new Error('No active database session found. Please log in first to perform deletions.');
      }

      const { data, error } = await supabase!
        .from('contact_channels')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Deletion failed. Row Level Security (RLS) policies might be blocking deletes, or the ID does not exist.');
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete contact channel ${id} from Supabase:`, err);
      throw err;
    }
  },

  async reorderContactChannels(orderedIds: string[]): Promise<boolean> {
    checkConfig();
    try {
      const promises = orderedIds.map((id, index) => 
        supabase!
          .from('contact_channels')
          .update({ sort_order: index })
          .eq('id', id)
      );
      await Promise.all(promises);
      return true;
    } catch (err: any) {
      console.error('Failed to reorder contact channels in Supabase:', err);
      throw err;
    }
  },

  // ==========================================
  // 6. Biography Settings & Cards Services
  // ==========================================
  async getBioLeftSettings(): Promise<BiographyLeftSettings> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('biography_left_settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data) {
        return {
          id: data.id,
          sectionLabel: data.section_label || data.sectionLabel || '',
          mainHeading: data.main_heading || data.mainHeading || '',
          p1: data.p1 || '',
          p2: data.p2 || '',
          p3: data.p3 || '',
          buttonText: data.button_text || data.buttonText || '',
        };
      }

      return BLANK_BIO_LEFT;
    } catch (err: any) {
      console.error('Supabase getBioLeftSettings failed:', err);
      throw err;
    }
  },

  async updateBioLeftSettings(settings: Partial<BiographyLeftSettings>): Promise<BiographyLeftSettings> {
    checkConfig();
    const current = await this.getBioLeftSettings();
    const updated = { ...current, ...settings };

    try {
      const dbRow = {
        id: updated.id,
        section_label: updated.sectionLabel,
        main_heading: updated.mainHeading,
        p1: updated.p1,
        p2: updated.p2,
        p3: updated.p3,
        button_text: updated.buttonText,
      };
      const { data, error } = await supabase!
        .from('biography_left_settings')
        .upsert(dbRow)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return {
        id: data.id,
        sectionLabel: data.section_label || data.sectionLabel || updated.sectionLabel,
        mainHeading: data.main_heading || data.mainHeading || updated.mainHeading,
        p1: data.p1 || updated.p1,
        p2: data.p2 || updated.p2,
        p3: data.p3 || updated.p3,
        buttonText: data.button_text || data.buttonText || updated.buttonText,
      };
    } catch (err: any) {
      console.error('Failed to update biography left settings in Supabase:', err);
      throw err;
    }
  },

  async getBioCards(): Promise<BiographyCard[]> {
    checkConfig();
    try {
      const { data, error } = await supabase!
        .from('biography_cards')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          sortOrder: d.sort_order ?? d.sortOrder ?? 0,
        }));
      }

      return [];
    } catch (err: any) {
      console.error('Supabase getBioCards failed:', err);
      throw err;
    }
  },

  async createBioCard(card: Omit<BiographyCard, 'id'> & { id?: string }): Promise<BiographyCard> {
    checkConfig();
    const id = card.id || String(Date.now());
    const cards = await this.getBioCards();
    const sortOrder = cards.length;
    const newCard: BiographyCard = { ...card, id, sortOrder };

    try {
      const { data, error } = await supabase!
        .from('biography_cards')
        .insert([{ id, title: newCard.title, description: newCard.description, sort_order: sortOrder }])
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        sortOrder: data.sort_order ?? data.sortOrder ?? sortOrder,
      };
    } catch (err: any) {
      console.error('Failed to create biography card in Supabase:', err);
      throw err;
    }
  },

  async updateBioCard(id: string, updates: Partial<BiographyCard>): Promise<BiographyCard> {
    checkConfig();
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

      const { data, error } = await supabase!
        .from('biography_cards')
        .update(dbUpdates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      return {
        id: data.id,
        title: data.title,
        description: data.description,
        sortOrder: data.sort_order ?? data.sortOrder ?? 0,
      };
    } catch (err: any) {
      console.error(`Failed to update biography card ${id}:`, err);
      throw err;
    }
  },

  async deleteBioCard(id: string): Promise<boolean> {
    checkConfig();
    try {
      const { data: { session } } = await supabase!.auth.getSession();
      if (!session || !session.user) {
        throw new Error('No active database session found. Please log in first to perform deletions.');
      }

      const { data, error } = await supabase!
        .from('biography_cards')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        throw new Error(`[Supabase Error] ${error.message}`);
      }

      if (!data || data.length === 0) {
        throw new Error('Deletion failed. Row Level Security (RLS) policies might be blocking deletes, or the ID does not exist.');
      }

      return true;
    } catch (err: any) {
      console.error(`Failed to delete biography card ${id} from Supabase:`, err);
      throw err;
    }
  },

  async reorderBioCards(orderedIds: string[]): Promise<boolean> {
    checkConfig();
    try {
      const promises = orderedIds.map((id, index) => 
        supabase!
          .from('biography_cards')
          .update({ sort_order: index })
          .eq('id', id)
      );
      await Promise.all(promises);
      return true;
    } catch (err: any) {
      console.error('Failed to reorder biography cards in Supabase:', err);
      throw err;
    }
  }
};
