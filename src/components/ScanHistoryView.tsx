import React, { useState } from 'react';
import { 
  History, 
  RefreshCw, 
  Search, 
  Filter, 
  X, 
  Copy, 
  Check, 
  Globe, 
  MessageSquare, 
  Download, 
  ArrowUpDown, 
  FileSpreadsheet,
  AlertTriangle
} from 'lucide-react';
import { ScanItem } from '../types';

interface ScanHistoryViewProps {
  scans: ScanItem[];
  loading: boolean;
  error?: string;
  onRefresh: () => void;
  apiUrl: string;
  onOpenExportGuide: () => void;
}

export const ScanHistoryView: React.FC<ScanHistoryViewProps> = ({
  scans,
  loading,
  error,
  onRefresh,
  apiUrl,
  onOpenExportGuide,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterVerdict, setFilterVerdict] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'risk_desc' | 'risk_asc'>('newest');
  const [selectedScan, setSelectedScan] = useState<ScanItem | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Filter and sort scans
  const processedScans = scans
    .filter((scan) => {
      const scanType = (scan.scan_type || scan.type || '').toLowerCase();
      const verdict = (scan.verdict || scan.status || '').toLowerCase();
      const target = String(scan.target || scan.url || scan.message || scan.id || '').toLowerCase();

      // Type filter
      if (filterType !== 'all') {
        if (filterType === 'message' && !scanType.includes('message') && !scan.message) return false;
        if (filterType === 'url' && !scanType.includes('url') && !scan.url) return false;
      }

      // Verdict filter
      if (filterVerdict !== 'all') {
        if (!verdict.includes(filterVerdict.toLowerCase())) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return target.includes(q) || verdict.includes(q) || scanType.includes(q);
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
      }
      if (sortBy === 'risk_desc') {
        return (b.risk_score || 0) - (a.risk_score || 0);
      }
      if (sortBy === 'risk_asc') {
        return (a.risk_score || 0) - (b.risk_score || 0);
      }
      return 0;
    });

  const exportAllScans = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(scans, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `trustshield-scans-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2000);
  };

  const copyScanJson = (scan: ScanItem) => {
    navigator.clipboard.writeText(JSON.stringify(scan, null, 2));
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  const getVerdictBadge = (verdict?: string) => {
    const v = (verdict || '').toLowerCase();
    if (v.includes('malicious') || v.includes('high') || v.includes('danger') || v.includes('fake')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEE2E2] text-[#DC2626] border border-[#FCA5A5]">
          Likely Fake
        </span>
      );
    }
    if (v.includes('suspicious') || v.includes('warning') || v.includes('medium')) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A]">
          Suspicious
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]">
        Real
      </span>
    );
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* View Header with Refresh & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6B7280]">
            <span className="font-bold text-[#A855F7]">FastAPI Audit Trail</span>
            <span aria-hidden="true">·</span>
            <span>GET /scans</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-[#16A34A] font-semibold">{scans.length} Total Records</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#1F2937] mt-1">
            Historical Scan Registry
          </h1>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Audit logs of all inspected messages and URLs recorded in your FastAPI backend database.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          {scans.length > 0 && (
            <button
              onClick={exportAllScans}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs bg-white border border-[#E5E7EB] hover:bg-[#F8F7FC] text-[#1F2937] font-semibold transition-colors shadow-xs cursor-pointer"
              title="Export all database records to JSON"
            >
              {exportSuccess ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Download className="w-3.5 h-3.5 text-[#A855F7]" />}
              <span>{exportSuccess ? 'Exported' : 'Export Logs'}</span>
            </button>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs bg-[#A855F7] hover:bg-[#7E22CE] text-white font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Logs'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-[#E5E7EB] bg-white flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by target URL, message snippet, ID, or threat category..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] font-mono shadow-xs"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 bg-[#F8F7FC] px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#1F2937]">
            <Filter className="w-3.5 h-3.5 text-[#A855F7]" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-[#1F2937] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="message">Messages</option>
              <option value="url">URLs</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8F7FC] px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#1F2937]">
            <select
              value={filterVerdict}
              onChange={(e) => setFilterVerdict(e.target.value)}
              className="bg-transparent text-[#1F2937] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="malicious">Likely Fake</option>
              <option value="suspicious">Suspicious</option>
              <option value="safe">Real</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#F8F7FC] px-3 py-2 rounded-xl border border-[#E5E7EB] text-[#1F2937]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#6B7280]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#1F2937] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="risk_desc">Highest Risk</option>
              <option value="risk_asc">Lowest Risk</option>
            </select>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white overflow-hidden shadow-xs">
        
        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-7 h-7 text-[#A855F7] animate-spin mx-auto" />
            <p className="text-sm font-bold text-[#1F2937]">
              Connecting to <span className="font-mono text-[#A855F7]">{apiUrl}/scans</span>
            </p>
            <p className="text-xs text-[#6B7280]">
              Retrieving live telemetry records from FastAPI SQLite database...
            </p>
          </div>
        )}

        {/* Backend Error State */}
        {!loading && error && (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#DC2626]">
                Failed to Retrieve Scan History
              </h3>
              <p className="text-xs font-mono text-[#6B7280] max-w-lg mx-auto mt-1 break-words">
                {error}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={onRefresh}
                className="px-4 py-2 rounded-xl bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] text-xs font-bold hover:bg-[#FEE2E2]/80 transition-colors cursor-pointer"
              >
                Retry GET /scans
              </button>
              <button
                onClick={onOpenExportGuide}
                className="px-4 py-2 rounded-xl bg-white border border-[#E5E7EB] text-[#A855F7] text-xs font-bold hover:bg-[#F8F7FC] transition-colors cursor-pointer shadow-xs"
              >
                Windows Setup Guide
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && processedScans.length === 0 && (
          <div className="py-16 text-center space-y-3 p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center mx-auto">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#1F2937]">
              {scans.length === 0 ? 'No Scans Recorded in Database' : 'No Results Matching Filter'}
            </h3>
            <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
              {scans.length === 0 
                ? 'Your FastAPI SQLite database does not contain scan logs yet. Run a Message or URL scan in the Cyber Scan section to record live data.' 
                : 'Try adjusting your search query or verdict filters to view historical entries.'}
            </p>
          </div>
        )}

        {/* Scans Table */}
        {!loading && !error && processedScans.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8F7FC] text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Content / Target</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Risk Index</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E7EB]">
                {processedScans.map((scan, idx) => {
                  const isUrl = (scan.scan_type || scan.type || '').toLowerCase().includes('url') || Boolean(scan.url);
                  const targetText = scan.target || scan.url || scan.message || scan.id || 'Unknown';
                  const dateStr = scan.created_at ? new Date(scan.created_at).toLocaleString() : 'Recent';

                  return (
                    <tr 
                      key={scan.id || idx}
                      className="hover:bg-[#F8F7FC] transition-colors group cursor-pointer"
                      onClick={() => setSelectedScan(scan)}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
                            {isUrl ? <Globe className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
                          </div>
                          <span className="font-bold text-[#1F2937] capitalize">
                            {scan.scan_type || scan.type || (isUrl ? 'URL' : 'Message')}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 max-w-xs sm:max-w-md">
                        <div className="font-mono text-[11px] text-[#1F2937] truncate font-medium">
                          {targetText}
                        </div>
                        {scan.category && (
                          <div className="text-[10px] text-[#6B7280] truncate">
                            {scan.category}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {getVerdictBadge(scan.verdict || scan.status)}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {scan.risk_score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 rounded-full bg-[#E5E7EB] overflow-hidden">
                              <div 
                                className={`h-full ${
                                  scan.risk_score > 60 ? 'bg-[#DC2626]' : scan.risk_score > 25 ? 'bg-[#D97706]' : 'bg-[#16A34A]'
                                }`} 
                                style={{ width: `${Math.min(100, scan.risk_score)}%` }}
                              />
                            </div>
                            <span className="font-mono text-[11px] font-bold text-[#1F2937]">
                              {scan.risk_score}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#6B7280] text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-[#6B7280] text-[11px]">
                        {dateStr}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScan(scan);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:border-[#A855F7] text-[#1F2937] hover:text-[#A855F7] font-semibold text-[11px] transition-colors cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* DETAIL MODAL */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="rounded-2xl border border-[#E5E7EB] bg-white w-full max-w-2xl overflow-hidden shadow-2xl space-y-4 p-6 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Scan Audit Detail
                  </h3>
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    Record ID: {selectedScan.id || 'N/A'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => copyScanJson(selectedScan)}
                  className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#F3E8FF] text-[#6B7280] hover:text-[#A855F7] transition-colors cursor-pointer"
                  title="Copy JSON"
                >
                  {copiedRaw ? <Check className="w-3.5 h-3.5 text-[#16A34A]" /> : <Copy className="w-3.5 h-3.5 text-[#A855F7]" />}
                </button>
                <button
                  onClick={() => setSelectedScan(null)}
                  className="p-1.5 rounded-lg bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#E5E7EB] text-[#6B7280] hover:text-[#1F2937] transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick summary grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block">Verdict</span>
                <div className="mt-0.5">{getVerdictBadge(selectedScan.verdict || selectedScan.status)}</div>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block">Risk Score</span>
                <span className="font-mono font-bold text-[#1F2937] text-sm">
                  {selectedScan.risk_score !== undefined ? `${selectedScan.risk_score}%` : 'N/A'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block">Category</span>
                <span className="font-semibold text-[#1F2937] truncate block">
                  {selectedScan.category || 'General'}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB]">
                <span className="text-[10px] text-[#6B7280] block">Type</span>
                <span className="font-bold text-[#A855F7] uppercase font-mono text-[11px]">
                  {selectedScan.scan_type || selectedScan.type || 'Scan'}
                </span>
              </div>
            </div>

            {/* Payload Display */}
            <div>
              <span className="text-xs font-bold text-[#1F2937] block mb-1">
                Target Payload:
              </span>
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] font-mono text-xs text-[#1F2937] break-all max-h-24 overflow-y-auto">
                {selectedScan.target || selectedScan.url || selectedScan.message || 'N/A'}
              </div>
            </div>

            {/* Raw JSON */}
            <div>
              <span className="text-xs font-bold text-[#1F2937] block mb-1">
                Raw SQLite Database Record:
              </span>
              <div className="p-3 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] font-mono text-[11px] text-[#1F2937] overflow-x-auto max-h-48">
                <pre>{JSON.stringify(selectedScan, null, 2)}</pre>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedScan(null)}
                className="px-4 py-2 rounded-xl bg-[#A855F7] hover:bg-[#7E22CE] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Close Record
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
