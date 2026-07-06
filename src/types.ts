/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProgramInfo {
  name: string;
  role: string;
  category: 'Design' | 'Development' | 'Creative' | 'Graphics' | 'Animation' | 'DevOps' | string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  coverImage: string;
  images?: string[];
  category: string;
  tags: string[];
  role?: string;
  client?: string;
  year: string;
  link?: string;
  github?: string;
  featured: boolean;
  
  // CMS detail fields
  detailTitle?: string;
  detailQuote?: string;
  softwarePrograms?: ProgramInfo[];
  projectHighlights?: string[];
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'read' | 'archived';
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatarImage?: string;
  rating: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'design' | 'development' | 'tools';
  level: number; // 0 to 100
  iconName?: string;
  sortOrder?: number;
}

export interface HomeSettings {
  id: string;
  line1: string;
  line2: string;
  line3: string;
  subHeadline: string;
  experience: string;
  location: string;
  primaryStack: string;
  infrastructure: string;
}

export interface HomeInfoItem {
  key: 'experience' | 'location' | 'primaryStack' | 'infrastructure';
  label: string;
  value: string;
  sortOrder: number;
}

export function parseHomeInfoItem(
  key: 'experience' | 'location' | 'primaryStack' | 'infrastructure',
  rawValue: string,
  defaultLabel: string,
  defaultOrder: number
): HomeInfoItem {
  if (rawValue && rawValue.includes('|||')) {
    const parts = rawValue.split('|||');
    return {
      key,
      label: parts[0] || defaultLabel,
      value: parts[1] || '',
      sortOrder: isNaN(Number(parts[2])) ? defaultOrder : Number(parts[2]),
    };
  }
  return {
    key,
    label: defaultLabel,
    value: rawValue || '',
    sortOrder: defaultOrder,
  };
}

export function formatHomeInfoItem(item: HomeInfoItem): string {
  return `${item.label}|||${item.value}|||${item.sortOrder}`;
}

export interface AboutSettings {
  id: string;
  title: string;
  subtitle: string;
  p1: string;
  p2: string;
  p3: string;
}

export interface Certification {
  id: string;
  name: string;
  authority: string;
  date: string;
  code: string;
  sortOrder?: number;
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  iconName: string;
  type: 'contact' | 'social';
  sortOrder?: number;
}

export interface BiographyCard {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface BiographyLeftSettings {
  id: string;
  sectionLabel: string;
  mainHeading: string;
  p1: string;
  p2: string;
  p3: string;
  buttonText: string;
}

