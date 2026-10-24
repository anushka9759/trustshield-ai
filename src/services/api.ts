/**
 * TrustShield AI - FastAPI Backend API Service
 * 
 * Default API Base URL: http://127.0.0.1:8000/api/v1
 * Backend Root: http://127.0.0.1:8000
 * 
 * Endpoints:
 * - GET  /health (and fallback /api/v1/health)
 * - POST /cyber/message-scans
 * - POST /cyber/url-scans
 * - GET  /scans
 */

import {
  BackendConfig,
  HealthCheckResponse,
  MessageScanRequest,
  MessageScanResponse,
  ScanItem,
  ScanHistoryResponse,
  UrlScanRequest,
  UrlScanResponse,
} from '../types';

const STORAGE_KEY_BASE_URL = 'trustshield_api_base_url';
const STORAGE_KEY_ROOT_URL = 'trustshield_backend_root';

export const DEFAULT_BACKEND_ROOT = 
  import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export const DEFAULT_API_BASE_URL = 
  import.meta.env.VITE_API_BASE_URL || `${DEFAULT_BACKEND_ROOT}/api/v1`;

export function getStoredConfig(): BackendConfig {
  const baseUrl = localStorage.getItem(STORAGE_KEY_BASE_URL) || DEFAULT_API_BASE_URL;
  const backendRoot = localStorage.getItem(STORAGE_KEY_ROOT_URL) || DEFAULT_BACKEND_ROOT;
  return {
    baseUrl: baseUrl.replace(/\/$/, ''),
    backendRoot: backendRoot.replace(/\/$/, ''),
    useProxy: false,
    timeoutMs: 10000,
  };
}

export function saveStoredConfig(baseUrl: string, backendRoot: string): void {
  localStorage.setItem(STORAGE_KEY_BASE_URL, baseUrl.trim().replace(/\/$/, ''));
  localStorage.setItem(STORAGE_KEY_ROOT_URL, backendRoot.trim().replace(/\/$/, ''));
}

export function resetStoredConfig(): void {
  localStorage.removeItem(STORAGE_KEY_BASE_URL);
  localStorage.removeItem(STORAGE_KEY_ROOT_URL);
}

/**
 * Checks if current page is served over HTTPS while target backend is HTTP (Mixed Content risk)
 */
export function isMixedContentRisk(targetUrl: string): boolean {
  if (typeof window === 'undefined') return false;
  const isPageHttps = window.location.protocol === 'https:';
  const isTargetHttp = targetUrl.startsWith('http://');
  return isPageHttps && isTargetHttp;
}

/**
 * Custom Error with diagnostic details for FastAPI responses
 */
export class ApiError extends Error {
  status?: number;
  details?: unknown;
  endpoint: string;
  isNetworkError: boolean;
  isMixedContent: boolean;

  constructor(message: string, options: {
    status?: number;
    details?: unknown;
    endpoint: string;
    isNetworkError?: boolean;
    isMixedContent?: boolean;
  }) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.details = options.details;
    this.endpoint = options.endpoint;
    this.isNetworkError = options.isNetworkError || false;
    this.isMixedContent = options.isMixedContent || false;
  }
}

/**
 * Executes fetch with timeout and comprehensive error normalization
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (err: unknown) {
    clearTimeout(id);
    const isMixed = isMixedContentRisk(url);
    const errorObj = err as { name?: string; message?: string };

    if (errorObj.name === 'AbortError') {
      throw new ApiError(`Request to ${url} timed out after ${timeoutMs / 1000}s.`, {
        endpoint: url,
        isNetworkError: true,
        isMixedContent: isMixed,
      });
    }

    const message = isMixed
      ? `Cannot reach ${url}: Browser blocked mixed HTTP request from this HTTPS preview. Run frontend locally on Windows via 'npm run dev' to access http://127.0.0.1:8000 directly.`
      : `Cannot reach FastAPI backend at ${url}. Ensure your server is running on http://127.0.0.1:8000 and CORS is configured.`;

    throw new ApiError(message, {
      endpoint: url,
      isNetworkError: true,
      isMixedContent: isMixed,
      details: errorObj.message,
    });
  }
}

/**
 * Parse FastAPI JSON response or Pydantic validation error details
 */
