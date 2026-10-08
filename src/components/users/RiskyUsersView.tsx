import React, { useState } from 'react';
import { 
  Users2, 
  Search, 
  Lock, 
  HelpCircle, 
  MapPin, 
  Bell, 
  Send, 
  ShieldCheck, 
  CheckCheck, 
  ArrowRight, 
  Zap, 
  Filter 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { RiskyUser, SystemNotification } from '../../types/soc';
import { SeverityBadge } from '../common/SeverityBadge';
import { UserAlertNotificationModal } from './UserAlertNotificationModal';

export const RiskyUsersView: React.FC = () => {
  const { 
    riskyUsers, 
    restrictUser, 
    setActiveTab, 
    setSelectedIncident, 
    incidents,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    triggerAttackScenario
  } = useSoc();

  const [activeSubTab, setActiveSubTab] = useState<'UEBA' | 'ALERT_NOTIFICATIONS'>('UEBA');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<RiskyUser>(riskyUsers[0]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [modalTargetUser, setModalTargetUser] = useState<string>('');
  const [alertFilter, setAlertFilter] = useState<'ALL' | 'UNREAD' | 'CRITICAL' | 'ACTION_REQUIRED'>('ALL');

  const filteredUsers = riskyUsers.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userSystemNotifications = notifications.filter(n => n.category === 'USER_SYSTEM');
  const unreadUserAlertsCount = userSystemNotifications.filter(n => !n.read).length;
  const filteredUserAlerts = userSystemNotifications.filter(n => {
    if (alertFilter === 'UNREAD') return !n.read;
    if (alertFilter === 'CRITICAL') return n.severity === 'CRITICAL';
    if (alertFilter === 'ACTION_REQUIRED') return n.actionRequired;
    return true;
  });

  const selectedUserAlerts = userSystemNotifications.filter(n => 
    n.targetUser?.toLowerCase().includes(selectedUser.username.toLowerCase())
  );

  const handleOpenAlertModal = (userEmail?: string) => {
    setModalTargetUser(userEmail || `${selectedUser.username}@enterprise.com`);
    setIsAlertModalOpen(true);
  };

  const handleInvestigateAlert = (notif: SystemNotification) => {
    markNotificationAsRead(notif.id);
    if (notif.incidentId) {
      const inc = incidents.find(i => i.id === notif.incidentId);
      if (inc) {
        setSelectedIncident(inc);
        setActiveTab('analysis');
        return;
      }
    }
    if (notif.targetUser) {
      const match = riskyUsers.find(u => notif.targetUser!.includes(u.username));
      if (match) {
        setSelectedUser(match);
        setActiveSubTab('UEBA');
      }
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto select-none">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Users2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>User System & Behavioral Analytics (UEBA)</span>
                {unreadUserAlertsCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500 text-white font-bold animate-pulse">
                    {unreadUserAlertsCount} Unread Alert{unreadUserAlertsCount > 1 ? 's' : ''}
                  </span>
                )}
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time user anomaly detection, identity attack alerting, and credential risk mitigation.
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls & Disclaimer */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleOpenAlertModal()}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Dispatch User Alert Notification</span>
          </button>

          <button
            onClick={() => triggerAttackScenario('CREDENTIAL_SPRAY')}
            className="px-3.5 py-1.5 rounded-xl bg-[#0f1738] hover:bg-[#162354] text-amber-300 border border-amber-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Simulate incoming credential spray against user authentication"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Simulate User Attack</span>
          </button>

          <div className="hidden sm:flex px-3 py-1.5 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] font-mono items-center gap-1.5">
            <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Risk scores quantify behavioral deviation, not proof of guilt.</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs: 1. Identities & UEBA, 2. User Security Alert Notifications Feed */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2">
        <button
          onClick={() => setActiveSubTab('UEBA')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeSubTab === 'UEBA'
              ? 'bg-blue-600/20 text-cyan-300 border border-blue-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1432]'
          }`}
        >
          <Users2 className="w-4 h-4 text-cyan-400" />
          <span>Flagged Identities & Behavioral Dossiers ({riskyUsers.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('ALERT_NOTIFICATIONS')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all relative ${
            activeSubTab === 'ALERT_NOTIFICATIONS'
              ? 'bg-amber-600/20 text-amber-300 border border-amber-500/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#0c1432]'
          }`}
        >
          <Bell className="w-4 h-4 text-amber-400" />
          <span>User Security Alert Notifications ({userSystemNotifications.length})</span>
          {unreadUserAlertsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
        </button>
      </div>

      {/* SUB-VIEW 1: IDENTITIES & BEHAVIOR ANALYTICS */}
      {activeSubTab === 'UEBA' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left 5 Cols */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-200">Flagged Identities ({riskyUsers.length})</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search identity..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg pl-6 pr-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 w-44 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                />
                <Search className="w-3 h-3 text-slate-500 absolute left-2 top-2" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = selectedUser.id === user.id;
                const userAlertCount = userSystemNotifications.filter(n => n.targetUser?.includes(user.username)).length;
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedUser(user)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-cyan-400/80 bg-blue-950/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] ring-1 ring-cyan-400/40' 
                        : 'border-slate-800/80 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">{user.displayName}</span>
                          <span className="text-[11px] font-mono text-cyan-300">({user.username})</span>
                          {userAlertCount > 0 && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                              {userAlertCount} alert{userAlertCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 block mt-0.5">{user.role} • {user.department}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-rose-400 tabular-nums">
                          {user.riskScore}/100
                        </span>
                        <div className="flex items-center justify-end gap-1 text-[10px] font-mono mt-0.5">
                          {user.riskTrend === 'INCREASING' ? (
                            <span className="text-rose-400 flex items-center">↑ Rising</span>
                          ) : user.riskTrend === 'DECREASING' ? (
                            <span className="text-emerald-400 flex items-center">↓ Falling</span>
                          ) : (
                            <span className="text-slate-400">→ Stable</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 7 Cols */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-bold text-white">{selectedUser.displayName}</h2>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    selectedUser.status === 'RESTRICTED' 
                      ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                      : selectedUser.status === 'MONITORED'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {selectedUser.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedUser.username}@enterprise.com • {selectedUser.department} ({selectedUser.role})
                </p>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block">UEBA Risk Score</span>
                <span className="text-2xl font-bold text-rose-400 tabular-nums">{selectedUser.riskScore}/100</span>
              </div>
            </div>

            {/* Baseline Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-400 text-[10px] block">Login Frequency</span>
                <span className="text-slate-200 tabular-nums">{selectedUser.loginFrequencyDaily} daily logins</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Failed Attempts</span>
                <span className="text-rose-400 font-bold tabular-nums">{selectedUser.failedLoginAttempts} attempts</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Unusual Login Time</span>
                <span className="text-amber-300 text-[11px] truncate block">{selectedUser.unusualLoginTime}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Device Changes</span>
                <span className="text-slate-200 tabular-nums">{selectedUser.deviceChangesCount} new devices</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span className="text-slate-400">Geolocation Anomaly:</span>
                <span className="text-slate-200">{selectedUser.unusualLocation}</span>
              </div>
              <span className="text-[11px] text-amber-400">VPN / Foreign IP Detected</span>
            </div>

            {/* User Security Alert History */}
            <div className="space-y-2 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-bold text-white">
                    Dispatched Alert Notifications for {selectedUser.displayName} ({selectedUserAlerts.length})
                  </span>
                </div>
                <button
                  onClick={() => handleOpenAlertModal(`${selectedUser.username}@enterprise.com`)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Alert Now</span>
                </button>
              </div>

              {selectedUserAlerts.length === 0 ? (
                <p className="text-[11px] text-slate-500 font-mono py-1">
                  No active security alert notifications dispatched to this user.
                </p>
              ) : (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {selectedUserAlerts.map(alert => (
                    <div 
                      key={alert.id}
                      className="p-2 rounded-lg bg-[#0c1432] border border-blue-500/20 text-xs flex items-center justify-between gap-2"
                    >
                      <div className="space-y-0.5 truncate">
                        <div className="flex items-center gap-2">
                          <SeverityBadge severity={alert.severity} size="sm" />
                          <span className="font-semibold text-white truncate">{alert.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 truncate">{alert.message}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 shrink-0">{alert.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suspicious Activities Log */}
            <div className="space-y-1.5 text-xs">
              <span className="font-semibold text-slate-200 block">
                Flagged Behavioral Anomalies
              </span>
              <ul className="space-y-1 text-slate-300 font-sans">
                {selectedUser.suspiciousActivities.map((act, i) => (
                  <li key={i} className="flex items-start gap-1.5 p-1.5 rounded-lg bg-slate-950 border border-slate-800/60">
                    <span className="text-rose-400 shrink-0">•</span>
                    <span>{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Accessed Resources */}
            <div className="space-y-1.5 text-xs font-mono">
              <span className="font-semibold text-slate-200 block">
                Recently Accessed Resources & Scopes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedUser.accessedResources.map((res) => (
                  <span key={res} className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px]">
                    {res}
                  </span>
                ))}
              </div>
            </div>

            {/* Confidence Context */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-[11px] text-slate-400">
              <strong>Analyst Note:</strong> {selectedUser.confidenceNote}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const matchingInc = incidents.find(i => i.title.includes(selectedUser.username) || i.targetAsset.includes(selectedUser.username));
                    if (matchingInc) setSelectedIncident(matchingInc);
                    setActiveTab('analysis');
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                >
                  Investigate Incident →
                </button>
                <button
                  onClick={() => setActiveTab('attackpath')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium transition-colors"
                >
                  View Activity Chain
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenAlertModal(`${selectedUser.username}@enterprise.com`)}
                  className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notify User</span>
                </button>
                <button
                  onClick={() => restrictUser(selectedUser.username)}
                  className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Restrict Sessions / Challenge MFA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: USER SECURITY ALERT NOTIFICATIONS FEED */}
      {activeSubTab === 'ALERT_NOTIFICATIONS' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                <span>Filter Alerts:</span>
              </span>
              {(['ALL', 'UNREAD', 'CRITICAL', 'ACTION_REQUIRED'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => setAlertFilter(flt)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    alertFilter === flt
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {flt === 'ALL' && `All (${userSystemNotifications.length})`}
                  {flt === 'UNREAD' && `Unread (${unreadUserAlertsCount})`}
                  {flt === 'CRITICAL' && `Critical (${userSystemNotifications.filter(n => n.severity === 'CRITICAL').length})`}
                  {flt === 'ACTION_REQUIRED' && `Action Required (${userSystemNotifications.filter(n => n.actionRequired).length})`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {unreadUserAlertsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="px-3 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs flex items-center gap-1.5 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={() => handleOpenAlertModal()}
                className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>New Alert Notification</span>
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {filteredUserAlerts.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 mx-auto flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-200">No User System Alerts</h3>
                <p className="text-xs text-slate-500 font-mono">
                  All user system alerts resolved or matching filter criteria are cleared.
                </p>
              </div>
            ) : (
              filteredUserAlerts.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-xl border transition-all ${
                    notif.read
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-[#0f173d]/90 border-blue-500/30 text-slate-100 shadow-md ring-1 ring-blue-500/20'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        )}
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          USER SYSTEM ALERT
                        </span>
                        <SeverityBadge severity={notif.severity} size="sm" />
                        {notif.targetUser && (
                          <span className="text-[11px] font-mono text-cyan-300 bg-[#141f48] px-2 py-0.5 rounded border border-[#21306b] flex items-center gap-1">
                            <Users2 className="w-3 h-3 text-cyan-400" />
                            <span>{notif.targetUser}</span>
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">{notif.timestamp}</span>
                      </div>

                      <h4 className="text-sm font-bold text-white leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {notif.message}
                      </p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                        {notif.sourceIp && (
                          <span>Source Origin: {notif.sourceIp}</span>
                        )}
                        {notif.incidentId && (
                          <span className="text-cyan-400">Linked Incident: {notif.incidentId}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-1.5 shrink-0 pt-1">
                      {notif.targetUser && (
                        <button
                          onClick={() => {
                            restrictUser(notif.targetUser!.split('@')[0]);
                            markNotificationAsRead(notif.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 text-xs font-medium flex items-center gap-1 transition-colors"
                        >
                          <Lock className="w-3 h-3 text-rose-400" />
                          <span>Restrict User</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleInvestigateAlert(notif)}
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 transition-colors shadow-sm"
                      >
                        <span>Investigate</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      {!notif.read && (
                        <button
                          onClick={() => markNotificationAsRead(notif.id)}
                          className="text-[10px] text-slate-400 hover:text-slate-200 transition-colors pt-1"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Dispatch User Alert Notification */}
      <UserAlertNotificationModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        initialTargetUser={modalTargetUser}
      />
    </div>
  );
};
