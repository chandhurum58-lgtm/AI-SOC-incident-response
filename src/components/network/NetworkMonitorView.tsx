import React, { useState } from 'react';
import { 
  Network, 
  ShieldCheck, 
  Server, 
  Database, 
  Laptop, 
  Globe, 
  Activity 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

interface TopologyNode {
  id: string;
  name: string;
  type: 'INTERNET' | 'FIREWALL' | 'WEB_SERVER' | 'APP_SERVER' | 'DATABASE' | 'USER_DEVICES';
  ip: string;
  status: 'NORMAL' | 'UNDER_ATTACK' | 'MONITORED' | 'ISOLATED';
  activeSockets: number;
  cpuLoadPercent: number;
  bandwidthMbps: number;
  recentEvent: string;
}

export const NetworkMonitorView: React.FC = () => {
  const { setActiveTab } = useSoc();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-web');

  const nodes: TopologyNode[] = [
    {
      id: 'node-wan',
      name: 'Internet / WAN Ingress',
      type: 'INTERNET',
      ip: '0.0.0.0/0 (Global BGP)',
      status: 'UNDER_ATTACK',
      activeSockets: 14200,
      cpuLoadPercent: 12,
      bandwidthMbps: 842.6,
      recentEvent: 'Incoming L7 HTTP POST flood cluster detected from AS208323'
    },
    {
      id: 'node-firewall',
      name: 'Perimeter Next-Gen Firewall / WAF',
      type: 'FIREWALL',
      ip: '198.51.100.1 (DMZ VIP)',
      status: 'MONITORED',
      activeSockets: 8900,
      cpuLoadPercent: 68,
      bandwidthMbps: 790.2,
      recentEvent: 'Rate-limiting active; dropping 3,420 rogue requests/sec'
    },
    {
      id: 'node-web',
      name: 'Web Server Gateway [api.enterprise.com]',
      type: 'WEB_SERVER',
      ip: '10.0.2.80 (VLAN-10)',
      status: 'UNDER_ATTACK',
      activeSockets: 4890,
      cpuLoadPercent: 88,
      bandwidthMbps: 540.8,
      recentEvent: 'HTTP POST flood targeting /v2/checkout endpoint'
    },
    {
      id: 'node-app',
      name: 'Application Cluster [Auth & Billing]',
      type: 'APP_SERVER',
      ip: '10.0.4.12 (VLAN-20)',
      status: 'MONITORED',
      activeSockets: 1280,
      cpuLoadPercent: 44,
      bandwidthMbps: 180.4,
      recentEvent: 'Suspicious authentication activity for user alex.vance'
    },
    {
      id: 'node-db',
      name: 'Database Cluster [Customer Records]',
      type: 'DATABASE',
      ip: '10.0.8.10 (VLAN-200)',
      status: 'NORMAL',
      activeSockets: 210,
      cpuLoadPercent: 28,
      bandwidthMbps: 42.1,
      recentEvent: 'Normal transactional load; zero unauthorized queries'
    },
    {
      id: 'node-devices',
      name: 'User Devices [Corp Workstations]',
      type: 'USER_DEVICES',
      ip: '10.0.12.0/24 (VLAN-30)',
      status: 'UNDER_ATTACK',
      activeSockets: 340,
      cpuLoadPercent: 35,
      bandwidthMbps: 88.5,
      recentEvent: 'Workstation-Fin-08 scanning port 445; host quarantined'
    }
  ];

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Live Network Topology & Traffic Flow Monitor
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time packet trajectory animation across edge gateways, application tiers, and internal subnets.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            Active Threat Ingress Highlighted
          </span>
        </div>
      </div>

      {/* Interactive Topology Canvas / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-semibold text-slate-200">
              Perimeter-to-Core Network Pipeline
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Click node to inspect telemetry
            </span>
          </div>

          <div className="space-y-4 py-2">
            {nodes.map((node, index) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-3.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-sky-400 bg-slate-850 shadow-md ring-1 ring-sky-500/40'
                        : node.status === 'UNDER_ATTACK'
                        ? 'border-rose-800/80 bg-rose-950/20 hover:border-rose-600'
                        : node.status === 'MONITORED'
                        ? 'border-amber-800/80 bg-amber-950/10 hover:border-amber-600'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className={`w-10 h-10 rounded border flex items-center justify-center ${
                        node.status === 'UNDER_ATTACK'
                          ? 'bg-rose-950 border-rose-700 text-rose-400 animate-pulse'
                          : node.status === 'MONITORED'
                          ? 'bg-amber-950 border-amber-700 text-amber-300'
                          : 'bg-slate-900 border-slate-700 text-emerald-400'
                      }`}>
                        {node.type === 'INTERNET' && <Globe className="w-5 h-5" />}
                        {node.type === 'FIREWALL' && <ShieldCheck className="w-5 h-5" />}
                        {node.type === 'WEB_SERVER' && <Server className="w-5 h-5" />}
                        {node.type === 'APP_SERVER' && <Activity className="w-5 h-5" />}
                        {node.type === 'DATABASE' && <Database className="w-5 h-5" />}
                        {node.type === 'USER_DEVICES' && <Laptop className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-100">{node.name}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            node.status === 'UNDER_ATTACK'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : node.status === 'MONITORED'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          }`}>
                            {node.status}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          {node.ip} • {node.recentEvent}
                        </span>
                      </div>
                    </div>

                    <div className="text-right font-mono text-xs shrink-0">
                      <span className="text-slate-200 font-bold block tabular-nums">
                        {node.bandwidthMbps} MB/s
                      </span>
                      <span className="text-slate-400 text-[10px] block tabular-nums">
                        {node.activeSockets.toLocaleString()} sockets
                      </span>
                    </div>
                  </div>

                  {index < nodes.length - 1 && (
                    <div className="flex items-center justify-center my-1.5 gap-2 text-[10px] font-mono">
                      <div className={`h-4 w-0.5 ${
                        node.status === 'UNDER_ATTACK' ? 'bg-rose-500 animate-pulse' : 'bg-slate-700'
                      }`} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Node Telemetry Inspector
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
                {activeNode.name}
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Network Segment / IP</span>
                <span className="text-sky-400 font-bold block">{activeNode.ip}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">Active Sockets</span>
                  <span className="text-base font-bold text-slate-200 tabular-nums">
                    {activeNode.activeSockets.toLocaleString()}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                  <span className="text-slate-400 text-[10px] block">CPU Load</span>
                  <span className="text-base font-bold text-amber-400 tabular-nums">
                    {activeNode.cpuLoadPercent}%
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Throughput</span>
                <span className="text-emerald-400 font-bold block tabular-nums">
                  {activeNode.bandwidthMbps} MB/s
                </span>
              </div>

              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Recent Telemetry Event</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {activeNode.recentEvent}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => setActiveTab('traffic')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            >
              Inspect Ingress Logs →
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded transition-colors"
            >
              Simulate Isolation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
