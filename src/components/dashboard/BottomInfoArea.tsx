import React from 'react';
import { 
  MapPin, 
  Globe2, 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  AlertTriangle, 
  Building2, 
  Navigation, 
  Activity,
  Compass
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export interface BottomInfoAreaProps {
  locationInfo?: {
    country: string;
    state: string;
    district: string;
    city: string;
    lat: number;
    lng: number;
  };
}

export const BottomInfoArea: React.FC<BottomInfoAreaProps> = ({
  locationInfo = {
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7128,
    lng: -74.0060
  }
}) => {
  const { stats, alerts, devices } = useSoc();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch font-sans text-xs select-none">
      {/* 1. Location Details (4 cols) */}
      <div className="lg:col-span-4 bg-[#070c20] border border-[#162244] rounded-2xl p-3.5 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141f45] pb-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono">
                Location Details & Geo Telemetry
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Active Tactical Sector Profile
              </p>
            </div>
          </div>
          <span className="text-[9.5px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            ONLINE
          </span>
        </div>

        {/* Location Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-xl bg-[#0a112c] border border-[#162248]">
            <span className="text-slate-400 block text-[9.5px]">Region / City:</span>
            <span className="font-bold text-white text-xs truncate block">{locationInfo.city}</span>
            <span className="text-slate-400 text-[10px] truncate block">{locationInfo.state}, {locationInfo.country}</span>
          </div>
          <div className="p-2 rounded-xl bg-[#0a112c] border border-[#162248]">
            <span className="text-slate-400 block text-[9.5px]">District / Subnet:</span>
            <span className="font-bold text-cyan-300 text-xs truncate block">{locationInfo.district}</span>
            <span className="text-slate-400 text-[10px] block">VLAN-100 DMZ</span>
          </div>
          <div className="p-2 rounded-xl bg-[#0a112c] border border-[#162248]">
            <span className="text-slate-400 block text-[9.5px]">GPS Coordinates:</span>
            <span className="font-bold text-slate-200 block">{locationInfo.lat.toFixed(4)}° N</span>
            <span className="text-slate-400 text-[10px] block">{Math.abs(locationInfo.lng).toFixed(4)}° W</span>
          </div>
          <div className="p-2 rounded-xl bg-[#0a112c] border border-[#162248]">
            <span className="text-slate-400 block text-[9.5px]">Elevation & Terrain:</span>
            <span className="font-bold text-slate-200 block">12m ASL</span>
            <span className="text-emerald-400 text-[10px] block">River / Urban Grid</span>
          </div>
        </div>
      </div>

      {/* 2. Small World Overview Map (3 cols) */}
      <div className="lg:col-span-3 bg-[#070c20] border border-[#162244] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141f45] pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
              World Overview
            </h3>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400">Global Mesh</span>
        </div>

        {/* Compact Minimap SVG */}
        <div className="relative w-full h-24 bg-[#05091a] rounded-xl border border-[#152048] overflow-hidden flex items-center justify-center p-1">
          <svg viewBox="0 0 400 200" className="w-full h-full object-contain">
            {/* Dark Continents Vector Silhouettes */}
            <g fill="#0e173b" stroke="#1c2f66" strokeWidth="0.8">
              {/* North America */}
              <path d="M 50,30 Q 90,20 130,30 Q 140,60 120,90 Q 90,110 70,80 Z" />
              {/* South America */}
              <path d="M 110,95 Q 140,110 145,150 Q 120,180 100,150 Z" />
              {/* Europe */}
              <path d="M 190,30 Q 230,25 240,55 Q 210,70 190,60 Z" />
              {/* Africa */}
              <path d="M 190,70 Q 240,75 245,130 Q 210,160 185,130 Z" />
              {/* Asia */}
              <path d="M 240,25 Q 340,20 350,80 Q 300,120 250,85 Z" />
              {/* Australia */}
              <path d="M 310,120 Q 350,120 355,155 Q 320,170 305,150 Z" />
            </g>

            {/* Global Attack Pulse Dots */}
            <circle cx="100" cy="55" r="3" fill="#ef4444" className="animate-ping" />
            <circle cx="100" cy="55" r="2.5" fill="#ef4444" />
            <circle cx="210" cy="45" r="2" fill="#10b981" />
            <circle cx="290" cy="50" r="2.5" fill="#ef4444" />
            <circle cx="330" cy="140" r="2" fill="#3b82f6" />
            <circle cx="120" cy="130" r="2" fill="#eab308" />

            {/* Glowing Active Viewport Box representing currently zoomed city */}
            <rect 
              x="88" 
              y="45" 
              width="24" 
              height="20" 
              fill="rgba(6, 182, 212, 0.2)" 
              stroke="#38bdf8" 
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </svg>

          {/* Minimap Pin Readout */}
          <div className="absolute bottom-1 right-2 text-[8.5px] font-mono text-cyan-300">
            Viewport: {locationInfo.city.split(' ')[0]}
          </div>
        </div>
      </div>

      {/* 3. Summary Counters (3 cols) */}
      <div className="lg:col-span-3 bg-[#070c20] border border-[#162244] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141f45] pb-1.5 mb-1.5">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase font-mono tracking-wide">
              Summary Counters
            </h3>
          </div>
          <span className="text-[9.5px] font-mono text-slate-400">Live Totals</span>
        </div>

        {/* 4 Quick Counters */}
        <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
          {/* Attackers */}
          <div className="p-2 rounded-xl bg-[#0a112c] border border-rose-900/40 flex items-center justify-between">
            <div>
              <span className="text-[9.5px] text-slate-400 font-sans block">Attackers</span>
              <span className="text-sm font-bold text-rose-400 tabular-nums">14 Active</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          </div>

          {/* Protected Users */}
          <div className="p-2 rounded-xl bg-[#0a112c] border border-emerald-900/40 flex items-center justify-between">
            <div>
              <span className="text-[9.5px] text-slate-400 font-sans block">Users</span>
              <span className="text-sm font-bold text-emerald-400 tabular-nums">1,420 Safe</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>

          {/* Servers */}
          <div className="p-2 rounded-xl bg-[#0a112c] border border-blue-900/40 flex items-center justify-between">
            <div>
              <span className="text-[9.5px] text-slate-400 font-sans block">Servers</span>
              <span className="text-sm font-bold text-sky-400 tabular-nums">68 Nodes</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          </div>

          {/* Active Alerts */}
          <div className="p-2 rounded-xl bg-[#0a112c] border border-yellow-900/40 flex items-center justify-between">
            <div>
              <span className="text-[9.5px] text-slate-400 font-sans block">Alerts</span>
              <span className="text-sm font-bold text-yellow-400 tabular-nums">{alerts.length} In Triage</span>
            </div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping" />
          </div>
        </div>
      </div>

      {/* 4. Compact Legend (2 cols) */}
      <div className="lg:col-span-2 bg-[#070c20] border border-[#162244] rounded-2xl p-3 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141f45] pb-1.5 mb-1.5">
          <span className="text-xs font-bold text-white uppercase font-mono tracking-wide">
            Map Legend
          </span>
          <span className="text-[9px] font-mono text-slate-500">3D Keys</span>
        </div>

        <div className="space-y-1.5 text-[11px] font-medium font-sans">
          <div className="flex items-center gap-2 text-rose-300">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] shrink-0" />
            <span className="truncate">🔴 Red = Attacker</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] shrink-0" />
            <span className="truncate">🟢 Green = User</span>
          </div>
          <div className="flex items-center gap-2 text-sky-300">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] shrink-0" />
            <span className="truncate">🔵 Blue = Server</span>
          </div>
          <div className="flex items-center gap-2 text-yellow-300">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-[0_0_8px_#eab308] shrink-0" />
            <span className="truncate">🟡 Yellow = Alert Zone</span>
          </div>
        </div>
      </div>
    </div>
  );
};
