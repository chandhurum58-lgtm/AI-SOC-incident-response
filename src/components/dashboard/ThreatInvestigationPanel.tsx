import React, { useState } from 'react';
import { 
  Crosshair, 
  X, 
  Copy, 
  Check, 
  MapPin, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  Lock, 
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Server,
  Globe2,
  AlertTriangle,
  RotateCcw,
  Zap,
  TrendingDown,
  Activity,
  ChevronRight,
  ShieldX
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { GlobalThreatPoint } from '../../types/soc';

interface ThreatInvestigationPanelProps {
  threat: GlobalThreatPoint;
  onClose?: () => void;
}

export const ThreatInvestigationPanel: React.FC<ThreatInvestigationPanelProps> = ({
  threat,
  onClose
}) => {
  const { 
    setActiveTab, 
    setInvestigatedIp, 
    triggerAttackScenario, 
    setIsCopilotOpen 
  } = useSoc();

  const [copied, setCopied] = useState(false);
  const [simulationState, setSimulationState] = useState<'IDLE' | 'SIMULATING' | 'SIMULATED'>('IDLE');
  const [containmentStatus, setContainmentStatus] = useState<'ACTIVE' | 'CONTAINING' | 'CONTAINED'>('ACTIVE');
  const [verificationPassed, setVerificationPassed] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard?.writeText(threat.sourceIp || threat.ip || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulation = () => {
    setSimulationState('SIMULATING');
    setTimeout(() => {
      setSimulationState('SIMULATED');
    }, 900);
  };

  const handleApplyContainment = () => {
    setContainmentStatus('CONTAINING');
    setTimeout(() => {
      setContainmentStatus('CONTAINED');
      setVerificationPassed(true);
    }, 1200);
  };

  const sevColor = 
    threat.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
    threat.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
    threat.severity === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
    'bg-sky-500/20 text-sky-300 border-sky-500/40';

  const sourceIp = threat.sourceIp || threat.ip || '103.77.12.5';
  const city = threat.sourceCity || threat.city || 'Singapore';
  const country = threat.sourceCountry || threat.country || 'Singapore';
  const attackCategory = threat.attackCategory || threat.attackType || 'Credential Theft';

  return (
    <div className="bg-[#070b1c] border border-[#162244] rounded-2xl p-4 flex flex-col justify-between h-full space-y-3.5 shadow-2xl font-sans text-xs">
      {/* 1. Header with Live Status & Controls */}
      <div className="flex items-center justify-between border-b border-[#141e3d] pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
            <Crosshair className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide flex items-center gap-1.5">
              <span>AI Threat Investigation</span>
              {containmentStatus === 'CONTAINED' && (
                <span className="text-[9.5px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
                  CONTAINED
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Dynamic Real-Time Forensics & Response
            </p>
          </div>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-[#141f42] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Scrollable Forensic Dossier */}
      <div className="space-y-3.5 overflow-y-auto flex-1 min-h-0 pr-1.5 select-text">
        {/* SECTION 1: SOURCE ORIGIN & GEOLOCATION */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Source Geolocation & ASN
            </span>
            <span className="text-[10px] font-mono text-cyan-400">
              {threat.attributionConfidence || 'HIGH'} Confidence
            </span>
          </div>

          {/* Source IP Banner */}
          <div className="p-2.5 rounded-xl bg-[#0a1028] border border-[#18264e] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="font-mono text-sm font-bold text-white tracking-tight">
                {sourceIp}
              </span>
              <button 
                onClick={handleCopyIp}
                className="p-1 text-slate-400 hover:text-white transition-colors rounded hover:bg-[#141f42]"
                title="Copy IP"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${sevColor}`}>
              {threat.severity}
            </span>
          </div>

          {/* Origin Attributes */}
          <div className="p-2.5 rounded-xl bg-[#0a1028] border border-[#18264e] space-y-1.5 font-mono text-[11px]">
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400 font-sans">Origin:</span>
              <span className="text-slate-200">{city}, {country}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400 font-sans">ASN / Provider:</span>
              <span className="text-slate-200 truncate max-w-[190px]">{threat.asn || 'Amazon Technologies Inc.'}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400 font-sans">ISP Network:</span>
              <span className="text-slate-200 truncate max-w-[190px]">{threat.isp || 'Commercial Transit Node'}</span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-slate-400 font-sans">Abuse Reputation:</span>
              <span className="text-rose-400 font-bold">{threat.reputation || 87} / 100 (Malicious)</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ATTACK TARGET & VECTOR */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Server className="w-3.5 h-3.5 text-cyan-400" />
              Targeted Asset & Vector
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Port {threat.port || 443} • {threat.protocol || 'HTTPS'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#0a1028] border border-[#18264e] space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Attack Type:</span>
              <span className="font-semibold text-white font-mono bg-blue-950/60 px-2 py-0.5 rounded border border-blue-800/40">
                {attackCategory}
              </span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Target Server:</span>
              <span className="text-cyan-300 font-mono font-medium">{threat.targetAsset}</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Affected Website:</span>
              <span className="text-slate-200 font-mono">auth.example.com</span>
            </div>
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-slate-400">Payload Volume:</span>
              <span className="text-amber-400 font-mono">{threat.eventsCount || 428} Events logged</span>
            </div>
          </div>
        </div>

        {/* SECTION 3: WHAT HAPPENED BEFORE THE ATTACK? */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span>What happened before the attack?</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0a1028] border border-[#18264e] space-y-1.5 text-[10.5px]">
            <div className="flex items-start gap-2">
              <span className="text-slate-500 font-mono shrink-0">14:23:17</span>
              <span className="text-slate-300">TCP SYN sweep on edge router ports 80/443.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-slate-500 font-mono shrink-0">14:48:02</span>
              <span className="text-slate-300">14 failed authentication attempts with varying user-agents.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-mono shrink-0">15:12:43</span>
              <span className="text-amber-200 font-medium">Successful OAuth token request followed by administrative API probe.</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: WHAT COULD HAPPEN NEXT? */}
        <div className="space-y-1.5">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1 text-purple-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              What could happen next? (AI Forecast)
            </span>
            <span className="text-[10px] font-mono text-purple-400">92% Probable</span>
          </div>
          <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 text-[11px] leading-relaxed">
            {threat.potentialNextStep || 'Adversary will attempt lateral SMB propagation to production database cluster within next 15-30 minutes.'}
          </div>
        </div>

        {/* SECTION 5: AI DEFENSE RECOMMENDATION */}
        <div className="space-y-2">
          <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1 text-cyan-300">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              AI Defense Recommendation
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">0% Collateral Downtime</span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#0a1028] border border-[#18264e] space-y-2">
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {threat.aiExplanation || 'Deploy perimeter WAF rule dropping IP subnet, terminate active OAuth refresh token, and mandate FIDO2 hardware challenge.'}
            </p>

            {simulationState === 'SIMULATED' && (
              <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[10.5px] space-y-1 font-mono">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span>Simulation Results:</span>
                  <span>PASSED (Safe to Apply)</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Threat Reduction:</span>
                  <span className="text-emerald-400 font-bold">-96.4%</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>False Positive Risk:</span>
                  <span className="text-emerald-400 font-bold">0.0%</span>
                </div>
              </div>
            )}

            {verificationPassed && (
              <div className="p-2 rounded-lg bg-blue-950/30 border border-blue-500/30 text-[10.5px] font-mono flex items-center gap-2 text-cyan-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Verification Complete: 0 active unauthorized sessions detected. Edge rules in effect.</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleRunSimulation}
                disabled={simulationState === 'SIMULATING'}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#121c42] hover:bg-[#1a2960] text-cyan-300 border border-cyan-500/30 font-medium transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>{simulationState === 'SIMULATING' ? 'Simulating...' : 'Simulate Defense'}</span>
              </button>
              <button
                onClick={handleApplyContainment}
                disabled={containmentStatus !== 'ACTIVE'}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-medium transition-all ${
                  containmentStatus === 'CONTAINED'
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 cursor-default'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                }`}
              >
                {containmentStatus === 'CONTAINED' ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Contained</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>{containmentStatus === 'CONTAINING' ? 'Applying...' : 'Apply Defense'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Investigation Navigation Links */}
      <div className="border-t border-[#141e3d] pt-2 space-y-1">
        <button
          onClick={() => {
            setInvestigatedIp(sourceIp);
            setActiveTab('analysis');
          }}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#0a1028] hover:bg-[#111a40] text-slate-300 hover:text-white transition-colors border border-[#16234b]"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Open Deep Forensic Analysis</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          onClick={() => setActiveTab('attackpath')}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-[#0a1028] hover:bg-[#111a40] text-slate-300 hover:text-white transition-colors border border-[#16234b]"
        >
          <span className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Full Attack Path Kill-Chain</span>
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          onClick={() => setIsCopilotOpen(true)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-900/20 hover:bg-blue-900/30 text-cyan-300 transition-colors border border-blue-500/30"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ask AI Copilot About This Threat</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>
    </div>
  );
};
