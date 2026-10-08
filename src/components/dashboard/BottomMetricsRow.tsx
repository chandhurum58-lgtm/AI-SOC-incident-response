import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  Pause, 
  Play, 
  Globe2, 
  ChevronRight
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const BottomMetricsRow: React.FC = () => {
  const { setActiveTab, setInvestigatedIp } = useSoc();
  const [isTimelineLive, setIsTimelineLive] = useState(true);

  // Live real-time streaming attack events for timeline
  const [timelineEvents, setTimelineEvents] = useState([
    { id: 'EV-101', time: 'Just now', ip: '103.77.12.5', country: 'Singapore', flag: '🇸🇬', type: 'Credential Theft', target: 'Auth Server (auth.example.com)', severity: 'CRITICAL', protocol: 'HTTPS / 443' },
    { id: 'EV-102', time: '18s ago', ip: '203.0.113.18', country: 'United States', flag: '🇺🇸', type: 'Brute Force Spray', target: 'Frankfurt Datacenter', severity: 'HIGH', protocol: 'HTTPS / 443' },
    { id: 'EV-103', time: '42s ago', ip: '198.51.100.42', country: 'Germany', flag: '🇩🇪', type: 'TCP SYN Port Scan', target: 'Ingress Router Gateway', severity: 'MEDIUM', protocol: 'TCP / SYN' },
    { id: 'EV-104', time: '1m ago', ip: '181.214.56.7', country: 'Brazil', flag: '🇧🇷', type: 'SQLi Injection Probe', target: 'API Gateway Cluster', severity: 'MEDIUM', protocol: 'HTTP / 8080' },
    { id: 'EV-105', time: '2m ago', ip: '45.77.32.101', country: 'Australia', flag: '🇦🇺', type: 'Unusual Session Anomaly', target: 'SSO Portal', severity: 'LOW', protocol: 'HTTPS / 443' }
  ]);

  useEffect(() => {
    if (!isTimelineLive) return;
    const interval = setInterval(() => {
      setTimelineEvents((prev) => {
        const rotatingIps = [
          { ip: '185.220.101.5', country: 'Russia', flag: '🇷🇺', type: 'C2 Beaconing Check', target: 'Prod K8s Cluster', severity: 'HIGH', protocol: 'DNS / 53' },
          { ip: '114.119.130.8', country: 'China', flag: '🇨🇳', type: 'DDoS SYN Flood', target: 'Web Edge Proxy', severity: 'CRITICAL', protocol: 'TCP / 80' },
          { ip: '194.26.29.112', country: 'Netherlands', flag: '🇳🇱', type: 'Directory Traversal', target: 'Static Asset Server', severity: 'MEDIUM', protocol: 'HTTP / 443' }
        ];
        const nextItem = rotatingIps[Math.floor(Math.random() * rotatingIps.length)];
        const newEvent = {
          id: `EV-${Date.now()}`,
          time: 'Just now',
          ip: nextItem.ip,
          country: nextItem.country,
          flag: nextItem.flag,
          type: nextItem.type,
          target: nextItem.target,
          severity: nextItem.severity,
          protocol: nextItem.protocol
        };
        return [newEvent, ...prev.slice(0, 4)];
      });
    }, 8000);
    return () => clearInterval(interval);
  }, [isTimelineLive]);

  const telemetryPoints = [38, 42, 58, 52, 79, 88, 74, 82, 95, 68, 74, 86, 92, 78, 85];

  const countries = [
    { country: 'United States', flag: '🇺🇸', count: '2,845', pct: '23%', barPct: 92, color: 'bg-rose-500' },
    { country: 'China', flag: '🇨🇳', count: '1,982', pct: '16%', barPct: 68, color: 'bg-amber-500' },
    { country: 'Russia', flag: '🇷🇺', count: '1,245', pct: '10%', barPct: 48, color: 'bg-yellow-500' },
    { country: 'Germany', flag: '🇩🇪', count: '982', pct: '8%', barPct: 36, color: 'bg-cyan-500' },
    { country: 'Brazil', flag: '🇧🇷', count: '761', pct: '6%', barPct: 26, color: 'bg-emerald-500' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch font-sans text-xs">
      {/* 1. Real-time Attack Timeline */}
      <div className="lg:col-span-5 bg-[#070b1c] border border-[#162244] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141e3d] pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                <span>Real-Time Attack Timeline</span>
                <span className="flex items-center gap-1 text-[9.5px] px-1.5 py-0.2 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                  Live Ingress
                </span>
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Streaming incident sequence & edge actions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTimelineLive(!isTimelineLive)}
              className="p-1 rounded bg-[#0d1430] border border-[#1a2854] text-slate-400 hover:text-white transition-colors"
              title={isTimelineLive ? "Pause Feed" : "Resume Feed"}
            >
              {isTimelineLive ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-slate-400" />}
            </button>
            <button
              onClick={() => setActiveTab('alerts')}
              className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors"
            >
              <span>Alert Center</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Streaming Event Items */}
        <div className="space-y-2 overflow-y-auto max-h-[190px] pr-1">
          {timelineEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => {
                setInvestigatedIp(ev.ip);
                setActiveTab('analysis');
              }}
              className="p-2 rounded-xl bg-[#0a1028] hover:bg-[#111a42] border border-[#16234b] hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-base select-none">{ev.flag}</span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="font-bold text-white text-[11px] truncate">{ev.ip}</span>
                    <span className="text-[9.5px] text-slate-500">• {ev.time}</span>
                  </div>
                  <div className="text-[10.5px] text-slate-300 truncate">
                    <span className="text-cyan-300 font-medium">{ev.type}</span> • <span className="text-slate-400">{ev.target}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${
                  ev.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                  ev.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                  ev.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                  'bg-sky-500/20 text-sky-300 border-sky-500/40'
                }`}>
                  {ev.severity}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Network Activity & Bandwidth Telemetry */}
      <div className="lg:col-span-4 bg-[#070b1c] border border-[#162244] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141e3d] pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">Network Bandwidth & Traffic</h3>
              <p className="text-[10px] text-slate-400 font-mono">Peak Ingress 4.82 Gbps • 1,248 pkts/s</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('traffic')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Live Sparkline Area Chart */}
        <div className="space-y-3">
          <div className="relative h-24 w-full bg-[#0a1028] rounded-xl border border-[#16234b] p-2 flex flex-col justify-end overflow-hidden">
            <svg viewBox="0 0 300 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="telemetryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <line x1="0" y1="20" x2="300" y2="20" stroke="#16234b" strokeDasharray="3,3" strokeWidth="0.8" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#16234b" strokeDasharray="3,3" strokeWidth="0.8" />
              <polygon
                points={`0,80 ${telemetryPoints.map((p, i) => `${(i / (telemetryPoints.length - 1)) * 300},${80 - (p / 100) * 65}`).join(' ')} 300,80`}
                fill="url(#telemetryGrad)"
              />
              <polyline
                points={telemetryPoints.map((p, i) => `${(i / (telemetryPoints.length - 1)) * 300},${80 - (p / 100) * 65}`).join(' ')}
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle cx="300" cy={80 - (telemetryPoints[telemetryPoints.length - 1] / 100) * 65} r="3.5" fill="#38bdf8" className="animate-pulse" />
            </svg>
            <div className="absolute top-2 left-2 flex items-center gap-3 text-[10px] font-mono">
              <span className="text-cyan-300 font-bold">In: 3.42 Gbps</span>
              <span className="text-slate-400">Out: 1.40 Gbps</span>
              <span className="text-rose-400 font-bold">Spike: +18%</span>
            </div>
          </div>

          {/* Protocol Distribution Strip */}
          <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[10px]">
            <div className="p-1.5 rounded-lg bg-[#0a1028] border border-[#16234b]">
              <span className="text-slate-400 block text-[9px]">HTTPS</span>
              <span className="text-cyan-300 font-bold">78.4%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#0a1028] border border-[#16234b]">
              <span className="text-slate-400 block text-[9px]">TCP/SYN</span>
              <span className="text-amber-400 font-bold">12.1%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#0a1028] border border-[#16234b]">
              <span className="text-slate-400 block text-[9px]">DNS UDP</span>
              <span className="text-emerald-400 font-bold">6.8%</span>
            </div>
            <div className="p-1.5 rounded-lg bg-[#0a1028] border border-[#16234b]">
              <span className="text-slate-400 block text-[9px]">SSH</span>
              <span className="text-purple-300 font-bold">2.7%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Top Attack Origin Countries */}
      <div className="lg:col-span-3 bg-[#070b1c] border border-[#162244] rounded-2xl p-4 flex flex-col justify-between shadow-xl">
        <div className="flex items-center justify-between border-b border-[#141e3d] pb-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-white tracking-wide">Top Origin Countries</h3>
              <p className="text-[10px] text-slate-400 font-mono">BGP Geographic Distribution</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('dashboard')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-0.5 transition-colors"
          >
            <span>Dashboard</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>

        {/* Countries Progress List */}
        <div className="space-y-2">
          {countries.map((c) => (
            <div key={c.country} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm select-none">{c.flag}</span>
                  <span className="text-slate-300 font-medium">{c.country}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10.5px]">
                  <span className="text-white font-bold">{c.count}</span>
                  <span className="text-slate-500">({c.pct})</span>
                </div>
              </div>
              <div className="h-1.5 w-full bg-[#0a1028] rounded-full overflow-hidden border border-[#16234b]">
                <div 
                  className={`h-full rounded-full ${c.color}`}
                  style={{ width: `${c.barPct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
