import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Search, 
  Bell, 
  ChevronDown, 
  User, 
  Clock, 
  Layers,
  Menu
} from 'lucide-react';
import { useSoc, ActiveTab } from '../../context/SocContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    unreadNotificationsCount,
    isNotificationDropdownOpen,
    setIsNotificationDropdownOpen,
    setIsSearchModalOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useSoc();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState<string>('');

  // Live real-time clock ticking every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const utcString = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
      setCurrentDateTime(utcString);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: ActiveTab; label: string; isSpecial?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Summary' },
    { id: 'alerts', label: 'Alert' },
    { id: 'incidents', label: 'Activities' },
    { id: 'threatintel', label: 'Data' },
    { id: 'settings', label: 'Settings' }
  ];

  const isTabActive = (tabId: ActiveTab) => {
    if (tabId === 'dashboard') {
      return activeTab === 'dashboard' || activeTab === 'overview' || activeTab === 'livemap' || activeTab === 'threatmap';
    }
    return activeTab === tabId;
  };

  return (
    <header className="h-14 bg-[#070b1e] border-b border-[#141e42] px-3 sm:px-5 flex items-center justify-between sticky top-0 z-40 select-none shadow-md font-sans">
      {/* Left: Sidebar Toggle + SentraIQ Brand Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121a3e] transition-colors"
          title={isSidebarCollapsed ? "Expand Advanced SOC Sidebar" : "Collapse Sidebar"}
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* SentraIQ Logo Brand matching reference screenshot */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#070b1e] rounded-[6px] flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          </div>
          <span className="text-base font-bold text-white tracking-wide font-sans">
            Sentra<span className="text-cyan-400">IQ</span>
          </span>
        </div>
      </div>

      {/* Center: Top Navigation Tabs matching reference screenshot */}
      <nav className="hidden md:flex items-center gap-1 sm:gap-2">
        {navItems.map((item) => {
          const active = isTabActive(item.id);
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs transition-all relative font-medium ${
                active
                  ? 'text-cyan-300 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#0f1738]'
              } ${item.isSpecial ? 'flex items-center gap-1.5 text-cyan-400' : ''}`}
            >
              {item.isSpecial && <Layers className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />}
              <span>{item.label}</span>
              {active && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-400 rounded-full shadow-[0_0_8px_#22d3ee]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Right Controls: Search, Live Status, Notification Bell, Admin Profile */}
      <div className="flex items-center gap-2.5">
        {/* Quick Search */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#121a3e] transition-colors"
          title="Search (⌘K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* System Status: ● LIVE */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0a112c] border border-[#172550] text-[10.5px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>LIVE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 text-[10px] tabular-nums font-medium">
            {currentDateTime.split(' ')[1] || '10:05 PM'}
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
            className={`relative p-1.5 rounded-lg transition-all ${
              isNotificationDropdownOpen
                ? 'bg-blue-600/20 text-cyan-300'
                : 'text-slate-400 hover:text-white hover:bg-[#121a3e]'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <NotificationDropdown 
            isOpen={isNotificationDropdownOpen} 
            onClose={() => setIsNotificationDropdownOpen(false)} 
          />
        </div>

        {/* User Profile Avatar with Admin Dropdown matching reference screenshot */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg hover:bg-[#121a3e] text-xs transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-[10px] font-bold shadow-sm">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-slate-200 font-medium text-xs hidden sm:inline">Admin</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#0a102a] border border-[#1b2756] shadow-2xl rounded-xl p-1.5 z-50 text-xs">
              <div className="px-2.5 py-1.5 border-b border-[#162148]">
                <div className="font-semibold text-white">Administrator</div>
                <div className="text-[10px] text-slate-400">admin@sentraiq.security</div>
              </div>
              <button
                onClick={() => { setActiveTab('dashboard'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[#121b44] text-slate-200 rounded-lg transition-colors mt-1"
              >
                Threat Dashboard
              </button>
              <button
                onClick={() => { setActiveTab('livemap'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[#121b44] text-cyan-300 rounded-lg transition-colors"
              >
                3D Live Security Map
              </button>
              <button
                onClick={() => { setActiveTab('settings'); setProfileDropdownOpen(false); }}
                className="w-full text-left px-2.5 py-1.5 hover:bg-[#121b44] text-slate-200 rounded-lg transition-colors"
              >
                Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
