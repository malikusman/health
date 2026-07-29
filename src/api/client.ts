import { ApiError, type ApiErrorBody } from './types';

const DEFAULT_API_ORIGIN = 'https://health-api.dev-scorpiusnetworks.com';

/** API origin without trailing slash. Empty string = same-origin (Vite proxy). */
export function getApiOrigin(): string {
  const raw = import.meta.env.VITE_HEALTH_API_BASE_URL;
  if (raw === '' || raw === '/') return '';
  if (typeof raw === 'string' && raw.length > 0) {
    return raw.replace(/\/$/, '');
  }
  return DEFAULT_API_ORIGIN;
}

/** Build absolute URL for an API path (e.g. `/api/v1/patients`). */
export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${getApiOrigin()}${p}`;
}

/**
 * Resolve thumbnail/render URLs from the API.
 * Relative paths like `/api/v1/images/.../thumbnail` are prefixed with the API origin.
 */
export function resolveMediaUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return apiUrl(url.startsWith('/') ? url : `/${url}`);
}

function buildQuery(params?: Record<string, string | number | boolean | undefined | null>): string {
  if (!params) return '';
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue;
    q.set(key, String(value));
  }
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>,
): Promise<T> {
  const url = `${apiUrl(path)}${buildQuery(params)}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
  } catch {
    throw new ApiError(0, 'Network error — unable to reach the Medical Intelligence API.');
  }

  if (!res.ok) {
    let body: ApiErrorBody | null = null;
    try {
      body = (await res.json()) as ApiErrorBody;
    } catch {
      body = null;
    }
    const message =
      body?.message ||
      (typeof body?.detail === 'string' ? body.detail : null) ||
      `Request failed (${res.status})`;
    throw new ApiError(res.status, message, body);
  }

  return (await res.json()) as T;
}

/** Format a probability in [0,1] as a percentage string, or "unavailable". */
export function formatProbability(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'unavailable';
  return `${(value * 100).toFixed(digits)}%`;
}

/** Format a metric that may be missing — never substitute 0 for null. */
export function formatMetric(value: number | null | undefined, digits = 3): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'unavailable';
  return value.toFixed(digits);
}

export function formatPercentMetric(value: number | null | undefined, digits = 1): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'unavailable';
  return `${(value * 100).toFixed(digits)}%`;
}
