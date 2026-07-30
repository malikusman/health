import React, { useCallback, useEffect, useState } from 'react';
import { getHealth } from '../api/endpoints';
import type { HealthResponse } from '../api/types';

const POLL_MS = 60_000;

/** Live Medical Intelligence API health chip for the app footer. */
export default function ApiHealthStatus() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    setLoading(true);
    getHealth()
      .then((h) => {
        setHealth(h);
        setError(null);
      })
      .catch((err: unknown) => {
        setHealth(null);
        setError(err instanceof Error ? err.message : 'API unreachable');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  const ok = health?.status === 'healthy' && !error;
  const color = loading ? '#5E6E85' : ok ? '#36C28B' : '#F0476A';
  const label = loading
    ? 'API…'
    : ok
      ? `API ${health!.version}`
      : 'API down';

  return (
    <span className="flex items-center gap-1.5 text-xs" style={{ color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: color }} />
      <span title={ok ? `${health!.service} · ${health!.timestamp}` : error ?? undefined}>
        {label}
      </span>
      {!ok && !loading && (
        <button
          type="button"
          className="underline ml-1"
          style={{ color: '#3B82F6' }}
          onClick={load}
        >
          Retry
        </button>
      )}
    </span>
  );
}
