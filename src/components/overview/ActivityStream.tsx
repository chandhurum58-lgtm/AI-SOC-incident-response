import React from 'react';
import { Radio, ArrowUpRight } from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from '../common/SeverityBadge';

export const ActivityStream: React.FC = () => {
  const { activityFeed, setActiveTab, setInvestigatedIp } = useSoc();

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded flex flex-col h-full">
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
          <h3 className="text-xs font-semibold text-slate-200">Real-Time Threat Activity Stream</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Live Ingest</span>
      </div>

      <div className="p-2 space-y-1.5 overflow-y-auto max-h-[340px]">
        {activityFeed.map((item, idx) => (
          <div
            key={`${item.id}-${idx}`}
            className="p-2 rounded bg-slate-950/60 border border-slate-800/60 hover:border-slate-700 transition-colors flex items-start justify-between gap-3 text-xs"
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2">
                <SeverityBadge severity={item.severity} size="sm" />
                <span className="text-slate-400 text-[11px] font-mono">{item.timestamp}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono text-[11px] truncate">{item.asset}</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed font-normal">
                {item.message}
              </p>
            </div>
            {item.sourceIp && (
              <button
                onClick={() => {
                  setInvestigatedIp(item.sourceIp!);
                  setActiveTab('threatintel');
                }}
                className="shrink-0 flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:text-sky-300 hover:underline pt-0.5"
                title="Inspect Source IP Intelligence"
              >
                <span>{item.sourceIp}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
