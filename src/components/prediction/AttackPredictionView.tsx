import React from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Clock, 
  Play 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from '../common/SeverityBadge';

export const AttackPredictionView: React.FC = () => {
  const { predictions, setActiveTab } = useSoc();

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              AI Predictive Cyber Threat Modeling
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Probabilistic forward horizon forecasting derived from real-time anomalous heuristics and global threat feeds.
          </p>
        </div>
        <div className="px-3 py-1.5 rounded bg-sky-950/40 border border-sky-800/60 text-sky-300 text-xs font-mono flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Notice: Predictions represent probabilistic models, NOT confirmed active breaches.</span>
        </div>
      </div>

      {/* Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {predictions.map((pred) => (
          <div 
            key={pred.id}
            className="bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col justify-between space-y-3.5"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400">{pred.id}</span>
                    <SeverityBadge severity={pred.risk} />
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-sky-950 text-sky-300 border border-sky-800/60">
                      PREDICTION
                    </span>
                  </div>
                  <h3 className="text-xs font-semibold text-slate-100 mt-1">
                    {pred.predictedThreat}
                  </h3>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 block">Probability</span>
                  <span className="text-lg font-bold font-mono text-sky-400 tabular-nums">
                    {pred.probability}%
                  </span>
                </div>
              </div>

              {/* Time Horizon & Target */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950 p-2 rounded border border-slate-800/80 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">Time Horizon</span>
                  <div className="flex items-center gap-1 text-slate-200 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{pred.timeHorizon}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Target Asset</span>
                  <span className="text-slate-200 truncate block mt-0.5">{pred.targetAsset}</span>
                </div>
              </div>

              {/* Supporting Indicators */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-mono text-[11px] font-semibold block">
                  Supporting Behavioral Indicators
                </span>
                <ul className="space-y-1 text-slate-300 font-sans text-xs">
                  {pred.supportingIndicators.map((ind, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 shrink-0">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Preventions */}
              <div className="space-y-1.5 text-xs bg-slate-950 p-2.5 rounded border border-slate-800/80">
                <span className="text-emerald-400 font-mono text-[11px] font-semibold block">
                  Recommended Proactive Prevention
                </span>
                <ul className="space-y-1 text-slate-300 font-sans text-xs">
                  {pred.recommendedPrevention.map((prev, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">•</span>
                      <span>{prev}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* MITRE Mapping */}
              <div className="text-[11px] font-mono text-slate-400">
                Potential Technique: <span className="text-slate-200">{pred.mitreNextTechnique}</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setActiveTab('simulation')}
                className="px-2.5 py-1 text-xs font-medium bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded flex items-center gap-1 transition-colors"
              >
                <Play className="w-3 h-3" />
                <span>Simulate Defense</span>
              </button>
              <button
                onClick={() => setActiveTab('defense')}
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Configure Prevention →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
