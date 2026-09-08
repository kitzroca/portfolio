import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const SUPABASE_URL =
    process.env.VITE_SUPABASE_URL ||
    process.env.REACT_APP_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    '';
  const SUPABASE_KEY =
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.REACT_APP_SUPABASE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    '';

  if (req.method === 'POST') {
    const { name, role, company_or_institution, quote, initials } = req.body || {};
    if (!name || !quote) {
      return res.status(400).json({ error: 'Name and quote are required.' });
    }

    const newVouch = {
      id: `vouch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: String(name).slice(0, 80),
      role: String(role || 'Collaborator').slice(0, 80),
      company_or_institution: String(company_or_institution || 'Project Peer').slice(0, 100),
      quote: String(quote).slice(0, 1000),
      initials: String(initials || 'CB').slice(0, 4),
      created_at: new Date().toISOString(),
    };

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/vouches`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: 'return=representation',
          },
          body: JSON.stringify(newVouch),
        });
        if (dbRes.ok) {
          const inserted = await dbRes.json();
          return res.status(201).json({ success: true, vouch: inserted[0] || newVouch });
        }
      } catch (err: any) {
        console.error('Supabase insert error:', err);
      }
    }

    return res.status(201).json({ success: true, vouch: newVouch });
  }

  if (req.method === 'GET') {
    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        const dbRes = await fetch(`${SUPABASE_URL}/rest/v1/vouches?select=*&order=created_at.desc`, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        if (dbRes.ok) {
          const vouches = await dbRes.json();
          return res.status(200).json({ vouches });
        }
      } catch (err: any) {
        console.error('Supabase fetch error:', err);
      }
    }

    return res.status(200).json({ vouches: [] });
  }

  if (req.method === 'DELETE') {
    const id = (req.query.id as string) || (req.body && req.body.id);
    if (!id) {
      return res.status(400).json({ error: 'Vouch ID is required.' });
    }

    if (SUPABASE_URL && SUPABASE_KEY) {
      try {
        await fetch(`${SUPABASE_URL}/rest/v1/vouches?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
      } catch (err: any) {
        console.error('Supabase delete error:', err);
      }
    }

    return res.status(200).json({ success: true, id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
