import React, { useState } from 'react';
import { 
  GitFork, 
  ArrowDown, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const AttackPathGraph: React.FC = () => {
  const { attackPathNodes, attackPathLinks, selectedIncident, setActiveTab } = useSoc();
  const [activeNodeId, setActiveNodeId] = useState<string>('node-5');
  const activeNode = attackPathNodes.find(n => n.id === activeNodeId) || attackPathNodes[0];

  const stages = [
    { id: 'INITIAL_ACCESS', label: '1. Initial Access', desc: 'Perimeter probing & WAF transit' },
    { id: 'DISCOVERY', label: '2. Discovery', desc: 'API endpoint enumeration' },
    { id: 'CREDENTIAL_ACCESS', label: '3. Credential Access', desc: 'Password spraying against OAuth token endpoint' },
    { id: 'PRIVILEGE_ESCALATION', label: '4. Privilege Escalation', desc: 'Valid JWT session token hijacked' },
    { id: 'LATERAL_MOVEMENT', label: '5. Lateral Movement', desc: 'Attempted socket pivot toward internal services' },
    { id: 'DATA_ACCESS', label: '6. Data Access', desc: 'Direct SQL query chokepoint (Blocked)' },
    { id: 'EXFILTRATION', label: '7. Exfiltration Risk', desc: 'Egress firewall drop rule active' }
  ];

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-purple-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Interactive Attack Path & Attack Story Graph
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full cyber kill chain progression from external adversary ingress down to targeted database assets.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('simulation')}
          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded text-xs font-medium transition-colors"
        >
          Simulate Chokepoint Defense →
        </button>
      </div>

      {/* Kill Chain Progression Stages Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-xs">
        {stages.map((st, idx) => (
          <div 
            key={st.id}
            className={`p-2 rounded border font-mono ${
              idx < 4 
                ? 'bg-rose-950/20 border-rose-900/40 text-rose-300' 
                : idx === 4
                ? 'bg-amber-950/20 border-amber-900/40 text-amber-300'
                : 'bg-slate-900/60 border-slate-800 text-slate-400'
            }`}
          >
            <span className="font-semibold block text-[11px] truncate">{st.label}</span>
            <span className="text-[10px] text-slate-400 block truncate mt-0.5">{st.desc}</span>
          </div>
        ))}
      </div>

      {/* Interactive Visual Graph & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left 8 Cols */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-200">
              Correlated Attack Chain: {selectedIncident ? selectedIncident.id : 'INC-8402'}
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Click any node to inspect evidence</span>
          </div>

          <div className="space-y-3 py-2">
            {attackPathNodes.map((node, index) => {
              const isSelected = activeNodeId === node.id;
              const link = attackPathLinks[index];
              return (
                <div key={node.id} className="relative">
                  <div
                    onClick={() => setActiveNodeId(node.id)}
                    className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-sky-400 bg-slate-855 shadow-md ring-1 ring-sky-500/40'
                        : node.status === 'COMPROMISED'
                        ? 'border-rose-800/80 bg-rose-950/10 hover:border-rose-600'
                        : node.status === 'ACTIVE_THREAT'
                        ? 'border-rose-700 bg-rose-950/20 hover:border-rose-500'
                        : node.status === 'AT_RISK'
                        ? 'border-amber-800/80 bg-amber-950/10 hover:border-amber-600'
                        : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-3 h-3 rounded-full shrink-0 ${
                        node.status === 'COMPROMISED' || node.status === 'ACTIVE_THREAT'
                          ? 'bg-rose-500 animate-pulse'
                          : node.status === 'AT_RISK'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs text-slate-100">{node.label}</span>
                          <span className="text-[10px] font-mono text-slate-400">({node.stage})</span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block truncate">
                          {node.ipOrIdentifier}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded text-xs ${
                        node.status === 'COMPROMISED'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                          : node.status === 'ACTIVE_THREAT'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                          : node.status === 'AT_RISK'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                      }`}>
                        {node.status}
                      </span>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-sky-400' : 'text-slate-600'}`} />
                    </div>
                  </div>

                  {link && index < attackPathNodes.length - 1 && (
                    <div className="flex items-center justify-center my-1.5 gap-2 text-[10px] font-mono">
                      <ArrowDown className={`w-3.5 h-3.5 ${
                        link.status === 'ACTIVE' 
                          ? 'text-rose-400 animate-bounce' 
                          : link.status === 'SUSPECTED' 
                          ? 'text-amber-400' 
                          : 'text-emerald-400'
                      }`} />
                      <span className={`${
                        link.status === 'ACTIVE' 
                          ? 'text-rose-400' 
                          : link.status === 'SUSPECTED' 
                          ? 'text-amber-400' 
                          : 'text-emerald-400'
                      }`}>
                        {link.label} [{link.protocol}] • Status: {link.status}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 4 Cols */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Node Forensic Inspector
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
                {activeNode.label}
              </h3>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Identifier / IP</span>
                <span className="text-sky-400 font-bold block">{activeNode.ipOrIdentifier}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Stage</span>
                <span className="text-slate-200 block">{activeNode.stage}</span>
              </div>
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Forensic Description</span>
                <p className="text-slate-300 font-sans text-xs leading-relaxed">
                  {activeNode.description}
                </p>
              </div>
              {activeNode.evidenceSnippet && (
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                  <span className="text-slate-400 text-[10px] block">Observed Evidence Snippet</span>
                  <p className="text-emerald-400 font-mono text-[11px] leading-relaxed">
                    {activeNode.evidenceSnippet}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 rounded bg-sky-950/20 border border-sky-900/40 text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-sky-400 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Kill Chain Interpretation</span>
              </div>
              <p className="text-slate-300 font-sans leading-relaxed text-[11px]">
                The adversary executed automated brute force to establish valid credentials on this account, intending to pivot horizontally to backend services. However, egress filtering prevented payload extraction.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Node State: {activeNode.status}</span>
            <button
              onClick={() => setActiveTab('defense')}
              className="px-2.5 py-1 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
            >
              Contain Node →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
