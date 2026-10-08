import React, { useState } from 'react';
import { useSoc } from '../../context/SocContext';
import { ChevronDown } from 'lucide-react';

export const ThreatTypeBarChart: React.FC = () => {
  const { setActiveTab } = useSoc();
  const [activeFilter, setActiveFilter] = useState<'Today' | 'Last 24 Hours' | 'Date Range'>('Last 24 Hours');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(1); // Default highlight Malware

  const categories = [
    { label: 'DDOS', value: 165 },
    { label: 'Malware', value: 185, isHighlight: true },
    { label: 'Ransom', value: 135 },
    { label: 'Spyware', value: 110 },
    { label: 'Phishing', value: 95 },
    { label: 'Botnet', value: 85 },
    { label: 'SQLi', value: 78 },
    { label: 'Exploit', value: 70 },
    { label: 'Backdoor', value: 60 },
    { label: 'Zero-day', value: 48 },
    { label: 'Brute Force', value: 38 }
  ];

  return (
    <div 
      onClick={() => setActiveTab('mitre')}
      className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between hover:border-blue-500/40 transition-all cursor-pointer h-full shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-[#152044] pb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          Breakdown of Threats by Type
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

      <div className="relative w-full h-32 my-1 flex items-end">
        {/* Y Axis Guide lines */}
        <div className="absolute inset-x-0 inset-y-0 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-slate-500">
          <div className="border-b border-[#162046]/40 w-full flex justify-between pr-1"><span>200</span></div>
          <div className="border-b border-[#162046]/40 w-full flex justify-between pr-1"><span>150</span></div>
          <div className="border-b border-[#162046]/40 w-full flex justify-between pr-1"><span>100</span></div>
          <div className="border-b border-[#162046]/40 w-full flex justify-between pr-1"><span>50</span></div>
          <div className="border-b border-[#162046] w-full flex justify-between pr-1"><span>0</span></div>
        </div>

        {/* Bars Container */}
        <div className="relative z-10 w-full h-[95px] flex items-end justify-between pl-6 pr-2 gap-1.5">
          {categories.map((cat, idx) => {
            const heightPct = Math.round((cat.value / 200) * 100);
            const isHovered = hoveredIndex === idx;

            return (
              <div
                key={cat.label}
                onMouseEnter={() => setHoveredIndex(idx)}
                className="flex-1 flex flex-col items-center h-full justify-end group"
              >
                {/* Tooltip on active / hovered bar */}
                {isHovered && (
                  <div className="absolute -top-3 text-[8.5px] font-mono font-bold text-cyan-300 bg-[#070b1c] px-1.5 py-0.5 rounded border border-cyan-500/40 shadow pointer-events-none">
                    {cat.value}
                  </div>
                )}
                {/* Bar */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full max-w-[14px] rounded-t transition-all duration-300 ${
                    cat.isHighlight || isHovered
                      ? 'bg-gradient-to-t from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : 'bg-gradient-to-t from-blue-900 to-blue-500 opacity-80 group-hover:opacity-100'
                  }`}
                />
                {/* Label */}
                <span className="text-[7.5px] text-slate-400 font-sans mt-1 truncate max-w-[24px] text-center">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
