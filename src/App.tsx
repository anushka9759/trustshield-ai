/**
 * TrustShield AI - Cybersecurity Intelligence Dashboard
 * Authenticated Portal with Hero Deepfake Artwork Login / Registration
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { BackendStatusBanner } from './components/BackendStatusBanner';
import { DashboardView } from './components/DashboardView';
import { CyberScanView } from './components/CyberScanView';
import { MediaScanView } from './components/MediaScanView';
import { TrustChecksView } from './components/TrustChecksView';
import { ScanHistoryView } from './components/ScanHistoryView';
import { SettingsModal } from './components/SettingsModal';
import { ExportGuideModal } from './components/ExportGuideModal';
import { AuthView } from './components/AuthView';
import { AuthService } from './services/auth';
import { 
  TrustShieldApi, 
  getStoredConfig 
} from './services/api';
import { HealthCheckResponse, ScanItem, User } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  
  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(() => AuthService.getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => AuthService.isAuthenticated());

  // Modals & Navigation State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportGuideOpen, setIsExportGuideOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Configuration
  const [config, setConfig] = useState(getStoredConfig());

  // Backend Health State
  const [healthStatus, setHealthStatus] = useState<{
    checking: boolean;
    ok: boolean;
    data?: HealthCheckResponse;
    error?: string;
    latencyMs: number;
    checkedUrl: string;
  }>({
    checking: true,
    ok: false,
    latencyMs: 0,
    checkedUrl: config.backendRoot + '/health',
  });

  // Scan History State
  const [scans, setScans] = useState<ScanItem[]>([]);
  const [scansLoading, setScansLoading] = useState(false);
  const [scansError, setScansError] = useState<string | undefined>(undefined);

  // Probe backend health (GET /health)
  const probeHealth = useCallback(async () => {
    setHealthStatus((prev) => ({ ...prev, checking: true }));
    try {
      const result = await TrustShieldApi.checkHealth();
      setHealthStatus({
        checking: false,
        ok: result.ok,
        data: result.data,
        error: result.error,
        latencyMs: result.latencyMs,
        checkedUrl: result.checkedUrl,
      });
    } catch (err: unknown) {
      setHealthStatus({
        checking: false,
        ok: false,
        error: (err as Error).message || 'Health probe failed',
        latencyMs: 0,
        checkedUrl: config.backendRoot + '/health',
      });
    }
  }, [config.backendRoot]);

  // Fetch scans (GET /scans)
  const fetchScans = useCallback(async () => {
    setScansLoading(true);
    setScansError(undefined);
    try {
      const items = await TrustShieldApi.getScans();
      setScans(items);
    } catch (err: unknown) {
      setScansError((err as Error).message || 'Failed to query scan records from GET /scans');
      setScans([]);
    } finally {
      setScansLoading(false);
    }
  }, []);

  // Initial load & health polling
  useEffect(() => {
    probeHealth();
    if (isAuthenticated) {
      fetchScans();
    }

    const interval = setInterval(() => {
      probeHealth();
    }, 15000);

    return () => clearInterval(interval);
  }, [probeHealth, fetchScans, isAuthenticated]);

  const handleConfigSaved = () => {
    const updated = getStoredConfig();
    setConfig(updated);
    probeHealth();
    if (isAuthenticated) {
      fetchScans();
    }
  };

  const handleAuthenticated = (user: User) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    fetchScans();
  };

  const handleLogout = () => {
    AuthService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // 1. If user is unauthenticated, render the Login / Registration experience with Hero Artwork
  if (!isAuthenticated) {
    return (
      <AuthView
        onAuthenticated={handleAuthenticated}
        apiUrl={config.baseUrl}
        isBackendOnline={healthStatus.ok}
      />
    );
  }

  // 2. Authenticated Dashboard Experience
  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#1F2937] flex flex-col lg:flex-row antialiased">
      
      {/* 1. Left Sidebar matching reference layout */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isBackendOnline={healthStatus.ok}
        activeApiUrl={config.baseUrl}
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExportGuide={() => setIsExportGuideOpen(true)}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* 2. Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Navbar */}
        <Navbar
          healthStatus={healthStatus}
          onRefreshHealth={probeHealth}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenExportGuide={() => setIsExportGuideOpen(true)}
          currentApiUrl={config.baseUrl}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* Backend Status Alert when offline */}
        <BackendStatusBanner
          isOnline={healthStatus.ok}
          isChecking={healthStatus.checking}
          onRetry={probeHealth}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenExportGuide={() => setIsExportGuideOpen(true)}
          apiUrl={config.baseUrl}
          backendError={healthStatus.error}
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={setActiveTab}
              healthStatus={healthStatus}
              scans={scans}
              scansLoading={scansLoading}
              scansError={scansError}
              onRefreshScans={fetchScans}
              apiUrl={config.baseUrl}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenExportGuide={() => setIsExportGuideOpen(true)}
              currentUser={currentUser}
            />
          )}

          {activeTab === 'media-scan' && (
            <MediaScanView />
          )}

          {activeTab === 'cyber-scan' && (
            <CyberScanView
              onScanCompleted={fetchScans}
              apiUrl={config.baseUrl}
              onOpenExportGuide={() => setIsExportGuideOpen(true)}
            />
          )}

          {activeTab === 'trust-checks' && (
            <TrustChecksView />
          )}

          {activeTab === 'history' && (
            <ScanHistoryView
              scans={scans}
              loading={scansLoading}
              error={scansError}
              onRefresh={fetchScans}
              apiUrl={config.baseUrl}
              onOpenExportGuide={() => setIsExportGuideOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={handleConfigSaved}
      />

      {/* Export & Windows Execution Guide Modal */}
      <ExportGuideModal
        isOpen={isExportGuideOpen}
        onClose={() => setIsExportGuideOpen(false)}
      />

    </div>
  );
}
