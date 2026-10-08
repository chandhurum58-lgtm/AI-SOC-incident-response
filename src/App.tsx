/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { SocProvider, useSoc } from './context/SocContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { AlertToastContainer } from './components/common/AlertToastContainer';

// Views
import { SentraThreatIntelligenceDashboard } from './components/dashboard/SentraThreatIntelligenceDashboard';
import { Live3DSocDashboard } from './components/dashboard/Live3DSocDashboard';
import { MainDashboard } from './components/overview/MainDashboard';
import { AlertsCenter } from './components/alerts/AlertsCenter';
import { IncidentManagement } from './components/incidents/IncidentManagement';
import { NetworkMonitorView } from './components/network/NetworkMonitorView';
import { ServerTrafficView } from './components/traffic/ServerTrafficView';
import { WebMonitoringView } from './components/web/WebMonitoringView';
import { DeviceMonitoringView } from './components/devices/DeviceMonitoringView';
import { RiskyUsersView } from './components/users/RiskyUsersView';
import { AttackAnalysisView } from './components/analysis/AttackAnalysisView';
import { AttackPredictionView } from './components/prediction/AttackPredictionView';
import { AttackPathGraph } from './components/attackpath/AttackPathGraph';
import { ThreatIntelView } from './components/threatintel/ThreatIntelView';
import { GoogleLiveMapView } from './components/googlemap/GoogleLiveMapView';
import { DefenseRecommendationView } from './components/defense/DefenseRecommendationView';
import { ResponseSimulationView } from './components/simulation/ResponseSimulationView';
import { MitreAttackView } from './components/mitre/MitreAttackView';
import { SecurityAnalyticsView } from './components/analytics/SecurityAnalyticsView';
import { ReportsView } from './components/reports/ReportsView';
import { CopilotView } from './components/copilot/CopilotView';
import { SettingsView } from './components/settings/SettingsView';
import { GOOGLE_MAPS_KEY, IS_GOOGLE_MAPS_ENABLED } from './utils/mapsConfig';

const SocAppContent: React.FC = () => {
  const { activeTab, setIsSearchModalOpen } = useSoc();
  const [gmpQuotaExceeded, setGmpQuotaExceeded] = useState(false);

  useEffect(() => {
    const handleQuotaExceeded = () => setGmpQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuotaExceeded);
  }, []);

  // Global keyboard shortcut for search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchModalOpen]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'overview':
      case 'livemap':
      case 'threatmap':
        return <SentraThreatIntelligenceDashboard />;
      case 'alerts':
        return <AlertsCenter />;
      case 'incidents':
        return <IncidentManagement />;
      case 'network':
        return <NetworkMonitorView />;
      case 'traffic':
        return <ServerTrafficView />;
      case 'web':
        return <WebMonitoringView />;
      case 'devices':
        return <DeviceMonitoringView />;
      case 'users':
        return <RiskyUsersView />;
      case 'analysis':
        return <AttackAnalysisView />;
      case 'prediction':
        return <AttackPredictionView />;
      case 'attackpath':
        return <AttackPathGraph />;
      case 'threatintel':
        return <ThreatIntelView />;
      case 'googlemap':
        return <GoogleLiveMapView />;
      case 'defense':
        return <DefenseRecommendationView />;
      case 'simulation':
        return <ResponseSimulationView />;
      case 'mitre':
        return <MitreAttackView />;
      case 'analytics':
        return <SecurityAnalyticsView />;
      case 'reports':
        return <ReportsView />;
      case 'copilot':
        return <CopilotView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <MainDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#070b1c] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-cyan-200">
      {gmpQuotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Compact Vertical Sidebar Navigation */}
        <Sidebar />
        {/* Center / Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-[#070b1c]">
          {renderActiveView()}
        </main>
      </div>
      <CopilotDrawer />
      <GlobalSearchModal />
      <AlertToastContainer />
    </div>
  );
};

export default function App() {
  if (!IS_GOOGLE_MAPS_ENABLED) {
    return (
      <SocProvider>
        <SocAppContent />
      </SocProvider>
    );
  }

  return (
    <APIProvider 
      apiKey={GOOGLE_MAPS_KEY}
      libraries={['places', 'geometry', 'marker']}
      onError={(err) => {
        console.warn('Google Maps APIProvider Notice:', err);
      }}
    >
      <SocProvider>
        <SocAppContent />
      </SocProvider>
    </APIProvider>
  );
}
