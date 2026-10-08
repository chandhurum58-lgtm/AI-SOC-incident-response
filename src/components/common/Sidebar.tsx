import React from 'react';
import { 
  LayoutDashboard, 
  BellRing, 
  FileText, 
  BarChart3, 
  Settings as SettingsIcon,
  AlertTriangle, 
  Network, 
  Activity, 
  Laptop, 
  Users, 
  Microscope, 
  Sparkles, 
  GitFork, 
  Compass, 
  FlaskConical, 
  Grid3X3, 
  Bot 
} from 'lucide-react';
import { useSoc, ActiveTab } from '../../context/SocContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, alerts, incidents, notifications, isSidebarCollapsed } = useSoc();
  const userAlertsCount = notifications.filter(n => n.category === 'USER_SYSTEM').length;

  if (isSidebarCollapsed) {
    return null;
  }

  // Primary 5 core items requested by user
  const primaryNavItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'LIVE', badgeColor: 'bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/40' },
    { id: 'alerts', label: 'Alerts', icon: BellRing, badge: alerts.filter(a => a.severity === 'CRITICAL').length || 4, badgeColor: 'bg-rose-500 text-white font-bold' },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  // Secondary advanced SOC tools
  const secondaryNavItems: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: incidents.filter(i => i.status !== 'RESOLVED').length || 5, badgeColor: 'bg-amber-500 text-slate-950 font-bold' },
    { id: 'network', label: 'Network Monitor', icon: Network },
    { id: 'traffic', label: 'Server Traffic', icon: Activity },
    { id: 'devices', label: 'Devices', icon: Laptop },
    { id: 'users', label: 'Users System', icon: Users, badge: userAlertsCount > 0 ? userAlertsCount : undefined, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono' },
    { id: 'analysis', label: 'Attack Analysis', icon: Microscope },
    { id: 'prediction', label: 'Attack Prediction', icon: Sparkles },
    { id: 'attackpath', label: 'Attack Path', icon: GitFork },
    { id: 'threatintel', label: 'Threat Intel', icon: Compass },
    { id: 'simulation', label: 'Response Sandbox', icon: FlaskConical },
    { id: 'mitre', label: 'MITRE ATT&CK', icon: Grid3X3 },
    { id: 'copilot', label: 'AI Security Copilot', icon: Bot },
  ];

  return (
    <aside className="w-52 bg-[#050818] border-r border-[#141e3d] flex flex-col shrink-0 select-none overflow-y-auto">
      <div className="py-3 px-2 space-y-1">
        {/* Core Navigation Items */}
        <div className="px-2.5 py-1 text-[9.5px] uppercase font-mono tracking-wider text-slate-500">
          Core Operations
        </div>
        {primaryNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === 'dashboard' 
            ? (activeTab === 'dashboard' || activeTab === 'overview' || activeTab === 'threatmap' || activeTab === 'livemap') 
            : activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-sans transition-all text-left ${
                isActive
                  ? 'bg-blue-600/20 text-cyan-300 font-semibold border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1432]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9.5px] font-mono leading-tight ${item.badgeColor}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Tactical Sub-Systems */}
        <div className="pt-2 mt-2 border-t border-[#121c3d]">
          <div className="px-2.5 py-1 text-[9.5px] uppercase font-mono tracking-wider text-slate-500">
            SOC Investigation
          </div>
          <div className="space-y-0.5">
            {secondaryNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-sans transition-all text-left ${
                    isActive
                      ? 'bg-blue-600/15 text-white font-medium border border-blue-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1432]/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate text-[11.5px]">{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-mono leading-tight ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-auto p-3 border-t border-[#141e3d] text-[10px] text-slate-500 font-mono flex items-center justify-between bg-[#040614]">
        <span>SOC Sensor v4.2</span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE
        </span>
      </div>
    </aside>
  );
};