async function handleResponse<T>(res: Response, endpoint: string): Promise<T> {
  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    let errorMsg = `FastAPI error (${res.status} ${res.statusText})`;
    if (data?.detail) {
      if (typeof data.detail === 'string') {
        errorMsg = data.detail;
      } else if (Array.isArray(data.detail)) {
        // Pydantic validation error array
        errorMsg = data.detail
          .map((d: any) => `${d.loc?.join('.') || 'field'}: ${d.msg}`)
          .join('; ');
      }
    } else if (data?.message) {
      errorMsg = data.message;
    }

    throw new ApiError(errorMsg, {
      status: res.status,
      endpoint,
      details: data,
    });
  }

  return data as T;
}

export const TrustShieldApi = {
  /**
   * Check backend status using GET /health (checks root, then fallback to base URL)
   */
  async checkHealth(): Promise<{ ok: boolean; data?: HealthCheckResponse; error?: string; latencyMs: number; checkedUrl: string }> {
    const config = getStoredConfig();
    const startTime = performance.now();
    const primaryUrl = `${config.backendRoot}/health`;

    try {
      const res = await fetchWithTimeout(primaryUrl, { method: 'GET' }, 4000);
      const data = await handleResponse<HealthCheckResponse>(res, primaryUrl);
      const latencyMs = Math.round(performance.now() - startTime);
      return { ok: true, data, latencyMs, checkedUrl: primaryUrl };
    } catch (err: unknown) {
      // Try fallback to /api/v1/health in case health endpoint is mounted under the v1 router
      try {
        const fallbackUrl = `${config.baseUrl}/health`;
        const resFallback = await fetchWithTimeout(fallbackUrl, { method: 'GET' }, 4000);
        const data = await handleResponse<HealthCheckResponse>(resFallback, fallbackUrl);
        const latencyMs = Math.round(performance.now() - startTime);
        return { ok: true, data, latencyMs, checkedUrl: fallbackUrl };
      } catch (fallbackErr: unknown) {
        const latencyMs = Math.round(performance.now() - startTime);
        const finalError = (err instanceof ApiError ? err.message : String(err));
        return { ok: false, error: finalError, latencyMs, checkedUrl: primaryUrl };
      }
    }
  },

  /**
   * Submit message for cybersecurity analysis: POST /cyber/message-scans
   */
  async scanMessage(request: MessageScanRequest): Promise<MessageScanResponse> {
    const config = getStoredConfig();
    const endpoint = `${config.baseUrl}/cyber/message-scans`;

    // Send rich schema to satisfy FastAPI Pydantic models regardless of property naming
    const payload = {
      message: request.message,
      content: request.message,
      text: request.message,
      ...(request.sender ? { sender: request.sender } : {}),
      ...(request.context ? { context: request.context } : {}),
    };

    const res = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<MessageScanResponse>(res, endpoint);
    return data;
  },

  /**
   * Submit URL for cybersecurity analysis: POST /cyber/url-scans
   */
  async scanUrl(request: UrlScanRequest): Promise<UrlScanResponse> {
    const config = getStoredConfig();
    const endpoint = `${config.baseUrl}/cyber/url-scans`;

    const payload = {
      url: request.url,
      target_url: request.url,
      deep_analysis: request.deep_analysis ?? true,
    };

    const res = await fetchWithTimeout(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const data = await handleResponse<UrlScanResponse>(res, endpoint);
    return data;
  },

  /**
   * Retrieve scan history: GET /scans
   */
  async getScans(): Promise<ScanItem[]> {
    const config = getStoredConfig();
    const endpoint = `${config.baseUrl}/scans`;

    const res = await fetchWithTimeout(endpoint, {
      method: 'GET',
    });

    const data = await handleResponse<ScanItem[] | ScanHistoryResponse>(res, endpoint);

    // Normalize response: FastAPI might return list [...] or dict { items: [...] } or { scans: [...] }
    if (Array.isArray(data)) {
      return data;
    }
    if (data && typeof data === 'object') {
      if (Array.isArray(data.items)) return data.items;
      if (Array.isArray(data.scans)) return data.scans;
      if (Array.isArray(data.data)) return data.data;
    }
    return [];
  },
};
