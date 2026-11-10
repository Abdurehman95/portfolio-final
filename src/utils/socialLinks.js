import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export const platformPresets = [
  { platform: 'Instagram', icon: 'fab fa-instagram', color: '#E1306C', defaultUrl: 'https://instagram.com/' },
  { platform: 'LinkedIn', icon: 'fab fa-linkedin-in', color: '#0ea5e9', defaultUrl: 'https://www.linkedin.com/feed/' },
  { platform: 'GitHub', icon: 'fab fa-github', color: '#ffffff', defaultUrl: 'https://github.com/Abdurehman95' },
  { platform: 'Twitter / X', icon: 'fab fa-x-twitter', color: '#38bdf8', defaultUrl: 'https://x.com/home' },
  { platform: 'Telegram', icon: 'fab fa-telegram', color: '#229ed9', defaultUrl: 'https://t.me/abdu_8995' },
  { platform: 'YouTube', icon: 'fab fa-youtube', color: '#ff0000', defaultUrl: 'https://youtube.com/@' },
  { platform: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877f2', defaultUrl: 'https://facebook.com/' },
  { platform: 'TikTok', icon: 'fab fa-tiktok', color: '#ff0050', defaultUrl: 'https://tiktok.com/@' },
  { platform: 'Discord', icon: 'fab fa-discord', color: '#5865f2', defaultUrl: 'https://discord.gg/' },
  { platform: 'Website / Portfolio', icon: 'fas fa-globe', color: '#10b981', defaultUrl: 'https://abdurex.vercel.app/' },
  { platform: 'Email', icon: 'fas fa-envelope', color: '#f59e0b', defaultUrl: 'mailto:abdurehmanseid856@gmail.com' }
];

export const defaultSocialLinks = [
  {
    id: 1,
    platform: 'GitHub',
    url: 'https://github.com/Abdurehman95',
    icon: 'fab fa-github',
    color: '#ffffff',
    active: true,
    display_order: 1
  },
  {
    id: 2,
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/feed/',
    icon: 'fab fa-linkedin-in',
    color: '#0ea5e9',
    active: true,
    display_order: 2
  },
  {
    id: 3,
    platform: 'Twitter / X',
    url: 'https://x.com/home',
    icon: 'fab fa-twitter',
    color: '#38bdf8',
    active: true,
    display_order: 3
  },
  {
    id: 4,
    platform: 'Telegram',
    url: 'https://t.me/abdu_8995',
    icon: 'fab fa-telegram',
    color: '#229ed9',
    active: true,
    display_order: 4
  },
  {
    id: 5,
    platform: 'Instagram',
    url: 'https://instagram.com/',
    icon: 'fab fa-instagram',
    color: '#e1306c',
    active: true,
    display_order: 5
  }
];

const STORAGE_KEY = 'portfolio_social_links';
const UPDATE_EVENT = 'portfolio_social_links_updated';

/**
 * Sanitizes URLs to prevent XSS (such as javascript: or vbscript: URLs)
 * and ensures safe navigation.
 */
export function sanitizeUrl(url) {
  if (!url || typeof url !== 'string') return '#';
  const trimmed = url.trim();

  // Explicitly block malicious protocol schemes
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) {
    return '#';
  }

  const lower = trimmed.toLowerCase();

  // Allow mailto, tel, absolute http/https, or valid anchors
  if (
    lower.startsWith('http://') ||
    lower.startsWith('https://') ||
    lower.startsWith('mailto:') ||
    lower.startsWith('tel:') ||
    lower.startsWith('#') ||
    lower.startsWith('/')
  ) {
    return trimmed;
  }

  // If no scheme provided, safely prepend https://
  return `https://${trimmed}`;
}

export function getStoredSocialLinks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Failed to parse stored social links:', err);
  }
  return defaultSocialLinks;
}

export function saveStoredSocialLinks(links) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(UPDATE_EVENT, { detail: links }));
    }
  } catch (err) {
    console.warn('Failed to persist social links:', err);
  }
}

/**
 * React hook to access and subscribe to social links across any component
 */
export function useSocialLinks() {
  const [links, setLinks] = useState(() => getStoredSocialLinks());
  const [loading, setLoading] = useState(true);
  const [isDbConnected, setIsDbConnected] = useState(false);

  const fetchLinks = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('social_links')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        // Table may not exist yet or permissions issue
        setIsDbConnected(false);
        setLinks(getStoredSocialLinks());
      } else if (data && data.length > 0) {
        setIsDbConnected(true);
        setLinks(data);
        saveStoredSocialLinks(data);
      } else {
        // Connected to Supabase, but table is empty
        setIsDbConnected(true);
        setLinks(getStoredSocialLinks());
      }
    } catch (err) {
      console.warn('Supabase fetch error for social_links:', err);
      setIsDbConnected(false);
      setLinks(getStoredSocialLinks());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLinks();

    const handleLocalUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setLinks(e.detail);
      } else {
        setLinks(getStoredSocialLinks());
      }
    };

    window.addEventListener(UPDATE_EVENT, handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      window.removeEventListener(UPDATE_EVENT, handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, [fetchLinks]);

  // Return only active links by default, but also expose all links
  const activeLinks = links.filter((item) => item.active !== false);

  return {
    links,
    activeLinks,
    loading,
    isDbConnected,
    refetch: fetchLinks
  };
}
