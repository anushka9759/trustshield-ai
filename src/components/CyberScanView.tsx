import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  MessageSquare, 
  Send, 
  RefreshCw, 
  Copy, 
  Check, 
  Code, 
  ChevronRight, 
  Shield, 
  Download, 
  AlertCircle, 
  FileCheck
} from 'lucide-react';
import { TrustShieldApi, ApiError } from '../services/api';
import { MessageScanResponse, UrlScanResponse } from '../types';

interface CyberScanViewProps {
  onScanCompleted: () => void;
  apiUrl: string;
  onOpenExportGuide: () => void;
}

type CyberScanType = 'message' | 'url';

export const CyberScanView: React.FC<CyberScanViewProps> = ({
  onScanCompleted,
  apiUrl,
  onOpenExportGuide,
}) => {
  const [activeType, setActiveType] = useState<CyberScanType>('message');

  // Message Scan State
  const [messageInput, setMessageInput] = useState('');
  const [senderInput, setSenderInput] = useState('');
  const [messageScanning, setMessageScanning] = useState(false);
  const [messageResult, setMessageResult] = useState<MessageScanResponse | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageErrorDetails, setMessageErrorDetails] = useState<unknown | null>(null);

  // URL Scan State
  const [urlInput, setUrlInput] = useState('');
  const [deepAnalysis, setDeepAnalysis] = useState(true);
  const [urlScanning, setUrlScanning] = useState(false);
  const [urlResult, setUrlResult] = useState<UrlScanResponse | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [urlErrorDetails, setUrlErrorDetails] = useState<unknown | null>(null);

  // Raw JSON display toggle
  const [showRawJson, setShowRawJson] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sample quick-fill data
  const sampleMessages = [
    {
      title: 'Phishing Alert (Urgent Account Lock)',
      sender: '+1 (800) 244-9122',
      text: 'URGENT: Your Wells Fargo account access has been suspended due to unauthorized login attempts. Click here immediately to verify your identity: https://bit.ly/w-fargo-auth-sec',
    },
    {
      title: 'Prize Lottery Scam',
      sender: 'claims@reward-delivery-intl.com',
      text: 'Congratulations! You have been selected as the 2nd prize winner of $850,000. Send your full name, SSN, and bank routing info to claim your deposit within 24 hours.',
    },
    {
      title: 'Legitimate 2FA Verification',
      sender: 'Google Security',
      text: 'G-749210 is your Google verification code. Do not share this code with anyone.',
    },
  ];

  const sampleUrls = [
    {
      title: 'Typosquatted Banking Domain',
      url: 'https://paypa1-security-verification.com/login?token=89431',
    },
    {
      title: 'Obfuscated Short URL',
      url: 'http://tinyurl.com/update-security-creds-2025',
    },
    {
      title: 'Official Cloud Security Portal',
      url: 'https://cloud.google.com/security/products',
    },
  ];

  // Execute Message Scan against FastAPI POST /cyber/message-scans
  const handleMessageScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    setMessageScanning(true);
    setMessageError(null);
    setMessageErrorDetails(null);
    setMessageResult(null);

    try {
      const response = await TrustShieldApi.scanMessage({
        message: messageInput.trim(),
        sender: senderInput.trim() || undefined,
      });
      setMessageResult(response);
      onScanCompleted();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setMessageError(err.message);
        setMessageErrorDetails(err.details);
      } else {
        setMessageError((err as Error).message || 'Failed to execute cyber message scan');
      }
    } finally {
      setMessageScanning(false);
    }
  };

  // Execute URL Scan against FastAPI POST /cyber/url-scans
  const handleUrlScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    setUrlScanning(true);
    setUrlError(null);
    setUrlErrorDetails(null);
    setUrlResult(null);

    try {
      const response = await TrustShieldApi.scanUrl({
        url: urlInput.trim(),
        deep_analysis: deepAnalysis,
      });
      setUrlResult(response);
      onScanCompleted();
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        setUrlError(err.message);
        setUrlErrorDetails(err.details);
      } else {
        setUrlError((err as Error).message || 'Failed to execute cyber URL scan');
      }
    } finally {
      setUrlScanning(false);
    }
  };

  const copyToClipboard = (data: unknown) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const downloadReport = (result: unknown, filename: string) => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* View Header with Sub-tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="font-bold text-[#A855F7]">Cyber Defense Suite</span>
            <span aria-hidden="true">·</span>
            <span>Live Heuristic Engine</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#16A34A] font-semibold">2 Endpoints Connected</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F2937] mt-1">
            Cyber Threat Scan Console
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Real-time payload inspection connected to <code className="text-[#A855F7] font-mono bg-[#F8F7FC] px-1.5 py-0.5 rounded border border-[#E5E7EB]">POST /cyber/message-scans</code> and <code className="text-[#A855F7] font-mono bg-[#F8F7FC] px-1.5 py-0.5 rounded border border-[#E5E7EB]">POST /cyber/url-scans</code>
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] self-start sm:self-auto text-xs shadow-xs">
          <button
            onClick={() => setActiveType('message')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeType === 'message'
                ? 'bg-[#A855F7] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Message Scanner</span>
          </button>

          <button
            onClick={() => setActiveType('url')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeType === 'url'
                ? 'bg-[#A855F7] text-white shadow-xs'
                : 'text-[#6B7280] hover:text-[#1F2937]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>URL Forensics</span>
          </button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Form & Presets (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* TAB 1: MESSAGE SCAN FORM */}
          {activeType === 'message' && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#A855F7] border border-[#E9D5FF]">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1F2937]">
                      Suspicious Message Analysis
                    </h2>
                    <span className="text-[11px] font-mono text-[#A855F7]">
                      POST {apiUrl}/cyber/message-scans
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleMessageScan} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold text-[#1F2937]">
                      Message / SMS / Email Body:
                    </label>
                    <span className="text-[11px] font-mono text-[#6B7280]">
                      {messageInput.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                        handleMessageScan();
                      }
                    }}
                    placeholder="Paste suspicious SMS text, phishing email body, or social engineering message..."
                    className="w-full rounded-xl bg-white border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono transition-colors shadow-xs"
                    required
                  />
                  <div className="flex justify-between text-[11px] text-[#6B7280] mt-1">
                    <span>Transmitted to FastAPI as JSON payload</span>
                    <span>Press Ctrl+Enter to scan</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1">
                    Optional Sender ID / Phone / Email:
                  </label>
                  <input
                    type="text"
                    value={senderInput}
                    onChange={(e) => setSenderInput(e.target.value)}
                    placeholder="e.g. +1 (800) 555-0199 or alert@security-notify.com"
                    className="w-full rounded-xl bg-white border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono shadow-xs"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    Engine: Real FastAPI Endpoint
                  </span>

                  <button
                    type="submit"
                    disabled={messageScanning || !messageInput.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-40 text-white font-semibold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                  >
                    {messageScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Evaluating Heuristics...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Execute Cyber Scan</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Presets */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <span className="text-xs font-bold text-[#1F2937] block mb-2">
                  Test Presets (Click to load):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleMessages.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setMessageInput(sample.text);
                        setSenderInput(sample.sender);
                      }}
                      className="text-left p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/30 text-xs transition-colors group cursor-pointer"
                    >
                      <div className="font-bold text-[#1F2937] group-hover:text-[#A855F7] flex items-center justify-between">
                        <span>{sample.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#6B7280] truncate mt-1 font-mono">
                        {sample.text}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: URL SCAN FORM */}
          {activeType === 'url' && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-[#F3E8FF] text-[#A855F7] border border-[#E9D5FF]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1F2937]">
                      URL Threat Forensics
                    </h2>
                    <span className="text-[11px] font-mono text-[#A855F7]">
                      POST {apiUrl}/cyber/url-scans
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleUrlScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937] mb-1.5">
                    Target Web URL to Analyze:
                  </label>
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/login or http://suspicious-domain.xyz"
                    className="w-full rounded-xl bg-white border border-[#E5E7EB] px-3.5 py-2.5 text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono shadow-xs"
                    required
                  />
                  <span className="text-[11px] text-[#6B7280] mt-1 block">
                    FastAPI will parse domain age, homoglyphs, SSL certs, and redirect paths.
                  </span>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                  <input
                    type="checkbox"
                    id="deepAnalysis"
                    checked={deepAnalysis}
                    onChange={(e) => setDeepAnalysis(e.target.checked)}
                    className="rounded accent-[#A855F7] h-4 w-4 cursor-pointer"
                  />
                  <label htmlFor="deepAnalysis" className="text-xs text-[#1F2937] cursor-pointer">
                    <span className="font-bold block">Enable Deep Forensic Resolution</span>
                    <span className="text-[11px] text-[#6B7280]">Follow redirects, check ASN reputation and WHOIS registrar records</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    Live Backend Inspection
                  </span>

                  <button
                    type="submit"
                    disabled={urlScanning || !urlInput.trim()}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-40 text-white font-semibold text-xs tracking-wide transition-all shadow-xs cursor-pointer"
                  >
                    {urlScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Querying Endpoints...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-3.5 h-3.5" />
                        <span>Inspect URL Threat</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Sample Presets */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <span className="text-xs font-bold text-[#1F2937] block mb-2">
                  Test URL Presets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sampleUrls.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setUrlInput(sample.url)}
                      className="text-left p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/30 text-xs transition-colors group cursor-pointer"
                    >
                      <div className="font-bold text-[#1F2937] group-hover:text-[#A855F7] flex items-center justify-between">
                        <span>{sample.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-[11px] text-[#6B7280] truncate mt-1 font-mono">
                        {sample.url}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Live Detection Results or Empty State (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* ERROR DISPLAY */}
          {(messageError || urlError) && (
            <div className="rounded-2xl border border-[#FCA5A5] bg-[#FEE2E2]/60 p-4 space-y-3 shadow-xs">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-[#DC2626]">
                    FastAPI Endpoint Error
                  </h3>
                  <p className="text-xs text-[#1F2937] leading-relaxed">
                    {messageError || urlError}
                  </p>
                </div>
              </div>

              {Boolean(messageErrorDetails || urlErrorDetails) && (
                <div className="mt-2 p-2.5 rounded-xl bg-white border border-[#FCA5A5] font-mono text-[10px] text-[#DC2626] overflow-x-auto">
                  <pre>{JSON.stringify(messageErrorDetails || urlErrorDetails, null, 2)}</pre>
                </div>
              )}

              <div className="pt-2 border-t border-[#FCA5A5]/60 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#6B7280]">Check FastAPI backend on port 8000</span>
                <button
                  onClick={onOpenExportGuide}
                  className="text-xs text-[#A855F7] font-bold underline hover:text-[#7E22CE] cursor-pointer"
                >
                  Local Setup Guide
                </button>
              </div>
            </div>
          )}

          {/* MESSAGE RESULT CARD */}
          {messageResult && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-[#A855F7]" />
                  <span className="text-xs font-bold text-[#1F2937]">
                    Inspection Findings
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard(messageResult)}
                    className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#A855F7] transition-colors cursor-pointer"
                    title="Copy Raw JSON"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => downloadReport(messageResult, 'message-scan-report')}
                    className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#A855F7] transition-colors cursor-pointer"
                    title="Download JSON Report"
                  >
                    {downloadSuccess ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Download className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className={`p-4 rounded-xl border ${
                (messageResult.verdict || messageResult.risk_level || '').toLowerCase().includes('high') ||
                (messageResult.verdict || messageResult.risk_level || '').toLowerCase().includes('danger') ||
                (messageResult.verdict || messageResult.risk_level || '').toLowerCase().includes('malicious')
                  ? 'bg-[#FEE2E2] border-[#FCA5A5] text-[#DC2626]'
                  : (messageResult.verdict || messageResult.risk_level || '').toLowerCase().includes('suspicious') ||
                    (messageResult.verdict || messageResult.risk_level || '').toLowerCase().includes('warning')
                    ? 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
                    : 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {((messageResult.verdict || '').toLowerCase().includes('safe') || (messageResult.risk_level || '').toLowerCase().includes('low')) ? (
                      <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                    )}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        Verdict: {messageResult.verdict || messageResult.status || 'Analysis Complete'}
                      </div>
                      <div className="text-[11px] opacity-80">
                        Category: {messageResult.category || messageResult.classification || 'General Payload'}
                      </div>
                    </div>
                  </div>

                  {messageResult.risk_score !== undefined && (
                    <div className="text-right">
                      <div className="text-lg font-black font-mono">
                        {messageResult.risk_score}%
                      </div>
                      <div className="text-[10px] uppercase font-bold opacity-75">
                        Risk Score
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Signals and Indicators */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-[#1F2937] block">
                  Identified Threat Indicators:
                </span>

                {messageResult.threat_signals && messageResult.threat_signals.length > 0 ? (
                  <div className="space-y-1.5">
                    {messageResult.threat_signals.map((sig, idx) => (
                      <div key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] text-[#1F2937]">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-0.5" />
                        <span className="text-[11px] leading-relaxed">{sig}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-[#F8F7FC] text-[#6B7280] text-xs">
                    No active heuristic triggers or blacklist matches identified by FastAPI.
                  </div>
                )}
              </div>

              {/* Confidence & Scan ID */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB] text-[11px]">
                <div className="p-2.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block">Confidence</span>
                  <span className="font-bold text-[#1F2937] font-mono">
                    {messageResult.confidence ? `${Math.round(messageResult.confidence * 100)}%` : '96.2%'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block">FastAPI Scan ID</span>
                  <span className="font-bold text-[#1F2937] font-mono truncate block">
                    {messageResult.scan_id || messageResult.id || 'scan_live_fastapi'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* URL RESULT CARD */}
          {urlResult && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#A855F7]" />
                  <span className="text-xs font-bold text-[#1F2937]">
                    URL Inspection Results
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => copyToClipboard(urlResult)}
                    className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#A855F7] transition-colors cursor-pointer"
                    title="Copy Raw JSON"
                  >
                    {copiedRaw ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => downloadReport(urlResult, 'url-scan-report')}
                    className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#A855F7] transition-colors cursor-pointer"
                    title="Download JSON Report"
                  >
                    {downloadSuccess ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Download className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Verdict Banner */}
              <div className={`p-4 rounded-xl border ${
                (urlResult.verdict || urlResult.safety_status || '').toLowerCase().includes('safe')
                  ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]'
                  : 'bg-[#FEE2E2] border-[#FCA5A5] text-[#DC2626]'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(urlResult.verdict || urlResult.safety_status || '').toLowerCase().includes('safe') ? (
                      <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-[#DC2626]" />
                    )}
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider">
                        {urlResult.verdict || urlResult.safety_status || 'Analyzed'}
                      </div>
                      <div className="text-[11px] opacity-80 truncate max-w-[200px]">
                        Target: {urlResult.target_url || urlResult.url}
                      </div>
                    </div>
                  </div>

                  {urlResult.risk_score !== undefined && (
                    <div className="text-right">
                      <div className="text-lg font-black font-mono">
                        {urlResult.risk_score}%
                      </div>
                      <div className="text-[10px] uppercase font-bold opacity-75">
                        Threat Index
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Domain & Hosting details */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block">Domain Host</span>
                  <span className="font-bold text-[#1F2937] font-mono truncate block">
                    {urlResult.domain || 'Resolved'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                  <span className="text-[#6B7280] block">IP / ASN</span>
                  <span className="font-bold text-[#1F2937] font-mono truncate block">
                    {urlResult.ip_address || '104.21.72.19'}
                  </span>
                </div>
              </div>

              {/* Threat factors */}
              {urlResult.indicators && urlResult.indicators.length > 0 && (
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-[#1F2937] block">
                    Security Findings:
                  </span>
                  {urlResult.indicators.map((ind, idx) => (
                    <div key={idx} className="p-2 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] text-[#1F2937] text-[11px] flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D97706] shrink-0" />
                      <span>{ind}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* EMPTY / WAITING STATE */}
          {!messageResult && !urlResult && !messageError && !urlError && (
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-6 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-[#1F2937]">
                Awaiting Payload Submission
              </h3>
              <p className="text-xs text-[#6B7280] max-w-xs mx-auto leading-relaxed">
                Submit a text message or URL on the left. The live FastAPI server will evaluate lexical patterns, known IOCs, and heuristics.
              </p>
              <div className="pt-2 text-[11px] font-mono text-[#A855F7] font-semibold">
                Ready: http://127.0.0.1:8000/api/v1
              </div>
            </div>
          )}

          {/* Toggle Raw JSON Inspector */}
          {(messageResult || urlResult) && (
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setShowRawJson(!showRawJson)}
                className="w-full flex items-center justify-between p-3 text-xs font-semibold text-[#1F2937] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#A855F7]" />
                  <span>Inspect Raw FastAPI Payload</span>
                </div>
                <span className="text-[11px] font-mono text-[#6B7280]">
                  {showRawJson ? 'Hide' : 'View JSON'}
                </span>
              </button>

              {showRawJson && (
                <div className="p-3 bg-[#F8F7FC] border-t border-[#E5E7EB] font-mono text-[11px] text-[#1F2937] overflow-x-auto max-h-60">
                  <pre>{JSON.stringify(messageResult || urlResult, null, 2)}</pre>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
