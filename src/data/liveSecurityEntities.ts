export type EntityType = 'ATTACKER' | 'PROTECTED_USER' | 'SERVER' | 'ALERT_ZONE';

export interface SecurityEntity {
  id: string;
  name: string;
  type: EntityType;
  country: string;
  state: string;
  district: string;
  city: string;
  lat: number;
  lng: number;
  ip: string;
  status: string;
  statusColor: 'red' | 'green' | 'blue' | 'yellow';
  attackType?: string;
  targetServerId?: string;
  connectedServerId?: string;
  timestamp: string;
  details: {
    protocol?: string;
    port?: number;
    department?: string;
    os?: string;
    riskScore?: number;
    bandwidth?: string;
    description: string;
  };
}

export interface SecurityAttackPath {
  id: string;
  attackerId: string;
  targetServerId: string;
  vector: string;
  intensity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
  active: boolean;
  packetsPerSec: number;
}

export interface SecurityConnectionPath {
  id: string;
  userId: string;
  serverId: string;
  protocol: string;
  encryption: string;
  latencyMs: number;
}

export const INITIAL_SECURITY_ENTITIES: SecurityEntity[] = [
  // 1. New York City Cluster
  {
    id: 'atk-ny-01',
    name: 'ShadowCrawler Bot-Node #49',
    type: 'ATTACKER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7185,
    lng: -74.0080,
    ip: '198.51.100.23',
    status: 'ACTIVE ATTACKING',
    statusColor: 'red',
    attackType: 'DDoS / HTTP POST Flood',
    targetServerId: 'srv-ny-01',
    timestamp: 'Just now',
    details: {
      protocol: 'HTTPS:443',
      port: 443,
      riskScore: 98,
      bandwidth: '14.2 Gbps',
      description: 'Distributed L7 HTTP POST flood targeting core payment gateway memory pools.'
    }
  },
  {
    id: 'atk-ny-02',
    name: 'Cobalt-Relay Proxy Ingress',
    type: 'ATTACKER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7320,
    lng: -73.9920,
    ip: '185.220.101.5',
    status: 'PORT SCANNING',
    statusColor: 'red',
    attackType: 'Port Scan & SMB Recon',
    targetServerId: 'srv-ny-02',
    timestamp: '18s ago',
    details: {
      protocol: 'TCP:SYN',
      port: 445,
      riskScore: 92,
      bandwidth: '840 Mbps',
      description: 'High-speed SYN reconnaissance scanning database subnet ports 445, 139, and 3389.'
    }
  },
  {
    id: 'srv-ny-01',
    name: 'Core Payment Gateway VIP [NY-EAST-01]',
    type: 'SERVER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7128,
    lng: -74.0060,
    ip: '10.0.2.80',
    status: 'UNDER ATTACK - MITIGATING',
    statusColor: 'blue',
    timestamp: 'Active Online',
    details: {
      protocol: 'HTTPS / TLS 1.3',
      port: 443,
      bandwidth: '4.8 Gbps Ingress',
      os: 'Enterprise Hardened Linux 6.8',
      description: 'Primary ingress edge termination proxy with Layer-7 WAF rate-limiting engaged.'
    }
  },
  {
    id: 'srv-ny-02',
    name: 'Primary Financial DB Cluster [SQL-PROD]',
    type: 'SERVER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7060,
    lng: -74.0090,
    ip: '10.0.8.10',
    status: 'SECURED - ENCRYPTED',
    statusColor: 'blue',
    timestamp: 'Active Online',
    details: {
      protocol: 'PostgreSQL:5432',
      port: 5432,
      bandwidth: '120 MB/s',
      os: 'RHEL 9.4 CIS Benchmark Level 2',
      description: 'High-availability relational database cluster with zero unauthenticated socket leaks.'
    }
  },
  {
    id: 'usr-ny-01',
    name: 'Alex Vance (Staff SRE)',
    type: 'PROTECTED_USER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7250,
    lng: -74.0020,
    ip: '10.0.14.88',
    status: 'PROTECTED & MONITORED',
    statusColor: 'green',
    connectedServerId: 'srv-ny-01',
    timestamp: 'Active Session',
    details: {
      department: 'DevOps & Infrastructure',
      os: 'macOS Sonoma 14.5 (Managed MDM)',
      riskScore: 12,
      protocol: 'WireGuard mTLS',
      description: 'Hardware FIDO2 token verified. Encrypted tunnel operating with zero anomalies.'
    }
  },
  {
    id: 'usr-ny-02',
    name: 'Elena Rostova (SecOps Lead)',
    type: 'PROTECTED_USER',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7100,
    lng: -74.0150,
    ip: '10.0.12.35',
    status: 'ENCRYPTED TUNNEL ACTIVE',
    statusColor: 'green',
    connectedServerId: 'srv-ny-02',
    timestamp: 'Active Session',
    details: {
      department: 'Cyber Incident Response',
      os: 'Fedora Workstation 40',
      riskScore: 4,
      protocol: 'IPSec VPN (AES-256-GCM)',
      description: 'Lead Incident Commander observing real-time containment playbooks.'
    }
  },
  {
    id: 'zone-ny-01',
    name: 'DMZ Ingress Buffer Sector Alpha',
    type: 'ALERT_ZONE',
    country: 'United States',
    state: 'New York',
    district: 'New York County (Manhattan)',
    city: 'New York City',
    lat: 40.7220,
    lng: -73.9980,
    ip: '10.0.2.0/24 Subnet',
    status: 'SUSPICIOUS TRAFFIC BURST',
    statusColor: 'yellow',
    attackType: 'Unusual Traffic Pattern & Rate Spikes',
    timestamp: '2m ago',
    details: {
      riskScore: 78,
      bandwidth: 'Elevated (3.2 Gbps spike)',
      description: 'Unusual packet cadence and randomized User-Agent jitter detected by SIEM sensor.'
    }
  },

  // 2. Washington D.C. Cluster
  {
    id: 'atk-dc-01',
    name: 'Advanced Threat Actor APT-41 Node',
    type: 'ATTACKER',
    country: 'United States',
    state: 'District of Columbia',
    district: 'Capital Federal District',
    city: 'Washington, D.C.',
    lat: 38.9050,
    lng: -77.0420,
    ip: '198.18.0.89',
    status: 'FAILED AUTH SPRAY',
    statusColor: 'red',
    attackType: 'Multiple Failed Login Attempts',
    targetServerId: 'srv-dc-01',
    timestamp: '42s ago',
    details: {
      protocol: 'HTTPS / OAuth2',
      port: 443,
      riskScore: 94,
      description: '42 consecutive failed authentications followed by token spray attempt.'
    }
  },
  {
    id: 'srv-dc-01',
    name: 'Federal Gov Cloud Auth Cluster',
    type: 'SERVER',
    country: 'United States',
    state: 'District of Columbia',
    district: 'Capital Federal District',
    city: 'Washington, D.C.',
    lat: 38.8951,
    lng: -77.0364,
    ip: '10.100.4.10',
    status: 'ONLINE - FEDRAMP VERIFIED',
    statusColor: 'blue',
    timestamp: 'Active Online',
    details: {
      protocol: 'HTTPS / SAML 2.0',
      port: 443,
      os: 'RHEL 9.3 GovCloud',
      description: 'Central Identity Provider and Zero-Trust Access Gateway.'
    }
  },
  {
    id: 'usr-dc-01',
    name: 'Marcus Brody (Federal Analyst)',
    type: 'PROTECTED_USER',
    country: 'United States',
    state: 'District of Columbia',
    district: 'Capital Federal District',
    city: 'Washington, D.C.',
    lat: 38.8910,
    lng: -77.0320,
    ip: '10.100.12.4',
    status: 'AUTHENTICATED - SAFE',
    statusColor: 'green',
    connectedServerId: 'srv-dc-01',
    timestamp: 'Active Session',
    details: {
      department: 'Defense Intelligence',
      os: 'Windows 11 Enterprise (STIG Hardened)',
      riskScore: 8,
      protocol: 'CAC / PIV SmartCard',
      description: 'Federal security clearance credentialed operator.'
    }
  },
  {
    id: 'zone-dc-01',
    name: 'Capitol Network Perimeter Zone',
    type: 'ALERT_ZONE',
    country: 'United States',
    state: 'District of Columbia',
    district: 'Capital Federal District',
    city: 'Washington, D.C.',
    lat: 38.9000,
    lng: -77.0380,
    ip: '10.100.0.0/16 Subnet',
    status: 'SUSPICIOUS GEOLOCATION PROBES',
    statusColor: 'yellow',
    attackType: 'Suspicious Location Detected',
    timestamp: '6m ago',
    details: {
      riskScore: 71,
      description: 'Foreign ASN origin spoofing detected at boundary router interface.'
    }
  },

  // 3. San Francisco Cluster
  {
    id: 'atk-sf-01',
    name: 'Malware Drone C2 Beacon',
    type: 'ATTACKER',
    country: 'United States',
    state: 'California',
    district: 'San Francisco County',
    city: 'San Francisco',
    lat: 37.7850,
    lng: -72.4100, // Adjusted for local offset
    ip: '103.77.12.5',
    status: 'MALWARE BEACONING',
    statusColor: 'red',
    attackType: 'Malware Activity / Trojan C2',
    targetServerId: 'srv-sf-01',
    timestamp: '1m ago',
    details: {
      protocol: 'DNS Tunnel / UDP 53',
      port: 53,
      riskScore: 96,
      description: 'Encrypted DNS heartbeat pulses indicating Cobalt Strike or Sliver implant.'
    }
  },
  {
    id: 'srv-sf-01',
    name: 'Silicon Valley Cloud Edge Gateway',
    type: 'SERVER',
    country: 'United States',
    state: 'California',
    district: 'San Francisco County',
    city: 'San Francisco',
    lat: 37.7749,
    lng: -122.4194,
    ip: '10.40.1.1',
    status: 'FIREWALL ENFORCING',
    statusColor: 'blue',
    timestamp: 'Active Online',
    details: {
      protocol: 'BGP / Anycast DNS',
      port: 53,
      os: 'EdgeOS Core v4.1',
      description: 'Enterprise DNS sinkhole intercepting unauthorized exfiltration queries.'
    }
  },
  {
    id: 'usr-sf-01',
    name: 'Sarah Connor (Security Eng)',
    type: 'PROTECTED_USER',
    country: 'United States',
    state: 'California',
    district: 'San Francisco County',
    city: 'San Francisco',
    lat: 37.7790,
    lng: -122.4140,
    ip: '10.40.8.20',
    status: 'PROTECTED USER',
    statusColor: 'green',
    connectedServerId: 'srv-sf-01',
    timestamp: 'Active Session',
    details: {
      department: 'Product Security',
      os: 'macOS Sequoia 15.0',
      riskScore: 6,
      protocol: 'WireGuard Zero-Trust',
      description: 'Authenticated engineer running automated SAST/DAST verification pipelines.'
    }
  },
  {
    id: 'zone-sf-01',
    name: 'SOMA Tech Innovation Subnet Zone',
    type: 'ALERT_ZONE',
    country: 'United States',
    state: 'California',
    district: 'San Francisco County',
    city: 'San Francisco',
    lat: 37.7760,
    lng: -122.4080,
    ip: '10.40.0.0/20 Subnet',
    status: 'ANOMALY RATE SPIKE',
    statusColor: 'yellow',
    attackType: 'Port Scan Detected',
    timestamp: '8m ago',
    details: {
      riskScore: 65,
      description: 'Rapid TCP SYN scanning across ephemeral container ports 8000-9000.'
    }
  },

  // 4. London Cluster
  {
    id: 'atk-ldn-01',
    name: 'Bulletproof Tor Exit Ingress #12',
    type: 'ATTACKER',
    country: 'United Kingdom',
    state: 'England',
    district: 'Greater London / Westminster',
    city: 'London',
    lat: 51.5150,
    lng: -0.1180,
    ip: '194.26.29.112',
    status: 'CREDENTIAL STUFFING',
    statusColor: 'red',
    attackType: 'Multiple Failed Login Attempts',
    targetServerId: 'srv-ldn-01',
    timestamp: 'Just now',
    details: {
      protocol: 'HTTPS:443',
      port: 443,
      riskScore: 91,
      description: 'High-speed automated dictionary brute-force attacking Okta SSO portal.'
    }
  },
  {
    id: 'srv-ldn-01',
    name: 'London Financial Core Exchange Hub',
    type: 'SERVER',
    country: 'United Kingdom',
    state: 'England',
    district: 'Greater London / Westminster',
    city: 'London',
    lat: 51.5074,
    lng: -0.1278,
    ip: '10.20.0.1',
    status: 'ONLINE - PROTECTED',
    statusColor: 'blue',
    timestamp: 'Active Online',
    details: {
      protocol: 'FIX / mTLS TLS 1.3',
      port: 9800,
      os: 'Solaris 11.4 / Red Hat',
      description: 'High-frequency trading interface gateway with hardware HSM encryption.'
    }
  },
  {
    id: 'usr-ldn-01',
    name: 'Michael Scott (Risk Director)',
    type: 'PROTECTED_USER',
    country: 'United Kingdom',
    state: 'England',
    district: 'Greater London / Westminster',
    city: 'London',
    lat: 51.5020,
    lng: -0.1350,
    ip: '10.20.15.42',
    status: 'PROTECTED SESSION',
    statusColor: 'green',
    connectedServerId: 'srv-ldn-01',
    timestamp: 'Active Session',
    details: {
      department: 'EMEA Enterprise Operations',
      os: 'Windows 11 Enterprise',
      riskScore: 10,
      protocol: 'ZTNA Client',
      description: 'User operating inside verified corporate geofence with bio-MFA active.'
    }
  },
  {
    id: 'zone-ldn-01',
    name: 'Canary Wharf High-Density Banking Sector',
    type: 'ALERT_ZONE',
    country: 'United Kingdom',
    state: 'England',
    district: 'Greater London / Westminster',
    city: 'London',
    lat: 51.5050,
    lng: -0.1200,
    ip: '10.20.0.0/16 Subnet',
    status: 'DDOS VOLUMETRIC SURGE',
    statusColor: 'yellow',
    attackType: 'DDoS/Network Attack Detected',
    timestamp: '4m ago',
    details: {
      riskScore: 84,
      description: 'SYN flood spike exceeding 18,000 pps detected at core Tier 1 uplink.'
    }
  }
];

