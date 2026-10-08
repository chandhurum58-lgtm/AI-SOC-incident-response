import React, { useState } from 'react';
import { 
  Globe2, 
  Activity, 
  Lock, 
  ArrowUpRight 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const WebMonitoringView: React.FC = () => {
  const { websites, setActiveTab } = useSoc();
  const [selectedWebId, setSelectedWebId] = useState<string>(websites[0].id);

  const currentWeb = websites.find(w => w.id === selectedWebId) || websites[0];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-purple-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Web Application & Public Ingress Security Monitor
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual host telemetry, HTTP status distributions, API security, and Layer-7 WAF inspection.
          </p>
        </div>
        {/* Website Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Domain Target:</span>
          <select
            value={selectedWebId}
            onChange={(e) => setSelectedWebId(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-sky-400 font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
          >
            {websites.map((w) => (
              <option key={w.id} value={w.id}>
                {w.domain} ({w.environment} - {w.status})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected Domain Banner */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold font-mono text-slate-100">{currentWeb.domain}</h2>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              currentWeb.status === 'UNDER_ATTACK' 
                ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' 
                : currentWeb.status === 'DEGRADED'
                ? 'bg-amber-950 text-amber-300 border border-amber-800'
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {currentWeb.status}
            </span>
            <span className="text-[11px] font-mono text-slate-400">Env: {currentWeb.environment}</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Protected by Cloudflare Advanced WAF & Kong Ingress Gateway. mTLS enforced on internal microservices.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('simulation')}
            className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-xs font-medium transition-colors"
          >
            Simulate Edge Scrubbing
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">24h Requests</span>
          <span className="text-lg font-bold text-slate-100 tabular-nums">
            {currentWeb.requests24h.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Unique Visitors</span>
          <span className="text-lg font-bold text-slate-100 tabular-nums">
            {currentWeb.visitors24h.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Unique Client IPs</span>
          <span className="text-lg font-bold text-slate-100 tabular-nums">
            {currentWeb.uniqueSourceIps.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-rose-900/40">
          <span className="text-slate-400 text-[10px] block">Suspicious Requests</span>
          <span className="text-lg font-bold text-rose-400 tabular-nums">
            {currentWeb.suspiciousRequestsCount.toLocaleString()}
          </span>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Data Transferred</span>
          <span className="text-lg font-bold text-sky-400 tabular-nums">
            {currentWeb.trafficVolumeGB} GB
          </span>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <span className="text-slate-400 text-[10px] block">Error Rate</span>
          <span className="text-lg font-bold text-amber-400 tabular-nums">
            {currentWeb.errorRatePercent}%
          </span>
        </div>
      </div>

      {/* Response Codes Distribution */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
          HTTP Response Code Distribution (Last 24 Hours)
        </h3>
        <div className="space-y-2">
          {currentWeb.responseCodes.map((rc) => (
            <div key={rc.code} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold">{rc.code}</span>
                <span className="text-slate-400 tabular-nums">
                  {rc.count.toLocaleString()} requests ({rc.percent}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded bg-slate-950 border border-slate-800/80 overflow-hidden">
                <div 
                  style={{ width: `${rc.percent}%` }}
                  className={`h-full rounded ${
                    rc.code.startsWith('200') 
                      ? 'bg-emerald-500' 
                      : rc.code.startsWith('3')
                      ? 'bg-sky-500'
                      : rc.code.startsWith('429')
                      ? 'bg-purple-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sub-Activities: Auth vs API Calls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="p-4 rounded bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-[11px] block">Authentication Activity</span>
          <span className="text-xl font-bold text-slate-200 block tabular-nums">
            {currentWeb.authActivityCount.toLocaleString()} logins & token refreshes
          </span>
          <p className="text-slate-400 font-sans text-xs">
            Includes OAuth2 grant exchanges, JWT verification, and SAML assertions.
          </p>
        </div>
        <div className="p-4 rounded bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-[11px] block">API Requests</span>
          <span className="text-xl font-bold text-slate-200 block tabular-nums">
            {currentWeb.apiRequestsCount.toLocaleString()} REST / GraphQL calls
          </span>
          <p className="text-slate-400 font-sans text-xs">
            Ingress API gateway filtered {currentWeb.suspiciousRequestsCount.toLocaleString()} anomalous payloads.
          </p>
        </div>
      </div>
    </div>
  );
};
