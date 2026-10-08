import React from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  User, 
  Lock, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from './SeverityBadge';
import { SystemNotification } from '../../types/soc';

export const AlertToastContainer: React.FC = () => {
  const { 
    activeToasts, 
    dismissToast, 
    setActiveTab, 
    setSelectedIncident, 
    incidents, 
    restrictUser 
  } = useSoc();

  if (activeToasts.length === 0) return null;

  const handleInvestigate = (toast: SystemNotification) => {
    dismissToast(toast.id);
    if (toast.incidentId) {
      const inc = incidents.find(i => i.id === toast.incidentId);
      if (inc) {
        setSelectedIncident(inc);
        setActiveTab('analysis');
        return;
      }
    }
    if (toast.category === 'USER_SYSTEM') {
      setActiveTab('users');
      return;
    }
    setActiveTab('alerts');
  };

  const handleRestrict = (e: React.MouseEvent, user: string, id: string) => {
    e.stopPropagation();
    dismissToast(id);
    restrictUser(user.split('@')[0]);
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none select-none">
      {activeToasts.map((toast, idx) => {
        const isUserSystem = toast.category === 'USER_SYSTEM';
        const isCritical = toast.severity === 'CRITICAL';
        return (
          <div
            key={`${toast.id}-${idx}`}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-2xl border transition-all transform animate-in slide-in-from-top-3 duration-300 backdrop-blur-xl ${
              isCritical
                ? 'bg-[#100a22]/95 border-rose-500/60 shadow-[0_0_25px_rgba(244,63,94,0.3)] ring-1 ring-rose-500/30'
                : 'bg-[#09102c]/95 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.25)]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  isCritical ? 'bg-rose-500 animate-ping' : 'bg-cyan-400'
                }`} />
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isUserSystem 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                    : 'bg-blue-500/20 text-cyan-300 border border-blue-500/30'
                }`}>
                  {isUserSystem ? 'USER SYSTEM ALERT' : 'SECURITY ALERT'}
                </span>
                {toast.targetUser && (
                  <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1 bg-[#141f48] px-1.5 py-0.5 rounded border border-[#21306b]">
                    <User className="w-2.5 h-2.5 text-cyan-400" />
                    <span className="truncate max-w-[120px]">{toast.targetUser}</span>
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <SeverityBadge severity={toast.severity} size="sm" />
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-white leading-snug">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                {toast.message}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-slate-400">
                {toast.timestamp}
              </span>
              <div className="flex items-center gap-1.5">
                {isUserSystem && toast.targetUser && (
                  <button
                    onClick={(e) => handleRestrict(e, toast.targetUser!, toast.id)}
                    className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/40 text-[10.5px] font-medium flex items-center gap-1 transition-colors"
                  >
                    <Lock className="w-3 h-3 text-rose-400" />
                    <span>Restrict User</span>
                  </button>
                )}
                <button
                  onClick={() => handleInvestigate(toast)}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10.5px] font-medium flex items-center gap-1 transition-colors shadow-sm"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
