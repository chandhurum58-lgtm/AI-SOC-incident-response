import React from 'react';
import { 
  Clock, 
  ShieldAlert, 
  Target, 
  Activity, 
  Search 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const SentraKpiRow: React.FC = () => {
  const { setActiveTab } = useSoc();

  const kpis = [
    {
      id: 'total-threats',
      title: 'Total Threats',
      value: '12,345',
      icon: Clock,
      iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      tab: 'alerts' as const
    },
    {
      id: 'malware-incidents',
      title: 'Malware Incidents',
      value: '1,870',
      icon: ShieldAlert,
      iconBg: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30',
      tab: 'incidents' as const
    },
    {
      id: 'ddos-attacks',
      title: 'DDOS Attacks',
      value: '2,430',
      icon: Target,
      iconBg: 'bg-blue-600/20 text-cyan-400 border-cyan-500/30',
      tab: 'traffic' as const
    },
    {
      id: 'anomalous-traffic',
      title: 'Anomalous Traffic',
      value: '3,210',
      icon: Activity,
      iconBg: 'bg-sky-600/20 text-sky-400 border-sky-500/30',
      tab: 'traffic' as const
    },
    {
      id: 'ips-blocked',
      title: 'IPs Blocked',
      value: '3,120',
      icon: Search,
      iconBg: 'bg-blue-600/20 text-blue-400 border-blue-500/30',
      tab: 'threatintel' as const
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.id}
            onClick={() => setActiveTab(kpi.tab)}
            className="bg-[#0b1028] border border-[#16214a] hover:border-blue-500/40 rounded-xl p-3.5 flex items-center gap-3.5 cursor-pointer transition-all hover:bg-[#0e1534] shadow-lg group"
          >
            <div className={`w-11 h-11 rounded-full border flex items-center justify-center shrink-0 ${kpi.iconBg} group-hover:scale-105 transition-transform shadow-inner`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-bold font-mono text-white tracking-tight tabular-nums">
                {kpi.value}
              </div>
              <div className="text-xs text-slate-400 font-sans truncate">
                {kpi.title}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
