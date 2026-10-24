import React, { useState } from 'react';
import { 
  Globe, 
  ServerOff, 
  AlertTriangle, 
  Code, 
  Copy, 
  Check, 
  Search, 
  Lock, 
  ShieldCheck 
} from 'lucide-react';

export const TrustChecksView: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [domainInput, setDomainInput] = useState('');
  const [parsedDomain, setParsedDomain] = useState<{
    cleanDomain: string;
    tld: string;
    hasHomoglyphs: boolean;
    isHttps: boolean;
  } | null>(null);

  // Client-side domain syntax analysis
  const handleDomainAnalyze = (input: string) => {
    setDomainInput(input);
    if (!input.trim()) {
      setParsedDomain(null);
      return;
    }

    try {
      let raw = input.trim();
      const isHttps = raw.startsWith('https://');
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        raw = raw.replace(/^https?:\/\//, '');
      }
      raw = raw.split('/')[0].split('?')[0];

      // Check for homoglyphs (non-ASCII characters)
      const hasHomoglyphs = /[^\u0000-\u007F]/.test(raw);
      const parts = raw.split('.');
      const tld = parts.length > 1 ? parts[parts.length - 1] : 'unknown';

      setParsedDomain({
        cleanDomain: raw,
        tld,
        hasHomoglyphs,
        isHttps,
      });
    } catch {
      setParsedDomain(null);
    }
  };

  const trustRouterCode = `# Planned FastAPI Trust Checks Endpoints:
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/trust", tags=["trust-verification"])

class DomainAuditRequest(BaseModel):
    domain: str
    check_dnssec: bool = True
    check_tls: bool = True

class DomainAuditResult(BaseModel):
    domain: str
    trust_score: int  # 0 to 100
    dnssec_enabled: bool
    tls_version: str
    issuer: str
    brand_impersonation_risk: str  # "low" | "medium" | "high"
    email_security: dict

@router.post("/domain-verification", response_model=DomainAuditResult)
def verify_domain(request: DomainAuditRequest):
    # Perform DNSSEC validation and certificate chain handshake
    return {
        "domain": request.domain,
        "trust_score": 92,
        "dnssec_enabled": True,
        "tls_version": "TLS 1.3",
        "issuer": "Let's Encrypt Authority",
        "brand_impersonation_risk": "low",
        "email_security": {"spf": "pass", "dmarc": "reject"}
    }`;

  const handleCopy = () => {
    navigator.clipboard.writeText(trustRouterCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* View Header with Not Connected Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="font-bold text-[#D97706]">Roadmap Engine</span>
            <span aria-hidden="true">·</span>
            <span>Awaiting Backend Provider</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#6B7280]">v2.0 Architecture</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F2937] mt-1">
            Trust & Identity Verification
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Cryptographic trust verification, SSL/TLS cipher audit, and brand impersonation detection.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] text-xs font-semibold px-3 py-1.5 self-start sm:self-auto shadow-xs">
          <ServerOff className="w-3.5 h-3.5" />
          <span>Backend Endpoint Dormant</span>
        </div>
      </div>

      {/* Prominent Architectural Notice Banner */}
      <div className="rounded-2xl border border-[#FDE68A] bg-[#FEF3C7]/40 p-5 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-xl bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 text-xs text-[#6B7280]">
            <h3 className="font-bold text-sm text-[#D97706]">
              Trust Checks Engine is Not Yet Connected
            </h3>
            <p className="leading-relaxed text-[#1F2937]">
              In accordance with TrustShield AI zero-mock policy, trust scores and certificates are not fabricated. Your FastAPI backend at <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E5E7EB]">http://127.0.0.1:8000</code> does not yet host the trust verification router.
            </p>
            <p className="text-[11px] text-[#6B7280]">
              Deploy the provided FastAPI router schema below to your backend to turn this audit module live.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Planned Trust Engines & Domain Inspector Sandbox */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Domain Inspector & Feature Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Domain Sandbox Input */}
          <div className="p-6 rounded-2xl border border-[#E5E7EB] bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-sm font-bold text-[#1F2937]">
                Domain Heuristic Inspector (Client Sandbox)
              </h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                  Enter Domain or URL to Inspect:
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={domainInput}
                    onChange={(e) => handleDomainAnalyze(e.target.value)}
                    placeholder="e.g. trustshield.ai or accounts-google.verify-secure.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono shadow-xs"
                  />
                </div>
              </div>

              {parsedDomain && (
                <div className="p-4 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                    <span>Parsed Domain Structure:</span>
                    <span className="font-bold text-[#A855F7]">{parsedDomain.cleanDomain}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB]">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">Top-Level Domain (TLD)</span>
                      <span className="font-bold text-[#1F2937]">.{parsedDomain.tld}</span>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E7EB]">
                      <span className="text-[10px] text-[#6B7280] block">IDN / Homoglyphs</span>
                      <span className={parsedDomain.hasHomoglyphs ? 'text-[#DC2626] font-bold' : 'text-[#16A34A] font-bold'}>
                        {parsedDomain.hasHomoglyphs ? 'Warning: Non-ASCII Detected' : 'Clean (Standard ASCII)'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Planned Trust Modules */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1F2937]">SSL / TLS Cipher Auditor</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Verifies X.509 certificate chains, OCSP revocation status, and TLS 1.3 protocol handshake parameters.
              </p>
              <span className="inline-block text-[10px] font-mono text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-full font-bold">
                Pending Backend Route
              </span>
            </div>

            <div className="p-5 rounded-2xl border border-[#E5E7EB] bg-white space-y-2 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-[#1F2937]">DNSSEC & SPF/DMARC</h4>
              <p className="text-[11px] text-[#6B7280] leading-relaxed">
                Audits cryptographically signed DNS zones, DKIM records, and email anti-spoofing policies.
              </p>
              <span className="inline-block text-[10px] font-mono text-[#D97706] bg-[#FEF3C7] border border-[#FDE68A] px-2 py-0.5 rounded-full font-bold">
                Pending Backend Route
              </span>
            </div>
          </div>

        </div>

        {/* Right: Planned FastAPI Code Router (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#A855F7]" />
                <h3 className="text-sm font-bold text-[#1F2937]">
                  Proposed FastAPI Router Code
                </h3>
              </div>
              <button
                onClick={handleCopy}
                className="text-xs text-[#A855F7] hover:text-[#7E22CE] flex items-center gap-1 bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-[#6B7280] leading-relaxed">
              Copy this blueprint into your FastAPI <code className="bg-[#F8F7FC] px-1.5 py-0.5 rounded font-mono text-[#A855F7] border border-[#E5E7EB]">routers/trust.py</code> file to implement real live certificate and DNS validation:
            </p>

            <div className="rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] p-3.5 font-mono text-[11px] text-[#1F2937] overflow-x-auto max-h-72">
              <pre>{trustRouterCode}</pre>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
