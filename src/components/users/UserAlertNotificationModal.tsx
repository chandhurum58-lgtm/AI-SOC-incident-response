import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Send, 
  ShieldAlert, 
  User, 
  Zap, 
  CheckCircle2, 
  Globe2, 
  Radio, 
  Sparkles 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { Severity } from '../../types/soc';

interface UserAlertNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetUser?: string;
}

interface AlertTemplate {
  id: string;
  name: string;
  severity: Severity;
  title: string;
  message: string;
}

const ALERT_TEMPLATES: AlertTemplate[] = [
  {
    id: 'mfa_challenge',
    name: 'Hardware FIDO2 MFA Step-Up Challenge',
    severity: 'CRITICAL',
    title: '🚨 Mandatory Security Challenge: Hardware MFA Verification Required',
    message: 'Anomalous session behavior detected. All active access tokens suspended pending hardware FIDO2 / WebAuthn key biometric verification.'
  },
  {
    id: 'impossible_travel',
    name: 'Impossible Geolocation Travel Velocity',
    severity: 'CRITICAL',
    title: '🚨 Critical Geolocation Velocity Warning',
    message: 'Concurrent logins detected within 4 minutes across divergent geographic regions (New York, USA and Frankfurt, Germany). Active tokens invalidated.'
  },
  {
    id: 'credential_spray',
    name: 'Password Spray / Brute-Force Alert',
    severity: 'HIGH',
    title: '⚠️ Identity Security Warning: High-Frequency Auth Surge',
    message: '90+ failed authentication requests recorded against your corporate SSO account from foreign proxy ASN. Account placed in heightened monitoring.'
  },
  {
    id: 'token_reuse',
    name: 'Suspicious OAuth Token Presentation',
    severity: 'HIGH',
    title: '⚠️ Access Token Anomaly Detected',
    message: 'Bearer token presented from an unmanaged device without required client device certificate. Verification required within 15 minutes.'
  },
  {
    id: 'data_download',
    name: 'Unusual Bulk Data Export / Download',
    severity: 'MEDIUM',
    title: '⚠️ DLP Alert: High-Volume Data Export Notice',
    message: 'Unusual volume of customer records exported outside business hours. Security operations team notified for authorization verification.'
  }
];

