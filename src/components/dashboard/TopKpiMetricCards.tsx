import React from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Flame, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const TopKpiMetricCards: React.FC = () => {
  const { stats, setActiveTab } = useSoc();

  const cards = [
    {
      id: 'total-attacks',
      title: 'Total Attacks',
      value: stats.totalAttacksDetected.toLocaleString(),
      change: '↑ 18%',
      changeColor: 'text-rose-400',
      icon: ShieldAlert,
      iconColor: 'text-rose-500',
      iconBorder: 'border-rose-500/30 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      tab: 'alerts' as const
    },
    {
      id: 'critical-incidents',
      title: 'Critical Incidents',
      value: stats.criticalIncidents.toLocaleString(),
      change: '↑ 12%',
      changeColor: 'text-rose-400',
      icon: AlertTriangle,
      iconColor: 'text-rose-400',
      iconBorder: 'border-rose-500/30 bg-rose-500/10 shadow-[0_0_12px_rgba(244,63,94,0.3)]',
      tab: 'incidents' as const
    },
    {
      id: 'high-risk',
      title: 'High Risk Incidents',
      value: stats.highRiskIncidents.toLocaleString(),
      change: '↑ 9%',
      changeColor: 'text-amber-400',
      icon: Flame,
      iconColor: 'text-amber-400',
      iconBorder: 'border-amber-500/30 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.3)]',
      tab: 'incidents' as const
    },
    {
      id: 'active-threats',
      title: 'Active Threats',
      value: stats.activeThreats.toLocaleString(),
      change: '↑ 7%',
      changeColor: 'text-sky-400',
      icon: ShieldAlert,
      iconColor: 'text-sky-400',
      iconBorder: 'border-sky-500/30 bg-sky-500/10 shadow-[0_0_12px_rgba(56,189,248,0.3)]',
      tab: 'alerts' as const
    },
    {
      id: 'blocked-attacks',
      title: 'Blocked Attacks',
      value: stats.blockedAttacks.toLocaleString(),
      change: '↑ 15%',
      changeColor: 'text-emerald-400',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      iconBorder: 'border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
      tab: 'defense' as const
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {cards.map((c) => {
        const Icon = c.icon;
        return (
          <div
            key={c.id}
            onClick={() => setActiveTab(c.tab)}
            className="bg-[#0b1126] border border-[#162244] hover:border-blue-500/40 rounded-2xl p-4 flex items-center gap-3.5 cursor-pointer transition-all hover:shadow-[0_0_15px_rgba(37,99,235,0.2)] group"
          >
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBorder} group-hover:scale-105 transition-transform`}>
              <Icon className={`w-6 h-6 ${c.iconColor}`} />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold font-mono text-white tracking-tight tabular-nums">
                {c.value}
              </div>
              <div className="text-[11px] text-slate-400 font-sans truncate">
                {c.title}
              </div>
              <div className={`text-[10px] font-mono font-medium ${c.changeColor} mt-0.5`}>
                {c.change}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
