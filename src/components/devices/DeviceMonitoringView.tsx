import React, { useState } from 'react';
import { 
  Laptop, 
  Lock, 
  Zap 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { MonitoredDevice } from '../../types/soc';

export const DeviceMonitoringView: React.FC = () => {
  const { devices, isolateDevice, triggerAttackScenario } = useSoc();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<MonitoredDevice>(devices[0]);

  const filteredDevices = devices.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.mac.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="w-5 h-5 text-sky-400" />
            <h1 className="text-base font-semibold text-slate-100">
              Endpoint & Device Hardware Security Monitor
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Continuous EDR telemetry, 802.1X certificate verification, and rogue physical asset detection.
          </p>
        </div>
        {/* Real-time Rogue Simulation Trigger */}
        <button
          onClick={() => triggerAttackScenario('ROGUE_DEVICE')}
          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Simulate Rogue Wi-Fi Device Ingress</span>
        </button>
      </div>

      {/* Main Grid: Device Roster + Forensic Inspection Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Device Table (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-semibold text-slate-200">
              Monitored Endpoints ({devices.length})
            </h3>
            <input
              type="text"
              placeholder="Filter by name, IP, MAC..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 placeholder:text-slate-500 w-48 font-mono"
            />
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 text-[11px]">
                  <th className="pb-2">Device Name</th>
                  <th className="pb-2">IP / MAC</th>
                  <th className="pb-2">User / Segment</th>
                  <th className="pb-2">Risk</th>
                  <th className="pb-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDevices.map((dev) => {
                  const isSelected = selectedDevice.id === dev.id;
                  return (
                    <tr 
                      key={dev.id} 
                      onClick={() => setSelectedDevice(dev)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-slate-800/80' : 'hover:bg-slate-850'
                      }`}
                    >
                      <td className="py-2.5">
                        <span className="text-slate-200 font-bold block">{dev.name}</span>
                        <span className="text-[10px] text-slate-400 font-sans">{dev.os}</span>
                      </td>
                      <td className="py-2.5 text-[11px]">
                        <span className="text-sky-400 block">{dev.ip}</span>
                        <span className="text-slate-400 block text-[10px]">{dev.mac}</span>
                      </td>
                      <td className="py-2.5 text-[11px]">
                        <span className="text-slate-300 block truncate max-w-[140px]">{dev.user}</span>
                        <span className="text-slate-400 block text-[10px] truncate max-w-[140px]">{dev.networkSegment}</span>
                      </td>
                      <td className="py-2.5">
                        <span className={`font-bold tabular-nums ${
                          dev.riskScore > 75 ? 'text-rose-400' : dev.riskScore > 50 ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {dev.riskScore}/100
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          dev.connectionStatus === 'QUARANTINED' 
                            ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                            : dev.connectionStatus === 'UNDER_ANALYSIS'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}>
                          {dev.connectionStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Device Deep Inspector (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="border-b border-slate-800 pb-2 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Device Forensic Profile
                </span>
                <h3 className="text-sm font-semibold text-slate-100 mt-0.5">
                  {selectedDevice.name}
                </h3>
              </div>
              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                selectedDevice.riskScore > 75 ? 'text-rose-400 bg-rose-950/60' : 'text-emerald-400 bg-emerald-950/60'
              }`}>
                Risk: {selectedDevice.riskScore}/100
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block">IP Address</span>
                  <span className="text-sky-400 font-bold">{selectedDevice.ip}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Hardware MAC</span>
                  <span className="text-slate-200">{selectedDevice.mac}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Operating System</span>
                  <span className="text-slate-200">{selectedDevice.os}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block">Network Segment</span>
                  <span className="text-slate-200">{selectedDevice.networkSegment}</span>
                </div>
              </div>

              {/* Open Ports */}
              <div className="p-2.5 rounded bg-slate-950 border border-slate-800/80 space-y-1">
                <span className="text-slate-400 text-[10px] block">Detected Active Open Sockets</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDevice.openPorts.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400 text-[11px]">
                      Port {p}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Assessment */}
              <div className="p-3 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
                <span className="text-slate-400 text-[10px] font-semibold block">
                  AI Behavioral Assessment
                </span>
                <p className="text-slate-200 font-sans text-xs leading-relaxed">
                  {selectedDevice.aiAssessment}
                </p>
              </div>
            </div>
          </div>

          {/* Containment Control Button */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-400">EDR Agent Tunnel: Active</span>
            {selectedDevice.connectionStatus === 'QUARANTINED' ? (
              <span className="px-3 py-1.5 text-xs text-rose-400 font-mono flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Host Quarantined</span>
              </span>
            ) : (
              <button
                onClick={() => isolateDevice(selectedDevice.id)}
                className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Isolate / Quarantine Device</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
