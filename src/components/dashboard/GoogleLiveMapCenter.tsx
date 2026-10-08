import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { 
  Map, 
  useMap,
  Marker,
  InfoWindow,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { 
  Globe2, 
  MapPin, 
  Maximize2, 
  Minimize2, 
  Search, 
  Activity, 
  Navigation, 
  RotateCcw, 
  Compass, 
  Building2, 
  Landmark, 
  Tag, 
  Check, 
  X
} from 'lucide-react';
import { useSoc } from '../../context/SocContext';
import { GlobalThreatPoint } from '../../types/soc';
import { 
  GEO_HIERARCHY, 
  getAllFlatPlaces, 
  CountryNode, 
  CityNode, 
  FlatGeoPlace 
} from '../../data/geoHierarchy';
import { TacticalCyberVectorMap } from './TacticalCyberVectorMap';
import { IS_GOOGLE_MAPS_ENABLED } from '../../utils/mapsConfig';

export interface CountryItem {
  id: string;
  flag: string;
  name: string;
  continent: string;
  capital: string;
  lat: number;
  lng: number;
  zoom: number;
  majorCities: string[];
}

export const COUNTRIES_LIST: CountryItem[] = GEO_HIERARCHY.map(c => ({
  id: c.id,
  flag: c.flag,
  name: c.name,
  continent: c.continent,
  capital: c.capital,
  lat: c.lat,
  lng: c.lng,
  zoom: c.zoom,
  majorCities: c.states.flatMap(s => s.districts.flatMap(d => d.cities.map(ci => ci.name)))
}));

// Real-World Natural Colors with Explicit High-Visibility Administrative Labels
export const REAL_WORLD_ENHANCED_STYLES: google.maps.MapTypeStyle[] = [
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#334155' }, { weight: 2 }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#0f172a' }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 3.5 }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#475569' }, { weight: 1.5 }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#1e293b' }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 3 }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#090d16' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 2.5 }]
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#1e293b' }]
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }, { weight: 2 }]
  }
];

// SOC Dark Mode with High-Contrast Luminous Labels
export const SOC_DARK_ENHANCED_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#090e24' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#050814' }, { weight: 3 }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  {
    featureType: 'administrative.country',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#38bdf8' }, { weight: 2 }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#ffffff' }]
  },
  {
    featureType: 'administrative.country',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#020617' }, { weight: 3.5 }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'on' }, { color: '#3b82f6' }, { weight: 1.5 }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#93c5fd' }]
  },
  {
    featureType: 'administrative.province',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#090e24' }, { weight: 3 }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#f8fafc' }]
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#020617' }, { weight: 3 }]
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.fill',
    stylers: [{ visibility: 'on' }, { color: '#5eead4' }]
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'labels.text.stroke',
    stylers: [{ visibility: 'on' }, { color: '#020617' }, { weight: 2.5 }]
  },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0b1330' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#0e183a' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#131e42' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0a1024' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1d2e5b' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#111a3b' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#040714' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#38bdf8' }] }
];

const CONTINENT_PRESETS = [
  { name: 'Global', lat: 20, lng: 0, zoom: 2.2 },
  { name: 'North America', lat: 39.8283, lng: -98.5795, zoom: 4.2 },
  { name: 'Europe', lat: 50.1109, lng: 14.4208, zoom: 4.5 },
  { name: 'East Asia', lat: 34.0479, lng: 120.5574, zoom: 4.3 },
  { name: 'South Asia', lat: 20.5937, lng: 78.9629, zoom: 4.8 },
  { name: 'Southeast Asia', lat: 2.2180, lng: 105.8198, zoom: 4.8 },
  { name: 'Middle East', lat: 26.8206, lng: 45.0000, zoom: 4.6 },
  { name: 'South America', lat: -14.2350, lng: -51.9253, zoom: 4.0 },
  { name: 'Africa', lat: -1.2921, lng: 26.8219, zoom: 3.8 },
  { name: 'Oceania', lat: -25.2744, lng: 133.7751, zoom: 4.2 }
];

