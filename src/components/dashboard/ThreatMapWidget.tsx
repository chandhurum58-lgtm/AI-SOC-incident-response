import React, { useState } from 'react';
import { 
  ChevronDown,
  Layers
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const ThreatMapWidget: React.FC = () => {
  const { setActiveTab, setInvestigatedIp } = useSoc();
  const [ipFilter, setIpFilter] = useState('First 5 Ips');
  const [threatTypeFilter, setThreatTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const liveAttacks = [
    {
      id: 'atk-1',
      title: 'Clone Site Targeting Client HTTP service',
      source: 'US',
      dest: 'Turkey',
      dotColor: 'bg-amber-400',
      ip: '198.51.100.23'
    },
    {
      id: 'atk-2',
      title: 'Clone Site Targeting Client HTTP service',
      source: 'US',
      dest: 'Turkey',
      dotColor: 'bg-amber-400',
      ip: '198.51.100.24'
    },
    {
      id: 'atk-3',
      title: 'WMC32 Malware Windows HTTP/HTTPS',
      source: 'Russia',
      dest: 'Turkey',
      dotColor: 'bg-amber-400',
      ip: '185.220.101.42'
    },
    {
      id: 'atk-4',
      title: 'Clone Site Targeting Client HTTP service',
      source: 'US',
      dest: 'Turkey',
      dotColor: 'bg-amber-400',
      ip: '198.51.100.25'
    },
    {
      id: 'atk-5',
      title: 'WMC32 Malware Windows HTTP/HTTPS',
      source: 'China',
      dest: 'UAE',
      dotColor: 'bg-rose-500',
      ip: '203.0.113.19'
    }
  ];

  const topOrganizations = [
    {
      name: 'Organisation 1',
      count: '41',
      details: '15 minutes, 12 Server, 12 Exploits',
      barPct: 85,
      color: 'bg-rose-500'
    },
    {
      name: 'Organisation 2',
      count: '21',
      details: '11 Server, 11 DDOS',
      barPct: 45,
      color: 'bg-amber-400'
    },
    {
      name: 'Organisation 3',
      count: '41',
      details: '22 Server, 12 Suspicious IP Targeting',
      barPct: 85,
      color: 'bg-yellow-400'
    },
    {
      name: 'Organisation 4',
      count: '22',
      details: '22 Exfiltration',
      barPct: 48,
      color: 'bg-cyan-400'
    },
    {
      name: 'Organisation 5',
      count: '21',
      details: '9 Virus',
      barPct: 42,
      color: 'bg-blue-400'
    }
  ];

  return (
    <div className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between h-full space-y-3 shadow-lg">
      {/* Top Header matching reference screenshot */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#152044] pb-2.5 gap-2">
        <div className="flex items-center gap-2">
          <h2 className="text-xs font-semibold text-slate-100 font-sans tracking-wide">
            Threat Map
          </h2>
        </div>

        {/* Filters on right: [First 5 Ips v] [Threat Types: All v] [Severity: All v] */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#101738] border border-[#1c2752] text-[9.5px] text-slate-300">
            <span>{ipFilter}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#101738] border border-[#1c2752] text-[9.5px] text-slate-300">
            <span>Threat Types: {threatTypeFilter}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </div>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#101738] border border-[#1c2752] text-[9.5px] text-slate-300">
            <span>Severity: {severityFilter}</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </div>
          {/* Quick toggle to launch 3D view if desired without losing anything */}
          <button
            onClick={() => setActiveTab('livemap')}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-[9.5px] text-cyan-300 transition-colors"
            title="Switch to 3D Live Security Map"
          >
            <Layers className="w-2.5 h-2.5" />
            <span>3D Map</span>
          </button>
        </div>
      </div>

      {/* Middle Split Row: Attacks & Top 5 Affected Organisations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 font-sans text-xs">
        {/* Left Sub-panel: Attacks */}
        <div className="bg-[#080d22] border border-[#141d40] rounded-lg p-2.5 space-y-1.5">
          <div className="text-[10.5px] font-semibold text-slate-300 border-b border-[#141d40] pb-1">
            Attacks
          </div>
          <div className="space-y-1">
            {liveAttacks.map((atk) => (
              <div 
                key={atk.id} 
                onClick={() => { setInvestigatedIp(atk.ip); setActiveTab('threatintel'); }}
                className="flex items-center justify-between text-[10px] hover:bg-[#0f1738] p-1 rounded cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-1.5 min-w-0 pr-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${atk.dotColor} shrink-0`} />
                  <span className="text-slate-300 truncate text-[9.5px]">{atk.title}</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[9px] text-slate-400 shrink-0">
                  <span className="text-slate-300">{atk.source}</span>
                  <span className="text-cyan-400">→</span>
                  <span className="text-slate-200">{atk.dest}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sub-panel: Top 5 Affected Organisations */}
        <div className="bg-[#080d22] border border-[#141d40] rounded-lg p-2.5 space-y-1.5">
          <div className="text-[10.5px] font-semibold text-slate-300 border-b border-[#141d40] pb-1">
            Top 5 Affected Organisations
          </div>
          <div className="space-y-1">
            {topOrganizations.map((org) => (
              <div key={org.name} className="space-y-0.5">
                <div className="flex items-center justify-between text-[9px]">
                  <span className="text-slate-200 font-medium">{org.name} | {org.count}</span>
                  <span className="text-slate-400 truncate max-w-[130px] font-mono">{org.details}</span>
                </div>
                <div className="w-full h-1 bg-[#101738] rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${org.barPct}%` }}
                    className={`h-full ${org.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Sub-panel: World Threat Map with Animated Attack Arcs */}
      <div className="relative bg-[#070b1c] border border-[#141d40] rounded-xl overflow-hidden p-2 flex flex-col justify-between h-60">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#101738_1px,transparent_1px),linear-gradient(to_bottom,#101738_1px,transparent_1px)] bg-[size:1.6rem_1.6rem] opacity-20" />
          
          <svg viewBox="0 0 800 380" className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(20,40,90,0.4)]">
            <defs>
              <linearGradient id="yellowArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#eab308" stopOpacity="1" />
              </linearGradient>
              <linearGradient id="redArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Realistic Continent Vector Shapes matching screenshot */}
            {/* North America */}
            <path d="M 80,50 Q 140,40 220,55 Q 240,110 220,150 Q 170,180 130,140 Q 90,100 80,50 Z" fill="#152148" opacity="0.85" />
            {/* South America */}
            <path d="M 210,170 Q 260,190 270,250 Q 230,320 200,270 Q 190,200 210,170 Z" fill="#152148" opacity="0.85" />
            {/* Europe */}
            <path d="M 370,60 Q 440,55 460,100 Q 410,130 370,110 Q 350,80 370,60 Z" fill="#172450" opacity="0.9" />
            {/* Africa */}
            <path d="M 370,125 Q 460,130 470,220 Q 420,290 370,250 Q 350,170 370,125 Z" fill="#152148" opacity="0.85" />
            {/* Asia & Russia */}
            <path d="M 460,45 Q 680,40 700,130 Q 640,190 530,160 Q 450,110 460,45 Z" fill="#172450" opacity="0.9" />
            {/* Australia */}
            <path d="M 610,220 Q 680,220 690,280 Q 640,310 600,270 Z" fill="#152148" opacity="0.85" />

            {/* Glowing Attack Trajectory Arcs matching screenshot */}
            {/* Arc 1: US -> Turkey (Yellow arc) */}
            <path 
              d="M 180 110 Q 300 15 440 100" 
              fill="none" 
              stroke="url(#yellowArc)" 
              strokeWidth="2.2" 
              strokeDasharray="6,4"
              className="animate-pulse"
            />
            {/* Arc 2: US -> Turkey (Yellow arc secondary) */}
            <path 
              d="M 190 120 Q 310 35 440 100" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="1.8" 
              strokeDasharray="4,4"
              opacity="0.8"
            />
            {/* Arc 3: Russia -> Turkey (Yellow arc) */}
            <path 
              d="M 540 70 Q 480 75 440 100" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="2" 
              strokeDasharray="5,3"
            />
            {/* Arc 4: China -> UAE (Red arc) */}
            <path 
              d="M 620 110 Q 550 85 470 125" 
              fill="none" 
              stroke="url(#redArc)" 
              strokeWidth="2.4" 
              strokeDasharray="6,3"
              className="animate-pulse"
            />

            {/* Attack Endpoints */}
            <circle cx="180" cy="110" r="4.5" fill="#f59e0b" className="animate-ping" />
            <circle cx="180" cy="110" r="3.5" fill="#f59e0b" />
            <circle cx="440" cy="100" r="4" fill="#ef4444" />
            <circle cx="540" cy="70" r="3.5" fill="#eab308" />
            <circle cx="620" cy="110" r="4.5" fill="#ef4444" className="animate-ping" />
            <circle cx="620" cy="110" r="3.5" fill="#ef4444" />
            <circle cx="470" cy="125" r="4" fill="#ef4444" />
          </svg>
        </div>

        {/* Legend matching screenshot at bottom of map */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-sans pt-1 border-t border-[#141d40] text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
            <span>Malware</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_5px_#f59e0b]" />
            <span>Phishing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_5px_#06b6d4]" />
            <span>Botnet</span>
          </div>
        </div>
      </div>
    </div>
  );
};
