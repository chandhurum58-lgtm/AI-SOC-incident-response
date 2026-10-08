import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  Play 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const DefenseRecommendationView: React.FC = () => {
  const { 
    selectedIncident, 
    incidents, 
    setActiveTab 
  } = useSoc();

  const incident = selectedIncident || incidents[0];

  const defaultDefensePlan = [
    {
      id: 'DEF-1',
      actionNumber: 1,
      title: 'Isolate Suspicious Host / Endpoint',
      description: 'Quarantine endpoint from production VLANs to restrict network access while preserving EDR tunnel.',
      justification: 'Halts unauthorized command execution and lateral traversal across subnet.',
      isDestructive: true,
      requiresApproval: true,
      status: 'APPROVED'
    },
    {
      id: 'DEF-2',
      actionNumber: 2,
      title: 'Terminate Suspicious Active Sessions',
      description: 'Invalidate active JWT bearer tokens and OAuth refresh cookies for compromised user accounts.',
      justification: 'Immediately revokes adversary access to enterprise web portals and APIs.',
      isDestructive: false,
      requiresApproval: false,
      status: 'EXECUTED'
    },
    {
      id: 'DEF-3',
      actionNumber: 3,
      title: 'Block Confirmed Malicious Source IP on Perimeter WAF',
      description: 'Inject temporary drop rule on ingress firewall for source IP 198.51.100.23 (72h ban).',
      justification: 'Prevents further automated credential stuffing and port scanning against public VIPs.',
      isDestructive: false,
      requiresApproval: true,
      status: 'PENDING'
    },
    {
      id: 'DEF-4',
      actionNumber: 4,
      title: 'Review Authentication & Access Audit Logs',
      description: 'Export 24-hour Okta / Azure AD and SSH auth logs for compromised identities into SIEM.',
      justification: 'Identifies whether other systems were probed or accessed prior to initial detection.',
      isDestructive: false,
      requiresApproval: false,
      status: 'EXECUTED'
    },
    {
      id: 'DEF-5',
      actionNumber: 5,
      title: 'Reset Compromised Identity Credentials & Mandate FIDO2',
      description: 'Expire existing LDAP passwords and require in-person hardware token re-enrollment.',
      justification: 'Eliminates lingering password exposure from dark web credential dumps.',
      isDestructive: true,
      requiresApproval: true,
      status: 'PENDING'
    },
    {
      id: 'DEF-6',
      actionNumber: 6,
      title: 'Check for Lateral Movement & Internal Kerberos Probing',
      description: 'Query Zeek and EDR event logs for abnormal RPC/SMB connections to port 445 on database tiers.',
      justification: 'Validates that the adversary has not successfully established footholds on other internal servers.',
      isDestructive: false,
      requiresApproval: false,
      status: 'EXECUTED'
    },
    {
      id: 'DEF-7',
      actionNumber: 7,
      title: 'Verify Server & Database Integrity Post-Mitigation',
      description: 'Execute file integrity monitoring checks (AIDE / Tripwire) and verify database query logs.',
      justification: 'Confirms no unauthorized tables were dumped or system binaries tampered with.',
      isDestructive: false,
      requiresApproval: false,
      status: 'PENDING'
    },
    {
      id: 'DEF-8',
      actionNumber: 8,
      title: 'Continue Elevated Automated Monitoring',
      description: 'Set telemetry threshold alert multiplier to 1.5x on auth and database clusters for 7 days.',
      justification: 'Guarantees rapid re-alerting should the adversary attempt secondary ingress vectors.',
      isDestructive: false,
      requiresApproval: false,
      status: 'PENDING'
    }
  ];

  const [actions, setActions] = useState(defaultDefensePlan);

  const handleApprove = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'APPROVED' } : a));
  };

  const handleReject = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'REJECTED' } : a));
  };

  const handleExecute = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status: 'EXECUTED' } : a));
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-semibold text-slate-100">
              AI Recommended Defense & Containment Plan
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Strict human-in-the-loop authorization controls for mitigating active threats without unintended operational downtime.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('simulation')}
          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Play className="w-3.5 h-3.5" />
          <span>Simulate First in Sandbox</span>
        </button>
      </div>

      {/* Incident Header */}
      <div className="p-3 bg-slate-900/90 border border-slate-800 rounded flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-400">Target Incident:</span>{' '}
          <span className="text-sky-400 font-bold">{incident.id}</span>{' '}
          <span className="text-slate-200">({incident.title})</span>
        </div>
        <div className="text-amber-400">
          Approval Policy: Tier 2 Analyst or SOC Lead Required for Destructive Actions
        </div>
      </div>

      {/* 8 Defensive Action Items */}
      <div className="space-y-3">
        {actions.map((act) => (
          <div
            key={act.id}
            className={`p-3.5 rounded border transition-colors bg-slate-900/90 ${
              act.status === 'EXECUTED'
                ? 'border-emerald-900/50'
                : act.status === 'APPROVED'
                ? 'border-sky-900/50'
                : act.status === 'REJECTED'
                ? 'border-rose-900/50 opacity-60'
                : 'border-slate-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-slate-400 font-bold">
                    #{act.actionNumber}.
                  </span>
                  <span className="font-semibold text-slate-100 text-xs">
                    {act.title}
                  </span>
                  {act.isDestructive && (
                    <span className="text-[10px] font-mono text-amber-400 px-1.5 py-0.5 rounded bg-amber-950/40 border border-amber-800/40">
                      Disruptive Action
                    </span>
                  )}
                  {act.requiresApproval && (
                    <span className="text-[10px] font-mono text-sky-400 px-1.5 py-0.5 rounded bg-sky-950/40 border border-sky-800/40">
                      Approval Required
                    </span>
                  )}
                </div>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {act.description}
                </p>
                <div className="text-[11px] text-slate-400 font-sans pt-1">
                  <strong className="text-slate-300">Justification:</strong> {act.justification}
                </div>
              </div>

              {/* Status & Control Buttons */}
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                  act.status === 'EXECUTED'
                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60'
                    : act.status === 'APPROVED'
                    ? 'text-sky-300 bg-sky-950/60 border border-sky-800/60'
                    : act.status === 'REJECTED'
                    ? 'text-rose-400 bg-rose-950/60 border border-rose-800/60'
                    : 'text-amber-400 bg-amber-950/60 border border-amber-800/60'
                }`}>
                  {act.status}
                </span>

                <div className="flex items-center gap-1.5">
                  {act.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleApprove(act.id)}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(act.id)}
                        className="px-2.5 py-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}
                  {act.status === 'APPROVED' && (
                    <button
                      onClick={() => handleExecute(act.id)}
                      className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium transition-colors"
                    >
                      Execute Now
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab('simulation')}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
                  >
                    Simulate First
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
