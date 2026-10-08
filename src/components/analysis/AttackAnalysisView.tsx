import React from 'react';
import { 
  Microscope, 
  Sparkles, 
  AlertTriangle, 
  Server, 
  User, 
  Laptop, 
  Globe, 
  Network, 
  Layers, 
  ShieldAlert, 
  GitFork, 
  Play, 
  CheckCircle2 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from '../common/SeverityBadge';
import { StatusBadge } from '../common/StatusBadge';

export const AttackAnalysisView: React.FC = () => {
  const { 
    selectedIncident, 
    incidents, 
    setSelectedIncident, 
    setActiveTab,
    updateIncidentStatus 
  } = useSoc();

  const incident = selectedIncident || incidents[0];
  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-400 font-mono text-xs">
        No active incident selected for analysis.
      </div>
    );
  }

  const analysis = incident.aiAnalysis;

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Microscope className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              AI Incident Deep Forensic Analysis
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated correlation, behavioral telemetry reasoning, and MITRE ATT&CK framework mapping.
          </p>
        </div>
        {/* Incident Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Incident:</span>
          <select
            value={incident.id}
            onChange={(e) => {
              const found = incidents.find(i => i.id === e.target.value);
              if (found) setSelectedIncident(found);
            }}
            className="bg-slate-900 border border-slate-800 text-sky-400 font-mono text-xs rounded px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} - {inc.severity} ({inc.attackType})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Incident Summary Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-sky-400">{incident.id}</span>
              <SeverityBadge severity={incident.severity} />
              <StatusBadge status={incident.status} />
              <span className="text-slate-400 text-xs font-mono">
                Assigned: {incident.assignedAnalyst}
              </span>
            </div>
            <h2 className="text-sm font-semibold text-slate-100">{incident.title}</h2>
          </div>
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Created:</span>
            <span className="text-slate-200">{incident.createdAt}</span>
          </div>
        </div>

        {/* 6 Core Analytical Questions from Prompt */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {/* Question 1: What happened? */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>What happened?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {analysis.whatHappened}
            </p>
          </div>

          {/* Question 2: Why is it suspicious? */}
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Why is it suspicious?</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">
              {analysis.whySuspicious}
            </p>
          </div>
        </div>

        {/* Question 3: What is affected? */}
        <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">What is affected?</span>
            <span className="text-[11px] font-mono text-slate-400">Scope of Impact: 4 Entities</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                <span>Server</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                Auth-Cluster-Alpha
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">MONITORED</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-rose-900/40 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <User className="w-3.5 h-3.5 text-rose-400" />
                <span>User</span>
              </div>
              <div className="font-mono text-rose-300 font-semibold truncate text-[11px]">
                alex.vance
              </div>
              <span className="text-[10px] text-rose-400 font-mono block">COMPROMISED</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Laptop className="w-3.5 h-3.5 text-sky-400" />
                <span>Device</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                MacBook-Pro-104
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">AT_RISK</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>Website</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                auth.portal.org
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">MONITORED</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Network className="w-3.5 h-3.5 text-indigo-400" />
                <span>Network</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                VLAN-10-DMZ
              </div>
              <span className="text-[10px] text-emerald-400 font-mono block">SECURED</span>
            </div>

            <div className="p-2 rounded bg-slate-900 border border-slate-800 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-yellow-400" />
                <span>Application</span>
              </div>
              <div className="font-mono text-slate-200 font-semibold truncate text-[11px]">
                OAuth2 SSO
              </div>
              <span className="text-[10px] text-amber-400 font-mono block">MONITORED</span>
            </div>
          </div>
        </div>

        {/* Attack Classification & AI Confidence */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-slate-200 block">
              Attack Classification (MITRE ATT&CK Mapping)
            </span>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Tactic:</span>
                <span className="text-amber-400">{analysis.attackClassification.tactic}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Technique:</span>
                <span className="text-slate-200 font-semibold">
                  {analysis.attackClassification.technique} ({analysis.attackClassification.techniqueId})
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="text-slate-300">{analysis.attackClassification.category}</span>
              </div>
              {analysis.attackClassification.subTechnique && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Sub-technique:</span>
                  <span className="text-slate-300">{analysis.attackClassification.subTechnique}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-200">AI Confidence Breakdown</span>
              <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                {analysis.confidence.overallPercentage}% Overall Confidence
              </span>
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              {analysis.confidence.factors.map((f) => (
                <div key={f.factor} className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">{f.factor}</span>
                  <span className="text-slate-200 tabular-nums">{f.score}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200">Comprehensive Risk Assessment</span>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-slate-400">Current Risk:</span>
              <span className="text-rose-400 font-bold tabular-nums">
                {analysis.riskAssessment.currentRisk}/100
              </span>
              <span className="text-slate-700">•</span>
              <span className="text-slate-400">Impact:</span>
              <span className="text-rose-400 font-bold">
                {analysis.riskAssessment.potentialImpact}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono text-[11px] block">Possible Next Attack Stage:</span>
              <p className="text-amber-300 font-sans">
                {analysis.riskAssessment.possibleNextAttackStage}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono text-[11px] block">Assets at Immediate Risk:</span>
              <p className="text-slate-300 font-mono text-[11px]">
                {analysis.riskAssessment.assetsAtRisk.join(', ')}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('attackpath')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <GitFork className="w-3.5 h-3.5 text-purple-400" />
              <span>Inspect Attack Path</span>
            </button>
            <button
              onClick={() => setActiveTab('simulation')}
              className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulate Defense Response</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateIncidentStatus(incident.id, 'CONTAINED')}
              className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Contain Incident</span>
            </button>
            <button
              onClick={() => updateIncidentStatus(incident.id, 'RESOLVED')}
              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
