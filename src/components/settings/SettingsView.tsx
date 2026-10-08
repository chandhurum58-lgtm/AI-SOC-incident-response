import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  CheckCircle2 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const SettingsView: React.FC = () => {
  const { isLiveFeedActive, setIsLiveFeedActive } = useSoc();
  const [savedNotification, setSavedNotification] = useState(false);
  const [rpsThreshold, setRpsThreshold] = useState('8000');
  const [failedLoginLimit, setFailedLoginLimit] = useState('5');
  const [edrAutoQuarantine, setEdrAutoQuarantine] = useState(false);
  const [mfaChallengeOffHours, setMfaChallengeOffHours] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="p-4 space-y-4 max-w-[1400px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              SOC Command Center & Rule Settings
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Detection threshold calibration, EDR response automation controls, and SIEM forwarder rules.
          </p>
        </div>
        {savedNotification && (
          <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Settings saved successfully.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
        {/* Detection Thresholds */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            Heuristic Anomaly Alert Thresholds
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Layer-7 RPS Spike Threshold (Requests/sec)
              </label>
              <input
                type="number"
                value={rpsThreshold}
                onChange={(e) => setRpsThreshold(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Generates a CRITICAL alert if cluster ingress exceeds this rate.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Failed Login Attempts Before UEBA Escalation
              </label>
              <input
                type="number"
                value={failedLoginLimit}
                onChange={(e) => setFailedLoginLimit(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-sky-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Flags identity as Risky User upon consecutive failures within 5 minutes.
              </span>
            </div>
          </div>
        </div>

        {/* Automated Defensive Response Policies */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            Automated Defensive Response Controls
          </h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={edrAutoQuarantine}
                onChange={(e) => setEdrAutoQuarantine(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-sky-500"
              />
              <div>
                <span className="text-slate-200 font-medium block">
                  Automated Host Quarantine for Critical Port Sweeps
                </span>
                <span className="text-[11px] text-slate-400 block">
                  When enabled, EDR will sever network sockets immediately without waiting for human approval.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mfaChallengeOffHours}
                onChange={(e) => setMfaChallengeOffHours(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 bg-slate-950 text-sky-500"
              />
              <div>
                <span className="text-slate-200 font-medium block">
                  Mandate Step-Up FIDO2 MFA for Off-Hours Authentications
                </span>
                <span className="text-[11px] text-slate-400 block">
                  Enforces secondary biometric/hardware confirmation for logins outside 07:00-20:00 employee local time.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Real-time Telemetry Ingestion */}
        <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <h3 className="text-xs font-semibold text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-2">
            Telemetry Feed Engine
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-slate-200 font-medium block">Live Event Stream Simulator</span>
              <span className="text-[11px] text-slate-400 block">
                Injects simulated background events and sensor metrics in real time.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsLiveFeedActive(!isLiveFeedActive)}
              className={`px-3 py-1.5 rounded text-xs font-medium font-mono transition-colors ${
                isLiveFeedActive ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {isLiveFeedActive ? 'Feed Active' : 'Feed Paused'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Configuration</span>
        </button>
      </form>
    </div>
  );
};
