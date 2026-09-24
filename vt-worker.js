/**
 * VirusTotal relay for moutazalazab.github.io  (Cloudflare Worker)
 * ---------------------------------------------------------------
 * Keeps your VirusTotal API key secret. The website sends a file hash (or, only if the visitor
 * explicitly agrees, the file itself) to this worker; the worker asks VirusTotal and returns a short summary.
 *
 * Setup (once):
 *   1. Create a Worker in Cloudflare and paste this whole file.
 *   2. Settings → Variables and Secrets → add a SECRET named  VT_API_KEY  = your VirusTotal API key.
 *   3. Deploy, then copy the worker address (https://….workers.dev) into malware-lab.js (VT_RELAY).
 */
const ALLOWED_ORIGINS = [
  'https://moutazalazab.github.io',
  'http://localhost:8000',
  'http://127.0.0.1:8000'
];
const VT = 'https://www.virustotal.com/api/v3';
const MAX_UPLOAD = 32 * 1024 * 1024; // VirusTotal's limit for direct uploads

function cors(origin) {
  const ok = ALLOWED_ORIGINS.includes(origin);
  return {
    'Access-Control-Allow-Origin': ok ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors(origin) } });
}

// Reduce VirusTotal's large response to what the website shows.
function summarise(attr) {
  const results = Object.entries(attr.last_analysis_results || attr.results || {}).map(([engine, r]) => ({
    engine, category: r.category, result: r.result || null
  }));
  const order = { malicious: 0, suspicious: 1, undetected: 2, harmless: 3, 'type-unsupported': 4, timeout: 5, failure: 6 };
  results.sort((a, b) => (order[a.category] ?? 9) - (order[b.category] ?? 9) || a.engine.localeCompare(b.engine));
  const ptc = attr.popular_threat_classification || {};
  return {
    stats: attr.last_analysis_stats || attr.stats || {},
    label: ptc.suggested_threat_label || null,
    categories: (ptc.popular_threat_category || []).map(x => x.value).slice(0, 3),
    families: (ptc.popular_threat_name || []).map(x => x.value).slice(0, 3),
    type: attr.type_description || null,
    names: (attr.names || []).slice(0, 5),
    size: attr.size || null,
    first_seen: attr.first_submission_date || null,
    last_analysis: attr.last_analysis_date || attr.date || null,
    reputation: typeof attr.reputation === 'number' ? attr.reputation : null,
    tags: (attr.tags || []).slice(0, 8),
    results
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (origin && !ALLOWED_ORIGINS.includes(origin)) return json({ error: 'Origin not allowed' }, 403, origin);
    if (!env.VT_API_KEY) return json({ error: 'Relay is not configured (missing VT_API_KEY secret)' }, 500, origin);

    const url = new URL(request.url);
    const headers = { 'x-apikey': env.VT_API_KEY, 'accept': 'application/json' };
    try {
      // GET /file/<md5|sha1|sha256>  → existing report
      let m = url.pathname.match(/^\/file\/([a-fA-F0-9]{32}|[a-fA-F0-9]{40}|[a-fA-F0-9]{64})$/);
      if (m && request.method === 'GET') {
        const r = await fetch(`${VT}/files/${m[1].toLowerCase()}`, { headers });
        if (r.status === 404) return json({ found: false }, 200, origin);
        if (r.status === 429) return json({ error: 'rate_limited' }, 429, origin);
        if (!r.ok) return json({ error: 'virustotal_error', status: r.status }, 502, origin);
        const d = await r.json();
        return json({ found: true, sha256: d.data.id, ...summarise(d.data.attributes) }, 200, origin);
      }
      // POST /upload  (multipart form, field "file") → start a scan
      if (url.pathname === '/upload' && request.method === 'POST') {
        const form = await request.formData();
        const file = form.get('file');
        if (!file || typeof file === 'string') return json({ error: 'no_file' }, 400, origin);
        if (file.size > MAX_UPLOAD) return json({ error: 'too_large', limit: MAX_UPLOAD }, 413, origin);
        const fd = new FormData(); fd.append('file', file, file.name || 'sample.bin');
        const r = await fetch(`${VT}/files`, { method: 'POST', headers, body: fd });
        if (r.status === 429) return json({ error: 'rate_limited' }, 429, origin);
        if (!r.ok) return json({ error: 'virustotal_error', status: r.status }, 502, origin);
        const d = await r.json();
        return json({ analysis_id: d.data.id }, 200, origin);
      }
      // GET /analysis/<id>  → scan progress / result
      m = url.pathname.match(/^\/analysis\/([A-Za-z0-9=_\-:]+)$/);
      if (m && request.method === 'GET') {
        const r = await fetch(`${VT}/analyses/${m[1]}`, { headers });
        if (r.status === 429) return json({ error: 'rate_limited' }, 429, origin);
        if (!r.ok) return json({ error: 'virustotal_error', status: r.status }, 502, origin);
        const d = await r.json();
        const a = d.data.attributes;
        return json({ status: a.status, sha256: (d.meta && d.meta.file_info && d.meta.file_info.sha256) || null, ...summarise(a) }, 200, origin);
      }
      return json({ error: 'not_found' }, 404, origin);
    } catch (e) {
      return json({ error: 'relay_error' }, 502, origin);
    }
  }
};
