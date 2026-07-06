/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, Testimonial, Skill } from '../types';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Aura — Minimalist E-Commerce Experience',
    description: 'A serene digital storefront for high-end sustainable homeware, focusing on micro-interactions, editorial typography, and immersive layout designs.',
    longDescription: 'Aura is a digital experience reimagining how users interact with premium, sustainable physical goods. Moving away from cluttered grid templates, Aura utilizes an editorial, asymmetric layout strategy. We focused heavily on smooth page transitions, interactive product reveals, and a minimal, clean shopping cart flow that reduces friction while preserving the brand’s high-end aesthetic.',
    coverImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200'
    ],
    category: 'E-Commerce',
    tags: ['UX/UI Design', 'Interaction Design', 'Framer Motion', 'E-commerce'],
    role: 'Lead Interactive Designer',
    client: 'Aura Lifestyle Co.',
    year: '2025',
    featured: true
  },
  {
    id: '2',
    title: 'Canvas — Fluid Interactive Portfolio',
    description: 'A customizable layout and canvas platform for contemporary artists, utilizing WebGL-inspired React states and full fluid transitions.',
    longDescription: 'Canvas is an immersive WebGL-inspired portfolio platform built for contemporary painters, sculptors, and digital artists. The challenge was to create a digital space that respects the artworks and allows custom, non-grid-bound configurations. We created a dynamic, responsive canvas where artists can showcase their pieces in virtual galleries with rich transitions.',
    coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200'
    ],
    category: 'Interactive',
    tags: ['Creative Direction', 'WebGL', 'Framer Motion', 'React'],
    role: 'Principal UI/UX Architect',
    client: 'Paris Fine Arts Collective',
    year: '2025',
    featured: true
  },
  {
    id: '3',
    title: 'Vortex — Design System & Design-To-Code Framework',
    description: 'A hyper-efficient typography-first design system designed for fast-scaling enterprise SaaS platforms.',
    longDescription: 'Vortex is a unified design language and companion UI framework designed for fast-scaling enterprise web platforms. It establishes strict rules for fluid typography scaling, high-contrast dark and light modes, and responsive spacing logic. The final handoff included an interactive documentation library with 100+ fully responsive, accessible components.',
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1541462608141-2ff01dd0382c?auto=format&fit=crop&q=80&w=1200'
    ],
    category: 'Design Systems',
    tags: ['Design System', 'SaaS', 'Component Library', 'Figma'],
    role: 'Senior Product Designer',
    client: 'Vortex Technologies',
    year: '2024',
    featured: false
  },
  {
    id: '4',
    title: 'Nox — Ambient Space Soundscape Web App',
    description: 'A beautiful atmospheric application providing curated spatial focus sounds, framed by a tactile skeuomorphic audio deck controller.',
    longDescription: 'Nox is a sensory web app that delivers curated spatial soundscapes for deep focus and meditation. The UI is designed around a tactile, warm skeuomorphic audio controller that mimics real-world analog audio dials. Dynamic backgrounds change color temperature based on the selected sound profile, offering a truly immersive sound-to-visual experience.',
    coverImage: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=1200',
    images: [
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=1200'
    ],
    category: 'Skeuomorphic',
    tags: ['Skeuomorphic UI', 'Audio Interaction', 'Web Audio', 'Framer Motion'],
    role: 'Lead UI Designer & Sound Architect',
    client: 'Nox Lab',
    year: '2024',
    featured: true
  }
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Jenkins',
    role: 'Creative Director',
    company: 'Studio Berlin',
    content: 'Their ability to balance extreme minimalist restraint with engaging, fluid animation is unique. They did not just design a website; they created an online exhibition for our brand.',
    rating: 5
  },
  {
    id: '2',
    name: 'Marcus Thorne',
    role: 'VP of Product',
    company: 'Vortex Technologies',
    content: 'The Vortex design system revolutionized our velocity. Spacing, typography rules, and interactions are documented flawlessly. Our design-to-code friction dropped to zero.',
    rating: 5
  }
];

export const INITIAL_SKILLS: Skill[] = [
  // Design
  { id: '1', name: 'UI/UX Design', category: 'design', level: 95, iconName: 'Layout' },
  { id: '2', name: 'Art Direction', category: 'design', level: 90, iconName: 'Compass' },
  { id: '3', name: 'Design Systems', category: 'design', level: 95, iconName: 'Grid' },
  { id: '4', name: 'Typography', category: 'design', level: 90, iconName: 'Type' },
  
  // Development
  { id: '5', name: 'React 19 / Next.js', category: 'development', level: 85, iconName: 'Code' },
  { id: '6', name: 'Tailwind CSS', category: 'development', level: 95, iconName: 'Wind' },
  { id: '7', name: 'Framer Motion', category: 'development', level: 90, iconName: 'Activity' },
  { id: '8', name: 'TypeScript', category: 'development', level: 80, iconName: 'Layers' },
  
  // Tools
  { id: '9', name: 'Figma Pro', category: 'tools', level: 98, iconName: 'PenTool' },
  { id: '10', name: 'Adobe Creative Suite', category: 'tools', level: 85, iconName: 'Image' },
  { id: '11', name: 'Supabase', category: 'tools', level: 80, iconName: 'Database' },
  { id: '12', name: 'Git & GitHub', category: 'tools', level: 85, iconName: 'GitBranch' }
];
