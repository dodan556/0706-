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
import { INITIAL_SKILLS } from '../lib/portfolioData';

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

// --- Defaults / Cache Keys ---
const CACHE_KEYS = {
  home: 'cms_home_settings',
  about: 'cms_about_settings',
  skills: 'cms_skills',
  certs: 'cms_certifications',
  contacts: 'cms_contact_channels',
  bioLeft: 'cms_bio_left',
  bioCards: 'cms_bio_cards',
};

const DEFAULT_HOME: HomeSettings = {
  id: 'main',
  line1: 'FIFTEEN',
  line2: 'YEARS OF',
  line3: 'CRAFT',
  subHeadline: 'Specializing in premium high-fidelity React architectures, robust system scale blueprints, and micro-hover states designed carefully with surgical discipline.',
  experience: '15+ Years Professional',
  location: 'Seoul, KR / Remote',
  primaryStack: 'React / TS / Tailwind',
  infrastructure: 'Supabase / PG / Firebase',
};

const DEFAULT_ABOUT: AboutSettings = {
  id: 'main',
  title: 'ABOUT ME',
  subtitle: 'BIOGRAPHY PROFILE',
  p1: '안녕하세요. 브랜드의 메시지를 직관적이고 효과적으로 전달하는 웹 & 비주얼 디자이너 PARK SEONGMI 입니다. 단순히 보기 좋은 그래픽을 넘어, 목적과 결과를 고려한 사용자 중심의 디자인 솔루션을 제공합니다.',
  p2: '특히 브랜드와 제품의 장점을 극대화하는 맞춤형 상세페이지 제작과 1688·타오바오 등의 중국 상품 상세페이지를 국내 소비 트렌드에 최적화하여 리디자인하는 작업을 전문으로 하고 있습니다.',
  p3: '사용자가 쉽게 이해할 수 있는 타이포그래피 그리드, 정보의 구조화, 설득력 있는 비주얼 레이아웃을 연구하여 브랜드의 가치가 자연스럽게 녹아들고 매출과 전환으로 이어지는 결과를 이끌어냅니다.',
};

const DEFAULT_SKILLS: Skill[] = INITIAL_SKILLS.map((s, idx) => ({ ...s, sortOrder: idx }));

const DEFAULT_CERTS: Certification[] = [
  { id: '1', name: '정보처리기사 (Engineer Information Processing)', authority: 'Human Resources Development Service of Korea', date: '2015.06', code: 'License No. 15401050218U', sortOrder: 0 },
  { id: '2', name: 'AWS Certified Cloud Practitioner', authority: 'Amazon Web Services', date: '2022.11', code: 'Validation ID: QG6Z7BL2N2E1QGCS', sortOrder: 1 },
  { id: '3', name: 'Google UX Design Professional Certificate', authority: 'Google / Coursera', date: '2021.04', code: 'Credential ID: GUXD-984210', sortOrder: 2 },
  { id: '4', name: 'Certified ScrumMaster® (CSM)', authority: 'Scrum Alliance', date: '2019.08', code: 'Credential ID: 001004529', sortOrder: 3 },
];

const DEFAULT_CONTACTS: ContactChannel[] = [
  { id: '1', label: 'DIRECT INBOX', value: 'dodan556@gmail.com', iconName: 'Mail', type: 'contact', sortOrder: 0 },
  { id: '2', label: 'GEOGRAPHY', value: 'Seoul, South Korea / Available Globally', iconName: 'MapPin', type: 'contact', sortOrder: 1 },
  { id: '3', label: 'GITHUB', value: 'https://github.com', iconName: 'Github', type: 'social', sortOrder: 2 },
  { id: '4', label: 'LINKEDIN', value: 'https://linkedin.com', iconName: 'Linkedin', type: 'social', sortOrder: 3 },
  { id: '5', label: 'DRIBBBLE', value: 'https://dribbble.com', iconName: 'Compass', type: 'social', sortOrder: 4 },
];

