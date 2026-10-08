import React from 'react';
import { Severity } from '../../types/soc';

interface SeverityBadgeProps {
  severity: Severity;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'text-xs' : 'text-xs font-medium';
  switch (severity) {
    case 'CRITICAL':
      return (
        <span className={`inline-flex items-center gap-1.5 text-rose-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>CRITICAL</span>
        </span>
      );
    case 'HIGH':
      return (
        <span className={`inline-flex items-center gap-1.5 text-amber-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>HIGH</span>
        </span>
      );
    case 'MEDIUM':
      return (
        <span className={`inline-flex items-center gap-1.5 text-yellow-300 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
          <span>MEDIUM</span>
        </span>
      );
    case 'LOW':
      return (
        <span className={`inline-flex items-center gap-1.5 text-sky-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
          <span>LOW</span>
        </span>
      );
    case 'INFO':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 text-slate-400 ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
          <span>INFO</span>
        </span>
      );
  }
};
