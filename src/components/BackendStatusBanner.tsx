import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Terminal, 
  RefreshCw, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Copy,
  Server
} from 'lucide-react';

interface BackendStatusBannerProps {
  isOnline: boolean;
  isChecking: boolean;
  onRetry: () => void;
  onOpenSettings: () => void;
  onOpenExportGuide: () => void;
  apiUrl: string;
  backendError?: string;
}

export const BackendStatusBanner: React.FC<BackendStatusBannerProps> = ({
  isOnline,
  isChecking,
  onRetry,
  onOpenSettings: _onOpenSettings,
  onOpenExportGuide,
  apiUrl,
  backendError: _backendError,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [copiedCors, setCopiedCors] = useState(false);

  // If online, don't show the warning banner
  if (isOnline) {
    return null;
  }

  const isHttpsPage = typeof window !== 'undefined' && window.location.protocol === 'https:';

  const fastApiCorsCode = `# In your FastAPI main.py:
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TrustShield AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000", "http://127.0.0.1:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok", "service": "trustshield-fastapi"}`;

  const copyCorsToClipboard = () => {
    navigator.clipboard.writeText(fastApiCorsCode);
    setCopiedCors(true);
    setTimeout(() => setCopiedCors(false), 2000);
  };

  return (
    <div className="bg-[#FEF3C7]/50 border-b border-[#FDE68A] px-4 py-3 text-[#1F2937] shadow-xs select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-[#FEF3C7] text-[#D97706] mt-0.5 shrink-0 border border-[#FDE68A]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#D97706]">
                FastAPI Gateway Standby
              </span>
              <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-white border border-[#E5E7EB] text-[#6B7280] font-medium">
                Target: {apiUrl}
              </span>
            </div>
            
            <p className="text-[#6B7280] mt-1 leading-relaxed">
              {isHttpsPage ? (
                <>
                  <span className="text-[#1F2937] font-semibold">Notice for Cloud Sandbox:</span> Browsers enforce Mixed Content security blocking HTTPS pages from directly contacting local <code className="bg-white px-1.5 py-0.5 rounded text-[#A855F7] font-mono border border-[#E5E7EB]">http://127.0.0.1:8000</code>. To query your live local FastAPI server and SQLite database, <button onClick={onOpenExportGuide} className="underline text-[#A855F7] hover:text-[#7E22CE] font-semibold cursor-pointer">run this frontend locally on Windows</button> or configure an HTTPS reverse proxy.
                </>
              ) : (
                <>
                  Unable to connect to <code className="bg-white px-1.5 py-0.5 rounded text-[#A855F7] font-mono border border-[#E5E7EB]">{apiUrl}</code>. Ensure your FastAPI server is running with <code className="font-mono bg-white px-1.5 py-0.5 rounded text-[#A855F7] border border-[#E5E7EB]">uvicorn main:app --reload --port 8000</code> and CORS is enabled.
                </>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#E5E7EB] hover:bg-[#F8F7FC] text-[#1F2937] text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Terminal className="w-3.5 h-3.5 text-[#A855F7]" />
            <span>FastAPI Setup</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={onRetry}
            disabled={isChecking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-50 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Re-probing...' : 'Retry'}</span>
          </button>
        </div>

      </div>

      {/* Expanded CORS Helper Box */}
      {expanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-[#FDE68A] animate-in fade-in">
          <div className="bg-white rounded-xl p-3.5 border border-[#E5E7EB] space-y-2 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-xs text-[#1F2937] flex items-center gap-2">
                <Server className="w-4 h-4 text-[#A855F7]" />
                FastAPI Python CORS Setup Snippet
              </span>
              <button
                onClick={copyCorsToClipboard}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] text-[11px] font-mono text-[#1F2937] transition-colors cursor-pointer"
              >
                {copiedCors ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3 text-[#A855F7]" />}
                <span>{copiedCors ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] bg-[#F8F7FC] p-3 rounded-lg overflow-x-auto text-[#1F2937] border border-[#E5E7EB]">
              {fastApiCorsCode}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
