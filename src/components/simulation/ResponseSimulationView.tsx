import React from 'react';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingDown 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';

export const ResponseSimulationView: React.FC = () => {
  const { 
    simulation, 
    runSimulationStep, 
    approveSimulationResponse, 
    setActiveTab 
  } = useSoc();

  const isSimulating = simulation.simulationState === 'SIMULATING';
  const isCompleted = simulation.simulationState === 'COMPLETED' || simulation.simulationState === 'DEPLOYED';
  const isDeployed = simulation.simulationState === 'DEPLOYED';

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-purple-400" />
            <h1 className="text-base font-semibold text-slate-100">
              AI Defense Response Simulation Sandbox
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Safely simulate multi-step defensive playbooks against live telemetry before executing disruptive actions in production.
          </p>
        </div>
        {/* State Indicator */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">Status:</span>
          {isDeployed ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              DEPLOYED & VERIFIED
            </span>
          ) : isCompleted ? (
            <span className="text-purple-300 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              SIMULATION READY
            </span>
          ) : (
            <span className="text-amber-400">PENDING SIMULATION</span>
          )}
        </div>
      </div>

      {/* Target Incident & Simulation Meta */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
            Targeted Incident Under Defense
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold font-mono text-sky-400">
              {simulation.incidentId}
            </span>
            <span className="text-xs text-slate-200 font-semibold">
              • {simulation.attackType}
            </span>
          </div>
        </div>

        {/* Main Simulation Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={runSimulationStep}
            disabled={isSimulating}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isSimulating
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 text-white shadow-sm'
            }`}
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isSimulating ? 'Simulating Impact...' : 'Run Simulation'}</span>
          </button>
          <button
            onClick={approveSimulationResponse}
            disabled={!isCompleted || isDeployed}
            className={`px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-colors ${
              !isCompleted || isDeployed
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isDeployed ? 'Approved & Enforced' : 'Approve Response'}</span>
          </button>
          <button
            onClick={() => setActiveTab('incidents')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors"
          >
            Cancel / Return
          </button>
        </div>
      </div>

      {/* Simulation Telemetry Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Before Mitigation Card */}
        <div className="bg-slate-900/90 border border-rose-900/50 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <h3 className="text-xs font-semibold text-rose-300">
                Current State: Before Mitigation (Abnormal Attack Traffic)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-rose-400">UNCONTAINED</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">RPS</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">
                {simulation.telemetryBefore.rps.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Sockets</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">
                {simulation.telemetryBefore.connections.toLocaleString()}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Risk Score</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">
                {simulation.telemetryBefore.riskScore}/100
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Error Rate</span>
              <span className="text-lg font-bold text-rose-400 tabular-nums">
                {simulation.telemetryBefore.errorRate}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Adversary possesses active authentication token and is generating high-cadence probes across auth endpoints.
          </p>
        </div>

        {/* After Simulation Card */}
        <div className="bg-slate-900/90 border border-emerald-900/50 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-2">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-semibold text-emerald-300">
                Simulated Outcome: After Mitigation (Reduced Risk & Normalized Traffic)
              </h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold">
              -{simulation.riskReductionPercentage}% RISK
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">RPS</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {simulation.telemetryAfter.rps}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Sockets</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {simulation.telemetryAfter.connections}
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Risk Score</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {simulation.telemetryAfter.riskScore}/100
              </span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800/80">
              <span className="text-[10px] text-slate-400 block">Error Rate</span>
              <span className="text-lg font-bold text-emerald-400 tabular-nums">
                {simulation.telemetryAfter.errorRate}%
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            Sessions invalidated, rogue source dropped at edge WAF, and database sockets completely protected.
          </p>
        </div>
      </div>

      {/* 6 Step Defensive Playbook */}
      <div className="bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200 border-b border-slate-800 pb-2">
          Defensive Action Steps Execution Plan
        </h3>
        <div className="space-y-2">
          {simulation.steps.map((step) => (
            <div 
              key={step.stepNumber}
              className="p-3 rounded bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded bg-slate-800 text-sky-400 font-mono font-bold flex items-center justify-center shrink-0 text-xs">
                  {step.stepNumber}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-200">{step.title}</span>
                    {step.isDisruptive && (
                      <span className="text-[10px] font-mono text-amber-400">
                        [Disruptive Action: Requires Auth]
                      </span>
                    )}
                  </div>
                  <p className="text-slate-400 text-xs mt-0.5">{step.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                <span className="text-slate-400">Target: {step.target}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] ${
                  step.status === 'VERIFIED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                    : step.status === 'SIMULATED'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                    : 'bg-slate-900 text-slate-400'
                }`}>
                  {step.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Side Effects & Expected Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="p-3.5 rounded bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="font-semibold text-slate-200 block">Expected Result</span>
          <p className="text-slate-300 leading-relaxed font-sans">
            {simulation.expectedResult}
          </p>
          <div className="pt-2 font-mono text-slate-400">
            Affected Assets: <span className="text-slate-200">{simulation.affectedAssets.join(', ')}</span>
          </div>
        </div>
        <div className="p-3.5 rounded bg-slate-900/90 border border-slate-800 space-y-2">
          <span className="font-semibold text-amber-300 block">Possible Side Effects</span>
          <ul className="space-y-1 text-slate-300 font-sans">
            {simulation.possibleSideEffects.map((eff, i) => (
              <li key={i} className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>{eff}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
