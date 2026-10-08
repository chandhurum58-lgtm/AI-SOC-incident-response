import React, { useState } from 'react';
import { useSoc } from '../../context/SocContext';
import { ChevronDown } from 'lucide-react';

export const AffectedSystemsGauges: React.FC = () => {
  const { setActiveTab } = useSoc();
  const [activeFilter, setActiveFilter] = useState<'Today' | 'Last 24 Hours' | 'Date Range'>('Last 24 Hours');

  const systems = [
    {
      label: 'Users',
      count: '450',
      status: 'Investigating',
      statusDot: 'bg-amber-400',
      statusColor: 'text-amber-300',
      strokeColor: '#f59e0b',
      pct: 0.82,
      tab: 'users' as const
    },
    {
      label: 'Endpoints',
      count: '150',
      status: 'Blocked',
      statusDot: 'bg-rose-500',
      statusColor: 'text-rose-300',
      strokeColor: '#ef4444',
      pct: 0.65,
      tab: 'devices' as const
    },
    {
      label: 'Servers',
      count: '15',
      status: 'Critical',
      statusDot: 'bg-rose-500',
      statusColor: 'text-rose-300',
      strokeColor: '#ef4444',
      pct: 0.55,
      tab: 'traffic' as const
    },
    {
      label: 'Network Devices',
      count: '08',
      status: 'Remediated',
      statusDot: 'bg-emerald-400',
      statusColor: 'text-emerald-300',
      strokeColor: '#10b981',
      pct: 0.38,
      tab: 'network' as const
    }
  ];

  const r = 24;
  const c = 2 * Math.PI * r;

  return (
    <div className="bg-[#0b1028] border border-[#16214a] rounded-xl p-3.5 flex flex-col justify-between h-full shadow-lg">
      <div className="flex items-center justify-between border-b border-[#152044] pb-2">
        <h3 className="text-xs font-semibold text-slate-200 tracking-wide font-sans">
          Affected Systems & Severity
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-auto py-1">
        {systems.map((item) => {
          const dash = item.pct * c;

          return (
            <div
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              className="flex flex-col items-center text-center p-1.5 rounded-lg hover:bg-[#12193e] transition-colors cursor-pointer group"
            >
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center mb-1">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r={r}
                    fill="none"
                    stroke="#151e44"
                    strokeWidth="4"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r={r}
                    fill="none"
                    stroke={item.strokeColor}
                    strokeWidth="4"
                    strokeDasharray={`${dash} ${c}`}
                    strokeLinecap="round"
                    className="filter drop-shadow-[0_0_5px_currentColor]"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-sm text-white group-hover:scale-105 transition-transform">
                  {item.count}
                </div>
              </div>

              {/* Label */}
              <div className="text-[10px] font-sans font-medium text-slate-200 truncate w-full text-center">
                {item.label}
              </div>

              {/* Status pill with dot */}
              <div className="flex items-center gap-1 text-[8.5px] mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${item.statusDot}`} />
                <span className={`${item.statusColor} font-medium`}>{item.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
