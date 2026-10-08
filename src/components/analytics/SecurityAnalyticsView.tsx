import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const SecurityAnalyticsView: React.FC = () => {
  const { stats } = useSoc();
  const [timeFilter, setTimeFilter] = useState<string>('LAST_30_DAYS');
  const [viewScope, setViewScope] = useState<'OVERVIEW' | 'DAILY' | 'MONTHLY' | 'YEARLY'>('OVERVIEW');

  const attackCategories = [
    { name: 'Credential Spray / Brute Force', count: 6420, pct: 43 },
    { name: 'Layer-7 Volumetric DDoS', count: 4120, pct: 28 },
    { name: 'Web Application Probing (SQLi/XSS)', count: 2450, pct: 16 },
    { name: 'Internal SMB / Port Scanning', count: 1200, pct: 8 },
    { name: 'Rogue Hardware Insertion', count: 702, pct: 5 }
  ];

  const topTargetedServers = [
    { name: 'Auth-Cluster-Alpha [OAuth2]', attacks: 5820, risk: 'HIGH' },
    { name: 'Web-Gateway-02 [api.enterprise.com]', attacks: 4410, risk: 'CRITICAL' },
    { name: 'Payment-Gateway-Core', attacks: 2190, risk: 'MEDIUM' },
    { name: 'DB-Primary-Cluster', attacks: 840, risk: 'CRITICAL' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Historical Cyber Attack Analytics & Trends
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Longitudinal trend telemetry, incident resolution velocity, and attack vector distribution.
          </p>
        </div>
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800 text-xs">
            {(['OVERVIEW', 'DAILY', 'MONTHLY', 'YEARLY'] as const).map((sc) => (
              <button
                key={sc}
                onClick={() => setViewScope(sc)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  viewScope === sc 
                    ? 'bg-slate-800 text-slate-100 font-medium' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>

          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="TODAY">Today</option>
            <option value="YESTERDAY">Yesterday</option>
            <option value="LAST_7_DAYS">Last 7 Days</option>
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="PREV_MONTH">Previous Month</option>
            <option value="PREV_YEAR">Previous Year</option>
            <option value="CUSTOM">Custom Date Range</option>
          </select>
        </div>
      </div>

      {/* Comparisons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Current Month Attacks
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-100 tabular-nums">14,892</span>
            <span className="text-xs text-rose-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4% MoM
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">vs Prev Month: 13,740</span>
        </div>

        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Mean Time to Contain (MTTC)
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-400 tabular-nums">4.2 mins</span>
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              <TrendingDown className="w-3.5 h-3.5" /> -32% Improved
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">vs Prev Month: 6.2 mins</span>
        </div>

        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Annual Attack Growth
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-100 tabular-nums">142,400</span>
            <span className="text-xs text-rose-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +14.2% YoY
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">vs Prev Year: 124,700</span>
        </div>

        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Containment Verification Rate
          </span>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-xl font-bold text-emerald-400 tabular-nums">99.4%</span>
            <span className="text-xs text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> +1.2%
            </span>
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">Zero Breach Escapes</span>
        </div>
      </div>

      {/* Attack Categories & Severity Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Categories Breakdown */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Cyber Attack Categories Breakdown ({timeFilter})
          </h3>
          <div className="space-y-2.5">
            {attackCategories.map((cat) => (
              <div key={cat.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300 font-sans">{cat.name}</span>
                  <span className="text-slate-400 tabular-nums">
                    {cat.count.toLocaleString()} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-slate-950 border border-slate-800/80 overflow-hidden">
                  <div 
                    style={{ width: `${cat.pct}%` }}
                    className="h-full bg-gradient-to-r from-sky-500 to-purple-500 rounded"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
            Severity & Resolution Status
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono text-center">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Critical</span>
              <span className="text-base font-bold text-rose-400 tabular-nums">4</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">High</span>
              <span className="text-base font-bold text-amber-400 tabular-nums">9</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Medium</span>
              <span className="text-base font-bold text-yellow-400 tabular-nums">18</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
              <span className="text-[10px] text-slate-400 block">Low / Info</span>
              <span className="text-base font-bold text-sky-400 tabular-nums">42</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800 space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Resolved Incidents:</span>
              <span className="text-emerald-400 font-bold tabular-nums">{stats.resolvedIncidents}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Active / In Triage:</span>
              <span className="text-amber-400 font-bold tabular-nums">{stats.activeThreats}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Automated Blocks:</span>
              <span className="text-sky-300 font-bold tabular-nums">14,470 (97.2%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Most Targeted Servers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
          Most Targeted Assets & Infrastructure Nodes
        </h3>
        <div className="overflow-x-auto font-mono text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                <th className="pb-2">Asset Name</th>
                <th className="pb-2">Attacks Ingested</th>
                <th className="pb-2">Risk Rating</th>
                <th className="pb-2 text-right">Defense Posture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topTargetedServers.map((srv) => (
                <tr key={srv.name} className="hover:bg-slate-800/40">
                  <td className="py-2.5 text-slate-200 font-bold">{srv.name}</td>
                  <td className="py-2.5 text-slate-300 tabular-nums">
                    {srv.attacks.toLocaleString()}
                  </td>
                  <td className="py-2.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                      srv.risk === 'CRITICAL' ? 'bg-rose-950 text-rose-300' : 'bg-amber-950 text-amber-300'
                    }`}>
                      {srv.risk}
                    </span>
                  </td>
                  <td className="py-2.5 text-right text-emerald-400 text-[11px]">
                    Shield Active (99.8% Filtered)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
