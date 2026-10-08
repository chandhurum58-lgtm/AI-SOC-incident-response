import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const ReportsView: React.FC = () => {
  const { stats, incidents } = useSoc();
  const [reportType, setReportType] = useState<string>('DAILY');
  const [isCopied, setIsCopied] = useState(false);

  const reportTypes = [
    { id: 'DAILY', label: 'Daily Security Report' },
    { id: 'WEEKLY', label: 'Weekly Security Report' },
    { id: 'MONTHLY', label: 'Monthly Security Report' },
    { id: 'YEARLY', label: 'Yearly Executive Report' },
    { id: 'INCIDENT', label: 'Incident Deep Dive Report' },
    { id: 'TRAFFIC', label: 'Server Traffic Telemetry Report' },
    { id: 'USER_RISK', label: 'UEBA Risky User Report' },
    { id: 'THREAT_INTEL', label: 'Threat Intelligence Briefing' }
  ];

  const handleCopy = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Automated SOC Compliance & Executive Security Reports
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit-ready security intelligence summaries, SLA response metrics, and NIST/ISO 27001 executive briefs.
          </p>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{isCopied ? 'Report Copied!' : 'Copy Summary'}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Report Template Selector */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1.5 rounded border border-slate-800 text-xs">
        {reportTypes.map((rt) => (
          <button
            key={rt.id}
            onClick={() => setReportType(rt.id)}
            className={`px-3 py-1.5 rounded transition-colors ${
              reportType === rt.id 
                ? 'bg-slate-800 text-slate-100 font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {rt.label}
          </button>
        ))}
      </div>

      {/* Generated Report Content Container */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-6 space-y-6 font-sans text-xs">
        {/* Report Header Title */}
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              AEGIS SOC COMMAND CENTER • SECURITY INTELLIGENCE REPORT
            </div>
            <h2 className="text-lg font-bold text-slate-100 mt-1">
              {reportTypes.find(r => r.id === reportType)?.label}
            </h2>
            <div className="flex items-center gap-2 font-mono text-slate-400 text-[11px] mt-1">
              <span>Period: 2026-10-01 00:00 UTC to 2026-10-05 23:59 UTC</span>
              <span>•</span>
              <span>Classification: TLP:AMBER (RESTRICTED INTERNAL)</span>
            </div>
          </div>
          <div className="text-right font-mono text-xs">
            <span className="text-slate-400 block">Overall Posture Score</span>
            <span className="text-2xl font-bold text-emerald-400 tabular-nums">
              {stats.securityScore}/100 (GOOD)
            </span>
          </div>
        </div>

        {/* 1. Executive Summary */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-1">
            1. Executive Summary
          </h3>
          <p className="text-slate-300 leading-relaxed text-xs">
            During the monitored period, AegisSOC ingested and analyzed <strong className="text-slate-100 font-mono">{stats.totalAttacksDetected.toLocaleString()} attack vectors</strong> across the enterprise attack surface. Edge automation successfully mitigated <strong className="text-emerald-400 font-mono">{stats.blockedAttacks.toLocaleString()} attacks (97.2%)</strong> without human intervention. Four critical incidents were triaged by SOC analysts with zero data exfiltration verified. Production infrastructure maintained an uptime of <strong className="text-sky-300 font-mono">{stats.systemHealthPercent}%</strong>.
          </p>
        </div>

        {/* 2. Attack Statistics */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-1">
            2. Key Security Statistics & Posture Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block">Total Ingested Attacks</span>
              <span className="text-base font-bold text-slate-100 tabular-nums">{stats.totalAttacksDetected.toLocaleString()}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-slate-400 text-[10px] block">Critical Incidents Triaged</span>
              <span className="text-base font-bold text-rose-400 tabular-nums">{stats.criticalIncidents}</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-base font-bold text-emerald-400 tabular-nums">4.2 Minutes</span>
              <span className="text-slate-400 text-[10px] block">Mean Time to Contain (MTTC)</span>
            </div>
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-base font-bold text-slate-200 tabular-nums">{stats.resolvedIncidents}</span>
              <span className="text-slate-400 text-[10px] block">Resolved Incidents</span>
            </div>
          </div>
        </div>

        {/* 3. Top Incidents & Risk Analysis */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-1">
            3. Priority Incidents & Threat Analysis
          </h3>
          <div className="space-y-2">
            {incidents.slice(0, 3).map((inc) => (
              <div key={inc.id} className="p-3 rounded bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-400">{inc.id}</span>
                    <span className="text-slate-200 font-sans font-semibold">{inc.title}</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">{inc.severity} • {inc.status}</span>
                </div>
                <p className="text-slate-400 font-sans text-[11px]">
                  Target Asset: {inc.targetAsset} • Origin: {inc.sourceIp}
                </p>
                <div className="text-emerald-300 font-sans text-[11px] pt-0.5">
                  Action Taken: {inc.responseActions[0]?.title || 'Contained via edge WAF and session token revocation.'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Strategic Defense Recommendations */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-1">
            4. Strategic Security Recommendations
          </h3>
          <ul className="space-y-1.5 text-slate-300 text-xs font-sans list-disc pl-5">
            <li>Enforce mandatory hardware FIDO2 MFA tokens across all administrative and engineering identities.</li>
            <li>Maintain edge WAF rate limiting rules on /oauth/token to proactively suppress password spray spikes.</li>
            <li>Continue automated microsegmentation enforcement between developer VLANs and production database tiers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
