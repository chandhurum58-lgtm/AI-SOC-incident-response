import React, { useState } from 'react';
import { 
  Grid3X3, 
  Play 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from '../common/SeverityBadge';

export const MitreAttackView: React.FC = () => {
  const { mitreMatrix, setActiveTab } = useSoc();
  const [selectedTactic, setSelectedTactic] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const tactics = [
    'ALL',
    'Initial Access',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Impact',
    'Defense Evasion'
  ];

  const filteredTechniques = mitreMatrix.filter(m => {
    if (selectedTactic !== 'ALL' && m.tactic !== selectedTactic) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        m.techniqueName.toLowerCase().includes(q) ||
        m.techniqueId.toLowerCase().includes(q) ||
        m.observedEvidence.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Grid3X3 className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              MITRE ATT&CK® Enterprise Matrix Mapping
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Adversary technique taxonomy correlated with real-time log evidence, predictive next stages, and defensive countermeasures.
          </p>
        </div>
        {/* Search */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search technique (e.g. T1110)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 font-mono w-60 focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Tactic Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-900/90 p-1.5 rounded border border-slate-800 text-xs">
        {tactics.map((tac) => (
          <button
            key={tac}
            onClick={() => setSelectedTactic(tac)}
            className={`px-3 py-1 rounded transition-colors ${
              selectedTactic === tac 
                ? 'bg-slate-800 text-slate-100 font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tac}
          </button>
        ))}
      </div>

      {/* MITRE Technique Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTechniques.map((item) => (
          <div
            key={item.techniqueId}
            className="bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col justify-between space-y-3"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {item.techniqueId}
                    </span>
                    <SeverityBadge severity={item.severity} size="sm" />
                  </div>
                  <h3 className="text-xs font-semibold text-slate-100 mt-1">
                    {item.techniqueName}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                    Tactic: {item.tactic}
                  </span>
                </div>
                <div className="text-right font-mono shrink-0">
                  <span className="text-[10px] text-slate-400 block">Detections</span>
                  <span className="text-xs font-bold text-slate-200 tabular-nums">
                    {item.detectedCount} events
                  </span>
                </div>
              </div>

              {/* Observed Evidence */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] font-semibold block uppercase">
                  Observed Forensic Evidence
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  {item.observedEvidence}
                </p>
              </div>

              {/* Potential Next Technique */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-amber-400 text-[10px] font-semibold block uppercase">
                  Potential Next Technique Stage
                </span>
                <p className="text-amber-200 font-sans text-xs leading-relaxed">
                  {item.potentialNextTechnique}
                </p>
              </div>

              {/* Recommended Defense */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-emerald-400 text-[10px] font-semibold block uppercase">
                  Recommended Countermeasure Defense
                </span>
                <p className="text-emerald-300 font-sans text-xs leading-relaxed">
                  {item.recommendedDefense}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('simulation')}
                className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
              >
                <Play className="w-3 h-3" />
                <span>Simulate Defense</span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Correlated Incidents →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
