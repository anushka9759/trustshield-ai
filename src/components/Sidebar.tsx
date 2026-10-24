import React from 'react';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Link2, 
  ShieldCheck, 
  Clock, 
  Shield, 
  X,
  LogOut
} from 'lucide-react';
import { User } from '../types';

export type NavTab = 'dashboard' | 'media-scan' | 'cyber-scan' | 'trust-checks' | 'history';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isBackendOnline: boolean;
  activeApiUrl: string;
  mobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
  onOpenSettings?: () => void;
  onOpenExportGuide?: () => void;
  currentUser?: User | null;
  onLogout?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isBackendOnline,
  activeApiUrl: _activeApiUrl,
  mobileMenuOpen = false,
  onCloseMobileMenu,
  onOpenSettings: _onOpenSettings,
  onOpenExportGuide: _onOpenExportGuide,
  currentUser: _currentUser,
  onLogout,
}) => {
  const primaryNavItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'media-scan',
      label: 'Media Scan',
      icon: ImageIcon,
    },
    {
      id: 'cyber-scan',
      label: 'Cyber Scan',
      icon: Link2,
    },
    {
      id: 'trust-checks',
      label: 'Trust Checks',
      icon: ShieldCheck,
    },
    {
      id: 'history',
      label: 'Scan History',
      icon: Clock,
    },
  ];

  const handleSelectTab = (tab: NavTab) => {
    onTabChange(tab);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-6 px-4 bg-white border-r border-[#E5E7EB] select-none">
      
      {/* Top Brand & Navigation */}
      <div className="space-y-6">
        
        {/* Brand identity: TrustShield AI */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] border border-[#E9D5FF] p-2 flex items-center justify-center text-[#A855F7] shadow-sm shadow-[#A855F7]/10">
            <Shield className="w-5 h-5 text-[#A855F7] fill-[#A855F7]/15" />
          </div>
          <div>
            <div className="font-extrabold text-base text-[#1F2937] tracking-tight leading-none flex items-center gap-1.5">
              <span>TrustShield</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7]">
                AI
              </span>
            </div>
            <div className="text-[11px] font-semibold text-[#6B7280] mt-1 tracking-wide uppercase">
              Verify. Trust. Protect.
            </div>
          </div>
        </div>

        {/* Primary Nav List */}
        <nav className="space-y-1.5 pt-2">
          {primaryNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#F3E8FF] text-[#A855F7] font-bold border border-[#E9D5FF] shadow-xs'
                    : 'text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] font-medium'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${
                  isActive ? 'bg-[#A855F7]/15 text-[#A855F7]' : 'text-[#6B7280]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="tracking-wide text-xs">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#A855F7] shadow-xs shadow-[#A855F7]" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: "Your Digital Guardian" & Logout */}
      <div className="pt-6 mt-auto space-y-3">
        <div className="p-3.5 rounded-2xl bg-[#F8F7FC] border border-[#E5E7EB] space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#F3E8FF] border border-[#E9D5FF] text-[#A855F7] flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-xs text-[#1F2937]">
              Your Digital Guardian
            </span>
          </div>

          <p className="text-[11px] text-[#6B7280] leading-relaxed">
            Continuously analyzing threat heuristics to keep your digital interactions verified and safe.
          </p>

          {/* Quick backend connectivity info */}
          <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#6B7280] flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isBackendOnline ? 'bg-[#16A34A]' : 'bg-[#D97706]'}`} />
              FastAPI:8000
            </span>
            <span className={isBackendOnline ? 'text-[#16A34A] font-semibold' : 'text-[#D97706] font-semibold'}>
              {isBackendOnline ? 'Online' : 'Standby'}
            </span>
          </div>
        </div>

        {/* Sidebar Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F8F7FC] border border-[#E5E7EB] hover:bg-[#FEE2E2] hover:border-[#FCA5A5] text-[#6B7280] hover:text-[#DC2626] text-xs font-semibold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (When hamburger menu opened) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={onCloseMobileMenu}
            aria-hidden="true"
          />
          <div className="relative w-72 max-w-[85vw] bg-white border-r border-[#E5E7EB] h-full flex flex-col z-10 shadow-2xl">
            <div className="p-4 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#A855F7]" />
                <span className="font-extrabold text-[#1F2937] text-sm">TrustShield AI</span>
              </div>
              <button 
                onClick={onCloseMobileMenu}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#1F2937] hover:bg-[#F8F7FC] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {sidebarContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
