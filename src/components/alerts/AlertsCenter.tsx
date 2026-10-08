import React, { useState } from 'react';
import { 
  BellRing, 
  Search, 
  ShieldAlert, 
  GitFork, 
  Bot, 
  Play, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { Alert } from '../../types/soc';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const AlertsCenter: React.FC = () => {
  const { 
    alerts, 
    incidents, 
    setActiveTab, 
    setSelectedIncident, 
    setSelectedAlert,
    setInvestigatedIp,
    updateIncidentStatus
  } = useSoc();

  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(alerts[0]?.id || null);

  const filteredAlerts = alerts.filter(alert => {
    if (severityFilter !== 'ALL' && alert.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && alert.currentStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        alert.id.toLowerCase().includes(q) ||
        alert.attackType.toLowerCase().includes(q) ||
        alert.sourceIp.toLowerCase().includes(q) ||
        alert.destinationServer.toLowerCase().includes(q) ||
        alert.username.toLowerCase().includes(q) ||
        alert.detectionReason.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const handleInvestigate = (alert: Alert) => {
    setSelectedAlert(alert);
    if (alert.incidentId) {
      const inc = incidents.find(i => i.id === alert.incidentId);
      if (inc) setSelectedIncident(inc);
    }
    setActiveTab('analysis');
  };

  const handleViewAttackPath = (alert: Alert) => {
    setSelectedAlert(alert);
    setActiveTab('attackpath');
  };

  const handleSimulate = (alert: Alert) => {
    setSelectedAlert(alert);
    setActiveTab('simulation');
  };

  const handleContain = (alert: Alert) => {
    if (alert.incidentId) {
      updateIncidentStatus(alert.incidentId, 'CONTAINED');
    }
    alert.currentStatus = 'CONTAINED';
  };

  const handleMarkResolved = (alert: Alert) => {
    if (alert.incidentId) {
      updateIncidentStatus(alert.incidentId, 'RESOLVED');
    }
    alert.currentStatus = 'RESOLVED';
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-rose-400" />
            <h1 className="text-base font-semibold text-slate-100">Real-Time Threat & Incident Alerts</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time heuristic & behavioral detections across network ingress, identity providers, and endpoints.
          </p>
        </div>
        {/* Quick Severity Counts */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-rose-400">Critical: {alerts.filter(a => a.severity === 'CRITICAL').length}</span>
          <span className="text-slate-700">•</span>
          <span className="text-amber-400">High: {alerts.filter(a => a.severity === 'HIGH').length}</span>
          <span className="text-slate-700">•</span>
          <span className="text-yellow-400">Medium: {alerts.filter(a => a.severity === 'MEDIUM').length}</span>
          <span className="text-slate-700">•</span>
          <span className="text-sky-400">Low: {alerts.filter(a => a.severity === 'LOW').length}</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-800 p-2.5 rounded">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by IP, server, user, reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-sky-500 w-64 font-mono"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`px-2 py-1 rounded transition-colors ${
                  severityFilter === sev 
                    ? 'bg-slate-800 text-slate-100 font-medium' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 text-xs">
            {['ALL', 'NEW', 'INVESTIGATING', 'CONFIRMED', 'CONTAINED', 'RESOLVED'].map((stat) => (
              <button
                key={stat}
                onClick={() => setStatusFilter(stat)}
                className={`px-2 py-1 rounded transition-colors ${
                  statusFilter === stat 
                    ? 'bg-slate-800 text-slate-100 font-medium' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {stat}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredAlerts.length} of {alerts.length} alerts
        </span>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isExpanded = expandedAlertId === alert.id;
          return (
            <div 
              key={alert.id}
              className={`border rounded transition-all bg-slate-900/90 ${
                alert.severity === 'CRITICAL' 
                  ? 'border-rose-900/60 shadow-sm' 
                  : alert.severity === 'HIGH'
                  ? 'border-amber-900/50'
                  : 'border-slate-800'
              }`}
            >
              {/* Alert Header Row */}
              <div 
                onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                className="p-3 cursor-pointer hover:bg-slate-850 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold text-sky-400">{alert.id}</span>
                  <SeverityBadge severity={alert.severity} />
                  <span className="text-xs font-semibold text-slate-100">{alert.attackType}</span>
                  {alert.mitreId && (
                    <span className="text-[11px] font-mono text-slate-400">
                      MITRE {alert.mitreId} ({alert.mitreTactic})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-emerald-400 font-bold">{alert.confidenceScore}%</span>
                  </div>
                  <span className="text-slate-700">•</span>
                  <StatusBadge status={alert.currentStatus} />
                  <span className="text-slate-700">•</span>
                  <span className="text-slate-400">{alert.timestamp}</span>
                </div>
              </div>

              {/* Alert Body Details */}
              <div className="p-3 space-y-3 text-xs">
                {/* Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Source IP</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setInvestigatedIp(alert.sourceIp);
                        setActiveTab('threatintel');
                      }}
                      className="text-sky-400 hover:underline font-bold truncate block"
                    >
                      {alert.sourceIp}
                    </button>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Destination IP / Port</span>
                    <span className="text-slate-200 truncate block">{alert.destinationIp}:{alert.port}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Source Device</span>
                    <span className="text-slate-200 truncate block">{alert.sourceDevice}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target Server</span>
                    <span className="text-slate-200 truncate block">{alert.destinationServer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Target User</span>
                    <span className="text-slate-200 truncate block">{alert.username}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Protocol</span>
                    <span className="text-slate-200 truncate block">{alert.protocol} (Port {alert.port})</span>
                  </div>
                </div>

                {/* Detection Reason & Recommended Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block font-semibold mb-1">
                      Detection Reason / Forensic Indicators
                    </span>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {alert.detectionReason}
                    </p>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
                    <span className="text-slate-400 text-[11px] block font-semibold mb-1">
                      AI Recommended Action
                    </span>
                    <p className="text-emerald-300 leading-relaxed font-sans">
                      {alert.recommendedAction}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Affected Asset: <span className="text-slate-200">{alert.affectedAsset}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      onClick={() => handleInvestigate(alert)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-sky-400" />
                      <span>Investigate</span>
                    </button>
                    <button
                      onClick={() => handleViewAttackPath(alert)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <GitFork className="w-3.5 h-3.5 text-purple-400" />
                      <span>View Attack Path</span>
                    </button>
                    <button
                      onClick={() => handleInvestigate(alert)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <Bot className="w-3.5 h-3.5 text-emerald-400" />
                      <span>AI Analysis</span>
                    </button>
                    <button
                      onClick={() => handleSimulate(alert)}
                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Simulate Response</span>
                    </button>
                    <button
                      onClick={() => handleContain(alert)}
                      className="px-2.5 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Contain</span>
                    </button>
                    <button
                      onClick={() => handleMarkResolved(alert)}
                      className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded font-medium transition-colors flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
