import React from 'react';
import { useSoc } from '../../context/SocContext';

export const AccuracyDonutChart: React.FC = () => {
  const { setActiveTab } = useSoc();

  const radius = 54;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  // Exact segmented values
  const confirmedPct = 0.74; // 74%
  const falsePosPct = 0.16;  // 16%
  const manualPct = 0.10;    // 10%

  const confirmedDash = confirmedPct * circumference;
  const falsePosDash = falsePosPct * circumference;
  const manualDash = manualPct * circumference;

  return (
    <div 
      onClick={() => setActiveTab('analysis')}
      className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between hover:border-blue-500/40 transition-all cursor-pointer h-full shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-[#152044] pb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          Detection Accuracy
        </h3>
        <span className="text-[10px] font-mono text-cyan-400">96.8% Model Confidence</span>
      </div>

      <div className="relative flex items-center justify-center my-auto py-2">
        <svg viewBox="0 0 160 160" className="w-36 h-36 -rotate-90 overflow-visible">
          {/* Base track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#101838"
            strokeWidth={strokeWidth}
          />
          {/* Confirmed Threats (Cyan) */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#06b6d4"
            strokeWidth={strokeWidth}
            strokeDasharray={`${confirmedDash} ${circumference}`}
            strokeDashoffset="0"
            className="filter drop-shadow-[0_0_6px_rgba(6,182,212,0.4)]"
          />
          {/* False Positives (Orange) */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={strokeWidth}
            strokeDasharray={`${falsePosDash} ${circumference}`}
            strokeDashoffset={-confirmedDash}
            className="filter drop-shadow-[0_0_6px_rgba(245,158,11,0.4)]"
          />
          {/* Manual Investigation (Emerald/Green) */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${manualDash} ${circumference}`}
            strokeDashoffset={-(confirmedDash + falsePosDash)}
            className="filter drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]"
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-lg font-bold font-mono text-white">96.8%</span>
          <span className="text-[9px] text-slate-400">Precision</span>
        </div>
      </div>

      {/* Legend matching screenshot */}
      <div className="flex items-center justify-center gap-3 pt-2 border-t border-[#152044] text-[9.5px] text-slate-300 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_4px_#22d3ee]" />
          <span>Confirmed Threats</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_4px_#fbbf24]" />
          <span>False Positives</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399]" />
          <span>Manual Investigation</span>
        </div>
      </div>
    </div>
  );
};