export const UserAlertNotificationModal: React.FC<UserAlertNotificationModalProps> = ({
  isOpen,
  onClose,
  initialTargetUser
}) => {
  const { riskyUsers, addNotification } = useSoc();

  const [selectedUserEmail, setSelectedUserEmail] = useState<string>(
    initialTargetUser || (riskyUsers[0]?.username ? `${riskyUsers[0].username}@enterprise.com` : 'alex.vance@enterprise.com')
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>(ALERT_TEMPLATES[0].id);
  const [title, setTitle] = useState<string>(ALERT_TEMPLATES[0].title);
  const [message, setMessage] = useState<string>(ALERT_TEMPLATES[0].message);
  const [severity, setSeverity] = useState<Severity>(ALERT_TEMPLATES[0].severity);
  const [sourceIp, setSourceIp] = useState<string>('198.51.100.42');
  const [requireAction, setRequireAction] = useState<boolean>(true);
  const [dispatchedSuccess, setDispatchedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const tmpl = ALERT_TEMPLATES.find(t => t.id === templateId);
    if (tmpl) {
      setTitle(tmpl.title);
      setMessage(tmpl.message);
      setSeverity(tmpl.severity);
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    addNotification({
      title,
      message,
      severity,
      category: 'USER_SYSTEM',
      targetUser: selectedUserEmail,
      sourceIp: sourceIp.trim() || undefined,
      actionRequired: requireAction
    });

    setDispatchedSuccess(true);
    setTimeout(() => {
      setDispatchedSuccess(false);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#090f26] border border-[#1b2a5e] rounded-2xl shadow-2xl overflow-hidden font-sans select-none flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#16234f] bg-gradient-to-r from-[#0d163d] via-[#0b122e] to-[#090f26] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>Dispatch Alert Notification to User System</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  Live Dispatch
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                Transmit instant security warning banner & audio chime to identity endpoint
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleDispatch} className="p-5 overflow-y-auto space-y-4">
          {/* Target Identity Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Identity / User Account:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="bg-[#0b122b] border border-[#1d2b5c] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
              >
                {riskyUsers.map((u) => (
                  <option key={u.id} value={`${u.username}@enterprise.com`}>
                    {u.displayName} ({u.username}@enterprise.com) • Risk {u.riskScore}
                  </option>
                ))}
                <option value="devops-lead@enterprise.com">devops-lead@enterprise.com (Core DevOps)</option>
                <option value="security-admin@enterprise.com">security-admin@enterprise.com (SecOps)</option>
              </select>
              <input
                type="text"
                placeholder="Target email (e.g. user@enterprise.com)"
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="bg-[#0b122b] border border-[#1d2b5c] rounded-xl px-3 py-2 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>
          </div>

          {/* Quick Preset Templates */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Choose Alert Preset Template:</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {ALERT_TEMPLATES.map((tmpl) => (
                <button
                  type="button"
                  key={tmpl.id}
                  onClick={() => handleTemplateChange(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    selectedTemplate === tmpl.id
                      ? 'bg-blue-600/20 border-cyan-400 text-white shadow-sm ring-1 ring-cyan-400/40'
                      : 'bg-[#0b122b] border-[#182650] text-slate-300 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-[11.5px] truncate">{tmpl.name}</span>
                    <span className={`text-[9.5px] font-mono px-1.5 py-0.2 rounded font-bold ${
                      tmpl.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                      tmpl.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {tmpl.severity}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate font-mono">
                    {tmpl.title}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Severity & Origin IP */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Alert Severity Level:
              </label>
              <div className="flex items-center gap-1.5">
                {(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO'] as Severity[]).map((lvl) => (
                  <button
                    type="button"
                    key={lvl}
                    onClick={() => setSeverity(lvl)}
                    className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-mono font-bold transition-all ${
                      severity === lvl
                        ? lvl === 'CRITICAL'
                          ? 'bg-rose-600 text-white shadow-md'
                          : lvl === 'HIGH'
                          ? 'bg-amber-600 text-white shadow-md'
                          : 'bg-blue-600 text-white shadow-md'
                        : 'bg-[#0d1538] text-slate-400 border border-[#192754] hover:text-slate-200'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Suspected Anomaly IP:</span>
              </label>
              <input
                type="text"
                value={sourceIp}
                onChange={(e) => setSourceIp(e.target.value)}
                placeholder="e.g. 198.51.100.42"
                className="w-full bg-[#0b122b] border border-[#1d2b5c] rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400 transition-colors"
              />
            </div>
          </div>

          {/* Title and Message */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notification Headline:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0b122b] border border-[#1d2b5c] rounded-xl px-3 py-2 text-xs text-white font-sans focus:outline-none focus:border-cyan-400 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Notification Message Body:
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-[#0b122b] border border-[#1d2b5c] rounded-xl px-3 py-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-cyan-400 transition-colors leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Options: Action Required */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#0b122b] border border-[#16224c]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Immediate User Action Required</span>
                <span className="text-[10.5px] text-slate-400 block font-mono">Forces user response confirmation in client portal</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={requireAction}
              onChange={(e) => setRequireAction(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Live Notification Preview */}
          <div className="p-3 rounded-xl bg-[#070b1a] border border-[#192652] space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Live Alert Banner Preview for {selectedUserEmail}</span>
            </span>
            <div className="p-3 rounded-lg bg-[#0d163d] border border-blue-500/40 text-xs">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-white text-xs">{title}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {severity}
                </span>
              </div>
              <p className="text-[11px] text-slate-300">{message}</p>
              <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Target: {selectedUserEmail}</span>
                <span>IP: {sourceIp}</span>
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-[#141f48]">
            <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Synthesizes Web Audio alert chime on trigger</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-xl text-xs text-slate-300 hover:bg-[#141e42] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={dispatchedSuccess}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-500/25 transition-all disabled:opacity-50"
              >
                {dispatchedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-bounce" />
                    <span>Dispatched Successfully!</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Dispatch Alert Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
