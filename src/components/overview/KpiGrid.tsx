import React from 'react';
import { 
  AlertOctagon, 
  Flame, 
  Users, 
  Laptop, 
  Server, 
  Sparkles 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const KpiGrid: React.FC = () => {
  const { stats, setActiveTab } = useSoc();

  return (
    <div className="space-y-3">
      {/* Primary Status Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div 
          onClick={() => setActiveTab('alerts')}
          className="bg-slate-900/90 border border-rose-900/40 rounded p-3 cursor-pointer hover:border-rose-700/60 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Critical Incidents</span>
            <AlertOctagon className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-rose-400 tabular-nums">{stats.criticalIncidents}</span>
            <span className="text-[11px] text-rose-400/80 font-mono">Immediate Action</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('incidents')}
          className="bg-slate-900/90 border border-amber-900/40 rounded p-3 cursor-pointer hover:border-amber-700/60 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Threats</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-amber-300 tabular-nums">{stats.activeThreats}</span>
            <span className="text-[11px] text-amber-400/80 font-mono">In Triage</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('users')}
          className="bg-slate-900/90 border border-slate-800 rounded p-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Risky Users</span>
            <Users className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">{stats.riskyUsersCount}</span>
            <span className="text-[11px] text-yellow-400/80 font-mono">UEBA Flagged</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('devices')}
          className="bg-slate-900/90 border border-slate-800 rounded p-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Monitored Devices</span>
            <Laptop className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">{stats.monitoredDevicesCount}</span>
            <span className="text-[11px] text-emerald-400 font-mono">Online</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('traffic')}
          className="bg-slate-900/90 border border-slate-800 rounded p-3 cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Servers</span>
            <Server className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-slate-100 tabular-nums">{stats.activeServersCount}</span>
            <span className="text-[11px] text-emerald-400 font-mono">68 Healthy</span>
          </div>
        </div>

        <div 
          onClick={() => setActiveTab('prediction')}
          className="bg-slate-900/90 border border-sky-900/40 rounded p-3 cursor-pointer hover:border-sky-700/60 transition-colors"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>AI Predictions</span>
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-sky-300 tabular-nums">{stats.aiPredictionsCount}</span>
            <span className="text-[11px] text-sky-400/80 font-mono">Horizon</span>
          </div>
        </div>
      </div>

      {/* Secondary Telemetry Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs font-mono bg-slate-950 border border-slate-800/80 rounded p-2.5">
        <div>
          <span className="text-slate-400 block text-[11px]">Total Attacks</span>
          <span className="text-slate-200 font-semibold tabular-nums">{stats.totalAttacksDetected.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Blocked Attacks</span>
          <span className="text-emerald-400 font-semibold tabular-nums">{stats.blockedAttacks.toLocaleString()}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Resolved Incidents</span>
          <span className="text-slate-200 font-semibold tabular-nums">{stats.resolvedIncidents}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Suspicious Activities</span>
          <span className="text-amber-400 font-semibold tabular-nums">{stats.suspiciousActivities}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Monitored Websites</span>
          <span className="text-slate-200 font-semibold tabular-nums">{stats.monitoredWebsitesCount}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Network Throughput</span>
          <span className="text-sky-300 font-semibold tabular-nums">{stats.currentNetworkTrafficMbps} MB/s</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[11px]">Security Score</span>
          <span className="text-emerald-400 font-semibold tabular-nums">{stats.securityScore}/100</span>
        </div>
      </div>
    </div>
  );
};