export const INITIAL_ATTACK_PATHS: SecurityAttackPath[] = [
  {
    id: 'path-atk-1',
    attackerId: 'atk-ny-01',
    targetServerId: 'srv-ny-01',
    vector: 'L7 HTTP Flood / 14.2 Gbps',
    intensity: 'CRITICAL',
    active: true,
    packetsPerSec: 14200
  },
  {
    id: 'path-atk-2',
    attackerId: 'atk-ny-02',
    targetServerId: 'srv-ny-02',
    vector: 'SMB:445 Sweep / Recon',
    intensity: 'HIGH',
    active: true,
    packetsPerSec: 1840
  },
  {
    id: 'path-atk-3',
    attackerId: 'atk-dc-01',
    targetServerId: 'srv-dc-01',
    vector: 'Credential Spray / OAuth2',
    intensity: 'HIGH',
    active: true,
    packetsPerSec: 860
  },
  {
    id: 'path-atk-4',
    attackerId: 'atk-sf-01',
    targetServerId: 'srv-sf-01',
    vector: 'DNS Tunnel / C2 Beacon',
    intensity: 'CRITICAL',
    active: true,
    packetsPerSec: 340
  },
  {
    id: 'path-atk-5',
    attackerId: 'atk-ldn-01',
    targetServerId: 'srv-ldn-01',
    vector: 'Password Spray / SSO Token',
    intensity: 'HIGH',
    active: true,
    packetsPerSec: 1120
  }
];

