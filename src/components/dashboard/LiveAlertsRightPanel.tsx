import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  Pause, 
  Play, 
  ShieldAlert, 
  AlertTriangle, 
  Lock, 
  ExternalLink, 
  Filter, 
  CheckCircle2, 
  ChevronRight,
  MapPin,
  Server,
  Zap,
  Activity,
  UserX
} from 'lucide-react';
import { 
  LiveAlertEvent, 
  INITIAL_LIVE_ALERT_EVENTS 
} from '../../data/liveSecurityEntities';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from '../common/SeverityBadge';

export interface LiveAlertsRightPanelProps {
  onSelectAlert?: (alert: LiveAlertEvent) => void;
}

export const LiveAlertsRightPanel: React.FC<LiveAlertsRightPanelProps> = ({
  onSelectAlert
}) => {
  const { setActiveTab, setInvestigatedIp, triggerAttackScenario } = useSoc();
  const [alerts, setAlerts] = useState<LiveAlertEvent[]>(INITIAL_LIVE_ALERT_EVENTS);
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(INITIAL_LIVE_ALERT_EVENTS[0].id);

  // Streaming simulation
  useEffect(() => {
    if (!isLiveStreaming) return;
    const interval = setInterval(() => {
      const candidates: Array<Omit<LiveAlertEvent, 'id' | 'timestamp' | 'mitigated'>> = [
        {
          type: 'Suspicious Location Detected',
          severity: 'HIGH',
          sourceName: 'Foreign Tor Relay AS4839',
          sourceIp: '185.220.101.42',
          targetAsset: 'Federal Gov Cloud Auth Cluster',
          city: 'Washington, D.C.',
          country: 'United States',
          description: 'User login attempt from anomalous IP geolocation (Munich, Germany) with disparate hardware hash.'
        },
        {
          type: 'Port Scan Detected',
          severity: 'HIGH',
          sourceName: 'Host Scan Probe [10.0.12.88]',
          sourceIp: '10.0.12.88',
          targetAsset: 'Primary Financial DB Cluster [SQL-PROD]',
          city: 'New York City',
          country: 'United States',
          description: 'TCP SYN port scanning sweep across database subnet ports 445, 139, 3389, and 5432.'
        },
        {
          type: 'Multiple Failed Login Attempts',
          severity: 'CRITICAL',
          sourceName: 'Hydra Automated Brute-Force',
          sourceIp: '194.26.29.88',
          targetAsset: 'Core Payment Gateway VIP [NY-EAST-01]',
          city: 'New York City',
          country: 'United States',
          description: '120 failed OAuth credential requests detected within 30 seconds against user devops@enterprise.com.'
        },
        {
          type: 'DDoS/Network Attack Detected',
          severity: 'CRITICAL',
          sourceName: 'Botnet Cluster [Mirai-Echo]',
          sourceIp: '203.0.113.19',
          targetAsset: 'Silicon Valley Cloud Edge Gateway',
          city: 'San Francisco',
          country: 'United States',
          description: 'Surge of 24,000 req/sec HTTP GET requests flooding API ingress reverse proxy.'
        },
        {
          type: 'Malware Activity',
          severity: 'CRITICAL',
          sourceName: 'Trojan Sliver C2 Pulse',
          sourceIp: '103.77.12.99',
          targetAsset: 'London Financial Core Exchange Hub',
          city: 'London',
          country: 'United Kingdom',
          description: 'Covert process hollowed out svchost.exe communicating with unauthorized external IP.'
        },
        {
          type: 'Unusual Traffic Pattern',
          severity: 'MEDIUM',
          sourceName: 'Storage Subnet Exfil Probe',
          sourceIp: '10.0.14.200',
          targetAsset: 'Backup S3 Ingress Gateway',
          city: 'New York City',
          country: 'United States',
          description: 'Anomalous outbound bandwidth spike (480 MB/s) occurring outside standard replication schedules.'
        }
      ];

      const chosen = candidates[Math.floor(Math.random() * candidates.length)];
      const uniqueId = `EVT-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
      const newAlert: LiveAlertEvent = {
        ...chosen,
        id: uniqueId,
        timestamp: 'Just now',
        mitigated: false
      };

      setAlerts(prev => [newAlert, ...prev.filter(a => a.id !== newAlert.id).slice(0, 14)]);
    }, 9000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleMitigate = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, mitigated: true } : a));
  };

  const handleSelect = (alert: LiveAlertEvent) => {
    setSelectedAlertId(alert.id);
    if (onSelectAlert) onSelectAlert(alert);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'ALL' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="bg-[#070c20] border border-[#162244] rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden font-sans select-none text-xs">
      {/* 1. Header with Live Ticker */}
      <div className="p-3.5 border-b border-[#141f45] bg-gradient-to-r from-[#0a112c] via-[#090f28] to-[#070c20] flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <BellRing className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide uppercase font-mono flex items-center gap-1.5">
              <span>LIVE ALERTS</span>
              <span className="flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                STREAMING
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Real-time threat ingress & anomaly feed
            </p>
          </div>
        </div>

        {/* Live pause toggle & scenario trigger */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsLiveStreaming(!isLiveStreaming)}
            className="p-1 rounded-lg bg-[#0d163d] border border-[#1b2b5a] text-slate-400 hover:text-white transition-colors"
            title={isLiveStreaming ? "Pause Feed" : "Resume Feed"}
          >
            {isLiveStreaming ? <Pause className="w-3 h-3 text-cyan-400" /> : <Play className="w-3 h-3 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="px-3 py-2 bg-[#05091a] border-b border-[#141f45] flex items-center gap-1 overflow-x-auto no-scrollbar text-[10.5px] font-mono shrink-0">
        <span className="text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-slate-400" />
        </span>
        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              filterSeverity === sev 
                ? 'bg-blue-600 text-white font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1432]'
            }`}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* 3. Alerts Stream List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#131d42] p-2 space-y-1.5">
        {filteredAlerts.map((alert, index) => {
          const isSelected = selectedAlertId === alert.id;
          const isCrit = alert.severity === 'CRITICAL';
          const isHigh = alert.severity === 'HIGH';

          return (
            <div
              key={`${alert.id}-${index}`}
              onClick={() => handleSelect(alert)}
              className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col gap-1.5 border relative group ${
                isSelected 
                  ? 'bg-[#0f173b] border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.2)] ring-1 ring-cyan-400/40' 
                  : alert.mitigated
                  ? 'bg-[#080d22]/50 border-[#121c3d] opacity-75'
                  : 'bg-[#090f26] hover:bg-[#0e163d] border-[#16234b]'
              }`}
            >
              {/* Top Row: Severity badge, Alert Type, Timestamp */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    alert.mitigated 
                      ? 'bg-emerald-400' 
                      : isCrit 
                      ? 'bg-rose-500 animate-ping' 
                      : isHigh 
                      ? 'bg-amber-400' 
                      : 'bg-yellow-400'
                  }`} />
                  <span className="font-bold text-white text-[11px] truncate">
                    {alert.type}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <SeverityBadge severity={alert.severity} size="sm" />
                  <span className="text-[9.5px] font-mono text-slate-500">{alert.timestamp}</span>
                </div>
              </div>

              {/* Source & Target Asset */}
              <div className="text-[10.5px] text-slate-300 font-mono flex items-center justify-between gap-2">
                <span className="text-cyan-300 truncate max-w-[170px]">
                  Src: {alert.sourceIp}
                </span>
                <span className="text-slate-400 truncate max-w-[130px]">
                  {alert.city}
                </span>
              </div>

              {/* Description */}
              <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                {alert.description}
              </p>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono border-t border-[#141f45]/60">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setInvestigatedIp(alert.sourceIp);
                    setActiveTab('threatintel');
                  }}
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 hover:underline"
                >
                  <span>Investigate</span>
                  <ChevronRight className="w-3 h-3" />
                </button>

                <div className="flex items-center gap-1">
                  {alert.mitigated ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mitigated</span>
                    </span>
                  ) : (
                    <button
                      onClick={(e) => handleMitigate(e, alert.id)}
                      className="px-2 py-0.5 rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[9.5px] font-bold flex items-center gap-1 transition-colors"
                      title="Apply immediate containment rule"
                    >
                      <Lock className="w-2.5 h-2.5" />
                      <span>Mitigate</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Quick Scenario Injection Button */}
      <div className="p-2.5 bg-[#05091a] border-t border-[#141f45] flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => triggerAttackScenario('DDOS_FLOOD')}
          className="w-full py-1.5 px-2 rounded-xl bg-gradient-to-r from-rose-600/20 to-amber-600/20 hover:from-rose-600/30 hover:to-amber-600/30 border border-rose-500/30 text-rose-300 font-medium text-[11px] flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Simulate Live Security Surge</span>
        </button>
      </div>
    </div>
  );
};
