import React, { useState } from 'react';
import { Live3DSecurityMap } from './Live3DSecurityMap';
import { LiveAlertsRightPanel } from './LiveAlertsRightPanel';
import { BottomInfoArea } from './BottomInfoArea';
import { SecurityEntity, LiveAlertEvent } from '../../data/liveSecurityEntities';

export const Live3DSocDashboard: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState<SecurityEntity | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<LiveAlertEvent | null>(null);

  const locationInfo = selectedEntity ? {
    country: selectedEntity.country,
    state: selectedEntity.state,
    district: selectedEntity.district,
    city: selectedEntity.city,
    lat: selectedEntity.lat,
    lng: selectedEntity.lng
  } : selectedAlert ? {
    country: selectedAlert.country,
    state: 'Operational Sector',
    district: `${selectedAlert.type.split(' ')[0]} Target Zone`,
    city: selectedAlert.city,
    lat: selectedAlert.city === 'London' ? 51.5074 : selectedAlert.city === 'San Francisco' ? 37.7749 : 40.7128,
    lng: selectedAlert.city === 'London' ? -0.1278 : selectedAlert.city === 'San Francisco' ? -122.4194 : -74.0060
  } : {
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7128,
    lng: -74.0060
  };

  return (
    <div className="p-3.5 sm:p-4 space-y-3.5 max-w-[1880px] mx-auto select-none font-sans">
      {/* 1. MAIN CENTERPIECE: Realistic LIVE 3D Security Map (left/center) + LIVE ALERTS (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Realistic LIVE 3D Security Map (8 or 9 cols, fixed height 590px) */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-[590px] min-h-[590px] max-h-[590px] overflow-hidden">
          <Live3DSecurityMap 
            onSelectEntity={setSelectedEntity}
            selectedEntityId={selectedEntity?.id}
          />
        </div>

        {/* Right-Side LIVE ALERTS Panel (4 or 3 cols, matching fixed height 590px) */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-[590px] min-h-[590px] max-h-[590px] overflow-hidden">
          <LiveAlertsRightPanel 
            onSelectAlert={setSelectedAlert}
          />
        </div>
      </div>

      {/* 2. BOTTOM INFORMATION AREA: Location Details, World Overview Map, Summary Counters, Legend */}
      <BottomInfoArea 
        locationInfo={locationInfo}
      />
    </div>
  );
};
