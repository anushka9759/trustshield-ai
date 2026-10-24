import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Server, 
  RefreshCw, 
  Check, 
  Copy, 
  Save, 
  RotateCcw
} from 'lucide-react';
import { 
  DEFAULT_API_BASE_URL, 
  DEFAULT_BACKEND_ROOT, 
  getStoredConfig, 
  saveStoredConfig, 
  resetStoredConfig, 
  TrustShieldApi 
} from '../services/api';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const currentConfig = getStoredConfig();

  const [baseUrlInput, setBaseUrlInput] = useState(currentConfig.baseUrl);
  const [rootUrlInput, setRootUrlInput] = useState(currentConfig.backendRoot);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    latencyMs?: number;
    error?: string;
    data?: unknown;
  } | null>(null);
  const [copiedCors, setCopiedCors] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    // Temporarily save to test with newly typed values
    saveStoredConfig(baseUrlInput, rootUrlInput);

    try {
      const res = await TrustShieldApi.checkHealth();
      setTestResult({
        ok: res.ok,
        latencyMs: res.latencyMs,
        error: res.error,
        data: res.data,
      });
    } catch (e: unknown) {
      setTestResult({
        ok: false,
        error: (e as Error).message || 'Connection test failed',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredConfig(baseUrlInput, rootUrlInput);
    setSavedSuccess(true);
    onConfigSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleReset = () => {
    resetStoredConfig();
    setBaseUrlInput(DEFAULT_API_BASE_URL);
    setRootUrlInput(DEFAULT_BACKEND_ROOT);
    setTestResult(null);
  };

  const corsSnippet = `# FastAPI main.py CORS Middleware:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`;

  const copyCors = () => {
    navigator.clipboard.writeText(corsSnippet);
    setCopiedCors(true);
    setTimeout(() => setCopiedCors(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs select-none font-sans">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white w-full max-w-xl overflow-hidden shadow-2xl space-y-4 p-6 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1F2937]">
                Gateway & Connection Settings
              </h2>
              <p className="text-xs text-[#6B7280]">
                Configure target FastAPI server addresses and endpoints.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-xs">
          
          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              API Base URL (v1 prefix):
            </label>
            <input
              type="text"
              value={baseUrlInput}
              onChange={(e) => setBaseUrlInput(e.target.value)}
              placeholder="http://127.0.0.1:8000/api/v1"
              className="w-full rounded-xl bg-white border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#1F2937] font-mono focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] shadow-xs"
            />
            <span className="text-[11px] text-[#6B7280] mt-1 block">
              Default: <code className="font-mono text-[#A855F7]">http://127.0.0.1:8000/api/v1</code>
            </span>
          </div>

          <div>
            <label className="block font-semibold text-[#1F2937] mb-1">
              Backend Root (for /health check):
            </label>
            <input
              type="text"
              value={rootUrlInput}
              onChange={(e) => setRootUrlInput(e.target.value)}
              placeholder="http://127.0.0.1:8000"
              className="w-full rounded-xl bg-white border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#1F2937] font-mono focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] shadow-xs"
            />
            <span className="text-[11px] text-[#6B7280] mt-1 block">
              Target of heartbeat ping: <code className="font-mono text-[#A855F7]">/health</code>
            </span>
          </div>

          {/* Test Connection Button & Result */}
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#F8F7FC] space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#1F2937]">
                Live Diagnostic Probe
              </span>
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E7EB] hover:border-[#A855F7] text-[#1F2937] font-semibold text-xs shadow-xs disabled:opacity-50 cursor-pointer transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>{testing ? 'Testing...' : 'Test Connection'}</span>
              </button>
            </div>

            {testResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono ${
                testResult.ok 
                  ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]' 
                  : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#DC2626]'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">
                    {testResult.ok ? '✓ Connected to FastAPI' : '✕ Health Probe Failed'}
                  </span>
                  {testResult.latencyMs && (
                    <span className="text-[11px] opacity-75">{testResult.latencyMs}ms</span>
                  )}
                </div>
                {testResult.error && (
                  <p className="mt-1 text-[11px] opacity-90 break-words">{testResult.error}</p>
                )}
              </div>
            )}
          </div>

          {/* CORS Helper */}
          <div className="p-3.5 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] text-[#1F2937] font-mono text-[11px] space-y-2">
            <div className="flex items-center justify-between font-semibold">
              <span className="flex items-center gap-1.5 font-sans text-xs text-[#1F2937]">
                <Server className="w-3.5 h-3.5 text-[#A855F7]" />
                FastAPI CORS Requirement
              </span>
              <button
                onClick={copyCors}
                className="text-xs text-[#A855F7] hover:text-[#7E22CE] flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#E5E7EB] hover:border-[#A855F7] transition-colors cursor-pointer"
              >
                {copiedCors ? <Check className="w-3 h-3 text-[#16A34A]" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCors ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-[10px] text-[#6B7280] overflow-x-auto bg-white p-2.5 rounded border border-[#E5E7EB]">
              {corsSnippet}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl text-xs text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved!' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
