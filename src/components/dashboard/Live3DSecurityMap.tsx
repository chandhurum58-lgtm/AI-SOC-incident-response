import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Globe2, 
  MapPin, 
  Compass, 
  Building2, 
  Landmark, 
  ShieldAlert, 
  ShieldCheck, 
  Server, 
  AlertTriangle, 
  Activity, 
  RotateCcw, 
  Plus, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Eye, 
  X, 
  Lock, 
  Zap, 
  Sliders, 
  Radio, 
  Navigation,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  Cpu
} from 'lucide-react';
import { 
  GEO_HIERARCHY, 
  CountryNode, 
  StateNode, 
  DistrictNode, 
  CityNode 
} from '../../data/geoHierarchy';
import { 
  SecurityEntity, 
  SecurityAttackPath, 
  SecurityConnectionPath,
  INITIAL_SECURITY_ENTITIES,
  INITIAL_ATTACK_PATHS,
  INITIAL_CONNECTION_PATHS
} from '../../data/liveSecurityEntities';
import { useSoc } from '../../context/SocContext';

export interface Live3DSecurityMapProps {
  onSelectEntity?: (entity: SecurityEntity) => void;
  selectedEntityId?: string;
  isFullscreen?: boolean;
}

export const Live3DSecurityMap: React.FC<Live3DSecurityMapProps> = ({
  onSelectEntity,
  selectedEntityId,
  isFullscreen = false
}) => {
  const { setActiveTab, setInvestigatedIp, triggerAttackScenario } = useSoc();

  // Location Hierarchy Selection State
  const [selectedCountryId, setSelectedCountryId] = useState<string>('us');
  const [selectedStateId, setSelectedStateId] = useState<string>('us-ny');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('us-ny-manhattan');
  const [selectedCityId, setSelectedCityId] = useState<string>('us-ny-nyc');

  // Camera 3D Transform States: Tilt Pitch, Rotation Yaw, Zoom, and Pan
  const [pitch, setPitch] = useState<number>(42); // 3D Tilt perspective (degrees)
  const [yaw, setYaw] = useState<number>(-12); // 3D Rotation (degrees)
  const [zoom, setZoom] = useState<number>(1.25);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Map Mode and Layer Visual Toggles
  const [mapMode, setMapMode] = useState<'ISOMETRIC_CITY' | 'SATELLITE_RADAR' | 'TERRAIN_GRID'>('ISOMETRIC_CITY');
  const [showAttackPaths, setShowAttackPaths] = useState<boolean>(true);
  const [showProtectedUserPaths, setShowProtectedUserPaths] = useState<boolean>(true);
  const [show3DBuildings, setShow3DBuildings] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);
  const [showRiverAndRoads, setShowRiverAndRoads] = useState<boolean>(true);
  const [internalFullscreen, setInternalFullscreen] = useState<boolean>(isFullscreen);

  // Entities & Paths State
  const [entities, setEntities] = useState<SecurityEntity[]>(INITIAL_SECURITY_ENTITIES);
  const [attackPaths, setAttackPaths] = useState<SecurityAttackPath[]>(INITIAL_ATTACK_PATHS);
  const [connectionPaths] = useState<SecurityConnectionPath[]>(INITIAL_CONNECTION_PATHS);

  // Selected Entity Floating Dossier Card State
  const [activeEntity, setActiveEntity] = useState<SecurityEntity | null>(
    INITIAL_SECURITY_ENTITIES[0]
  );
  const [copiedIp, setCopiedIp] = useState<boolean>(false);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);

  // Resolve current geographic nodes
  const activeCountry = useMemo(() => {
    return GEO_HIERARCHY.find(c => c.id === selectedCountryId) || GEO_HIERARCHY[0];
  }, [selectedCountryId]);

  const activeState = useMemo(() => {
    return activeCountry.states.find(s => s.id === selectedStateId) || activeCountry.states[0] || null;
  }, [activeCountry, selectedStateId]);

  const activeDistrict = useMemo(() => {
    if (!activeState) return null;
    return activeState.districts.find(d => d.id === selectedDistrictId) || activeState.districts[0] || null;
  }, [activeState, selectedDistrictId]);

  const activeCity = useMemo(() => {
    if (!activeDistrict) return null;
    return activeDistrict.cities.find(c => c.id === selectedCityId) || activeDistrict.cities[0] || null;
  }, [activeDistrict, selectedCityId]);

  // Filter entities according to active city/district
  const currentCityEntities = useMemo(() => {
    const cityName = activeCity ? activeCity.name : 'New York City';
    const cityFiltered = entities.filter(e => e.city.toLowerCase() === cityName.toLowerCase());
    return cityFiltered.length > 0 ? cityFiltered : entities.slice(0, 7);
  }, [entities, activeCity]);

  // Handle location hierarchy transitions
  const handleCountryChange = (cId: string) => {
    setSelectedCountryId(cId);
    const country = GEO_HIERARCHY.find(c => c.id === cId);
    if (country && country.states[0]) {
      setSelectedStateId(country.states[0].id);
      if (country.states[0].districts[0]) {
        setSelectedDistrictId(country.states[0].districts[0].id);
        if (country.states[0].districts[0].cities[0]) {
          setSelectedCityId(country.states[0].districts[0].cities[0].id);
        }
      }
    }
    // Subtle camera swoop
    setPan({ x: 0, y: 0 });
    setZoom(1.1);
  };

  const handleStateChange = (stId: string) => {
    setSelectedStateId(stId);
    if (!activeCountry) return;
    const st = activeCountry.states.find(s => s.id === stId);
    if (st && st.districts[0]) {
      setSelectedDistrictId(st.districts[0].id);
      if (st.districts[0].cities[0]) {
        setSelectedCityId(st.districts[0].cities[0].id);
      }
    }
  };

  const handleDistrictChange = (distId: string) => {
    setSelectedDistrictId(distId);
    if (!activeState) return;
    const dist = activeState.districts.find(d => d.id === distId);
    if (dist && dist.cities[0]) {
      setSelectedCityId(dist.cities[0].id);
    }
  };

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(cityId);
    setPan({ x: 0, y: 0 });
    setZoom(1.3);
  };

  // Quick preset jump
  const jumpToCityPreset = (countryId: string, stateId: string, distId: string, cityId: string) => {
    setSelectedCountryId(countryId);
    setSelectedStateId(stateId);
    setSelectedDistrictId(distId);
    setSelectedCityId(cityId);
    setPan({ x: 0, y: 0 });
    setZoom(1.35);
  };

  // Drag pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCopyIp = (ip: string) => {
    navigator.clipboard?.writeText(ip);
    setCopiedIp(true);
    setTimeout(() => setCopiedIp(false), 2000);
  };

  const handleBlockEntity = (entity: SecurityEntity) => {
    setIsBlocked(true);
    setEntities(prev => prev.map(e => e.id === entity.id ? { ...e, status: 'BLOCKED AT EDGE WAF' } : e));
    setAttackPaths(prev => prev.filter(p => p.attackerId !== entity.id));
  };

  // Convert city-relative offsets into 3D plane SVG coordinates (1000 x 600)
  const getEntityCoordinates = (entity: SecurityEntity) => {
    // Relative hash offset
    const hash = entity.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const xBase = 180 + (hash % 640);
    const yBase = 120 + ((hash * 7) % 360);
    return { x: xBase, y: yBase };
  };

  // Fixed 3D City Buildings layout
  const buildings3D = useMemo(() => [
    { id: 'b1', x: 220, y: 160, w: 55, d: 45, h: 95, label: 'DataCenter Core A', type: 'datacenter' },
    { id: 'b2', x: 310, y: 140, w: 70, d: 50, h: 140, label: 'Federal Financial Tower', type: 'hq' },
    { id: 'b3', x: 420, y: 150, w: 60, d: 45, h: 110, label: 'Telecom Central Switch', type: 'infra' },
    { id: 'b4', x: 240, y: 260, w: 50, d: 40, h: 80, label: 'Corp Office Tower 1', type: 'office' },
    { id: 'b5', x: 330, y: 250, w: 65, d: 55, h: 165, label: 'Aegis Security Operations', type: 'soc' },
    { id: 'b6', x: 440, y: 260, w: 55, d: 45, h: 85, label: 'Cloud Gateway Station', type: 'infra' },
    { id: 'b7', x: 540, y: 180, w: 75, d: 50, h: 125, label: 'Metro Exchange Point', type: 'datacenter' },
    { id: 'b8', x: 530, y: 290, w: 60, d: 45, h: 90, label: 'DevOps Campus Node', type: 'office' },
    { id: 'b9', x: 650, y: 220, w: 65, d: 50, h: 105, label: 'Edge Satellite Ingress', type: 'infra' },
    { id: 'b10', x: 740, y: 270, w: 55, d: 40, h: 75, label: 'Public DMZ Edge', type: 'office' },
  ], []);

  return (
    <div className={`relative flex flex-col w-full h-full bg-[#040714] border border-[#162244] rounded-2xl shadow-2xl overflow-hidden font-sans select-none ${
      internalFullscreen ? 'fixed inset-0 z-50 rounded-none border-none' : ''
    }`}>
      {/* 1. TOP TACTICAL CONTROL BAR: Location Hierarchy (Country -> State -> District -> City) */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-[#070b1e] via-[#090f28] to-[#060a1a] border-b border-[#141f45] flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        {/* Left: Location Hierarchy Breadcrumb & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Country Selector */}
          <div className="flex items-center gap-1.5 bg-[#0a112c] border border-[#1e2f60] hover:border-cyan-400/50 rounded-xl px-2.5 py-1 transition-colors">
            <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Country:
            </span>
            <select
              value={selectedCountryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px]"
            >
              {GEO_HIERARCHY.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#090f26] text-white">
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <span className="text-slate-600 text-xs font-mono">→</span>

          {/* State Selector */}
          {activeCountry && (
            <div className="flex items-center gap-1.5 bg-[#0a112c] border border-[#1e2f60] hover:border-blue-400/50 rounded-xl px-2.5 py-1 transition-colors">
              <span className="text-[10px] text-blue-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3 h-3 text-blue-400" />
                State:
              </span>
              <select
                value={selectedStateId}
                onChange={(e) => handleStateChange(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[140px]"
              >
                {activeCountry.states.map((st) => (
                  <option key={st.id} value={st.id} className="bg-[#090f26] text-white">
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <span className="text-slate-600 text-xs font-mono">→</span>

          {/* District Selector */}
          {activeState && (
            <div className="flex items-center gap-1.5 bg-[#0a112c] border border-[#1e2f60] hover:border-teal-400/50 rounded-xl px-2.5 py-1 transition-colors hidden sm:flex">
              <span className="text-[10px] text-teal-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3 h-3 text-teal-400" />
                District:
              </span>
              <select
                value={selectedDistrictId}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px]"
              >
                {activeState.districts.map((dist) => (
                  <option key={dist.id} value={dist.id} className="bg-[#090f26] text-white">
                    {dist.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <span className="text-slate-600 text-xs font-mono hidden sm:inline">→</span>

          {/* City Selector */}
          {activeDistrict && (
            <div className="flex items-center gap-1.5 bg-[#0a112c] border border-[#233876] hover:border-cyan-400 rounded-xl px-2.5 py-1 shadow-inner transition-colors">
              <span className="text-[10px] text-cyan-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-cyan-400" />
                City:
              </span>
              <select
                value={selectedCityId}
                onChange={(e) => handleCityChange(e.target.value)}
                className="bg-transparent text-white text-xs font-bold focus:outline-none cursor-pointer max-w-[160px]"
              >
                {activeDistrict.cities.map((city) => (
                  <option key={city.id} value={city.id} className="bg-[#090f26] text-white">
                    {city.isCapital ? '★ ' : ''}{city.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right: Map Perspective & Visual Layers Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Tabs */}
          <div className="flex items-center bg-[#0a112c] border border-[#1c2a55] rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => { setMapMode('ISOMETRIC_CITY'); setPitch(45); }}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[10.5px] font-medium ${
                mapMode === 'ISOMETRIC_CITY'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              3D City
            </button>
            <button
              onClick={() => { setMapMode('SATELLITE_RADAR'); setPitch(20); }}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[10.5px] font-medium ${
                mapMode === 'SATELLITE_RADAR'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => { setMapMode('TERRAIN_GRID'); setPitch(35); }}
              className={`px-2.5 py-1 rounded-lg transition-colors text-[10.5px] font-medium ${
                mapMode === 'TERRAIN_GRID'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Terrain
            </button>
          </div>

          {/* Quick Attack Arcs Toggle */}
          <button
            onClick={() => setShowAttackPaths(!showAttackPaths)}
            className={`px-2 py-1 rounded-xl border text-[10.5px] font-mono flex items-center gap-1 transition-all ${
              showAttackPaths
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_10px_rgba(244,63,94,0.25)]'
                : 'bg-[#0a112c] text-slate-400 border-[#1c2a55] hover:text-slate-200'
            }`}
            title="Toggle Red Attack Vectors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="hidden sm:inline">Attack Paths</span>
          </button>

          {/* Protected Users Toggle */}
          <button
            onClick={() => setShowProtectedUserPaths(!showProtectedUserPaths)}
            className={`px-2 py-1 rounded-xl border text-[10.5px] font-mono flex items-center gap-1 transition-all ${
              showProtectedUserPaths
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                : 'bg-[#0a112c] text-slate-400 border-[#1c2a55] hover:text-slate-200'
            }`}
            title="Toggle Green Protected User Connections"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="hidden sm:inline">User Tunnels</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={() => setInternalFullscreen(!internalFullscreen)}
            className="p-1.5 rounded-xl bg-[#0a112c] border border-[#1c2a55] text-slate-400 hover:text-white transition-colors"
            title={internalFullscreen ? 'Exit Fullscreen' : 'Fullscreen 3D Security Map'}
          >
            {internalFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. MAIN 3D ISOMETRIC / SATELLITE CANVAS CONTAINER */}
      <div 
        className="relative flex-1 w-full min-h-[460px] h-full bg-[#030612] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ perspective: '1100px' }}
      >
        {/* Floating 3D Tilt / Angle Controls */}
        <div className="absolute top-4 left-4 z-30 flex flex-col gap-1.5 bg-[#070d24]/90 p-2 rounded-xl border border-[#16234b] backdrop-blur-md shadow-2xl text-[10px] font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold border-b border-white/10 pb-1">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>3D SPATIAL SENSOR</span>
          </div>
          <div className="flex items-center justify-between gap-2 text-slate-300">
            <span>Tilt:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPitch(p => Math.min(p + 8, 65))}
                className="px-1.5 py-0.5 rounded bg-[#0d163d] hover:bg-[#152358] text-white"
              >
                ▲
              </button>
              <span className="w-6 text-center text-cyan-300 font-bold">{pitch}°</span>
              <button
                onClick={() => setPitch(p => Math.max(p - 8, 10))}
                className="px-1.5 py-0.5 rounded bg-[#0d163d] hover:bg-[#152358] text-white"
              >
                ▼
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2 text-slate-300">
            <span>Rotation:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setYaw(y => y - 10)}
                className="px-1.5 py-0.5 rounded bg-[#0d163d] hover:bg-[#152358] text-white"
              >
                ◀
              </button>
              <span className="w-6 text-center text-cyan-300 font-bold">{yaw}°</span>
              <button
                onClick={() => setYaw(y => y + 10)}
                className="px-1.5 py-0.5 rounded bg-[#0d163d] hover:bg-[#152358] text-white"
              >
                ▶
              </button>
            </div>
          </div>
          <button
            onClick={() => { setPitch(42); setYaw(-12); setZoom(1.25); setPan({ x: 0, y: 0 }); }}
            className="mt-1 w-full py-1 text-center rounded bg-blue-600/30 hover:bg-blue-600/50 text-cyan-300 font-medium transition-colors"
          >
            Reset 3D Angle
          </button>
        </div>

        {/* Floating Zoom & Pan Controls (Bottom-Right) */}
        <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-1.5 bg-[#070d24]/90 p-1.5 rounded-xl border border-[#16234b] backdrop-blur-md shadow-2xl">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.25, 3.5))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-white/10 mx-1" />
          <button
            onClick={() => setZoom(z => Math.max(z - 0.25, 0.7))}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-white/10 mx-1" />
          <button
            onClick={() => { setZoom(1.25); setPan({ x: 0, y: 0 }); }}
            className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-300 hover:text-white transition-colors"
            title="Reset Pan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Floating Active Entity Dossier HUD Card (Top-Right) */}
        {activeEntity && (
          <div className="absolute top-4 right-4 z-30 max-w-sm w-80 bg-[#09102b]/95 border border-cyan-500/40 p-3.5 rounded-2xl shadow-2xl backdrop-blur-xl text-xs space-y-2 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#182650] pb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  activeEntity.type === 'ATTACKER' ? 'bg-rose-500 animate-pulse' :
                  activeEntity.type === 'PROTECTED_USER' ? 'bg-emerald-400' :
                  activeEntity.type === 'SERVER' ? 'bg-blue-400' : 'bg-yellow-400'
                }`} />
                <span className="font-bold text-white text-xs truncate max-w-[180px]">
                  {activeEntity.name}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase ${
                activeEntity.type === 'ATTACKER' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                activeEntity.type === 'PROTECTED_USER' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                activeEntity.type === 'SERVER' ? 'bg-blue-500/20 text-cyan-300 border border-blue-500/40' :
                'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
              }`}>
                {activeEntity.type.replace('_', ' ')}
              </span>
            </div>

            {/* Coordinates & IP */}
            <div className="p-2 rounded-xl bg-[#060a1d] border border-[#141e42] font-mono text-[11px] space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[10.5px]">Coordinates:</span>
                <span className="text-cyan-300 font-bold">{activeEntity.lat.toFixed(4)}° N, {Math.abs(activeEntity.lng).toFixed(4)}° W</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[10.5px]">IP Address:</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white font-bold">{activeEntity.ip}</span>
                  <button
                    onClick={() => handleCopyIp(activeEntity.ip)}
                    className="p-0.5 hover:text-cyan-300 text-slate-400"
                    title="Copy IP"
                  >
                    {copiedIp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[10.5px]">Location:</span>
                <span className="text-slate-200">{activeEntity.city}, {activeEntity.country}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-sans text-[10.5px]">Status:</span>
                <span className={`font-bold ${
                  activeEntity.type === 'ATTACKER' ? 'text-rose-400' :
                  activeEntity.type === 'PROTECTED_USER' ? 'text-emerald-400' :
                  activeEntity.type === 'SERVER' ? 'text-sky-400' : 'text-amber-400'
                }`}>
                  {activeEntity.status}
                </span>
              </div>
            </div>

            {/* Vector or Department details */}
            {activeEntity.attackType && (
              <div className="p-2 rounded-xl bg-rose-950/20 border border-rose-500/30 text-[11px]">
                <span className="text-rose-300 font-semibold block">Attack Vector:</span>
                <span className="text-slate-200 font-mono">{activeEntity.attackType}</span>
              </div>
            )}
            {activeEntity.details.department && (
              <div className="p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-[11px]">
                <span className="text-emerald-300 font-semibold block">Protected Department:</span>
                <span className="text-slate-200 font-mono">{activeEntity.details.department} ({activeEntity.details.os})</span>
              </div>
            )}

            {/* Description */}
            <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
              {activeEntity.details.description}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-[#182650] flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setInvestigatedIp(activeEntity.ip);
                  setActiveTab('threatintel');
                }}
                className="flex-1 py-1 px-2 rounded-lg bg-[#0e163d] hover:bg-[#182458] text-cyan-300 text-[10.5px] font-medium transition-colors text-center"
              >
                Deep Intel
              </button>
              {activeEntity.type === 'ATTACKER' && (
                <button
                  onClick={() => handleBlockEntity(activeEntity)}
                  disabled={isBlocked}
                  className="flex-1 py-1 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 text-white text-[10.5px] font-medium transition-colors text-center shadow-md shadow-rose-600/30"
                >
                  {isBlocked ? 'Blocked' : 'Block IP'}
                </button>
              )}
              {activeEntity.type === 'PROTECTED_USER' && (
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-medium transition-colors text-center shadow-md shadow-emerald-600/30"
                >
                  Verify MFA
                </button>
              )}
            </div>
          </div>
        )}

        {/* 3. 3D ISOMETRIC CITY TRANSFORM STAGE */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-100 ease-out"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          {/* 3D Tilted Plane */}
          <div 
            className="relative w-[1000px] h-[640px] transition-transform duration-200 ease-out"
            style={{
              transform: `rotateX(${pitch}deg) rotateZ(${yaw}deg)`,
              transformStyle: 'preserve-3d'
            }}
          >
            {/* SVG Base Ground: Grid, Roads, Rivers, Terrain */}
            <svg 
              viewBox="0 0 1000 640" 
              className="w-full h-full overflow-visible"
              style={{ filter: 'drop-shadow(0 35px 40px rgba(0, 0, 0, 0.9))' }}
            >
              <defs>
                {/* Neon glow filters */}
                <filter id="glowRed" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowGreen" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="glowBlue" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* River water gradient */}
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#021028" />
                  <stop offset="50%" stopColor="#04234c" />
                  <stop offset="100%" stopColor="#021028" />
                </linearGradient>

                {/* Radar beam gradient */}
                <radialGradient id="radarSweep" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                  <stop offset="70%" stopColor="#0891b2" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Tactical Ground Mesh Plate */}
              <rect 
                x="40" 
                y="40" 
                width="920" 
                height="560" 
                rx="16" 
                fill="#070c20" 
                stroke="#162552" 
                strokeWidth="2" 
              />

              {/* Grid Lines Pattern */}
              <g stroke="#0f1a3d" strokeWidth="0.8" strokeDasharray="4 6">
                {Array.from({ length: 19 }).map((_, i) => (
                  <line key={`gx-${i}`} x1={60 + i * 48} y1="40" x2={60 + i * 48} y2="600" />
                ))}
                {Array.from({ length: 12 }).map((_, i) => (
                  <line key={`gy-${i}`} x1="40" y1={60 + i * 46} x2="960" y2={60 + i * 46} />
                ))}
              </g>

              {/* SATELLITE TERRAIN CONTOURS */}
              {mapMode !== 'ISOMETRIC_CITY' && (
                <g stroke="#1a2d60" strokeWidth="1.2" fill="none" opacity="0.65">
                  <path d="M 80,120 Q 240,80 400,140 T 720,100 T 920,150" />
                  <path d="M 60,240 Q 260,180 440,260 T 780,220 T 940,280" />
                  <path d="M 80,380 Q 220,320 420,400 T 760,340 T 920,420" />
                  <path d="M 100,500 Q 300,460 520,520 T 840,480" />
                </g>
              )}

              {/* RIVER WATER BODY with Cyber Reflections */}
              {showRiverAndRoads && (
                <g>
                  {/* Glowing river shorelines */}
                  <path 
                    d="M 40,360 Q 180,320 320,380 T 600,420 T 820,370 T 960,400" 
                    fill="none" 
                    stroke="#0284c7" 
                    strokeWidth="32" 
                    strokeLinecap="round"
                    opacity="0.25"
                  />
                  {/* Deep water vein */}
                  <path 
                    d="M 40,360 Q 180,320 320,380 T 600,420 T 820,370 T 960,400" 
                    fill="none" 
                    stroke="url(#riverGrad)" 
                    strokeWidth="24" 
                    strokeLinecap="round"
                  />
                  {/* Water current flow particles */}
                  <path 
                    d="M 40,360 Q 180,320 320,380 T 600,420 T 820,370 T 960,400" 
                    fill="none" 
                    stroke="#38bdf8" 
                    strokeWidth="1.5" 
                    strokeDasharray="8 20"
                    opacity="0.8"
                    className="animate-[dash_8s_linear_infinite]"
                  />
                </g>
              )}

              {/* ROAD NETWORK ARTERIES with High-Density Cyber Traffic */}
              {showRiverAndRoads && (
                <g stroke="#132048" strokeWidth="8" strokeLinecap="round">
                  {/* Main Avenue 1 */}
                  <line x1="100" y1="210" x2="900" y2="210" />
                  {/* Main Avenue 2 */}
                  <line x1="120" y1="470" x2="880" y2="470" />
                  {/* Cross Boulevard 1 */}
                  <line x1="280" y1="60" x2="280" y2="580" />
                  {/* Cross Boulevard 2 */}
                  <line x1="500" y1="60" x2="500" y2="580" />
                  {/* Cross Boulevard 3 */}
                  <line x1="720" y1="60" x2="720" y2="580" />

                  {/* High-speed traffic pulses */}
                  <g stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6 18" opacity="0.75">
                    <line x1="100" y1="210" x2="900" y2="210" className="animate-[dash_4s_linear_infinite]" />
                    <line x1="120" y1="470" x2="880" y2="470" className="animate-[dash_5s_linear_infinite]" />
                    <line x1="280" y1="60" x2="280" y2="580" className="animate-[dash_6s_linear_infinite]" />
                    <line x1="500" y1="60" x2="500" y2="580" className="animate-[dash_4s_linear_infinite]" />
                  </g>
                </g>
              )}

              {/* SUSPICIOUS / ALERT ZONES (Yellow Hazard Rings) */}
              {currentCityEntities.filter(e => e.type === 'ALERT_ZONE').map((zone) => {
                const coords = getEntityCoordinates(zone);
                return (
                  <g key={zone.id}>
                    {/* Pulsing zone circle */}
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="48"
                      fill="rgba(234, 179, 8, 0.08)"
                      stroke="#eab308"
                      strokeWidth="1.8"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    <circle
                      cx={coords.x}
                      cy={coords.y}
                      r="20"
                      fill="rgba(234, 179, 8, 0.15)"
                      stroke="#facc15"
                      strokeWidth="1"
                    />
                    <text
                      x={coords.x}
                      y={coords.y + 60}
                      textAnchor="middle"
                      fill="#fef08a"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {zone.name}
                    </text>
                  </g>
                );
              })}

              {/* GREEN PROTECTED USER CONNECTION PATHS (mTLS/WireGuard Tunnels) */}
              {showProtectedUserPaths && connectionPaths.map((conn) => {
                const user = entities.find(e => e.id === conn.userId);
                const server = entities.find(e => e.id === conn.serverId);
                if (!user || !server) return null;
                const uCoords = getEntityCoordinates(user);
                const sCoords = getEntityCoordinates(server);
                const midX = (uCoords.x + sCoords.x) / 2;
                const midY = (uCoords.y + sCoords.y) / 2 - 25;
                const pathD = `M ${uCoords.x} ${uCoords.y} Q ${midX} ${midY} ${sCoords.x} ${sCoords.y}`;

                return (
                  <g key={conn.id}>
                    {/* Tunnel halo */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="4"
                      opacity="0.2"
                    />
                    {/* Secure encrypted packets */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="2"
                      strokeDasharray="6 12"
                      filter="url(#glowGreen)"
                      className="animate-[dash_3s_linear_infinite]"
                    />
                  </g>
                );
              })}

              {/* RED ANIMATED ATTACK PATHS (Attacker -> Server / Target) */}
              {showAttackPaths && attackPaths.map((path) => {
                const attacker = entities.find(e => e.id === path.attackerId);
                const target = entities.find(e => e.id === path.targetServerId);
                if (!attacker || !target) return null;
                const aCoords = getEntityCoordinates(attacker);
                const tCoords = getEntityCoordinates(target);
                const midX = (aCoords.x + tCoords.x) / 2;
                const midY = Math.min(aCoords.y, tCoords.y) - 50;
                const pathD = `M ${aCoords.x} ${aCoords.y} Q ${midX} ${midY} ${tCoords.x} ${tCoords.y}`;

                return (
                  <g key={path.id}>
                    {/* Outer danger beam */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="5"
                      opacity="0.3"
                    />
                    {/* Flowing attack laser */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeDasharray="8 8"
                      filter="url(#glowRed)"
                      className="animate-pulse"
                    />
                    {/* Target Impact Ping */}
                    <circle
                      cx={tCoords.x}
                      cy={tCoords.y}
                      r="16"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1.5"
                      className="animate-ping"
                    />
                  </g>
                );
              })}

              {/* REALISTIC 3D EXTRUDED CITY BUILDINGS */}
              {show3DBuildings && buildings3D.map((b) => (
                <g 
                  key={b.id} 
                  className="cursor-pointer group hover:opacity-100 transition-opacity"
                  onClick={() => {
                    const matched = entities.find(e => e.type === 'SERVER');
                    if (matched) setActiveEntity(matched);
                  }}
                >
                  {/* Building Base Shadow */}
                  <rect
                    x={b.x + 8}
                    y={b.y + 8}
                    width={b.w}
                    height={b.d}
                    fill="rgba(0, 0, 0, 0.7)"
                    filter="blur(3px)"
                  />

                  {/* Left Facet Wall */}
                  <polygon
                    points={`${b.x},${b.y} ${b.x},${b.y + b.d} ${b.x - b.w * 0.2},${b.y + b.d - b.h * 0.3} ${b.x - b.w * 0.2},${b.y - b.h * 0.3}`}
                    fill="#0b1736"
                    stroke="#1c2f66"
                    strokeWidth="0.8"
                  />

                  {/* Front Facet Wall */}
                  <polygon
                    points={`${b.x},${b.y + b.d} ${b.x + b.w},${b.y + b.d} ${b.x + b.w - b.w * 0.2},${b.y + b.d - b.h * 0.3} ${b.x - b.w * 0.2},${b.y + b.d - b.h * 0.3}`}
                    fill="#0f214d"
                    stroke="#233d82"
                    strokeWidth="0.8"
                  />

                  {/* Rooftop Extrusion with Glowing Antenna */}
                  <polygon
                    points={`${b.x - b.w * 0.2},${b.y - b.h * 0.3} ${b.x + b.w - b.w * 0.2},${b.y - b.h * 0.3} ${b.x + b.w - b.w * 0.2},${b.y + b.d - b.h * 0.3} ${b.x - b.w * 0.2},${b.y + b.d - b.h * 0.3}`}
                    fill={b.type === 'soc' ? '#143070' : b.type === 'datacenter' ? '#0d2252' : '#0a1a40'}
                    stroke={b.type === 'soc' ? '#38bdf8' : '#1e3878'}
                    strokeWidth="1.2"
                  />

                  {/* Glowing Rooftop Satellite / Antenna Beacon */}
                  <circle
                    cx={b.x + b.w * 0.4 - b.w * 0.2}
                    cy={b.y + b.d * 0.5 - b.h * 0.3}
                    r={b.type === 'soc' ? '3.5' : '2'}
                    fill={b.type === 'soc' ? '#38bdf8' : '#0ea5e9'}
                    className="animate-pulse"
                  />

                  {/* Window Grid Matrices */}
                  <g fill={b.type === 'soc' ? '#38bdf8' : '#60a5fa'} opacity="0.6">
                    <circle cx={b.x + 10} cy={b.y + 15} r="1" />
                    <circle cx={b.x + 20} cy={b.y + 15} r="1" />
                    <circle cx={b.x + 30} cy={b.y + 15} r="1" />
                    <circle cx={b.x + 10} cy={b.y + 25} r="1" />
                    <circle cx={b.x + 20} cy={b.y + 25} r="1" />
                  </g>
                </g>
              ))}

              {/* 4. INTERACTIVE 3D ENTITY MARKERS:
                  🟢 Green = Protected User
                  🔴 Red = Attacker / Threat
                  🔵 Blue = Server / Gateway
                  🟡 Yellow = Suspicious / Alert Zone
              */}
              {currentCityEntities.map((entity) => {
                const coords = getEntityCoordinates(entity);
                const isSelected = activeEntity?.id === entity.id;

                return (
                  <g
                    key={entity.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer group"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveEntity(entity);
                      if (onSelectEntity) onSelectEntity(entity);
                    }}
                  >
                    {/* ATTACKER (RED 🔴) */}
                    {entity.type === 'ATTACKER' && (
                      <g>
                        {/* Danger radar pulse */}
                        <circle
                          r="20"
                          fill="rgba(239, 68, 68, 0.15)"
                          stroke="#ef4444"
                          strokeWidth="1.5"
                          className="animate-ping opacity-75 origin-center"
                        />
                        {/* Red 3D Pin Base */}
                        <circle
                          r="10"
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          filter="url(#glowRed)"
                        />
                        <circle r="3.5" fill="#ffffff" />
                        {/* Threat Label */}
                        <text
                          y="-16"
                          textAnchor="middle"
                          fill="#fecaca"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                        >
                          🔴 {entity.name.split(' ')[0]}
                        </text>
                      </g>
                    )}

                    {/* PROTECTED USER (GREEN 🟢) */}
                    {entity.type === 'PROTECTED_USER' && (
                      <g>
                        {/* Safe beacon ring */}
                        <circle
                          r="16"
                          fill="rgba(16, 185, 129, 0.12)"
                          stroke="#10b981"
                          strokeWidth="1.2"
                          className="animate-pulse"
                        />
                        {/* Green 3D Pin Base */}
                        <circle
                          r="9"
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth="2"
                          filter="url(#glowGreen)"
                        />
                        <circle r="3" fill="#ffffff" />
                        {/* User Name Label */}
                        <text
                          y="-15"
                          textAnchor="middle"
                          fill="#a7f3d0"
                          fontSize="9"
                          fontWeight="600"
                          fontFamily="sans-serif"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                        >
                          🟢 {entity.name.split(' ')[0]}
                        </text>
                      </g>
                    )}

                    {/* SERVER (BLUE 🔵) */}
                    {entity.type === 'SERVER' && (
                      <g>
                        {/* Server Hex Shield */}
                        <polygon
                          points="0,-14 12,-7 12,7 0,14 -12,7 -12,-7"
                          fill="#2563eb"
                          stroke="#60a5fa"
                          strokeWidth="2"
                          filter="url(#glowBlue)"
                        />
                        <circle r="3" fill="#ffffff" />
                        {/* Server Tag */}
                        <text
                          y="-18"
                          textAnchor="middle"
                          fill="#93c5fd"
                          fontSize="9.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.9))"
                        >
                          🔵 {entity.name.split(' ')[0]}
                        </text>
                      </g>
                    )}

                    {/* ALERT ZONE (YELLOW 🟡) */}
                    {entity.type === 'ALERT_ZONE' && (
                      <g>
                        <circle
                          r="10"
                          fill="#eab308"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <circle r="3.5" fill="#000000" />
                        <text
                          y="-15"
                          textAnchor="middle"
                          fill="#fef08a"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          🟡 Zone
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* 4. RADAR SWEEP LINE OVERLAY (Simulating live radar scanning across map) */}
        {showRadarSweep && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] animate-[scan_6s_linear_infinite]" />
          </div>
        )}

        {/* 5. HUD TELEMETRY BADGE (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none bg-[#070d24]/90 border border-[#16234b] px-3.5 py-2 rounded-xl backdrop-blur-md shadow-2xl flex items-center gap-3 font-mono text-[11px] text-slate-300">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <Navigation className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>GEO SECTOR:</span>
          </div>
          <span>{activeCity?.name || 'New York City'}, {activeCountry.name}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Lat: <strong className="text-cyan-300">{activeCity?.lat || 40.7128}°</strong></span>
          <span className="text-slate-400">Lng: <strong className="text-cyan-300">{activeCity?.lng || -74.0060}°</strong></span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            3D SPATIAL SENSORS SYNCHRONIZED
          </span>
        </div>
      </div>
    </div>
  );
};
