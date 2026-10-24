/**
 * TrustShield AI - Cybersecurity Platform Types
 */

export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  plan?: string;
  created_at?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface HealthCheckResponse {
  status: string;
  version?: string;
  timestamp?: string;
  uptime?: number | string;
  service?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface MessageScanRequest {
  message: string;
  content?: string;
  text?: string;
  sender?: string;
  context?: string;
  [key: string]: unknown;
}

export interface MessageScanResponse {
  id?: string;
  scan_id?: string;
  verdict?: 'safe' | 'suspicious' | 'malicious' | 'clean' | string;
  risk_score?: number; // 0 - 100 or 0 - 1
  risk_level?: string;
  score?: number;
  threat_category?: string;
  threat_type?: string;
  status?: string;
  category?: string;
  classification?: string;
  confidence?: number;
  indicators?: string[];
  threat_signals?: string[];
  findings?: Array<{
    type?: string;
    description?: string;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }>;
  analysis?: string;
  summary?: string;
  created_at?: string;
  timestamp?: string;
  raw_response?: unknown;
  [key: string]: unknown;
}

export interface UrlScanRequest {
  url: string;
  target_url?: string;
  deep_analysis?: boolean;
  [key: string]: unknown;
}

export interface UrlScanResponse {
  id?: string;
  scan_id?: string;
  url?: string;
  target_url?: string;
  verdict?: 'safe' | 'suspicious' | 'malicious' | 'clean' | string;
  safety_status?: string;
  risk_score?: number;
  score?: number;
  threat_category?: string;
  domain?: string;
  reputation?: string;
  domain_age?: string | number;
  ip_address?: string;
  redirects?: string[];
  malicious_indicators?: string[];
  indicators?: string[];
  flags?: string[];
  ssl_valid?: boolean;
  created_at?: string;
  timestamp?: string;
  raw_response?: unknown;
  [key: string]: unknown;
}

export interface ScanItem {
  id: string | number;
  scan_type?: 'message' | 'url' | 'cyber' | 'media' | 'trust' | string;
  type?: string;
  target?: string;
  url?: string;
  message?: string;
  verdict?: string;
  risk_score?: number;
  score?: number;
  threat_category?: string;
  category?: string;
  created_at?: string;
  timestamp?: string;
  status?: string;
  raw_data?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ScanHistoryResponse {
  items?: ScanItem[];
  scans?: ScanItem[];
  data?: ScanItem[];
  total?: number;
  [key: string]: unknown;
}

export interface BackendConfig {
  baseUrl: string;
  backendRoot: string;
  useProxy: boolean;
  timeoutMs: number;
}
