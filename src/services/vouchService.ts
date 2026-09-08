import { VouchItem } from '../types/portfolio';
import { supabase } from './supabaseClient';

const STORAGE_KEY = 'kitz_portfolio_vouches';

/**
 * Fetch live vouches from Cloud Database (Supabase / serverless API / localStorage cache)
 */
export async function fetchLiveVouches(): Promise<VouchItem[]> {
  // 1. Check Supabase cloud database if configured
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('vouches')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data as VouchItem[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, trying fallback:', err);
    }
  }

  // 2. Check /api/vouches serverless endpoint
  try {
    const res = await fetch('/api/vouches');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.vouches) && data.vouches.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.vouches));
        return data.vouches;
      }
    }
  } catch (err) {
    // API not reachable in local dev
  }

  // 3. Fallback to localStorage (clean legacy mock IDs)
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const parsed: VouchItem[] = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        const realVouches = parsed.filter(
          (item) =>
            !['vouch-1', 'vouch-2', 'vouch-3', 'vouch-4', 'vouch-5'].includes(
              item.id
            )
        );
        if (realVouches.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(realVouches));
        }
        return realVouches;
      }
    }
  } catch (err) {
    // ignore
  }

  return [];
}

/**
 * Submit a real collaborator vouch to Cloud Database & persistent storage
 */
export async function submitLiveVouch(
  item: Omit<VouchItem, 'id' | 'initials' | 'created_at'>
): Promise<VouchItem> {
  const words = item.name.trim().split(/\s+/);
  const initials =
    words.length > 1
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : item.name.slice(0, 2).toUpperCase();

  const newVouch: VouchItem = {
    id: `vouch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: item.name.trim(),
    role: item.role.trim() || 'Collaborator',
    company_or_institution: item.company_or_institution.trim() || 'Project Collaborator',
    quote: item.quote.trim(),
    initials,
    created_at: new Date().toISOString(),
  };

  // 1. Submit to Supabase if configured
  if (supabase) {
    try {
      await supabase.from('vouches').insert(newVouch);
    } catch (err) {
      console.warn('Direct Supabase submit failed:', err);
    }
  }

  // 2. Submit to /api/vouches
  try {
    await fetch('/api/vouches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVouch),
    });
  } catch (err) {
    // ignore
  }

  // 3. Cache immediately in localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    const list: VouchItem[] = cached ? JSON.parse(cached) : [];
    list.unshift(newVouch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn('LocalStorage cache failed:', err);
  }

  return newVouch;
}

/**
 * Delete a live vouch by ID from Cloud Database & localStorage
 */
export async function deleteLiveVouch(id: string): Promise<boolean> {
  // 1. Delete from Supabase if configured
  if (supabase) {
    try {
      await supabase.from('vouches').delete().eq('id', id);
    } catch (err) {
      console.warn('Direct Supabase delete failed:', err);
    }
  }

  // 2. Delete from /api/vouches
  try {
    await fetch(`/api/vouches?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  } catch (err) {
    // ignore
  }

  // 3. Remove from localStorage
  try {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      const list: VouchItem[] = JSON.parse(cached);
      const filtered = list.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.warn('LocalStorage delete failed:', err);
  }

  return true;
}