const DashboardMapCameraController: React.FC<{
  showTraffic: boolean;
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  colorMode: 'real' | 'dark';
  targetCamera: { lat: number; lng: number; zoom: number };
  onCameraChange: (lat: number, lng: number, zoom: number) => void;
}> = ({ showTraffic, mapType, colorMode, targetCamera, onCameraChange }) => {
  const map = useMap('dashboard-google-live-map');
  const [trafficLayer, setTrafficLayer] = useState<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      if (typeof google !== 'undefined' && google.maps?.event) {
        google.maps.event.trigger(map, 'resize');
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    if (!map) return;
    try {
      map.setMapTypeId(mapType);
      if (mapType === 'roadmap') {
        if (colorMode === 'dark') {
          map.setOptions({ styles: SOC_DARK_ENHANCED_STYLES });
        } else {
          map.setOptions({ styles: REAL_WORLD_ENHANCED_STYLES });
        }
      } else {
        map.setOptions({ styles: [] });
      }
    } catch {
      // Safe fallback
    }
  }, [map, mapType, colorMode]);

  useEffect(() => {
    if (!map) return;
    map.panTo({ lat: targetCamera.lat, lng: targetCamera.lng });
    map.setZoom(targetCamera.zoom);
  }, [map, targetCamera]);

  useEffect(() => {
    if (!map) return;
    if (showTraffic) {
      if (typeof google === 'undefined' || !google.maps) return;
      const layer = new google.maps.TrafficLayer();
      layer.setMap(map);
      setTrafficLayer(layer);
      return () => {
        layer.setMap(null);
      };
    } else if (trafficLayer) {
      trafficLayer.setMap(null);
      setTrafficLayer(null);
    }
  }, [map, showTraffic]);

  useEffect(() => {
    if (!map) return;
    const listener = map.addListener('idle', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      if (center && zoom !== undefined) {
        onCameraChange(center.lat(), center.lng(), zoom);
      }
    });
    return () => {
      if (listener && typeof listener.remove === 'function') {
        listener.remove();
      } else if (typeof google !== 'undefined' && google.maps?.event) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [map, onCameraChange]);

  return null;
};

export interface GoogleLiveMapCenterProps {
  selectedThreat?: GlobalThreatPoint;
  onSelectThreat?: (threat: GlobalThreatPoint) => void;
}

const getSeverityMarkerIcon = (severity: string, isSelected: boolean) => {
  const color = severity === 'CRITICAL' ? '%23ef4444' : severity === 'HIGH' ? '%23f97316' : '%23eab308';
  const size = isSelected ? 26 : 20;
  return `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="${color}" stroke="%23ffffff" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="%23ffffff"/></svg>`;
};

const getCityPinMarkerIcon = (isCapital?: boolean, isSelected?: boolean) => {
  const bgColor = isCapital ? '%23eab308' : '%233b82f6';
  const strokeColor = '%23ffffff';
  const size = isSelected ? 28 : 22;
  return `data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="${bgColor}" stroke="${strokeColor}" stroke-width="2"/><circle cx="12" cy="9" r="3" fill="%23ffffff"/></svg>`;
};

