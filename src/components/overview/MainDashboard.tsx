import React, { useState } from 'react';
import { useSoc } from '../../context/SocContext';
import { TopKpiMetricCards } from '../dashboard/TopKpiMetricCards';
import { GoogleLiveMapCenter } from '../dashboard/GoogleLiveMapCenter';
import { ThreatInvestigationPanel } from '../dashboard/ThreatInvestigationPanel';
import { BottomMetricsRow } from '../dashboard/BottomMetricsRow';
import { GlobalThreatPoint } from '../../types/soc';

export const MainDashboard: React.FC = () => {
  const { globalThreats } = useSoc();
  const [selectedThreat, setSelectedThreat] = useState<GlobalThreatPoint>(globalThreats[0]);

  return (
    <div className="p-4 space-y-4 max-w-[1780px] mx-auto select-none font-sans">
      {/* 1. Top KPI Row: 5 Cards (Total Attacks, Critical Incidents, High Risk, Active Threats, Blocked Attacks) */}
      <TopKpiMetricCards />

      {/* 2. Centerpiece: Google Live Map + Right Dynamic AI Threat Investigation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Map Centerpiece (8 cols, Fixed 580px Height) */}
        <div className="lg:col-span-8 flex flex-col h-[580px] min-h-[580px] max-h-[580px] overflow-hidden">
          <GoogleLiveMapCenter 
            selectedThreat={selectedThreat}
            onSelectThreat={setSelectedThreat}
          />
        </div>

        {/* Right Dynamic AI Threat Investigation Panel (4 cols, Matching Fixed 580px Height) */}
        <div className="lg:col-span-4 flex flex-col h-[580px] min-h-[580px] max-h-[580px] overflow-hidden">
          <ThreatInvestigationPanel 
            threat={selectedThreat}
          />
        </div>
      </div>

      {/* 3. Bottom Row: Real-time attack timeline, Network Bandwidth & Traffic, Top Source Countries */}
      <BottomMetricsRow />
    </div>
  );
};
