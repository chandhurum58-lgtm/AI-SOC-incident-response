import React, { useState } from 'react';
import { 
  X, 
  Search, 
  ShieldAlert, 
  User, 
  Laptop, 
  Server, 
  Globe, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const GlobalSearchModal: React.FC = () => {
  const { 
    isSearchModalOpen, 
    setIsSearchModalOpen,
    alerts,
    incidents,
    riskyUsers,
    devices,
    setInvestigatedIp,
    setSelectedIncident,
    setActiveTab 
  } = useSoc();

  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedAlerts = q ? alerts.filter(a => 
    a.id.toLowerCase().includes(q) || 
    a.sourceIp.toLowerCase().includes(q) || 
    a.username.toLowerCase().includes(q) ||
    a.destinationServer.toLowerCase().includes(q)
  ) : [];

  const matchedIncidents = q ? incidents.filter(i => 
    i.id.toLowerCase().includes(q) || 
    i.title.toLowerCase().includes(q) || 
    i.sourceIp.toLowerCase().includes(q) ||
    i.targetAsset.toLowerCase().includes(q)
  ) : [];

  const matchedUsers = q ? riskyUsers.filter(u => 
    u.username.toLowerCase().includes(q) || 
    u.displayName.toLowerCase().includes(q)
  ) : [];

  const matchedDevices = q ? devices.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.ip.toLowerCase().includes(q) || 
    d.mac.toLowerCase().includes(q)
  ) : [];

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20 px-4">
      <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-3 border-b border-slate-800 flex items-center gap-2.5">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            autoFocus
            type="text"
            placeholder="Search IP (198.51.100.23), user (alex.vance), device, server, INC ID..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-500 text-xs font-mono focus:outline-none"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-3 max-h-[420px] overflow-y-auto space-y-3 text-xs">
          {!q ? (
            <div className="py-8 text-center text-slate-500 font-mono text-xs">
              Type an IP address, username, device name, or incident ID to perform a unified SOC investigation.
            </div>
          ) : (
            <>
              {/* Incidents Matches */}
              {matchedIncidents.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Incidents ({matchedIncidents.length})
                  </span>
                  {matchedIncidents.map(inc => (
                    <div
                      key={inc.id}
                      onClick={() => {
                        setSelectedIncident(inc);
                        setIsSearchModalOpen(false);
                        setActiveTab('analysis');
                      }}
                      className="p-2 rounded bg-slate-950/70 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-400 font-bold">{inc.id}</span>
                        <span className="text-slate-200">{inc.title}</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">{inc.severity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alerts Matches */}
              {matchedAlerts.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Alerts ({matchedAlerts.length})
                  </span>
                  {matchedAlerts.map(alt => (
                    <div
                      key={alt.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setActiveTab('alerts');
                      }}
                      className="p-2 rounded bg-slate-950/70 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-amber-400 font-bold">{alt.id}</span>
                        <span className="text-slate-200">{alt.attackType}</span>
                        <span className="text-slate-500 text-[11px] font-mono">({alt.sourceIp})</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">{alt.severity}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Matches */}
              {matchedUsers.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Identities ({matchedUsers.length})
                  </span>
                  {matchedUsers.map(usr => (
                    <div
                      key={usr.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setActiveTab('users');
                      }}
                      className="p-2 rounded bg-slate-950/70 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-yellow-400" />
                        <span className="text-slate-200 font-bold">{usr.displayName}</span>
                        <span className="text-slate-400 text-[11px] font-mono">({usr.username})</span>
                      </div>
                      <span className="text-rose-400 font-mono text-[11px]">Risk: {usr.riskScore}/100</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Devices Matches */}
              {matchedDevices.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Endpoints ({matchedDevices.length})
                  </span>
                  {matchedDevices.map(dev => (
                    <div
                      key={dev.id}
                      onClick={() => {
                        setIsSearchModalOpen(false);
                        setActiveTab('devices');
                      }}
                      className="p-2 rounded bg-slate-950/70 hover:bg-slate-800 cursor-pointer flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Laptop className="w-3.5 h-3.5 text-sky-400" />
                        <span className="text-slate-200">{dev.name}</span>
                        <span className="text-slate-400 text-[11px] font-mono">({dev.ip})</span>
                      </div>
                      <span className="text-slate-400 text-[11px] font-mono">{dev.connectionStatus}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Direct IP Threat Intel Jump */}
              {q.includes('.') && (
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setInvestigatedIp(query.trim());
                      setIsSearchModalOpen(false);
                      setActiveTab('threatintel');
                    }}
                    className="w-full text-left p-2 rounded bg-slate-800/80 hover:bg-slate-800 text-sky-300 flex items-center justify-between text-xs font-mono"
                  >
                    <span>Inspect Threat Intelligence for IP "{query.trim()}"</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
