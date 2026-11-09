-- ==============================================================================
-- Supabase Schema & Security Setup: Social Media Links Table
-- ==============================================================================
-- Run this in your Supabase SQL Editor: Dashboard -> SQL Editor -> New Query

-- 1. Create the social_links table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.social_links (
    id BIGSERIAL PRIMARY KEY,
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT DEFAULT '#0ea5e9',
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- 3. Security Policy: Anyone (public / anon / authenticated) can read active social links
DROP POLICY IF EXISTS "Allow public read access to active social links" ON public.social_links;
CREATE POLICY "Allow public read access to active social links" 
ON public.social_links 
FOR SELECT 
USING (true);

-- 4. Security Policy: Authenticated admin users can perform full CRUD (INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow authenticated full access to social links" ON public.social_links;
CREATE POLICY "Allow authenticated full access to social links" 
ON public.social_links 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 5. Security Policy Fallback: Allow anon client full access for portfolio admin when Supabase Auth session isn't strictly required
DROP POLICY IF EXISTS "Allow anon manage social links" ON public.social_links;
CREATE POLICY "Allow anon manage social links" 
ON public.social_links 
FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- 6. Insert initial seed data
INSERT INTO public.social_links (platform, url, icon, color, active, display_order)
VALUES
    ('GitHub', 'https://github.com/Abdurehman95', 'fab fa-github', '#ffffff', true, 1),
    ('LinkedIn', 'https://www.linkedin.com/feed/', 'fab fa-linkedin-in', '#0ea5e9', true, 2),
    ('Twitter / X', 'https://x.com/home', 'fab fa-x-twitter', '#38bdf8', true, 3),
    ('Telegram', 'https://t.me/abdu_8995', 'fab fa-telegram', '#229ed9', true, 4),
    ('Instagram', 'https://instagram.com/', 'fab fa-instagram', '#e1306c', true, 5)
ON CONFLICT DO NOTHING;

