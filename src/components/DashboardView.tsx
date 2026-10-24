import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  Link2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  UploadCloud, 
  FileText, 
  MoreVertical, 
  Play, 
  AlertTriangle, 
  Shield, 
  Send, 
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { HealthCheckResponse, ScanItem, User } from '../types';
import { NavTab } from './Sidebar';
import { TrustShieldApi } from '../services/api';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  healthStatus: {
    checking: boolean;
    ok: boolean;
    data?: HealthCheckResponse;
    error?: string;
    latencyMs: number;
    checkedUrl: string;
  };
  scans: ScanItem[];
  scansLoading: boolean;
  scansError?: string;
  onRefreshScans: () => void;
  apiUrl: string;
  onOpenSettings: () => void;
  onOpenExportGuide: () => void;
  currentUser?: User | null;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  healthStatus: _healthStatus,
  scans,
  scansLoading,
  scansError: _scansError,
  onRefreshScans,
  apiUrl: _apiUrl,
  onOpenSettings: _onOpenSettings,
  onOpenExportGuide: _onOpenExportGuide,
  currentUser,
}) => {
  // New Scan Tab state inside the Start a New Scan workspace
  const [scanTab, setScanTab] = useState<'media' | 'link' | 'text'>('media');

  // Input states for quick scans right from dashboard
  const [quickUrl, setQuickUrl] = useState('');
  const [quickText, setQuickText] = useState('');
  const [quickScanning, setQuickScanning] = useState(false);
  const [quickScanResult, setQuickScanResult] = useState<any | null>(null);
  const [quickScanError, setQuickScanError] = useState<string | null>(null);

  // Reference items matching Digital Violet theme on white cards
  const referenceRecentScans = [
    {
      id: 'ref-1',
      title: 'IMG_4587_manipulation_sample.jpg',
      type: 'image',
      date: 'Jun 16, 2025 • 10:24 AM',
      verdict: 'Likely Fake',
      badgeClass: 'bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]',
      icon: ImageIcon,
      iconBg: 'bg-[#F3E8FF] text-[#A855F7] border border-[#E9D5FF]',
    },
    {
      id: 'ref-2',
      title: 'https://security-verify-auth.xyz/login',
      type: 'link',
      date: 'Jun 16, 2025 • 09:41 AM',
      verdict: 'Suspicious',
      badgeClass: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
      icon: Link2,
      iconBg: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
    },
    {
      id: 'ref-3',
      title: 'official_release_stream.mp4',
      type: 'video',
      date: 'Jun 16, 2025 • 08:12 PM',
      verdict: 'Real',
      badgeClass: 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]',
      icon: Play,
      iconBg: 'bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]',
    },
    {
      id: 'ref-4',
      title: 'Urgent Wire Transfer SMS Notice',
      type: 'text',
      date: 'Jun 15, 2025 • 06:30 PM',
      verdict: 'Suspicious',
      badgeClass: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
      icon: FileText,
      iconBg: 'bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]',
    },
  ];

  // Dynamic values or reference fallback
  const totalScans = scans.length > 0 ? scans.length : 85;
  const cyberScans = scans.length > 0 ? scans.filter(s => s.url || s.message || (s.type || '').includes('cyber')).length : 28;
  const mediaScans = scans.length > 0 ? scans.filter(s => (s.type || '').includes('media') || (s.type || '').includes('image')).length : 42;
  const trustChecks = scans.length > 0 ? scans.filter(s => (s.type || '').includes('trust')).length : 15;

  // Handle live URL scan from dashboard
  const handleQuickUrlScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickUrl.trim()) return;

    setQuickScanning(true);
    setQuickScanError(null);
    setQuickScanResult(null);

    try {
      const res = await TrustShieldApi.scanUrl({ url: quickUrl.trim() });
      setQuickScanResult(res);
      onRefreshScans();
    } catch (err: any) {
      setQuickScanError(err.message || 'Failed to scan URL');
    } finally {
      setQuickScanning(false);
    }
  };

  // Handle live Text scan from dashboard
  const handleQuickTextScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickText.trim()) return;

    setQuickScanning(true);
    setQuickScanError(null);
    setQuickScanResult(null);

    try {
      const res = await TrustShieldApi.scanMessage({ message: quickText.trim() });
      setQuickScanResult(res);
      onRefreshScans();
    } catch (err: any) {
      setQuickScanError(err.message || 'Failed to scan message');
    } finally {
      setQuickScanning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 font-sans">
      
      {/* 1. Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#F8F7FC] to-[#F3E8FF] border border-[#E9D5FF] p-6 sm:p-8 lg:p-9 shadow-sm shadow-purple-900/5">
        
        {/* Subtle decorative radial glow in background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#F3E8FF] rounded-full blur-3xl pointer-events-none opacity-70" />
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#E9D5FF]/60 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            
            {/* Tagline pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] text-xs font-bold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verify. Trust. Protect.</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#1F2937]">
              Welcome back, {currentUser?.name || 'Anushka'}!
            </h1>

            <p className="text-sm text-[#6B7280] leading-relaxed">
              Your digital safety companion for a more trustworthy internet. Detect deepfakes, inspect phishing payloads, and audit digital assets in real time.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                onClick={() => onNavigate('cyber-scan')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white text-xs font-bold transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <span>Launch Scanner</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigate('history')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] text-[#1F2937] text-xs font-semibold transition-all cursor-pointer shadow-xs"
              >
                <span>View Scan Audit</span>
              </button>
            </div>
          </div>

          {/* Right Shield Illustration with floating connected badges */}
          <div className="relative w-56 h-36 sm:w-64 sm:h-40 shrink-0 flex items-center justify-center self-center md:self-auto">
            
            {/* Connecting floating badges */}
            <div className="absolute top-2 left-6 p-2 rounded-xl bg-white shadow-md border border-[#E9D5FF] text-[#A855F7]">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div className="absolute top-2 right-10 p-2 rounded-xl bg-white shadow-md border border-[#E9D5FF] text-[#A855F7]">
              <Link2 className="w-4 h-4" />
            </div>
            <div className="absolute bottom-2 right-8 p-2 rounded-xl bg-white shadow-md border border-[#E9D5FF] text-[#A855F7]">
              <FileText className="w-4 h-4" />
            </div>

            {/* Central Digital Violet shield */}
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-2xl bg-gradient-to-b from-[#A855F7] to-[#7E22CE] p-1 shadow-lg shadow-[#A855F7]/20 flex items-center justify-center">
              <div className="w-full h-full rounded-2xl bg-white border border-[#E9D5FF] flex items-center justify-center">
                <ShieldCheck className="w-12 h-12 text-[#A855F7]" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Four Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Media Scans */}
        <div 
          onClick={() => onNavigate('media-scan')}
          className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A855F7] transition-all cursor-pointer group flex items-start gap-4 shadow-xs hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] group-hover:bg-[#A855F7] group-hover:text-white flex items-center justify-center text-[#A855F7] shrink-0 transition-colors">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold text-[#1F2937] leading-none">
              {mediaScans}
            </div>
            <div className="font-bold text-xs text-[#1F2937] mt-1.5">
              Media Scans
            </div>
            <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
              Deepfake & synthesis forensics
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
        </div>

        {/* Card 2: Cyber Scans */}
        <div 
          onClick={() => onNavigate('cyber-scan')}
          className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A855F7] transition-all cursor-pointer group flex items-start gap-4 shadow-xs hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] group-hover:bg-[#A855F7] group-hover:text-white flex items-center justify-center text-[#A855F7] shrink-0 transition-colors">
            <Link2 className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold text-[#1F2937] leading-none">
              {cyberScans}
            </div>
            <div className="font-bold text-xs text-[#1F2937] mt-1.5">
              Cyber Scans
            </div>
            <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
              Suspicious links and messages
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
        </div>

        {/* Card 3: Trust Checks */}
        <div 
          onClick={() => onNavigate('trust-checks')}
          className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A855F7] transition-all cursor-pointer group flex items-start gap-4 shadow-xs hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] group-hover:bg-[#A855F7] group-hover:text-white flex items-center justify-center text-[#A855F7] shrink-0 transition-colors">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold text-[#1F2937] leading-none">
              {trustChecks}
            </div>
            <div className="font-bold text-xs text-[#1F2937] mt-1.5">
              Trust Checks
            </div>
            <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
              Domain & SSL certificate verification
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
        </div>

        {/* Card 4: Total Scans */}
        <div 
          onClick={() => onNavigate('history')}
          className="p-5 rounded-2xl bg-white border border-[#E5E7EB] hover:border-[#A855F7] transition-all cursor-pointer group flex items-start gap-4 shadow-xs hover:shadow-md"
        >
          <div className="w-11 h-11 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] group-hover:bg-[#A855F7] group-hover:text-white flex items-center justify-center text-[#A855F7] shrink-0 transition-colors">
            <Clock className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-2xl font-extrabold text-[#1F2937] leading-none">
              {totalScans}
            </div>
            <div className="font-bold text-xs text-[#1F2937] mt-1.5">
              Total Scans
            </div>
            <div className="text-[11px] text-[#6B7280] mt-0.5 leading-snug">
              FastAPI SQLite telemetry records
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all mt-1 shrink-0" />
        </div>

      </div>

      {/* 3. Middle Section: Start a New Scan (Left) + Recent Scans (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* Left: Start a New Scan Workspace */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between shadow-xs">
          <div className="space-y-4">
            
            <div>
              <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">
                Start a New Scan
              </h2>
              <p className="text-xs text-[#6B7280] mt-1">
                Choose what you want to check. Upload a file, paste a link, or enter text to analyse for potential risks.
              </p>
            </div>

            {/* 3 Segmented Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#F8F7FC] border border-[#E5E7EB] rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setScanTab('media')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  scanTab === 'media'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Media</span>
              </button>

              <button
                type="button"
                onClick={() => setScanTab('link')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  scanTab === 'link'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Link</span>
              </button>

              <button
                type="button"
                onClick={() => setScanTab('text')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  scanTab === 'text'
                    ? 'bg-white text-[#A855F7] border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Text</span>
              </button>
            </div>

            {/* Tab 1: Media Upload Dropzone */}
            {scanTab === 'media' && (
              <div className="space-y-4">
                <div 
                  onClick={() => onNavigate('media-scan')}
                  className="border-2 border-dashed border-[#E5E7EB] hover:border-[#A855F7] rounded-2xl p-7 text-center space-y-2 bg-[#FAFAFC] cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center mx-auto">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-sm font-bold text-[#1F2937]">
                    Drag & drop your media file here
                  </div>
                  <div className="text-xs text-[#6B7280]">
                    or click to inspect in the Media Forensics engine
                  </div>
                  <div className="text-[11px] text-[#6B7280]/80 pt-1">
                    Supports JPG, PNG, WEBP, MP4, WAV (Client SHA-256 enabled)
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onNavigate('media-scan')}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Open Media Inspector</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] text-[#6B7280] font-medium">
                    Safe client-side evaluation
                  </span>
                </div>
              </div>
            )}

            {/* Tab 2: Link Scanner (Connected to POST /cyber/url-scans) */}
            {scanTab === 'link' && (
              <form onSubmit={handleQuickUrlScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1F2937]">
                    Target URL to Inspect:
                  </label>
                  <input
                    type="url"
                    value={quickUrl}
                    onChange={(e) => setQuickUrl(e.target.value)}
                    placeholder="https://suspicious-domain.xyz/login"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] bg-white placeholder-[#9CA3AF]"
                    required
                  />
                  <div className="text-[11px] text-[#6B7280] flex items-center justify-between">
                    <span>Target: FastAPI <code className="font-mono text-[#A855F7]">POST /cyber/url-scans</code></span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    disabled={quickScanning || !quickUrl.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    {quickScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{quickScanning ? 'Analyzing Link...' : 'Scan URL'}</span>
                  </button>
                  {quickScanResult && (
                    <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                      Verdict: {quickScanResult.verdict || 'Scanned'}
                    </span>
                  )}
                  {quickScanError && (
                    <span className="text-xs font-medium text-[#DC2626] bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#FCA5A5]">
                      {quickScanError}
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* Tab 3: Text Scanner (Connected to POST /cyber/message-scans) */}
            {scanTab === 'text' && (
              <form onSubmit={handleQuickTextScan} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#1F2937]">
                    Suspicious Message or Email Body:
                  </label>
                  <textarea
                    rows={3}
                    value={quickText}
                    onChange={(e) => setQuickText(e.target.value)}
                    placeholder="Paste suspicious SMS, urgent payment demand, or phishing email..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E7EB] text-xs text-[#1F2937] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] bg-white placeholder-[#9CA3AF]"
                    required
                  />
                  <div className="text-[11px] text-[#6B7280]">
                    Target: FastAPI <code className="font-mono text-[#A855F7]">POST /cyber/message-scans</code>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    disabled={quickScanning || !quickText.trim()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
                  >
                    {quickScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    <span>{quickScanning ? 'Analyzing Text...' : 'Scan Message'}</span>
                  </button>
                  {quickScanResult && (
                    <span className="text-xs font-bold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-1 rounded-full border border-[#BBF7D0]">
                      Verdict: {quickScanResult.verdict || 'Scanned'}
                    </span>
                  )}
                  {quickScanError && (
                    <span className="text-xs font-medium text-[#DC2626] bg-[#FEE2E2] px-2.5 py-1 rounded-full border border-[#FCA5A5]">
                      {quickScanError}
                    </span>
                  )}
                </div>
              </form>
            )}

          </div>

          {/* Footer inside Start a New Scan */}
          <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-[#F3E8FF] flex items-center justify-center text-[#A855F7]">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs text-[#6B7280]">
                TrustShield AI Heuristic Engine active
              </span>
            </div>
            <button
              onClick={() => onNavigate('cyber-scan')}
              className="text-xs text-[#A855F7] hover:text-[#7E22CE] font-bold transition-colors cursor-pointer"
            >
              Open Full Console →
            </button>
          </div>

        </div>

        {/* Right: Recent Scans Panel */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-lg font-bold text-[#1F2937] tracking-tight">
                Recent Scans
              </h2>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-bold text-[#A855F7] hover:text-[#7E22CE] flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Scan List */}
            <div className="divide-y divide-[#E5E7EB]">
              {referenceRecentScans.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-[#1F2937] truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-[#6B7280] mt-0.5">
                          {item.date}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${item.badgeClass}`}>
                        {item.verdict}
                      </span>
                      <button 
                        onClick={() => onNavigate('history')}
                        className="text-[#6B7280] hover:text-[#1F2937] p-1 cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-[#E5E7EB] flex items-center justify-between text-[11px] text-[#6B7280]">
            <span>FastAPI SQLite Persistence</span>
            <button onClick={onRefreshScans} className="text-[#A855F7] hover:underline font-semibold flex items-center gap-1 cursor-pointer">
              <RefreshCw className={`w-3 h-3 ${scansLoading ? 'animate-spin' : ''}`} />
              <span>Sync</span>
            </button>
          </div>
        </div>

      </div>

      {/* 4. Bottom Analytics Strip: Scan Activity + Detection Results + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Card 1: Scan Activity Bar Chart */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs text-[#1F2937]">
              Scan Activity
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-[#6B7280]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                Media
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#C084FC]" />
                Links
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Text
              </span>
            </div>
          </div>

          {/* Simple Clean Stacked Bars */}
          <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2">
            {[
              { day: 'Mon', hMedia: 30, hLink: 40, hText: 10 },
              { day: 'Tue', hMedia: 45, hLink: 30, hText: 15 },
              { day: 'Wed', hMedia: 20, hLink: 45, hText: 10 },
              { day: 'Thu', hMedia: 50, hLink: 30, hText: 20 },
              { day: 'Fri', hMedia: 25, hLink: 60, hText: 35 },
              { day: 'Sat', hMedia: 35, hLink: 40, hText: 15 },
              { day: 'Sun', hMedia: 20, hLink: 45, hText: 30 },
            ].map((col, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full max-w-[18px] flex flex-col rounded-t-md overflow-hidden bg-[#F3E8FF]/60">
                  <div style={{ height: `${col.hText}%` }} className="bg-[#16A34A]" />
                  <div style={{ height: `${col.hLink}%` }} className="bg-[#C084FC]" />
                  <div style={{ height: `${col.hMedia}%` }} className="bg-[#A855F7]" />
                </div>
                <span className="text-[10px] text-[#6B7280] font-mono">{col.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Card 2: Detection Results Donut Chart */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs">
          <h3 className="font-bold text-xs text-[#1F2937]">
            Detection Results
          </h3>

          <div className="flex items-center justify-between gap-4">
            {/* Donut ring container */}
            <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path
                  className="text-[#F3E8FF]"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Real (61%) */}
                <path
                  className="text-[#16A34A]"
                  strokeDasharray="61, 100"
                  strokeWidth="4"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Suspicious (24%) */}
                <path
                  className="text-[#D97706]"
                  strokeDasharray="24, 100"
                  strokeDashoffset="-61"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                {/* Likely Fake (15%) */}
                <path
                  className="text-[#DC2626]"
                  strokeDasharray="15, 100"
                  strokeDashoffset="-85"
                  strokeWidth="4"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-extrabold text-[#1F2937] font-mono">
                  85
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-bold">
                  Total
                </span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
                  <span className="text-[#1F2937] font-medium">Real</span>
                </div>
                <span className="font-bold text-[#1F2937] font-mono">61%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" />
                  <span className="text-[#1F2937] font-medium">Suspicious</span>
                </div>
                <span className="font-bold text-[#1F2937] font-mono">24%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                  <span className="text-[#1F2937] font-medium">Likely Fake</span>
                </div>
                <span className="font-bold text-[#1F2937] font-mono">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Quick Actions */}
        <div className="p-6 rounded-2xl bg-white border border-[#E5E7EB] space-y-4 shadow-xs md:col-span-2 lg:col-span-1">
          <h3 className="font-bold text-xs text-[#1F2937]">
            Quick Actions
          </h3>

          <div className="space-y-2">
            <button
              onClick={() => onNavigate('cyber-scan')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/40 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F3E8FF] text-[#A855F7]">
                  <Link2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#1F2937]">Scan Suspicious URL</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('cyber-scan')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/40 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F3E8FF] text-[#A855F7]">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#1F2937]">Inspect Message Payload</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all" />
            </button>

            <button
              onClick={() => onNavigate('trust-checks')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] hover:bg-[#F3E8FF]/40 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#F3E8FF] text-[#A855F7]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="font-bold text-[#1F2937]">Check Domain Homoglyphs</span>
              </div>
              <ArrowRight className="w-4 h-4 text-[#6B7280] group-hover:text-[#A855F7] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
