import React, { useState } from 'react';
import { ChevronDown, ShieldAlert, Building2 } from 'lucide-react';
import { SentraKpiRow } from './SentraKpiRow';
import { GoogleLiveMapCenter } from './GoogleLiveMapCenter';
import { ThreatTrendsChart } from './ThreatTrendsChart';
import { ThreatTypeBarChart } from './ThreatTypeBarChart';
import { AffectedSystemsGauges } from './AffectedSystemsGauges';
import { useSoc } from '../../context/SocContext';

export const SentraThreatIntelligenceDashboard: React.FC = () => {
  const { setInvestigatedIp, setActiveTab } = useSoc();
  const [selectedOrg, setSelectedOrg] = useState('All');
  const [timeRange, setTimeRange] = useState<'Today' | 'Last 24 Hours' | 'Date Range'>('Last 24 Hours');
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);

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
    <div className="p-3 sm:p-4 space-y-3.5 max-w-[1920px] mx-auto select-none font-sans">
      {/* 1. Subheader matching reference dashboard layout */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Left: Dashboard Title */}
        <div>
          <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
            Threat Intelligence Dashboard
          </h1>
        </div>

        {/* Center: Organization Overview Filter */}
        <div className="relative">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span className="text-slate-400 font-sans hidden sm:inline">Organization Overview:</span>
            <button
              onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0c122e] border border-[#1b2756] hover:border-blue-500/50 text-white font-medium text-xs shadow-inner transition-colors"
            >
              <span>{selectedOrg}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
          </div>

          {orgDropdownOpen && (
            <div className="absolute top-full mt-1.5 left-0 w-44 bg-[#0a102a] border border-[#1d2b5e] rounded-xl shadow-2xl py-1 z-30 text-xs">
              {['All', 'Enterprise Core Corp', 'Fintech Ingress DMZ', 'Cloud Infrastructure', 'Gov Perimeter'].map((org) => (
                <button
                  key={org}
                  onClick={() => { setSelectedOrg(org); setOrgDropdownOpen(false); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#131d45] text-slate-200 transition-colors"
                >
                  {org}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Time Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#090f26] border border-[#18234e] rounded-full p-0.5 text-xs font-sans">
            <button
              onClick={() => setTimeRange('Today')}
              className={`px-3 py-1 rounded-full transition-all text-[11px] ${
                timeRange === 'Today'
                  ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('Last 24 Hours')}
              className={`px-3 py-1 rounded-full transition-all text-[11px] ${
                timeRange === 'Last 24 Hours'
                  ? 'bg-blue-600 text-white font-semibold shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 24 Hours
            </button>
            <button
              onClick={() => setTimeRange('Date Range')}
              className={`px-3 py-1 rounded-full transition-all text-[11px] flex items-center gap-1 ${
                timeRange === 'Date Range'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Date Range</span>
              <ChevronDown className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top KPI Cards Row: 5 Cards matching reference dashboard */}
      <SentraKpiRow />

      {/* 3. Main Content Layout: Google Live Map + Right Column Telemetry Charts (Threat Distribution & Detection Accuracy removed) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* Left Column (8 cols): Google Live Map + Attacks & Top Organisations Telemetry */}
        <div className="lg:col-span-8 flex flex-col gap-3.5">
          {/* Attacks & Top 5 Affected Organisations Strip */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Left Sub-panel: Attacks */}
            <div className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#141d40] pb-1.5 mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  Live Attacks Stream (28,450 Detected)
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">First 5 IPs</span>
              </div>
              <div className="space-y-1.5">
                {liveAttacks.map((atk) => (
                  <div 
                    key={atk.id} 
                    onClick={() => { setInvestigatedIp(atk.ip); setActiveTab('threatintel'); }}
                    className="flex items-center justify-between text-[11px] hover:bg-[#121b3f] p-1.5 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span className={`w-2 h-2 rounded-full ${atk.dotColor} shrink-0 animate-pulse`} />
                      <span className="text-slate-300 truncate text-[11px] font-medium">{atk.title}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-400 shrink-0">
                      <span className="text-slate-300">{atk.source}</span>
                      <span className="text-cyan-400 font-bold">→</span>
                      <span className="text-slate-100 font-semibold">{atk.dest}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sub-panel: Top 5 Affected Organisations */}
            <div className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-[#141d40] pb-1.5 mb-2">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  Top 5 Affected Organisations
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Critical Perimeter</span>
              </div>
              <div className="space-y-2">
                {topOrganizations.map((org) => (
                  <div key={org.name} className="space-y-1">
                    <div className="flex items-center justify-between text-[10.5px]">
                      <span className="text-slate-200 font-semibold">{org.name} <span className="text-slate-400 font-normal font-mono">({org.count} Incidents)</span></span>
                      <span className="text-slate-400 truncate max-w-[150px] font-mono text-[9.5px]">{org.details}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#101738] rounded-full overflow-hidden">
                      <div 
                        style={{ width: `${org.barPct}%` }}
                        className={`h-full ${org.color} rounded-full transition-all`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Google Live Map Component */}
          <div className="w-full h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-[#16214a]">
            <GoogleLiveMapCenter />
          </div>
        </div>

        {/* Right Column (4 cols): Threat Trends Over Time, Breakdown by Type, Affected Systems & Severity */}
        <div className="lg:col-span-4 flex flex-col gap-3.5">
          <div className="min-h-[220px]">
            <ThreatTrendsChart />
          </div>
          <div className="min-h-[260px]">
            <ThreatTypeBarChart />
          </div>
          <div className="min-h-[220px]">
            <AffectedSystemsGauges />
          </div>
        </div>
      </div>
    </div>
  );
};