export const GoogleLiveMapCenter: React.FC<GoogleLiveMapCenterProps> = ({
  selectedThreat,
  onSelectThreat
}) => {
  const { globalThreats } = useSoc();
  const loadingStatus = useApiLoadingStatus();
  const [mapsSdkReady, setMapsSdkReady] = useState(false);
  const [showLoadingPill, setShowLoadingPill] = useState(true);

  useEffect(() => {
    const isGoogleMapsAvailable = 
      (typeof window !== 'undefined' && typeof window.google?.maps?.Map === 'function') || 
      loadingStatus === APILoadingStatus.LOADED;
    if (isGoogleMapsAvailable) {
      setMapsSdkReady(true);
      setShowLoadingPill(false);
    } else {
      const timer = setTimeout(() => {
        setShowLoadingPill(false);
        if (typeof window !== 'undefined' && typeof window.google?.maps?.Map === 'function') {
          setMapsSdkReady(true);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadingStatus]);

  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [colorMode, setColorMode] = useState<'real' | 'dark'>('real');
  const [showTraffic, setShowTraffic] = useState(false);
  const [showCityPins, setShowCityPins] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [selectedCountryId, setSelectedCountryId] = useState<string>('us');
  const [selectedStateId, setSelectedStateId] = useState<string>('us-ny');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('us-ny-manhattan');
  const [selectedCityId, setSelectedCityId] = useState<string>('us-ny-nyc');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const [activeHoverThreat, setActiveHoverThreat] = useState<GlobalThreatPoint | null>(null);
  const [activeCityModal, setActiveCityModal] = useState<CityNode | null>(null);

  const [cameraState, setCameraState] = useState({ lat: 40.7128, lng: -74.0060, zoom: 6.5 });
  const [targetCamera, setTargetCamera] = useState({ lat: 40.7128, lng: -74.0060, zoom: 6.5 });

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

  const activeCountryCities = useMemo(() => {
    return activeCountry.states.flatMap(s => s.districts.flatMap(d => d.cities));
  }, [activeCountry]);

  const allFlatPlaces = useMemo(() => getAllFlatPlaces(), []);
  const filteredPlaces = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allFlatPlaces.filter(p => 
      p.name.toLowerCase().includes(q) ||
      (p.stateName && p.stateName.toLowerCase().includes(q)) ||
      (p.districtName && p.districtName.toLowerCase().includes(q)) ||
      p.countryName.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [allFlatPlaces, searchQuery]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCameraUpdate = useCallback((lat: number, lng: number, zoom: number) => {
    setCameraState({ lat, lng, zoom });
  }, []);

  const handleSelectCountry = (countryId: string) => {
    setSelectedCountryId(countryId);
    const country = GEO_HIERARCHY.find(c => c.id === countryId);
    if (country) {
      const firstState = country.states[0];
      if (firstState) {
        setSelectedStateId(firstState.id);
        const firstDist = firstState.districts[0];
        if (firstDist) {
          setSelectedDistrictId(firstDist.id);
          const firstCity = firstDist.cities[0];
          if (firstCity) setSelectedCityId(firstCity.id);
        }
      }
      setTargetCamera({ lat: country.lat, lng: country.lng, zoom: country.zoom });
    }
  };

  const handleSelectState = (stateId: string) => {
    setSelectedStateId(stateId);
    if (!activeCountry) return;
    const st = activeCountry.states.find(s => s.id === stateId);
    if (st) {
      const firstDist = st.districts[0];
      if (firstDist) {
        setSelectedDistrictId(firstDist.id);
        const firstCity = firstDist.cities[0];
        if (firstCity) setSelectedCityId(firstCity.id);
      }
      setTargetCamera({ lat: st.lat, lng: st.lng, zoom: st.zoom });
    }
  };

  const handleSelectDistrict = (districtId: string) => {
    setSelectedDistrictId(districtId);
    if (!activeState) return;
    const dist = activeState.districts.find(d => d.id === districtId);
    if (dist) {
      const firstCity = dist.cities[0];
      if (firstCity) setSelectedCityId(firstCity.id);
      setTargetCamera({ lat: dist.lat, lng: dist.lng, zoom: dist.zoom });
    }
  };

  const handleSelectCity = (city: CityNode) => {
    setSelectedCityId(city.id);
    setActiveCityModal(city);
    setTargetCamera({ lat: city.lat, lng: city.lng, zoom: city.zoom });
  };

  const handleSelectFlatPlace = (place: FlatGeoPlace) => {
    setShowSearchResults(false);
    setSearchQuery(place.name);
    if (place.type === 'country') {
      const c = GEO_HIERARCHY.find(item => item.name.toLowerCase() === place.name.toLowerCase());
      if (c) handleSelectCountry(c.id);
    } else if (place.type === 'city') {
      setTargetCamera({ lat: place.lat, lng: place.lng, zoom: place.zoom });
    }
  };

  const handleSelectContinent = (preset: typeof CONTINENT_PRESETS[0]) => {
    setTargetCamera({
      lat: preset.lat,
      lng: preset.lng,
      zoom: preset.zoom
    });
  };

  const handleReset = () => {
    handleSelectCountry('us');
  };

  return (
    <div className={`bg-[#090f26] border border-[#17254e] rounded-2xl flex flex-col shadow-2xl overflow-hidden font-sans select-none transition-all ${
      isFullscreen 
        ? 'fixed inset-0 z-50 rounded-none border-none h-screen w-screen' 
        : 'h-full w-full'
    }`}>
      {/* 1. Primary Header Toolbar */}
      <div className="px-3 sm:px-4 py-2 border-b border-[#16234b] bg-gradient-to-r from-[#0d1536] via-[#0b122e] to-[#090f26] flex flex-wrap items-center justify-between gap-2.5 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(56,189,248,0.2)]">
            <Globe2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white tracking-wide uppercase font-mono flex items-center gap-2">
                Google Live Interactive Map
              </h2>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9.5px] font-mono font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live SDK
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400 flex items-center gap-1.5">
              <span>Authentic country, state, district & city names, road networks and satellite feeds</span>
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div ref={searchContainerRef} className="relative w-44 sm:w-56">
            <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              placeholder="Search country, state, city..."
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
                <div className="p-1 text-[9.5px] uppercase font-mono text-slate-400 px-2.5 py-1 border-b border-[#1b2b5c] bg-[#070d24]">
                  Matching Locations ({filteredPlaces.length})
                </div>
                {filteredPlaces.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectFlatPlace(place)}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-blue-600/30 flex items-center justify-between text-xs border-b border-[#131e42]/60 last:border-0 transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm shrink-0">{place.countryFlag}</span>
                      <div className="truncate">
                        <span className="font-semibold text-white">{place.name}</span>
                        <div className="text-[10px] text-slate-400 truncate">
                          {place.countryName}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center bg-[#0a112c] border border-[#1e2e5c] rounded-xl p-0.5 text-xs font-mono">
            {(['roadmap', 'hybrid', 'terrain'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setMapType(type)}
                className={`px-2 py-0.5 rounded-lg transition-colors capitalize text-[10.5px] ${
                  mapType === type 
                    ? 'bg-blue-600 text-white font-medium shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type === 'hybrid' ? 'Satellite' : type}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#0a112c] border border-[#1e2e5c] rounded-xl p-0.5 text-xs font-mono">
            <button
              onClick={() => setColorMode('real')}
              className={`px-2 py-0.5 rounded-lg transition-colors text-[10.5px] flex items-center gap-1 ${
                colorMode === 'real'
                  ? 'bg-emerald-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Real World Natural Google Maps Colors"
            >
              <span>🌿 Real Colors</span>
            </button>
            <button
              onClick={() => setColorMode('dark')}
              className={`px-2 py-0.5 rounded-lg transition-colors text-[10.5px] flex items-center gap-1 ${
                colorMode === 'dark'
                  ? 'bg-blue-600 text-white font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Dark Cyber SOC Style"
            >
              <span>⚡ Dark SOC</span>
            </button>
          </div>

          <button
            onClick={() => setShowCityPins(!showCityPins)}
            className={`px-2 py-1 rounded-xl border text-[10.5px] font-mono flex items-center gap-1 transition-colors ${
              showCityPins
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-[#0a112c] text-slate-400 border-[#1e2e5c] hover:text-slate-200'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span className="hidden sm:inline">Pins</span>
          </button>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-2 py-1 rounded-xl border text-[10.5px] font-mono flex items-center gap-1 transition-colors ${
              showTraffic 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                : 'bg-[#0a112c] text-slate-400 border-[#1e2e5c] hover:text-slate-200'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span className="hidden sm:inline">Traffic</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-[#0a112c] border border-[#1e2e5c] text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-xl bg-[#0a112c] border border-[#1e2e5c] text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* 2. Secondary Geographic Hierarchy Toolbar */}
      <div className="px-3 sm:px-4 py-1.5 bg-[#070c22] border-b border-[#141f45] flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0d163a] border border-[#20326b] rounded-xl px-2.5 py-1">
            <span className="text-[10px] text-cyan-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Compass className="w-3 h-3 text-cyan-400" />
              Country:
            </span>
            <select
              value={selectedCountryId}
              onChange={(e) => handleSelectCountry(e.target.value)}
              className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[170px]"
            >
              {GEO_HIERARCHY.map((country) => (
                <option key={country.id} value={country.id} className="bg-[#090f26] text-white">
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          {activeCountry && activeCountry.states.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0d163a] border border-[#20326b] rounded-xl px-2.5 py-1">
              <span className="text-[10px] text-blue-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Landmark className="w-3 h-3 text-blue-400" />
                State:
              </span>
              <select
                value={selectedStateId}
                onChange={(e) => handleSelectState(e.target.value)}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[160px]"
              >
                {activeCountry.states.map((st) => (
                  <option key={st.id} value={st.id} className="bg-[#090f26] text-white">
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {activeDistrict && activeDistrict.cities.length > 0 && (
            <div className="flex items-center gap-1.5 bg-[#0d163a] border border-[#20326b] rounded-xl px-2.5 py-1">
              <span className="text-[10px] text-amber-300 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                <Building2 className="w-3 h-3 text-amber-400" />
                City:
              </span>
              <select
                value={selectedCityId}
                onChange={(e) => {
                  const city = activeDistrict.cities.find(c => c.id === e.target.value);
                  if (city) handleSelectCity(city);
                }}
                className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer max-w-[150px]"
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

        <div className="hidden lg:flex items-center gap-1 text-[10.5px] font-mono">
          <span className="text-slate-400 mr-1">Fly to:</span>
          <button
            onClick={() => setTargetCamera({ lat: activeCountry.lat, lng: activeCountry.lng, zoom: activeCountry.zoom })}
            className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 transition-colors"
          >
            Country
          </button>
          {activeState && (
            <button
              onClick={() => setTargetCamera({ lat: activeState.lat, lng: activeState.lng, zoom: activeState.zoom })}
              className="px-2 py-0.5 rounded bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 transition-colors"
            >
              State
            </button>
          )}
          {activeCity && (
            <button
              onClick={() => setTargetCamera({ lat: activeCity.lat, lng: activeCity.lng, zoom: activeCity.zoom })}
              className="px-2 py-0.5 rounded bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 transition-colors"
            >
              City
            </button>
          )}
        </div>
      </div>

      {/* 3. Interactive Map Canvas Container */}
      <div className="relative flex-1 w-full min-h-[460px] h-full bg-[#050814] overflow-hidden">
        {showLoadingPill && (
          <div className="absolute top-4 right-4 z-30 flex items-center gap-2 bg-[#070c20]/95 border border-cyan-500/40 px-3 py-1.5 rounded-xl shadow-xl text-xs text-cyan-300 font-mono">
            <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <span>Connecting Google Live Map Stream...</span>
          </div>
        )}

        <div className="absolute inset-0 w-full h-full">
          <Map
            id="dashboard-google-live-map"
            internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
            reuseMaps={true}
            defaultCenter={{ lat: 40.7128, lng: -74.0060 }}
            defaultZoom={6.5}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            styles={colorMode === 'dark' && mapType === 'roadmap' ? SOC_DARK_ENHANCED_STYLES : (mapType === 'roadmap' ? REAL_WORLD_ENHANCED_STYLES : [])}
            mapTypeControl={false}
            streetViewControl={true}
            fullscreenControl={false}
            zoomControl={true}
            minZoom={2}
            maxZoom={20}
            style={{ width: '100%', height: '100%', minHeight: '460px' }}
          >
            <DashboardMapCameraController
              showTraffic={showTraffic}
              mapType={mapType}
              colorMode={colorMode}
              targetCamera={targetCamera}
              onCameraChange={handleCameraUpdate}
            />

            {showCityPins && activeCountryCities.map((city) => {
              const isSelected = selectedCityId === city.id;
              return (
                <Marker
                  key={city.id}
                  position={{ lat: city.lat, lng: city.lng }}
                  title={`${city.name} (${city.district}, ${city.state})`}
                  icon={getCityPinMarkerIcon(city.isCapital, isSelected)}
                  onClick={() => {
                    handleSelectCity(city);
                  }}
                />
              );
            })}

            {activeCityModal && (
              <InfoWindow
                position={{ lat: activeCityModal.lat, lng: activeCityModal.lng }}
                onCloseClick={() => setActiveCityModal(null)}
              >
                <div className="p-2.5 text-slate-900 font-sans min-w-[220px] max-w-xs">
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {activeCityModal.isCapital ? 'National Capital' : 'Metropolitan City'}
                    </span>
                    <span className="text-sm">{activeCityModal.countryFlag}</span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-950">{activeCityModal.name}</h3>
                  <div className="mt-1 space-y-1 text-[11px] text-slate-700">
                    <div><strong>District:</strong> {activeCityModal.district}</div>
                    <div><strong>State:</strong> {activeCityModal.state}</div>
                    <div><strong>Country:</strong> {activeCityModal.country}</div>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5">
                    <button
                      onClick={() => setTargetCamera({ lat: activeCityModal.lat, lng: activeCityModal.lng, zoom: 14 })}
                      className="flex-1 py-1 px-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-medium transition-colors text-center"
                    >
                      Street Level
                    </button>
                  </div>
                </div>
              </InfoWindow>
            )}

            {globalThreats.slice(0, 15).map((threat) => {
              const isSelected = selectedThreat?.id === threat.id;
              return (
                <Marker
                  key={threat.id}
                  position={{ lat: threat.sourceCoords ? threat.sourceCoords[0] : (threat.latitude || 0), lng: threat.sourceCoords ? threat.sourceCoords[1] : (threat.longitude || 0) }}
                  title={`[${threat.severity}] ${threat.attackCategory || threat.attackType} (${threat.sourceCity || threat.city}, ${threat.sourceCountry || threat.country})`}
                  icon={getSeverityMarkerIcon(threat.severity, isSelected)}
                  onClick={() => {
                    if (onSelectThreat) onSelectThreat(threat);
                    setActiveHoverThreat(threat);
                  }}
                />
              );
            })}

            {activeHoverThreat && (
              <InfoWindow
                position={{ lat: activeHoverThreat.sourceCoords ? activeHoverThreat.sourceCoords[0] : (activeHoverThreat.latitude || 0), lng: activeHoverThreat.sourceCoords ? activeHoverThreat.sourceCoords[1] : (activeHoverThreat.longitude || 0) }}
                onCloseClick={() => setActiveHoverThreat(null)}
              >
                <div className="p-2.5 text-slate-900 font-sans min-w-[210px] max-w-xs">
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-200">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      activeHoverThreat.severity === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      activeHoverThreat.severity === 'HIGH' ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activeHoverThreat.severity} Incident
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{activeHoverThreat.timestamp}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 mt-1">{activeHoverThreat.attackCategory || activeHoverThreat.attackType}</h4>
                  <div className="text-[11px] text-slate-600 mt-1 space-y-0.5 font-sans">
                    <div>Location: <strong className="text-slate-900">{activeHoverThreat.sourceCity || activeHoverThreat.city}, {activeHoverThreat.sourceCountry || activeHoverThreat.country}</strong></div>
                    <div>Source IP: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono text-slate-800">{activeHoverThreat.sourceIp || activeHoverThreat.ip}</code></div>
                    <div>Target Asset: <strong className="text-blue-700">{activeHoverThreat.targetAsset}</strong></div>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectThreat) onSelectThreat(activeHoverThreat);
                    }}
                    className="mt-2 w-full py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10.5px] font-medium transition-colors"
                  >
                    Investigate in Threat Panel →
                  </button>
                </div>
              </InfoWindow>
            )}
          </Map>
        </div>

        {/* 4. Dynamic HUD */}
        <div className="absolute left-3 bottom-3 z-10 pointer-events-auto bg-[#080d22]/95 backdrop-blur-md border border-[#1b2b5a] rounded-xl px-3 py-1.5 shadow-2xl text-[11px] flex flex-wrap items-center gap-2.5 text-slate-300 font-mono">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
            <Navigation className="w-3 h-3 text-cyan-400 animate-pulse" />
            <span>Center:</span>
          </div>
          <span className="text-slate-200">
            {cameraState.lat >= 0 ? `${cameraState.lat.toFixed(3)}° N` : `${Math.abs(cameraState.lat).toFixed(3)}° S`}, {cameraState.lng >= 0 ? `${cameraState.lng.toFixed(3)}° E` : `${Math.abs(cameraState.lng).toFixed(3)}° W`}
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Zoom: <strong className="text-cyan-300">{cameraState.zoom.toFixed(1)}x</strong>
          </span>
        </div>

        {/* 5. Continent Presets */}
        <div className="absolute right-3 top-3 z-10 pointer-events-auto hidden md:flex items-center gap-1 bg-[#080d22]/90 backdrop-blur-md border border-[#1b2b5a] rounded-xl p-1 shadow-2xl font-mono text-[10px]">
          <span className="text-slate-400 px-1.5 uppercase font-semibold">Region:</span>
          {CONTINENT_PRESETS.slice(0, 5).map((preset) => (
            <button
              key={preset.name}
              onClick={() => handleSelectContinent(preset)}
              className="px-2 py-0.5 rounded-lg text-slate-300 hover:text-white hover:bg-blue-600/40 transition-colors"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