export const INITIAL_CONNECTION_PATHS: SecurityConnectionPath[] = [
  {
    id: 'conn-usr-1',
    userId: 'usr-ny-01',
    serverId: 'srv-ny-01',
    protocol: 'WireGuard mTLS',
    encryption: 'ChaCha20-Poly1305',
    latencyMs: 1.8
  },
  {
    id: 'conn-usr-2',
    userId: 'usr-ny-02',
    serverId: 'srv-ny-02',
    protocol: 'IPSec VPN Tunnel',
    encryption: 'AES-256-GCM',
    latencyMs: 2.4
  },
  {
    id: 'conn-usr-3',
    userId: 'usr-dc-01',
    serverId: 'srv-dc-01',
    protocol: 'Zero-Trust ZTNA',
    encryption: 'TLS 1.3 / AES-256',
    latencyMs: 3.1
  },
  {
    id: 'conn-usr-4',
    userId: 'usr-sf-01',
    serverId: 'srv-sf-01',
    protocol: 'WireGuard Encrypted',
    encryption: 'ChaCha20-Poly1305',
    latencyMs: 1.2
  },
  {
    id: 'conn-usr-5',
    userId: 'usr-ldn-01',
    serverId: 'srv-ldn-01',
    protocol: 'ZTNA Corporate Mesh',
    encryption: 'TLS 1.3 Strict',
    latencyMs: 4.6
  }
];

