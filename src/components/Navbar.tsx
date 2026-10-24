import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Menu, 
  X, 
  RefreshCw, 
  Settings, 
  Shield, 
  LogOut, 
  UserCheck 
} from 'lucide-react';
import { HealthCheckResponse, User } from '../types';

interface NavbarProps {
  healthStatus: {
    checking: boolean;
    ok: boolean;
    data?: HealthCheckResponse;
    error?: string;
    latencyMs: number;
    checkedUrl: string;
  };
  onRefreshHealth: () => void;
  onOpenSettings: () => void;
  onOpenExportGuide: () => void;
  currentApiUrl: string;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  healthStatus,
  onRefreshHealth,
  onOpenSettings,
  onOpenExportGuide: _onOpenExportGuide,
  currentApiUrl,
  mobileMenuOpen,
  onToggleMobileMenu,
  searchQuery = '',
  onSearchChange,
  currentUser,
  onLogout,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName = currentUser?.name || 'Anushka';
  const displayPlan = currentUser?.plan || 'Free Plan';
  const initial = displayName.charAt(0).toUpperCase() || 'A';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 border-b border-[#E5E7EB] bg-white sticky top-0 z-30 select-none">
      
      {/* Mobile brand & menu toggle */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] border border-[#E5E7EB] cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-[#A855F7]" />
          <span className="font-extrabold text-sm text-[#1F2937]">
            TrustShield <span className="text-[#A855F7]">AI</span>
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-lg relative">
        <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          placeholder="Search scans, threats, payload indicators..."
          className="w-full pl-10 pr-20 py-2 rounded-xl bg-[#FAFAFC] border border-[#E5E7EB] text-xs text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all font-sans"
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E9D5FF] text-[10px] font-mono text-[#A855F7] font-semibold">
          Ctrl + K
        </div>
      </div>

      {/* Right Controls: Backend probe + Settings + Notifications + User Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Backend health quick probe pill */}
        <button
          onClick={onRefreshHealth}
          disabled={healthStatus.checking}
          title={`FastAPI backend: ${healthStatus.checkedUrl || currentApiUrl} (Click to re-probe)`}
          className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
            healthStatus.checking
              ? 'bg-[#F8F7FC] border-[#E5E7EB] text-[#6B7280]'
              : healthStatus.ok
              ? 'bg-[#DCFCE7] border-[#BBF7D0] text-[#16A34A]'
              : 'bg-[#FEF3C7] border-[#FDE68A] text-[#D97706]'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${healthStatus.ok ? 'bg-[#16A34A]' : 'bg-[#D97706]'} ${healthStatus.checking ? 'animate-ping' : ''}`} />
          <span className="font-semibold text-[11px]">
            {healthStatus.checking ? 'Checking...' : healthStatus.ok ? 'FastAPI Online' : 'Standby'}
          </span>
          <RefreshCw className={`w-3 h-3 ${healthStatus.checking ? 'animate-spin' : ''}`} />
        </button>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          title="Connection & Gateway Settings"
        >
          <Settings className="w-4 h-4 text-[#6B7280]" />
        </button>

        {/* Notification Bell */}
        <button
          onClick={onOpenSettings}
          className="relative p-2 rounded-xl text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] border border-transparent hover:border-[#E5E7EB] transition-colors cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4 text-[#6B7280]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626]" />
        </button>

        {/* User Profile Area with dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1.5 rounded-xl hover:bg-[#F8F7FC] border border-transparent hover:border-[#E5E7EB] transition-colors text-left cursor-pointer"
            title="User Account Menu"
          >
            <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] text-[#A855F7] border border-[#E9D5FF] font-bold text-xs flex items-center justify-center">
              {initial}
            </div>

            <div className="hidden md:block">
              <div className="text-xs font-bold text-[#1F2937] leading-tight">
                {displayName}
              </div>
              <div className="text-[10px] text-[#6B7280] leading-tight flex items-center gap-1">
                <span>{displayPlan}</span>
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280] hidden md:block" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-[#E5E7EB] shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-2.5 border-b border-[#E5E7EB]">
                <div className="font-bold text-[#1F2937]">{displayName}</div>
                <div className="text-[11px] text-[#6B7280]">{currentUser?.email || 'investigator@trustshield.ai'}</div>
                <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F3E8FF] border border-[#E9D5FF] text-[10px] font-semibold text-[#A855F7]">
                  <UserCheck className="w-3 h-3" />
                  <span>{currentUser?.role || 'Security Analyst'}</span>
                </div>
              </div>

              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#1F2937] hover:bg-[#F8F7FC] transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-[#6B7280]" />
                  <span>Gateway Settings</span>
                </button>
              </div>

              {onLogout && (
                <div className="pt-1 border-t border-[#E5E7EB] p-1.5">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[#DC2626] hover:bg-[#FEE2E2]/60 transition-colors cursor-pointer font-semibold"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </header>
  );
};
