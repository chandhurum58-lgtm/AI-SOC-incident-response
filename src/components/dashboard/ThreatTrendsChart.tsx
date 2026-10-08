import React, { useState } from 'react';
import { useSoc } from '../../context/SocContext';
import { ChevronDown } from 'lucide-react';

export const ThreatTrendsChart: React.FC = () => {
  const { setActiveTab } = useSoc();
  const [activeFilter, setActiveFilter] = useState<'Today' | 'Last 24 Hours' | 'Date Range'>('Last 24 Hours');
  const timestamps = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  return (
    <div 
      onClick={() => setActiveTab('analytics')}
      className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between hover:border-blue-500/40 transition-all cursor-pointer h-full shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-[#152044] pb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          Threat Trends Over Time
        </h3>
        <div className="flex items-center gap-1 bg-[#101738] p-0.5 rounded-full border border-[#1b2552] text-[9.5px]">
          {(['Today', 'Last 24 Hours'] as const).map((filter) => (
            <button
              key={filter}
              onClick={(e) => { e.stopPropagation(); setActiveFilter(filter); }}
              className={`px-2 py-0.5 rounded-full transition-all ${
                activeFilter === filter
                  ? 'bg-blue-600 text-white font-medium shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
          <button
            onClick={(e) => { e.stopPropagation(); setActiveFilter('Date Range'); }}
            className={`px-2 py-0.5 rounded-full transition-all flex items-center gap-1 ${
              activeFilter === 'Date Range'
                ? 'bg-blue-600 text-white font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Date Range</span>
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      <div className="relative w-full h-32 my-1">
        <svg viewBox="0 0 400 130" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="cyanAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="20" y1="20" x2="390" y2="20" stroke="#162046" strokeWidth="0.8" strokeDasharray="2,3" />
          <line x1="20" y1="50" x2="390" y2="50" stroke="#162046" strokeWidth="0.8" strokeDasharray="2,3" />
          <line x1="20" y1="80" x2="390" y2="80" stroke="#162046" strokeWidth="0.8" strokeDasharray="2,3" />
          <line x1="20" y1="105" x2="390" y2="105" stroke="#162046" strokeWidth="0.8" />

          {/* Cyan/Blue Area (Baseline) */}
          <path
            d="M 25 75 Q 75 90 130 60 T 235 42 T 310 78 T 385 55 L 385 105 L 25 105 Z"
            fill="url(#cyanAreaGrad)"
          />
          <path
            d="M 25 75 Q 75 90 130 60 T 235 42 T 310 78 T 385 55"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1.8"
          />

          {/* Red/Coral Area (Critical spikes) */}
          <path
            d="M 25 55 Q 85 40 145 70 T 250 30 T 310 25 T 385 45 L 385 105 L 25 105 Z"
            fill="url(#redAreaGrad)"
          />
          <path
            d="M 25 55 Q 85 40 145 70 T 250 30 T 310 25 T 385 45"
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
          />

          {/* Critical Point Dot (matching screenshot at 15:00 hrs) */}
          <circle cx="310" cy="25" r="4.5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />

          {/* X Axis labels */}
          {timestamps.map((t, idx) => (
            <text
              key={t}
              x={35 + idx * 56}
              y="120"
              textAnchor="middle"
              fill="#64748b"
              fontSize="8.5"
              fontFamily="monospace"
            >
              {t}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip matching screenshot */}
        <div className="absolute top-1 right-20 bg-[#070b1c]/95 border border-rose-500/50 rounded-lg px-2.5 py-1 text-[9.5px] font-mono shadow-xl pointer-events-none">
          <div className="text-rose-400 font-bold">Critical: 375</div>
          <div className="text-slate-400 text-[8.5px]">15:00 hrs, Today</div>
        </div>
      </div>

      {/* Legend matching screenshot */}
      <div className="flex items-center justify-center gap-4 pt-1.5 border-t border-[#152044] text-[9.5px] text-slate-300 font-sans">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>Maximum</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-400" />
          <span>Minimum</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_5px_#f43f5e]" />
          <span>Critical</span>
        </div>
      </div>
    </div>
  );
};
