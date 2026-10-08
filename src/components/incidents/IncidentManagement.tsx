import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Send, 
  Bot, 
  Play, 
  CheckCircle2 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { IncidentStatus } from '../../types/soc';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const IncidentManagement: React.FC = () => {
  const { 
    incidents, 
    selectedIncident, 
    setSelectedIncident, 
    updateIncidentStatus, 
    addIncidentNote,
    setActiveTab 
  } = useSoc();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [newNoteText, setNewNoteText] = useState<string>('');

  const currentInc = selectedIncident || incidents[0];
  const filteredIncidents = incidents.filter(i => 
    statusFilter === 'ALL' || i.status === statusFilter
  );

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    addIncidentNote(currentInc.id, newNoteText.trim());
    setNewNoteText('');
  };

  const timelineEvents = [
    { time: '22:42:01', label: 'Suspicious request detected', severity: 'MEDIUM', detail: 'External SYN packet from 198.51.100.23 targeting port 443' },
    { time: '22:42:45', label: 'Multiple failed requests detected', severity: 'HIGH', detail: '42 consecutive failed authentications on /oauth/token' },
    { time: '22:44:50', label: 'Authentication anomaly detected', severity: 'CRITICAL', detail: 'Successful login recorded for alex.vance from unknown Linux device' },
    { time: '22:45:10', label: 'Risk score increased', severity: 'HIGH', detail: 'UEBA risk score updated to 88/100' },
    { time: '22:45:12', label: 'AI generated incident INC-8402', severity: 'HIGH', detail: 'Automated correlation created incident dossier' },
    { time: '22:52:10', label: 'SOC analyst reviewed alert', severity: 'INFO', detail: 'Marcus Brody confirmed user was in Seattle, WA' },
    { time: '22:58:30', label: 'Response simulation executed', severity: 'INFO', detail: 'Sandbox confirmed 86% risk reduction upon session revocation' },
    { time: '23:01:00', label: 'Response approved by Lead', severity: 'INFO', detail: 'Session tokens revoked & edge IP blocked' },
    { time: '23:02:15', label: 'Traffic returned to normal', severity: 'INFO', detail: 'Ingress error rates dropped to 0.1%' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Enterprise Incident Response Management & Forensic Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full life cycle tracking across New, Investigating, Confirmed, Contained, Resolved, and False Positive states.
          </p>
        </div>
        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded border border-slate-800 text-xs">
          {['ALL', 'NEW', 'INVESTIGATING', 'CONFIRMED', 'CONTAINED', 'RESOLVED', 'FALSE_POSITIVE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2 py-0.5 rounded transition-colors ${
                statusFilter === st ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Incident List + Active Incident Detail & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 5 Cols: Incident Roster */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-200">
              Incident Queue ({filteredIncidents.length})
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Sort: Highest Severity</span>
          </div>

          <div className="space-y-2">
            {filteredIncidents.map((inc) => {
              const isSelected = currentInc.id === inc.id;
              return (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-3 rounded border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-sky-400 bg-slate-850 shadow-md ring-1 ring-sky-500/40' 
                      : 'border-slate-800 bg-slate-950/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-sky-400">{inc.id}</span>
                      <SeverityBadge severity={inc.severity} size="sm" />
                    </div>
                    <StatusBadge status={inc.status} />
                  </div>
                  <h4 className="text-xs font-semibold text-slate-100 mt-1.5 line-clamp-1">
                    {inc.title}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2">
                    <span className="truncate max-w-[200px]">{inc.targetAsset}</span>
                    <span>{inc.assignedAnalyst.split(' ')[0]}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 7 Cols: Incident Detail & Chronological Timeline */}
        <div className="lg:col-span-7 space-y-4">
          {/* Incident Detail Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-sm font-bold text-sky-400">{currentInc.id}</span>
                  <SeverityBadge severity={currentInc.severity} />
                  <StatusBadge status={currentInc.status} />
                </div>
                <h2 className="text-sm font-semibold text-slate-100 mt-1">{currentInc.title}</h2>
              </div>
              {/* Status Transition Control Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-slate-400">Change Status:</span>
                <select
                  value={currentInc.status}
                  onChange={(e) => updateIncidentStatus(currentInc.id, e.target.value as IncidentStatus)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono rounded px-2.5 py-1 focus:outline-none focus:border-sky-500"
                >
                  <option value="NEW">NEW</option>
                  <option value="INVESTIGATING">INVESTIGATING</option>
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="CONTAINED">CONTAINED</option>
                  <option value="RESOLVED">RESOLVED</option>
                  <option value="FALSE_POSITIVE">FALSE_POSITIVE</option>
                </select>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded border border-slate-800/80">
              <div>
                <span className="text-slate-400 text-[10px] block">Assigned Analyst</span>
                <span className="text-slate-200 truncate block">{currentInc.assignedAnalyst}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Created At</span>
                <span className="text-slate-200 truncate block">{currentInc.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Attack Vector</span>
                <span className="text-amber-300 truncate block">{currentInc.attackType}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">AI Confidence</span>
                <span className="text-emerald-400 font-bold block">{currentInc.aiConfidence}%</span>
              </div>
            </div>

            {/* Evidence Artifacts */}
            {currentInc.evidence.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-slate-200 block">
                  Observed Forensic Evidence Artifacts
                </span>
                <div className="space-y-1">
                  {currentInc.evidence.map((ev) => (
                    <div key={ev.id} className="p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-0.5">
                      <div className="flex items-center justify-between text-slate-400">
                        <span>{ev.source}</span>
                        <span>{ev.timestamp}</span>
                      </div>
                      <code className="text-emerald-400 text-[10px] block truncate">
                        {ev.raw}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('analysis')}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Bot className="w-3.5 h-3.5 text-sky-400" />
                  <span>AI Incident Analysis</span>
                </button>
                <button
                  onClick={() => setActiveTab('simulation')}
                  className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Simulate Containment</span>
                </button>
              </div>

              <button
                onClick={() => updateIncidentStatus(currentInc.id, 'RESOLVED')}
                className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Resolve Incident</span>
              </button>
            </div>
          </div>

          {/* Chronological Forensic Timeline */}
          <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-semibold text-slate-200">
                  Chronological Incident Investigation Timeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">Microsecond Correlation</span>
            </div>

            <div className="relative pl-6 space-y-3 border-l border-slate-800 ml-3 py-1">
              {timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                    evt.severity === 'CRITICAL' ? 'bg-rose-500' :
                    evt.severity === 'HIGH' ? 'bg-amber-400' :
                    evt.severity === 'MEDIUM' ? 'bg-yellow-400' :
                    'bg-sky-400'
                  }`} />
                  <div className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <span className="text-sky-400 font-bold">{evt.time}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-200 font-semibold">{evt.label}</span>
                    </div>
                    <p className="text-slate-400 text-[11px] font-sans">
                      {evt.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analyst Case Notes */}
          <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
            <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
              Analyst Case Notes & Collaboration
            </h3>
            {currentInc.notes.length > 0 && (
              <div className="space-y-2">
                {currentInc.notes.map((note) => (
                  <div key={note.id} className="p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span className="text-sky-400 font-bold">{note.author}</span>
                      <span>{note.timestamp}</span>
                    </div>
                    <p className="text-slate-200 font-sans">{note.text}</p>
                  </div>
                ))}
              </div>
            )}
            <form onSubmit={handleAddNote} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Add verified forensic note..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 font-sans focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
