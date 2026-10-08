import React from 'react';
import { GoogleLiveMapCenter } from '../dashboard/GoogleLiveMapCenter';

export const GoogleLiveMapView: React.FC = () => {
  return (
    <div className="p-4 h-[calc(100vh-4rem)] max-w-[1780px] mx-auto select-none font-sans">
      <GoogleLiveMapCenter />
    </div>
  );
};
