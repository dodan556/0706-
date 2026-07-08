-- ==========================================
-- SUPABASE PORTFOLIO SCHEMA MIGRATION SCRIPT
-- FILE PATH: /supabase/migrations/20260708000000_init_schema.sql
-- DATE: 2026-07-08
-- ==========================================

-- 1. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    cover_image TEXT NOT NULL,
    images TEXT[] DEFAULT '{}',
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    role TEXT,
    client TEXT,
    year TEXT NOT NULL,
    link TEXT,
    github TEXT,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    detail_title TEXT,
    detail_quote TEXT,
    software_programs JSONB DEFAULT '[]'::jsonb,
    project_highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;

-- 2. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unread',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_submissions DISABLE ROW LEVEL SECURITY;

-- 3. Home Settings Table
CREATE TABLE IF NOT EXISTS public.home_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    line1 TEXT NOT NULL,
    line2 TEXT NOT NULL,
    line3 TEXT NOT NULL,
    sub_headline TEXT NOT NULL,
    experience TEXT NOT NULL,
    location TEXT NOT NULL,
    primary_stack TEXT NOT NULL,
    infrastructure TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.home_settings DISABLE ROW LEVEL SECURITY;

-- 4. About Settings Table
CREATE TABLE IF NOT EXISTS public.about_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    p1 TEXT NOT NULL,
    p2 TEXT NOT NULL,
    p3 TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.about_settings DISABLE ROW LEVEL SECURITY;

-- 5. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('design', 'development', 'tools')),
    level INTEGER NOT NULL DEFAULT 0,
    icon_name TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.skills DISABLE ROW LEVEL SECURITY;

-- 6. Certifications Table
CREATE TABLE IF NOT EXISTS public.certifications (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    authority TEXT NOT NULL,
    date TEXT NOT NULL,
    code TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.certifications DISABLE ROW LEVEL SECURITY;

-- 7. Contact Channels Table
CREATE TABLE IF NOT EXISTS public.contact_channels (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('contact', 'social')),
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.contact_channels DISABLE ROW LEVEL SECURITY;

-- 8. Biography Left Settings Table
CREATE TABLE IF NOT EXISTS public.biography_left_settings (
    id TEXT PRIMARY KEY DEFAULT 'main',
    section_label TEXT NOT NULL,
    main_heading TEXT NOT NULL,
    p1 TEXT NOT NULL,
    p2 TEXT NOT NULL,
    p3 TEXT NOT NULL,
    button_text TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.biography_left_settings DISABLE ROW LEVEL SECURITY;

-- 9. Biography Cards Table
CREATE TABLE IF NOT EXISTS public.biography_cards (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.biography_cards DISABLE ROW LEVEL SECURITY;