const DEFAULT_BIO_LEFT: BiographyLeftSettings = {
  id: 'main',
  sectionLabel: 'BIOGRAPHY OVERVIEW',
  mainHeading: 'DETAIL PAGES & VISUAL DESIGN.',
  p1: '브랜드의 메시지를 효과적으로 전달하는 웹 & 비주얼 디자이너입니다.',
  p2: '상세페이지 제작과 중국 상품 상세페이지 리디자인을 중심으로 사용자가 쉽게 이해하고 브랜드의 가치가 자연스럽게 전달되는 디자인을 만듭니다.',
  p3: '보기 좋은 디자인을 넘어 목적과 결과를 함께 고려하는 작업을 지향합니다.',
  buttonText: 'VIEW PROFILE',
};

const DEFAULT_BIO_CARDS: BiographyCard[] = [
  { id: '1', title: 'DETAIL PAGE DESIGN', description: '브랜드와 제품의 장점을 효과적으로 전달하는 상세페이지를 기획하고 디자인합니다.', sortOrder: 0 },
  { id: '2', title: 'CHINA PAGE REDESIGN', description: '1688·타오바오 상품페이지를 국내 소비자에게 맞게 리디자인하고 정보를 보기 쉽게 재구성합니다.', sortOrder: 1 },
  { id: '3', title: 'VISUAL DESIGN', description: '배너, 이벤트 이미지, 프로모션 디자인 등 다양한 온라인 비주얼 콘텐츠를 제작합니다.', sortOrder: 2 },
  { id: '4', title: 'AI DESIGN WORKFLOW', description: 'AI 도구를 활용하여 디자인 기획과 제작 효율을 높이고 완성도 있는 결과물을 만들어갑니다.', sortOrder: 3 },
];

