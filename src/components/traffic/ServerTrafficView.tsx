import React, { useState } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowUpRight, 
  ArrowDownLeft, 
  TrendingUp, 
  SlidersHorizontal,
  Play,
  ShieldAlert
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const ServerTrafficView: React.FC = () => {
  const { setActiveTab, setInvestigatedIp } = useSoc();
  const [selectedServer, setSelectedServer] = useState<string>('Web-Gateway-02 [api.enterprise.com]');

  const timeBuckets = [
    { time: '22:00', inMB: 480, outMB: 240, rps: 3800, errors: 0.2 },
    { time: '22:10', inMB: 510, outMB: 260, rps: 4100, errors: 0.3 },
    { time: '22:20', inMB: 540, outMB: 275, rps: 4400, errors: 0.4 },
    { time: '22:30', inMB: 1250, outMB: 490, rps: 12400, errors: 2.1, isSpike: true },
    { time: '22:40', inMB: 1480, outMB: 520, rps: 14200, errors: 2.6, isSpike: true },
    { time: '22:50', inMB: 980, outMB: 380, rps: 9800, errors: 1.8, isSpike: true },
    { time: 'Now', inMB: 842, outMB: 310, rps: 8120, errors: 1.2 }
  ];

  const topPorts = [
    { port: 443, service: 'HTTPS', trafficPct: 78, connections: 3420, status: 'NORMAL' },
    { port: 80, service: 'HTTP (Redirect)', trafficPct: 9, connections: 410, status: 'NORMAL' },
    { port: 53, service: 'DNS UDP', trafficPct: 6, connections: 380, status: 'NORMAL' },
    { port: 22, service: 'SSH Management', trafficPct: 4, connections: 82, status: 'MONITORED' },
    { port: 445, service: 'SMB (File/RPC)', trafficPct: 3, connections: 45, status: 'ANOMALY_PROBE' }
  ];

  const suspiciousSources = [
    { ip: '185.220.101.5', rps: 3420, proto: 'HTTPS:443', country: 'Netherlands', tag: 'Tor Exit / DDoS' },
    { ip: '198.51.100.23', rps: 42, proto: 'HTTPS:443', country: 'Germany', tag: 'Password Spray' },
    { ip: '45.33.32.156', rps: 110, proto: 'HTTP:80', country: 'United States', tag: 'SQLi Probe' },
    { ip: '10.0.12.44', rps: 18, proto: 'TCP:445', country: 'Internal Corp', tag: 'Lateral Port Sweep' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Live Server Traffic & Ingress Telemetry Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Deep packet inspection, volumetric anomaly detection, and Layer-7 DDoS behavioral heuristics.
          </p>
        </div>
        {/* Server Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Monitored Cluster:</span>
          <select
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
          >
            <option value="Web-Gateway-02 [api.enterprise.com]">Web-Gateway-02 [api.enterprise.com]</option>
            <option value="Auth-Cluster-Alpha [auth.portal.org]">Auth-Cluster-Alpha [auth.portal.org]</option>
            <option value="DB-Primary-Cluster [10.0.8.10]">DB-Primary-Cluster [10.0.8.10]</option>
            <option value="Payment-Gateway-Core">Payment-Gateway-Core</option>
          </select>
        </div>
      </div>

      {/* Primary Traffic Telemetry Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Incoming Bandwidth</span>
            <ArrowDownLeft className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-slate-100 tabular-nums">842.6</span>
            <span className="text-xs text-slate-400">MB/s</span>
          </div>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Outgoing Bandwidth</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-slate-100 tabular-nums">310.2</span>
            <span className="text-xs text-slate-400">MB/s</span>
          </div>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-rose-900/40">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Current RPS</span>
            <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-rose-400 tabular-nums">14,240</span>
            <span className="text-xs text-rose-400/80">Req/s</span>
          </div>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active TCP Sockets</span>
            <Activity className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-slate-100 tabular-nums">4,890</span>
            <span className="text-xs text-slate-400">Conn</span>
          </div>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bandwidth Utilization</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-slate-100 tabular-nums">68.4%</span>
            <span className="text-xs text-slate-400">of 10Gbps</span>
          </div>
        </div>
        <div className="p-3 rounded bg-slate-900/90 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>HTTP Error Rate</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="mt-1 flex items-baseline gap-1 font-mono">
            <span className="text-xl font-bold text-amber-400 tabular-nums">2.4%</span>
            <span className="text-xs text-slate-400">(4xx/5xx)</span>
          </div>
        </div>
      </div>

      {/* Traffic Time-Series Histogram Chart */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h3 className="text-xs font-semibold text-slate-200">
            Volumetric Request & Throughput Cadence (Last 60 Minutes)
          </h3>
          <span className="text-[11px] font-mono text-rose-400">
            Spike Threshold: 8,000 RPS (Exceeded at 22:30 UTC)
          </span>
        </div>

        <div className="grid grid-cols-7 gap-3 pt-4 pb-2 items-end h-44">
          {timeBuckets.map((bucket, idx) => {
            const heightPct = Math.min(100, (bucket.rps / 15000) * 100);
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono text-slate-400 mb-1 opacity-80 group-hover:opacity-100 tabular-nums">
                  {bucket.rps} rps
                </span>
                <div className="w-full max-w-[48px] bg-slate-950 rounded-t overflow-hidden flex flex-col justify-end h-32 border border-slate-800">
                  <div 
                    style={{ height: `${heightPct}%` }}
                    className={`w-full transition-all rounded-t ${
                      bucket.isSpike 
                        ? 'bg-gradient-to-t from-rose-600 to-rose-400' 
                        : 'bg-gradient-to-t from-sky-600 to-sky-400'
                    }`}
                  />
                </div>
                <span className="text-[11px] font-mono text-slate-400 mt-2">
                  {bucket.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Server Traffic AI Fix / Recommendation */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-xs font-semibold text-slate-100">
              AI Traffic Anomaly Diagnosis & Recommended Fix
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('simulation')}
            className="px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded flex items-center gap-1 transition-colors"
          >
            <Play className="w-3 h-3" />
            <span>Simulate Traffic Fix Sandbox</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-rose-400 font-semibold block">1. Traffic Problem</span>
            <p className="text-slate-200 leading-relaxed font-sans">
              "Abnormally high requests (14,200 RPS) detected from a cluster of TOR exit nodes targeting /v2/checkout endpoint."
            </p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-amber-400 font-semibold block">2. Possible Cause</span>
            <p className="text-slate-200 leading-relaxed font-sans">
              "Potential automated request flooding designed to exhaust web application memory pools and trigger gateway failover."
            </p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1">
            <span className="text-emerald-400 font-semibold block">3. AI Recommendation</span>
            <ul className="text-slate-200 leading-relaxed font-sans space-y-0.5">
              <li>• Apply Layer-7 rate-limiting (50 req/min per IP)</li>
              <li>• Enable Managed JS challenge on /checkout</li>
              <li>• Review web server logs for token leaks</li>
              <li>• Monitor traffic after mitigation</li>
            </ul>
          </div>
        </div>

        <div className="p-3 rounded bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">Before Mitigation</span>
            <span className="text-rose-400 font-bold text-sm">14,200 RPS • 84/100 Risk</span>
            <span className="text-slate-400 text-[11px] block mt-0.5">Abnormal Attack Traffic Active</span>
          </div>
          <div className="text-slate-600 text-lg hidden sm:block">➔</div>
          <div>
            <span className="text-slate-400 text-[10px] block uppercase">After Simulation</span>
            <span className="text-emerald-400 font-bold text-sm">210 RPS • 10/100 Risk</span>
            <span className="text-slate-400 text-[11px] block mt-0.5">Reduced Risk & Baseline Restored</span>
          </div>
          <button
            onClick={() => setActiveTab('simulation')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-sans text-xs font-medium transition-colors"
          >
            Apply Mitigation Rules
          </button>
        </div>
      </div>

      {/* Top Ports & Suspicious Sources Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4">
          <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2 mb-3">
            Active Port Distribution & Protocol Breakdown
          </h3>
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-2">Port / Service</th>
                  <th className="pb-2">Traffic Share</th>
                  <th className="pb-2">Connections</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {topPorts.map((p) => (
                  <tr key={p.port} className="hover:bg-slate-800/40">
                    <td className="py-2 text-slate-200">
                      Port {p.port} ({p.service})
                    </td>
                    <td className="py-2 text-slate-300 tabular-nums">
                      {p.trafficPct}%
                    </td>
                    <td className="py-2 text-slate-300 tabular-nums">
                      {p.connections.toLocaleString()}
                    </td>
                    <td className="py-2 text-right">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        p.status === 'ANOMALY_PROBE' 
                          ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                          : p.status === 'MONITORED'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'text-slate-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded p-4">
          <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2 mb-3">
            Top Suspicious Ingress Sources
          </h3>
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-2">Source IP</th>
                  <th className="pb-2">Cadence</th>
                  <th className="pb-2">Location</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {suspiciousSources.map((s) => (
                  <tr key={s.ip} className="hover:bg-slate-800/40">
                    <td className="py-2 text-sky-400 font-bold">
                      <button
                        onClick={() => {
                          setInvestigatedIp(s.ip);
                          setActiveTab('threatintel');
                        }}
                        className="hover:underline"
                      >
                        {s.ip}
                      </button>
                    </td>
                    <td className="py-2 text-slate-300 tabular-nums">
                      {s.rps} rps ({s.proto})
                    </td>
                    <td className="py-2 text-slate-400">
                      {s.country}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => {
                          setInvestigatedIp(s.ip);
                          setActiveTab('threatintel');
                        }}
                        className="text-[11px] text-sky-400 hover:text-sky-300"
                      >
                        Investigate →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