export interface LiveAlertEvent {
  id: string;
  type: 
    | 'Suspicious Location Detected' 
    | 'Port Scan Detected' 
    | 'Multiple Failed Login Attempts' 
    | 'DDoS/Network Attack Detected' 
    | 'Malware Activity' 
    | 'Unusual Traffic Pattern';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  sourceName: string;
  sourceIp: string;
  targetAsset: string;
  city: string;
  country: string;
  timestamp: string;
  description: string;
  mitigated: boolean;
}

export const INITIAL_LIVE_ALERT_EVENTS: LiveAlertEvent[] = [
  {
    id: 'EVT-501',
    type: 'DDoS/Network Attack Detected',
    severity: 'CRITICAL',
    sourceName: 'Botnet Swarm [Mirai-v4]',
    sourceIp: '198.51.100.23',
    targetAsset: 'Core Payment Gateway VIP [NY-EAST-01]',
    city: 'New York City',
    country: 'United States',
    timestamp: 'Just now',
    description: '14,200 RPS HTTP POST volumetric flood targeting checkout endpoint with randomized TLS handshakes.',
    mitigated: false
  },
  {
    id: 'EVT-502',
    type: 'Suspicious Location Detected',
    severity: 'HIGH',
    sourceName: 'Unknown Foreign Host',
    sourceIp: '185.220.101.5',
    targetAsset: 'Federal Gov Cloud Auth Cluster',
    city: 'Washington, D.C.',
    country: 'United States',
    timestamp: '24s ago',
    description: 'Authentication token presented from foreign proxy ASN while user baseline is domestic US.',
    mitigated: false
  },
  {
    id: 'EVT-503',
    type: 'Multiple Failed Login Attempts',
    severity: 'CRITICAL',
    sourceName: 'Automated Spray Script',
    sourceIp: '194.26.29.112',
    targetAsset: 'London Financial Core Exchange Hub',
    city: 'London',
    country: 'United Kingdom',
    timestamp: '1m ago',
    description: '90+ failed authentication requests recorded in 60 seconds against Single Sign-On portal.',
    mitigated: false
  },
  {
    id: 'EVT-504',
    type: 'Port Scan Detected',
    severity: 'HIGH',
    sourceName: 'Workstation-Fin-08',
    sourceIp: '10.0.12.44',
    targetAsset: 'Primary Financial DB Cluster [SQL-PROD]',
    city: 'New York City',
    country: 'United States',
    timestamp: '2m ago',
    description: 'Rapid port sweep targeting ports 445, 139, and 3389 across restricted database subnet.',
    mitigated: true
  },
  {
    id: 'EVT-505',
    type: 'Malware Activity',
    severity: 'CRITICAL',
    sourceName: 'Malware Drone C2 Beacon',
    sourceIp: '103.77.12.5',
    targetAsset: 'Silicon Valley Cloud Edge Gateway',
    city: 'San Francisco',
    country: 'United States',
    timestamp: '4m ago',
    description: 'Trojan C2 beaconing pattern detected over covert DNS tunnel queries every 45 seconds.',
    mitigated: false
  },
  {
    id: 'EVT-506',
    type: 'Unusual Traffic Pattern',
    severity: 'MEDIUM',
    sourceName: 'DMZ Ingress Buffer Sector Alpha',
    sourceIp: '10.0.2.0/24 Subnet',
    targetAsset: 'Web Server Gateway [api.enterprise.com]',
    city: 'New York City',
    country: 'United States',
    timestamp: '7m ago',
    description: 'Bandwidth utilization surged 340% above 30-day baseline during non-operational off-hours.',
    mitigated: false
  }
];
