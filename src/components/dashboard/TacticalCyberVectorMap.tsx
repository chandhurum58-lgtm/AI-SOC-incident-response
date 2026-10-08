import React, { useState, useMemo } from 'react';
import { 
  Globe2, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Search, 
  Activity, 
  RotateCcw, 
  Compass, 
  Building2, 
  X, 
  Plus, 
  Minus, 
  Radio, 
  ShieldAlert, 
  Crosshair 
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { GlobalThreatPoint } from '../../types/soc';
import { 
  GEO_HIERARCHY, 
  getAllFlatPlaces, 
  CityNode 
} from '../../data/geoHierarchy';

const CONTINENT_PRESETS = [
  { name: 'Global View', lat: 20, lng: 0, zoom: 1 },
  { name: 'North America', lat: 40, lng: -100, zoom: 1.8 },
  { name: 'Europe', lat: 50, lng: 15, zoom: 2.2 },
  { name: 'East Asia', lat: 35, lng: 115, zoom: 2.0 },
  { name: 'South Asia', lat: 22, lng: 78, zoom: 2.2 },
  { name: 'Southeast Asia', lat: 4, lng: 108, zoom: 2.2 },
  { name: 'Middle East', lat: 28, lng: 45, zoom: 2.2 },
  { name: 'South America', lat: -15, lng: -60, zoom: 1.8 },
  { name: 'Africa', lat: 2, lng: 22, zoom: 1.8 },
  { name: 'Oceania', lat: -25, lng: 135, zoom: 2.0 }
];

interface TacticalCyberVectorMapProps {
  selectedThreat?: GlobalThreatPoint;
  onSelectThreat?: (threat: GlobalThreatPoint) => void;
  isEmbedded?: boolean;
  isFullscreenPage?: boolean;
}

export const TacticalCyberVectorMap: React.FC<TacticalCyberVectorMapProps> = ({
  selectedThreat,
  onSelectThreat,
  isFullscreenPage = false
}) => {
  const { globalThreats, setActiveTab, setInvestigatedIp } = useSoc();

  const [internalSelectedThreat, setInternalSelectedThreat] = useState<GlobalThreatPoint>(
    selectedThreat || globalThreats[0]
  );
  const activeThreat = selectedThreat || internalSelectedThreat;

  const handleThreatClick = (threat: GlobalThreatPoint) => {
    setInternalSelectedThreat(threat);
    if (onSelectThreat) onSelectThreat(threat);
  };

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [showAttackArcs, setShowAttackArcs] = useState<boolean>(true);
  const [showCityPins, setShowCityPins] = useState<boolean>(true);
  const [showRadarSweep, setShowRadarSweep] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(isFullscreenPage);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const allPlaces = useMemo(() => getAllFlatPlaces(), []);

  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allPlaces.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.countryName?.toLowerCase().includes(q) ||
      p.stateName?.toLowerCase().includes(q)
    ).slice(0, 10);
  }, [searchQuery, allPlaces]);

  const [selectedCountryId, setSelectedCountryId] = useState<string>('us');
  const [activeCityModal, setActiveCityModal] = useState<CityNode | null>(null);

  const activeCountry = useMemo(() => 
    GEO_HIERARCHY.find(c => c.id === selectedCountryId) || GEO_HIERARCHY[0],
    [selectedCountryId]
  );

  const activeCountryCities = useMemo(() => {
    const list: CityNode[] = [];
    activeCountry.states.forEach(st => {
      st.districts.forEach(d => {
        list.push(...d.cities);
      });
    });
    return list;
  }, [activeCountry]);

  const projectCoords = (lat: number, lng: number) => {
    const svgWidth = 800;
    const svgHeight = 420;
    const x = ((lng + 180) / 360) * svgWidth;
    const y = ((90 - lat) / 180) * svgHeight;
    return { x, y };
  };

  const panToLatAndLng = (lat: number, lng: number, targetZoom = 2.4) => {
    const coords = projectCoords(lat, lng);
    const centerX = 400;
    const centerY = 210;
    setZoom(targetZoom);
    setPan({
      x: centerX - coords.x * targetZoom,
      y: centerY - coords.y * targetZoom
    });
  };

  const handleSelectContinent = (preset: typeof CONTINENT_PRESETS[0]) => {
    panToLatAndLng(preset.lat, preset.lng, preset.zoom);
  };

  const handleSelectCountry = (countryId: string) => {
    setSelectedCountryId(countryId);
    const country = GEO_HIERARCHY.find(c => c.id === countryId);
    if (country) {
      panToLatAndLng(country.lat, country.lng, 2.2);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedCountryId('us');
  };

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

  const zoomIn = () => setZoom(prev => Math.min(prev + 0.4, 5.5));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.4, 0.8));

  const attackArcs = useMemo(() => {
    const targetAsset = { lat: 38.9072, lng: -77.0369 };
    const targetCoords = projectCoords(targetAsset.lat, targetAsset.lng);
    return globalThreats.slice(0, 6).map((threat, idx) => {
      const lat = threat.sourceCoords ? threat.sourceCoords[0] : (threat.latitude || 0);
      const lng = threat.sourceCoords ? threat.sourceCoords[1] : (threat.longitude || 0);
      const sourceCoords = projectCoords(lat, lng);
      const midX = (sourceCoords.x + targetCoords.x) / 2;
      const midY = Math.min(sourceCoords.y, targetCoords.y) - 40 - (idx * 12);
      const pathD = `M ${sourceCoords.x} ${sourceCoords.y} Q ${midX} ${midY} ${targetCoords.x} ${targetCoords.y}`;
      return {
        id: threat.id,
        pathD,
        source: threat,
        color: threat.severity === 'CRITICAL' ? '#f43f5e' : threat.severity === 'HIGH' ? '#f97316' : '#eab308'
      };
    });
  }, [globalThreats]);

  return (
    <div className={`bg-[#070c22] border border-[#17254e] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans select-none transition-all ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' 
        : 'h-full w-full'
    }`}>
      {/* 1. Header Toolbar */}
      <div className="px-3 sm:px-4 py-2 border-b border-[#16234b] bg-gradient-to-r from-[#0d1536] via-[#0b122e] to-[#090f26] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                Tactical SOC Cyber Threat Map
              </h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Ingress
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 flex items-center gap-1.5">
              <span>Real-time global attack telemetry • {globalThreats.length} Active Nodes Plotted</span>
            </p>
          </div>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="relative w-40 sm:w-52">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search country, city, node..."
              className="w-full bg-[#0a112c] border border-[#233876] rounded-xl pl-7 pr-6 py-1 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {showSearchResults && filteredPlaces.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#09102b] border border-[#233876] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto">
                {filteredPlaces.map((place, idx) => (
                  <div
                    key={`${place.id}-${idx}`}
                    onClick={() => {
                      panToLatAndLng(place.lat, place.lng, 2.5);
                      setSearchQuery('');
                      setShowSearchResults(false);
                    }}
                    className="p-2 hover:bg-[#121c45] cursor-pointer text-xs border-b border-[#142048] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-cyan-400" />
                      <span className="font-semibold text-white">{place.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{place.countryName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowAttackArcs(!showAttackArcs)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-colors flex items-center gap-1 ${
              showAttackArcs
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'bg-[#0f1738] text-slate-400 border border-[#1d2b5c]'
            }`}
            title="Toggle Live Cyber Attack Vectors"
          >
            <Activity className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Attack Arcs</span>
          </button>

          <button
            onClick={() => setShowCityPins(!showCityPins)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-colors flex items-center gap-1 ${
              showCityPins
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-[#0f1738] text-slate-400 border border-[#1d2b5c]'
            }`}
            title="Toggle Key Strategic Infrastructure & Cities"
          >
            <Building2 className="w-3 h-3 text-cyan-400" />
            <span className="hidden sm:inline">City Pins</span>
          </button>

          <button
            onClick={() => setShowRadarSweep(!showRadarSweep)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono transition-colors flex items-center gap-1 ${
              showRadarSweep
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-[#0f1738] text-slate-400 border border-[#1d2b5c]'
            }`}
            title="Toggle Live Threat Pulse Sweep"
          >
            <Radio className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Radar</span>
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-[#0f1738] hover:bg-[#162354] text-slate-300 hover:text-white border border-[#1d2b5c] transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Secondary Geographic Bar */}
      <div className="px-3 py-1.5 bg-[#05091c] border-b border-[#142045] flex items-center justify-between gap-2 overflow-x-auto no-scrollbar text-xs">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
            <Compass className="w-3 h-3 text-cyan-400" />
            <span>Region:</span>
          </span>
          {CONTINENT_PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectContinent(preset)}
              className="px-2 py-0.5 rounded-lg text-[10.5px] font-mono bg-[#0c1432] hover:bg-[#142048] text-slate-300 hover:text-white border border-[#1a2754] transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-mono text-slate-400">Country:</span>
          <select
            value={selectedCountryId}
            onChange={(e) => handleSelectCountry(e.target.value)}
            className="bg-[#0b122c] border border-[#1c2a57] rounded-lg px-2 py-0.5 text-[10.5px] text-cyan-300 font-mono focus:outline-none"
          >
            {GEO_HIERARCHY.map(c => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleReset}
            className="p-1 rounded-lg bg-[#0c1432] hover:bg-[#142048] text-slate-400 hover:text-white border border-[#1a2754]"
            title="Reset to global view"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 3. Interactive Map Canvas Container */}
      <div 
        className="relative flex-1 w-full min-h-[460px] h-full bg-[#040716] overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {/* Floating Controls: Zoom In / Out / Reset */}
        <div className="absolute bottom-5 right-4 z-20 flex flex-col gap-1.5 bg-[#080e26]/90 p-1.5 rounded-xl border border-[#1d2b59] shadow-xl backdrop-blur-md">
          <button
            onClick={zoomIn}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-px bg-white/10 mx-1" />
          <button
            onClick={zoomOut}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="h-px bg-white/10 mx-1" />
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Live Coordinate & Telemetry HUD */}
        <div className="absolute top-4 left-4 z-20 pointer-events-none flex flex-col gap-1 text-[10px] font-mono text-slate-400 bg-[#070d24]/85 border border-[#16234b] px-3 py-2 rounded-xl backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <Crosshair className="w-3 h-3 text-cyan-400" />
            <span>GEO SENSOR: {activeCountry.name} ({activeCountry.capital})</span>
          </div>
          <div className="text-slate-400">
            LAT: {activeCountry.lat.toFixed(4)} | LNG: {activeCountry.lng.toFixed(4)}
          </div>
          <div className="text-slate-500">
            ZOOM: {zoom.toFixed(1)}x | THREAT SENSORS: 48 ONLINE
          </div>
        </div>

        {/* Active Threat Selected Indicator Card */}
        {activeThreat && (
          <div className="absolute top-4 right-4 z-20 max-w-xs bg-[#090f2b]/95 border border-cyan-500/40 p-3 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1">
              <span className="font-bold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{activeThreat.sourceCity || activeThreat.city}, {activeThreat.sourceCountry || activeThreat.country}</span>
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold ${
                activeThreat.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                activeThreat.severity === 'HIGH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {activeThreat.severity}
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              <p className="font-semibold text-white">{activeThreat.attackCategory || activeThreat.attackType}</p>
              <p className="text-slate-400 font-mono text-[10px] mt-0.5">IP: {activeThreat.sourceIp || activeThreat.ip} • Port: {activeThreat.port || 443}</p>
            </div>
            <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
              <span className="text-slate-400">Target: {activeThreat.targetAsset}</span>
              <button
                onClick={() => {
                  setInvestigatedIp(activeThreat.sourceIp || activeThreat.ip || '103.77.12.5');
                  setActiveTab('threatintel');
                }}
                className="text-cyan-400 hover:text-cyan-300 underline font-sans"
              >
                Investigate →
              </button>
            </div>
          </div>
        )}

        {/* Map SVG Canvas with Zoom & Pan Transforms */}
        <div 
          className="w-full h-full flex items-center justify-center transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <svg
            viewBox="0 0 800 420"
            className="w-full h-full max-w-full max-h-full"
            style={{ filter: 'drop-shadow(0 0 20px rgba(14, 165, 233, 0.15))' }}
          >
            {/* Latitude / Longitude Tactical Graticules */}
            <g stroke="#132048" strokeWidth="0.6" strokeDasharray="3 3">
              <line x1="0" y1="70" x2="800" y2="70" />
              <line x1="0" y1="140" x2="800" y2="140" />
              <line x1="0" y1="210" x2="800" y2="210" stroke="#1d2e65" strokeWidth="1" strokeDasharray="none" />
              <line x1="0" y1="280" x2="800" y2="280" />
              <line x1="0" y1="350" x2="800" y2="350" />
              <line x1="133" y1="0" x2="133" y2="420" />
              <line x1="266" y1="0" x2="266" y2="420" />
              <line x1="400" y1="0" x2="400" y2="420" stroke="#1d2e65" strokeWidth="1" strokeDasharray="none" />
              <line x1="533" y1="0" x2="533" y2="420" />
              <line x1="666" y1="0" x2="666" y2="420" />
            </g>

            {/* Continents Vectors */}
            <g fill="#0e173b" stroke="#1b2a5c" strokeWidth="1.2">
              <path d="M 80 50 L 170 35 L 250 60 L 260 120 L 220 170 L 190 200 L 160 170 L 130 180 L 100 130 L 70 80 Z" />
              <path d="M 270 25 L 320 20 L 310 65 L 260 55 Z" fill="#0d1536" />
              <path d="M 190 200 L 230 210 L 270 260 L 250 350 L 220 370 L 180 290 L 170 230 Z" />
              <path d="M 370 70 L 450 65 L 470 120 L 410 150 L 360 130 L 350 90 Z" />
              <path d="M 400 35 L 430 40 L 420 85 L 390 70 Z" />
              <path d="M 360 140 L 470 145 L 490 230 L 450 330 L 400 340 L 350 240 L 340 170 Z" />
              <path d="M 470 60 L 680 50 L 730 110 L 690 190 L 590 200 L 540 230 L 480 180 L 460 110 Z" />
              <path d="M 520 170 L 570 175 L 560 250 L 530 250 Z" />
              <path d="M 690 120 L 710 115 L 700 160 L 680 150 Z" />
              <path d="M 620 270 L 720 260 L 730 340 L 640 350 Z" />
              <path d="M 740 340 L 760 335 L 750 370 Z" />
              <path d="M 20 400 L 780 400 L 780 415 L 20 415 Z" fill="#080e24" stroke="#131e42" />
            </g>

            {/* Live Animated Attack Arcs */}
            {showAttackArcs && attackArcs.map((arc) => (
              <g key={arc.id}>
                <path
                  d={arc.pathD}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="2.5"
                  strokeOpacity="0.25"
                />
                <path
                  d={arc.pathD}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="1.8"
                  strokeDasharray="6 14"
                  className="animate-pulse"
                />
              </g>
            ))}

            {/* Strategic City Infrastructure Pins */}
            {showCityPins && activeCountryCities.slice(0, 16).map((city) => {
              const coords = projectCoords(city.lat, city.lng);
              return (
                <g 
                  key={city.id} 
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer hover:opacity-100 opacity-80 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCityModal(city);
                  }}
                >
                  <circle
                    r={city.isCapital ? 4.5 : 3}
                    fill={city.isCapital ? '#eab308' : '#38bdf8'}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  {city.isCapital && (
                    <circle r="7" fill="none" stroke="#eab308" strokeWidth="0.8" opacity="0.6" />
                  )}
                  <text
                    y="-6"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7"
                    fontFamily="monospace"
                    className="select-none pointer-events-none"
                  >
                    {city.name}
                  </text>
                </g>
              );
            })}

            {/* Plotted Global Threat Sensors */}
            {globalThreats.map((threat) => {
              const lat = threat.sourceCoords ? threat.sourceCoords[0] : (threat.latitude || 0);
              const lng = threat.sourceCoords ? threat.sourceCoords[1] : (threat.longitude || 0);
              const coords = projectCoords(lat, lng);
              const isSelected = activeThreat?.id === threat.id;
              const isCrit = threat.severity === 'CRITICAL';
              const isHigh = threat.severity === 'HIGH';
              const dotColor = isCrit ? '#f43f5e' : isHigh ? '#f97316' : '#eab308';

              return (
                <g 
                  key={threat.id} 
                  transform={`translate(${coords.x}, ${coords.y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleThreatClick(threat);
                  }}
                >
                  {showRadarSweep && isCrit && (
                    <circle
                      r="16"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="1"
                      className="animate-ping opacity-75 origin-center"
                    />
                  )}
                  <circle
                    r={isSelected ? 10 : 6}
                    fill={dotColor}
                    opacity={isSelected ? 0.4 : 0.25}
                  />
                  <circle
                    r={isSelected ? 5 : 3.5}
                    fill={dotColor}
                    stroke="#ffffff"
                    strokeWidth={isSelected ? 2 : 1.2}
                  />
                  <text
                    y="-9"
                    textAnchor="middle"
                    fill={isSelected ? '#ffffff' : '#e2e8f0'}
                    fontSize={isSelected ? '8.5' : '7.5'}
                    fontWeight="bold"
                    fontFamily="monospace"
                    className="select-none pointer-events-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                  >
                    {threat.sourceCity || threat.city}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
