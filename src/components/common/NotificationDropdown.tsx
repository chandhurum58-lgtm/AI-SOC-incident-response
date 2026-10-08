import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  User, 
  AlertTriangle, 
  ShieldAlert, 
  ExternalLink, 
  X, 
  Lock, 
  ArrowRight,
  ShieldCheck,
  Laptop,
  Network,
  Globe2,
  Check,
  Zap
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { SeverityBadge } from './SeverityBadge';
import { SystemNotification } from '../../types/soc';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose
}) => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    notificationSoundEnabled,
    setNotificationSoundEnabled,
    desktopNotificationsEnabled,
    requestDesktopNotifications,
    restrictUser,
    setActiveTab,
    setSelectedIncident,
    incidents,
    triggerAttackScenario
  } = useSoc();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'USER_SYSTEM' | 'CRITICAL' | 'UNREAD'>('ALL');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'USER_SYSTEM') return n.category === 'USER_SYSTEM';
    if (activeFilter === 'CRITICAL') return n.severity === 'CRITICAL';
    if (activeFilter === 'UNREAD') return !n.read;
    return true;
  });

  const userAlertsCount = notifications.filter(n => n.category === 'USER_SYSTEM').length;
  const criticalCount = notifications.filter(n => n.severity === 'CRITICAL').length;

  const handleNotificationClick = (notif: SystemNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.incidentId) {
      const inc = incidents.find(i => i.id === notif.incidentId);
      if (inc) {
        setSelectedIncident(inc);
        setActiveTab('analysis');
        onClose();
        return;
      }
    }
    if (notif.category === 'USER_SYSTEM') {
      setActiveTab('users');
      onClose();
      return;
    }
    setActiveTab('alerts');
    onClose();
  };

  const handleRestrict = (e: React.MouseEvent, targetUser: string, notifId: string) => {
    e.stopPropagation();
    markNotificationAsRead(notifId);
    restrictUser(targetUser.split('@')[0]);
  };

  return (
    <div 
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 sm:w-[420px] max-w-[94vw] bg-[#090f26] border border-[#1a2652] rounded-2xl shadow-2xl z-50 overflow-hidden font-sans select-none flex flex-col max-h-[580px]"
    >
      {/* 1. Header Toolbar */}
      <div className="p-3.5 border-b border-[#16234b] bg-gradient-to-r from-[#0d1536] via-[#0b122e] to-[#090f26] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
              <span>Security Notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px] font-mono font-bold">
                  {unreadNotificationsCount} new
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Live user anomalies & threat alerts
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Sound Toggle */}
          <button
            onClick={() => setNotificationSoundEnabled(!notificationSoundEnabled)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              notificationSoundEnabled 
                ? 'bg-blue-600/20 text-cyan-300 border-blue-500/30 hover:bg-blue-600/30' 
                : 'bg-[#0f1738] text-slate-500 border-slate-700/50 hover:text-slate-300'
            }`}
            title={notificationSoundEnabled ? "Alert Sound: ON" : "Alert Sound: MUTED"}
          >
            {notificationSoundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>
          {/* Mark all read */}
          {unreadNotificationsCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="p-1.5 rounded-lg bg-[#0f1738] hover:bg-[#162354] text-slate-400 hover:text-slate-200 border border-[#1b2552] transition-colors"
              title="Mark all as read"
            >
              <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          )}
          {/* Clear all */}
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="p-1.5 rounded-lg bg-[#0f1738] hover:bg-[#162354] text-slate-400 hover:text-rose-400 border border-[#1b2552] transition-colors"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#162354] text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Filter Pills */}
      <div className="px-3 py-2 bg-[#060b1c] border-b border-[#141f45] flex items-center gap-1.5 text-xs overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveFilter('ALL')}
          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
            activeFilter === 'ALL'
              ? 'bg-blue-600 text-white font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#10193d]'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setActiveFilter('USER_SYSTEM')}
          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all flex items-center gap-1 ${
            activeFilter === 'USER_SYSTEM'
              ? 'bg-amber-600 text-white font-semibold shadow-sm'
              : 'text-amber-300/80 hover:text-amber-200 hover:bg-[#10193d]'
          }`}
        >
          <User className="w-3 h-3 text-amber-400" />
          <span>User System ({userAlertsCount})</span>
        </button>
        <button
          onClick={() => setActiveFilter('CRITICAL')}
          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
            activeFilter === 'CRITICAL'
              ? 'bg-rose-600 text-white font-semibold shadow-sm'
              : 'text-rose-400 hover:text-rose-200 hover:bg-[#10193d]'
          }`}
        >
          Critical ({criticalCount})
        </button>
        <button
          onClick={() => setActiveFilter('UNREAD')}
          className={`px-2.5 py-1 rounded-lg text-[10.5px] font-medium transition-all ${
            activeFilter === 'UNREAD'
              ? 'bg-cyan-600 text-white font-semibold shadow-sm'
              : 'text-cyan-400 hover:text-cyan-200 hover:bg-[#10193d]'
          }`}
        >
          Unread ({unreadNotificationsCount})
        </button>
      </div>

      {/* 3. Notifications Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#131d42] p-1.5 space-y-1">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-4 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-xs text-slate-300 font-medium">All caught up!</p>
            <p className="text-[11px] text-slate-500 font-mono">
              No notifications matching the selected filter.
            </p>
          </div>
        ) : (
          filteredNotifications.map((notif, idx) => {
            const isUserSystem = notif.category === 'USER_SYSTEM';
            return (
              <div
                key={`${notif.id}-${idx}`}
                onClick={() => handleNotificationClick(notif)}
                className={`p-3 rounded-xl cursor-pointer transition-all flex flex-col gap-1.5 relative group ${
                  notif.read 
                    ? 'bg-[#0a1028]/60 hover:bg-[#11193f]/80 text-slate-300' 
                    : 'bg-[#0f173b] hover:bg-[#15204f] text-slate-100 border border-blue-500/25 shadow-md'
                }`}
              >
                {/* Top Row */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] shrink-0" />
                    )}
                    <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      isUserSystem 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : notif.category === 'NETWORK'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    }`}>
                      {notif.category.replace('_', ' ')}
                    </span>
                    {notif.targetUser && (
                      <span className="text-[10px] font-mono text-cyan-300 flex items-center gap-1 bg-[#141f48] px-1.5 py-0.2 rounded border border-[#21306b]">
                        <User className="w-2.5 h-2.5 text-cyan-400" />
                        <span className="truncate max-w-[130px]">{notif.targetUser}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <SeverityBadge severity={notif.severity} size="sm" />
                    <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                  </div>
                </div>

                {/* Title & Body */}
                <div>
                  <h4 className="text-xs font-semibold text-white leading-tight">
                    {notif.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 leading-relaxed font-sans mt-0.5">
                    {notif.message}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 text-[10.5px]">
                  <div className="flex items-center gap-1.5">
                    {notif.sourceIp && (
                      <span className="text-slate-500 font-mono text-[10px]">
                        IP: {notif.sourceIp}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isUserSystem && notif.targetUser && (
                      <button
                        onClick={(e) => handleRestrict(e, notif.targetUser!, notif.id)}
                        className="px-2 py-0.5 rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 flex items-center gap-1 transition-colors font-medium"
                        title="Immediately terminate user sessions and enforce hardware MFA"
                      >
                        <Lock className="w-3 h-3 text-rose-400" />
                        <span>Restrict User</span>
                      </button>
                    )}
                    <span className="text-blue-400 hover:text-cyan-300 font-medium flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      <span>Investigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Bottom Footer Toolbar */}
      <div className="p-2.5 bg-[#070b1e] border-t border-[#16234b] flex items-center justify-between gap-2 text-xs">
        <button
          onClick={() => triggerAttackScenario('CREDENTIAL_SPRAY')}
          className="px-2.5 py-1 rounded-lg bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors font-medium text-[11px]"
          title="Inject a real-time credential spray alert notification against the user system"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Simulate User Alert</span>
        </button>
        <button
          onClick={() => {
            setActiveTab('alerts');
            onClose();
          }}
          className="text-cyan-400 hover:text-cyan-300 font-medium text-[11px] flex items-center gap-1"
        >
          <span>View All System Alerts</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
