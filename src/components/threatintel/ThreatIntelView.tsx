import React, { useState } from 'react';
import { 
  Compass, 
  HelpCircle 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { ThreatIntelligence } from '../../types/soc';

export const ThreatIntelView: React.FC = () => {
  const { threatIntelMap, investigatedIp, setInvestigatedIp, setActiveTab } = useSoc();
  const [inputIp, setInputIp] = useState<string>(investigatedIp || '198.51.100.23');

  const currentIntel: ThreatIntelligence = 
    threatIntelMap[inputIp] || threatIntelMap['198.51.100.23'];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (threatIntelMap[inputIp]) {
      setInvestigatedIp(inputIp);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Adversary Source & IP Threat Intelligence Dossier
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            BGP routing analysis, Autonomous System classification, and open-source intelligence correlation.
          </p>
        </div>
        {/* IP Lookup Form */}
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search IP (e.g. 198.51.100.23)"
            value={inputIp}
            onChange={(e) => setInputIp(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono w-56 focus:outline-none focus:border-sky-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium font-mono transition-colors"
          >
            Investigate
          </button>
        </form>
      </div>

      {/* Mandatory Disclaimer */}
      <div className="p-3 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 flex items-start gap-2.5">
        <HelpCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed font-sans text-xs">
          <strong>Investigation Standard:</strong> Geolocation coordinates represent approximate registrar/BGP announcement points. Commercial VPNs, bulletproof proxies, and compromised cloud instances deliberately obscure the human adversary's actual physical geography.
        </p>
      </div>

      {/* IP Overview Header Card */}
      <div className="p-4 rounded bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
            Target Host Dossier
          </span>
          <div className="flex items-center gap-3 mt-1">
            <h2 className="text-lg font-bold text-sky-400">{currentIntel.ip}</h2>
            <span className="text-xs text-slate-300 font-sans">
              • {currentIntel.organization}
            </span>
          </div>
          <span className="text-xs text-slate-400 block mt-0.5">
            ASN: {currentIntel.asn}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Reputation Score</span>
            <span className="text-2xl font-bold text-rose-400 tabular-nums">
              {currentIntel.reputationScore}/100
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Attribution Confidence</span>
            <span className="text-sm font-bold text-amber-400">
              {currentIntel.confidenceLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Distinction between Observed Information & AI Inference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Strictly Observed Telemetry & Facts */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
              <span>Observed Forensic Telemetry (Verified Facts)</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Deterministic Logs</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px] block">Observed Ingress Payloads</span>
              <ul className="space-y-1 text-slate-200 text-[11px]">
                {currentIntel.observedData.map((obs, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-sky-400 shrink-0">•</span>
                    <span>{obs}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px] block">Historical Observations</span>
              <ul className="space-y-1 text-slate-200 text-[11px]">
                {currentIntel.historicalObservations.map((hist, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400 shrink-0">•</span>
                    <span>{hist}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 text-[10px] block">Known Threat Intelligence Reports</span>
              <ul className="space-y-1 text-slate-300 font-sans text-xs">
                {currentIntel.knownThreatReports.map((rep, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 shrink-0">•</span>
                    <span>{rep}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: AI Behavioral Inference & Hypotheses */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
              <span>AI Behavioral Inference & Attribution Hypotheses</span>
            </h3>
            <span className="text-[11px] font-mono text-purple-400">Probabilistic Model</span>
          </div>

          <div className="space-y-2 text-xs font-sans">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
              <span className="text-slate-400 font-mono text-[10px] block">AI Behavioral Deduction</span>
              <ul className="space-y-1.5 text-slate-200 text-xs">
                {currentIntel.aiInference.map((inf, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-purple-400 shrink-0">•</span>
                    <span>{inf}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-mono text-[10px] block">Correlated Adversary Infrastructure</span>
              <div className="space-y-1 font-mono text-[11px]">
                <div className="text-slate-300">
                  Subnet Block: {currentIntel.relatedInfrastructure.join(', ')}
                </div>
                <div className="text-slate-400">
                  Related Domains: {currentIntel.relatedDomains.join(', ')}
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
              <span className="text-slate-400 font-mono text-[10px] block">Threat Classification Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {currentIntel.threatCategories.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-amber-300 font-mono text-[11px]">
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs font-mono">
        <span className="text-slate-400">
          Source IP state: <span className="text-rose-400">UNDER ACTIVE SURVEILLANCE</span>
        </span>
        <button
          onClick={() => setActiveTab('simulation')}
          className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded font-medium transition-colors"
        >
          Simulate Edge Drop Rule for {currentIntel.ip}
        </button>
      </div>
    </div>
  );
};
