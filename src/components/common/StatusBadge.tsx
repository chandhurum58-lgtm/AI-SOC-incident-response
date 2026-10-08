import React from 'react';
import { IncidentStatus } from '../../types/soc';

interface StatusBadgeProps {
  status: IncidentStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'NEW':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-rose-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
          <span>New Alert</span>
        </span>
      );
    case 'INVESTIGATING':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Investigating</span>
        </span>
      );
    case 'CONFIRMED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-purple-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span>Confirmed Threat</span>
        </span>
      );
    case 'CONTAINED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-cyan-300 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>Contained</span>
        </span>
      );
    case 'RESOLVED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Resolved</span>
        </span>
      );
    case 'FALSE_POSITIVE':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>False Positive</span>
        </span>
      );
    default:
      return <span className="text-xs text-slate-400">{status}</span>;
  }
};
