import React, { useState } from 'react';
import { 
  Activity, 
  MapPin, 
  ArrowUpRight, 
  RefreshCw 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { ThreatTrendsChart } from './ThreatTrendsChart';
import { ThreatTypeBarChart } from './ThreatTypeBarChart';
import { AffectedSystemsGauges } from './AffectedSystemsGauges';
import { SeverityRadarChart } from './SeverityRadarChart';

export const SocTelemetryCenter: React.FC = () => {
  const { setActiveTab } = useSoc();
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d'>('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="bg-[#090f26] border border-[#17254e] rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <div className="px-4 py-3 border-b border-[#16234b] bg-gradient-to-r from-[#0d1536] via-[#0b122e] to-[#090f26] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                SOC Security Operations & Telemetry Hub
              </h2>
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Aggregated threat metrics, vector breakdown, and affected enterprise infrastructure
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation Link */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0d1638] border border-[#1e2e5c] rounded-xl p-0.5 text-[11px] font-mono">
            {(['1h', '24h', '7d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white font-medium shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className={`p-2 rounded-xl bg-[#0d1638] border border-[#1e2e5c] text-slate-400 hover:text-white transition-all ${
              isRefreshing ? 'animate-spin text-cyan-400' : ''
            }`}
            title="Refresh Telemetry"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-medium flex items-center gap-1.5 transition-all shadow-sm group"
          >
            <MapPin className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span>Dashboard</span>
            <ArrowUpRight className="w-3 h-3 text-cyan-400/80" />
          </button>
        </div>
      </div>

      {/* 2x2 High-density SOC Telemetry Grid */}
      <div className="p-3.5 flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5 overflow-y-auto">
        <div className="min-h-[220px]">
          <ThreatTrendsChart />
        </div>
        <div className="min-h-[220px]">
          <ThreatTypeBarChart />
        </div>
        <div className="min-h-[220px]">
          <AffectedSystemsGauges />
        </div>
        <div className="min-h-[220px]">
          <SeverityRadarChart />
        </div>
      </div>
    </div>
  );
};