export const cmsService = {
  // ==========================================
  // 1. Home Settings Services
  // ==========================================
  async getHomeSettings(): Promise<HomeSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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

        // If configured but table is empty, return default (and try to seed)
        await supabase.from('home_settings').insert([mapUiToDbHome(DEFAULT_HOME)]);
        return DEFAULT_HOME;
      } catch (err) {
        console.warn('Supabase getHomeSettings failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.home);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_HOME; }
    }
    localStorage.setItem(CACHE_KEYS.home, JSON.stringify(DEFAULT_HOME));
    return DEFAULT_HOME;
  },

  async updateHomeSettings(settings: Partial<HomeSettings>): Promise<HomeSettings> {
    const current = await this.getHomeSettings();
    const updated = { ...current, ...settings };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
    }

    localStorage.setItem(CACHE_KEYS.home, JSON.stringify(updated));
    return updated;
  },

  // ==========================================
  // 2. About Settings Services
  // ==========================================
  async getAboutSettings(): Promise<AboutSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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

        // Auto-seed table if empty
        await supabase.from('about_settings').insert([mapUiToDbAbout(DEFAULT_ABOUT)]);
        return DEFAULT_ABOUT;
      } catch (err) {
        console.warn('Supabase getAboutSettings failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.about);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_ABOUT; }
    }
    localStorage.setItem(CACHE_KEYS.about, JSON.stringify(DEFAULT_ABOUT));
    return DEFAULT_ABOUT;
  },

  async updateAboutSettings(settings: Partial<AboutSettings>): Promise<AboutSettings> {
    const current = await this.getAboutSettings();
    const updated = { ...current, ...settings };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
    }

    localStorage.setItem(CACHE_KEYS.about, JSON.stringify(updated));
    return updated;
  },

  // ==========================================
  // 3. Skills Services
  // ==========================================
  async getSkills(): Promise<Skill[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (data && data.length > 0) {
          return data.map(mapDbToUiSkill);
        }

        // Auto-seed
        const dbRows = DEFAULT_SKILLS.map((s, idx) => mapUiToDbSkill(s, idx));
        await supabase.from('skills').insert(dbRows);
        return DEFAULT_SKILLS;
      } catch (err) {
        console.warn('Supabase getSkills failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.skills);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_SKILLS; }
    }
    localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(DEFAULT_SKILLS));
    return DEFAULT_SKILLS;
  },

  async createSkill(skill: Omit<Skill, 'id'> & { id?: string }): Promise<Skill> {
    const id = skill.id || String(Date.now());
    const skills = await this.getSkills();
    const sortOrder = skills.length;
    const newSkill: Skill = { ...skill, id, sortOrder };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
    }

    const updated = [...skills, newSkill];
    localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(updated));
    return newSkill;
  },

  async updateSkill(id: string, updates: Partial<Skill>): Promise<Skill> {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbUpdates: Partial<DatabaseSkill> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.level !== undefined) dbUpdates.level = updates.level;
        if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
        if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

        const { data, error } = await supabase
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
    }

    const skills = await this.getSkills();
    const index = skills.findIndex(s => s.id === id);
    if (index === -1) throw new Error('Skill not found');

    const updatedSkill = { ...skills[index], ...updates };
    const updatedList = [...skills];
    updatedList[index] = updatedSkill;
    localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(updatedList));
    return updatedSkill;
  },

  async deleteSkill(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          throw new Error('No active database session found. Please log in first to perform deletions.');
        }

        const { data, error } = await supabase
          .from('skills')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Deletion failed. The row was not deleted. This is typically due to Row Level Security (RLS) policies blocking deletes, or the ID does not exist.');
        }

        // Sync local cache
        const skills = await this.getSkills().catch(() => []);
        const filtered = skills.filter(s => s.id !== id);
        localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(filtered));

        return true;
      } catch (err: any) {
        console.error(`Failed to delete skill ${id} from Supabase:`, err);
        throw err;
      }
    }

    const skills = await this.getSkills();
    const filtered = skills.filter(s => s.id !== id);
    localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(filtered));
    return true;
  },

  async reorderSkills(orderedIds: string[]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        // Update each item in a transaction-like loop
        const promises = orderedIds.map((id, index) => 
          supabase
            .from('skills')
            .update({ sort_order: index })
            .eq('id', id)
        );
        await Promise.all(promises);
        return true;
      } catch (err) {
        console.error('Failed to reorder skills in Supabase:', err);
        throw err;
      }
    }

    const skills = await this.getSkills();
    const reordered = orderedIds
      .map(id => skills.find(s => s.id === id))
      .filter((s): s is Skill => s !== undefined)
      .map((s, idx) => ({ ...s, sortOrder: idx }));

    localStorage.setItem(CACHE_KEYS.skills, JSON.stringify(reordered));
    return true;
  },

  // ==========================================
  // 4. Certifications Services
  // ==========================================
  async getCertifications(): Promise<Certification[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('certifications')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (data && data.length > 0) {
          return data.map(mapDbToUiCert);
        }

        // Auto-seed
        const dbRows = DEFAULT_CERTS.map((c, idx) => mapUiToDbCert(c, idx));
        await supabase.from('certifications').insert(dbRows);
        return DEFAULT_CERTS;
      } catch (err) {
        console.warn('Supabase getCertifications failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.certs);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_CERTS; }
    }
    localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(DEFAULT_CERTS));
    return DEFAULT_CERTS;
  },

  async createCertification(cert: Omit<Certification, 'id'> & { id?: string }): Promise<Certification> {
    const id = cert.id || String(Date.now());
    const certs = await this.getCertifications();
    const sortOrder = certs.length;
    const newCert: Certification = { ...cert, id, sortOrder };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
    }

    const updated = [...certs, newCert];
    localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(updated));
    return newCert;
  },

  async updateCertification(id: string, updates: Partial<Certification>): Promise<Certification> {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbUpdates: Partial<DatabaseCertification> = {};
        if (updates.name !== undefined) dbUpdates.name = updates.name;
        if (updates.authority !== undefined) dbUpdates.authority = updates.authority;
        if (updates.date !== undefined) dbUpdates.date = updates.date;
        if (updates.code !== undefined) dbUpdates.code = updates.code;
        if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

        const { data, error } = await supabase
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
    }

    const certs = await this.getCertifications();
    const index = certs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Certification not found');

    const updatedCert = { ...certs[index], ...updates };
    const updatedList = [...certs];
    updatedList[index] = updatedCert;
    localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(updatedList));
    return updatedCert;
  },

  async deleteCertification(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          throw new Error('No active database session found. Please log in first to perform deletions.');
        }

        const { data, error } = await supabase
          .from('certifications')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Deletion failed. The row was not deleted. This is typically due to Row Level Security (RLS) policies blocking deletes, or the ID does not exist.');
        }

        // Sync local cache
        const certs = await this.getCertifications().catch(() => []);
        const filtered = certs.filter(c => c.id !== id);
        localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(filtered));

        return true;
      } catch (err: any) {
        console.error(`Failed to delete certification ${id} from Supabase:`, err);
        throw err;
      }
    }

    const certs = await this.getCertifications();
    const filtered = certs.filter(c => c.id !== id);
    localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(filtered));
    return true;
  },

  async reorderCertifications(orderedIds: string[]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const promises = orderedIds.map((id, index) => 
          supabase
            .from('certifications')
            .update({ sort_order: index })
            .eq('id', id)
        );
        await Promise.all(promises);
        return true;
      } catch (err) {
        console.error('Failed to reorder certifications in Supabase:', err);
        throw err;
      }
    }

    const certs = await this.getCertifications();
    const reordered = orderedIds
      .map(id => certs.find(c => c.id === id))
      .filter((c): c is Certification => c !== undefined)
      .map((c, idx) => ({ ...c, sortOrder: idx }));

    localStorage.setItem(CACHE_KEYS.certs, JSON.stringify(reordered));
    return true;
  },

  // ==========================================
  // 5. Contact Channels Services
  // ==========================================
  async getContactChannels(): Promise<ContactChannel[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('contact_channels')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (data && data.length > 0) {
          return data.map(mapDbToUiContact);
        }

        // Auto-seed
        const dbRows = DEFAULT_CONTACTS.map((cc, idx) => mapUiToDbContact(cc, idx));
        await supabase.from('contact_channels').insert(dbRows);
        return DEFAULT_CONTACTS;
      } catch (err) {
        console.warn('Supabase getContactChannels failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.contacts);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_CONTACTS; }
    }
    localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(DEFAULT_CONTACTS));
    return DEFAULT_CONTACTS;
  },

  async createContactChannel(channel: Omit<ContactChannel, 'id'> & { id?: string }): Promise<ContactChannel> {
    const id = channel.id || String(Date.now());
    const channels = await this.getContactChannels();
    const sortOrder = channels.length;
    const newChannel: ContactChannel = { ...channel, id, sortOrder };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
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
    }

    const updated = [...channels, newChannel];
    localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(updated));
    return newChannel;
  },

  async updateContactChannel(id: string, updates: Partial<ContactChannel>): Promise<ContactChannel> {
    if (isSupabaseConfigured && supabase) {
      try {
        const dbUpdates: Partial<DatabaseContactChannel> = {};
        if (updates.label !== undefined) dbUpdates.label = updates.label;
        if (updates.value !== undefined) dbUpdates.value = updates.value;
        if (updates.iconName !== undefined) dbUpdates.icon_name = updates.iconName;
        if (updates.type !== undefined) dbUpdates.type = updates.type;
        if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

        const { data, error } = await supabase
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
    }

    const channels = await this.getContactChannels();
    const index = channels.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact channel not found');

    const updatedChannel = { ...channels[index], ...updates };
    const updatedList = [...channels];
    updatedList[index] = updatedChannel;
    localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(updatedList));
    return updatedChannel;
  },

  async deleteContactChannel(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          throw new Error('No active database session found. Please log in first to perform deletions.');
        }

        const { data, error } = await supabase
          .from('contact_channels')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Deletion failed. The row was not deleted. This is typically due to Row Level Security (RLS) policies blocking deletes, or the ID does not exist.');
        }

        // Sync local cache
        const channels = await this.getContactChannels().catch(() => []);
        const filtered = channels.filter(c => c.id !== id);
        localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(filtered));

        return true;
      } catch (err: any) {
        console.error(`Failed to delete contact channel ${id} from Supabase:`, err);
        throw err;
      }
    }

    const channels = await this.getContactChannels();
    const filtered = channels.filter(c => c.id !== id);
    localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(filtered));
    return true;
  },

  async reorderContactChannels(orderedIds: string[]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const promises = orderedIds.map((id, index) => 
          supabase
            .from('contact_channels')
            .update({ sort_order: index })
            .eq('id', id)
        );
        await Promise.all(promises);
        return true;
      } catch (err) {
        console.error('Failed to reorder contact channels in Supabase:', err);
        throw err;
      }
    }

    const channels = await this.getContactChannels();
    const reordered = orderedIds
      .map(id => channels.find(c => c.id === id))
      .filter((c): c is ContactChannel => c !== undefined)
      .map((c, idx) => ({ ...c, sortOrder: idx }));

    localStorage.setItem(CACHE_KEYS.contacts, JSON.stringify(reordered));
    return true;
  },

  // ==========================================
  // 6. Biography Settings & Cards Services
  // ==========================================
  async getBioLeftSettings(): Promise<BiographyLeftSettings> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from('biography_left_settings')
            .select('*')
            .eq('id', 'main')
            .maybeSingle();

          if (error) {
            console.warn('[Supabase] biography_left_settings table might not exist:', error.message);
          } else if (data) {
            return {
              id: data.id,
              sectionLabel: data.section_label || data.sectionLabel || DEFAULT_BIO_LEFT.sectionLabel,
              mainHeading: data.main_heading || data.mainHeading || DEFAULT_BIO_LEFT.mainHeading,
              p1: data.p1 || DEFAULT_BIO_LEFT.p1,
              p2: data.p2 || DEFAULT_BIO_LEFT.p2,
              p3: data.p3 || DEFAULT_BIO_LEFT.p3,
              buttonText: data.button_text || data.buttonText || DEFAULT_BIO_LEFT.buttonText,
            };
          }
        }
      } catch (err) {
        console.warn('Supabase getBioLeftSettings failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.bioLeft);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_BIO_LEFT; }
    }
    localStorage.setItem(CACHE_KEYS.bioLeft, JSON.stringify(DEFAULT_BIO_LEFT));
    return DEFAULT_BIO_LEFT;
  },

  async updateBioLeftSettings(settings: Partial<BiographyLeftSettings>): Promise<BiographyLeftSettings> {
    const current = await this.getBioLeftSettings();
    const updated = { ...current, ...settings };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const dbRow = {
            id: updated.id,
            section_label: updated.sectionLabel,
            main_heading: updated.mainHeading,
            p1: updated.p1,
            p2: updated.p2,
            p3: updated.p3,
            button_text: updated.buttonText,
          };
          const { data, error } = await supabase
            .from('biography_left_settings')
            .upsert(dbRow)
            .select()
            .single();

          if (!error && data) {
            return {
              id: data.id,
              sectionLabel: data.section_label || data.sectionLabel || updated.sectionLabel,
              mainHeading: data.main_heading || data.mainHeading || updated.mainHeading,
              p1: data.p1 || updated.p1,
              p2: data.p2 || updated.p2,
              p3: data.p3 || updated.p3,
              buttonText: data.button_text || data.buttonText || updated.buttonText,
            };
          }
        }
      } catch (err: any) {
        console.warn('Failed to update biography left settings in Supabase:', err);
      }
    }

    localStorage.setItem(CACHE_KEYS.bioLeft, JSON.stringify(updated));
    return updated;
  },

  async getBioCards(): Promise<BiographyCard[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from('biography_cards')
            .select('*')
            .order('sort_order', { ascending: true });

          if (error) {
            console.warn('[Supabase] biography_cards table might not exist:', error.message);
          } else if (data && data.length > 0) {
            return data.map((d: any) => ({
              id: d.id,
              title: d.title,
              description: d.description,
              sortOrder: d.sort_order ?? d.sortOrder ?? 0,
            }));
          }
        }
      } catch (err) {
        console.warn('Supabase getBioCards failed. Using cache/defaults:', err);
      }
    }

    const cached = localStorage.getItem(CACHE_KEYS.bioCards);
    if (cached) {
      try { return JSON.parse(cached); } catch { return DEFAULT_BIO_CARDS; }
    }
    localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(DEFAULT_BIO_CARDS));
    return DEFAULT_BIO_CARDS;
  },

  async createBioCard(card: Omit<BiographyCard, 'id'> & { id?: string }): Promise<BiographyCard> {
    const id = card.id || String(Date.now());
    const cards = await this.getBioCards();
    const sortOrder = cards.length;
    const newCard: BiographyCard = { ...card, id, sortOrder };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const { data, error } = await supabase
            .from('biography_cards')
            .insert([{ id, title: newCard.title, description: newCard.description, sort_order: sortOrder }])
            .select()
            .single();

          if (!error && data) {
            return {
              id: data.id,
              title: data.title,
              description: data.description,
              sortOrder: data.sort_order ?? data.sortOrder ?? sortOrder,
            };
          }
        }
      } catch (err: any) {
        console.warn('Failed to create biography card in Supabase:', err);
      }
    }

    const updated = [...cards, newCard];
    localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(updated));
    return newCard;
  },

  async updateBioCard(id: string, updates: Partial<BiographyCard>): Promise<BiographyCard> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const dbUpdates: any = {};
          if (updates.title !== undefined) dbUpdates.title = updates.title;
          if (updates.description !== undefined) dbUpdates.description = updates.description;
          if (updates.sortOrder !== undefined) dbUpdates.sort_order = updates.sortOrder;

          const { data, error } = await supabase
            .from('biography_cards')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single();

          if (!error && data) {
            return {
              id: data.id,
              title: data.title,
              description: data.description,
              sortOrder: data.sort_order ?? data.sortOrder ?? (updates.sortOrder || 0),
            };
          }
        }
      } catch (err: any) {
        console.warn(`Failed to update biography card ${id}:`, err);
      }
    }

    const cards = await this.getBioCards();
    const index = cards.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Biography card not found');

    const updatedCard = { ...cards[index], ...updates };
    const updatedList = [...cards];
    updatedList[index] = updatedCard;
    localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(updatedList));
    return updatedCard;
  },

  async deleteBioCard(id: string): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session || !session.user) {
          throw new Error('No active database session found. Please log in first to perform deletions.');
        }

        const { data, error } = await supabase
          .from('biography_cards')
          .delete()
          .eq('id', id)
          .select();

        if (error) {
          throw new Error(`[Supabase Error] ${error.message}`);
        }

        if (!data || data.length === 0) {
          throw new Error('Deletion failed. The row was not deleted. This is typically due to Row Level Security (RLS) policies blocking deletes, or the ID does not exist.');
        }

        // Sync local cache
        const cards = await this.getBioCards().catch(() => []);
        const filtered = cards.filter(c => c.id !== id);
        localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(filtered));

        return true;
      } catch (err: any) {
        console.warn(`Failed to delete biography card ${id} from Supabase:`, err);
        throw err;
      }
    }

    const cards = await this.getBioCards();
    const filtered = cards.filter(c => c.id !== id);
    localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(filtered));
    return true;
  },

  async reorderBioCards(orderedIds: string[]): Promise<boolean> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user) {
          const promises = orderedIds.map((id, index) => 
            supabase
              .from('biography_cards')
              .update({ sort_order: index })
              .eq('id', id)
          );
          await Promise.all(promises);
          return true;
        }
      } catch (err) {
        console.warn('Failed to reorder biography cards in Supabase:', err);
      }
    }

    const cards = await this.getBioCards();
    const reordered = orderedIds
      .map(id => cards.find(c => c.id === id))
      .filter((c): c is BiographyCard => c !== undefined)
      .map((c, idx) => ({ ...c, sortOrder: idx }));

    localStorage.setItem(CACHE_KEYS.bioCards, JSON.stringify(reordered));
    return true;
  }
};
