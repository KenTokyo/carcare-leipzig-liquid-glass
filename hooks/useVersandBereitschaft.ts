import { useEffect, useState } from 'react';

let cached: { ready: boolean; expires: number } | null = null;
let pending: Promise<boolean> | null = null;
const load = () => {
  if (cached && cached.expires > Date.now()) return Promise.resolve(cached.ready);
  if (pending) return pending;
  pending = fetch('/api/anfrage', { signal: AbortSignal.timeout(8000) })
    .then(async (response) => response.ok && (await response.json()).bereit === true)
    .catch(() => false)
    .then((ready) => {
      cached = { ready, expires: Date.now() + 30_000 };
      pending = null;
      return ready;
    });
  return pending;
};

/** Shared request, short cache, retry on return to tab. SSR stays disabled. */
export function useVersandBereitschaft() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => { void load().then((value) => { if (active) setReady(value); }); };
    refresh();
    window.addEventListener('focus', refresh);
    return () => { active = false; window.removeEventListener('focus', refresh); };
  }, []);
  return { ready, disable: () => { cached = null; setReady(false); } };
}
