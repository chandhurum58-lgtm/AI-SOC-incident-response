import { 
  Alert, 
  Incident, 
  Prediction, 
  RiskyUser, 
  MonitoredDevice, 
  MonitoredWebsite, 
  ThreatIntelligence, 
  GlobalThreatPoint, 
  MitreTechniqueMapping, 
  ActivityFeedItem,
  SocStats,
  AttackPathNode,
  AttackPathLink,
  ResponseSimulation,
  SystemNotification
} from '../types/soc';

export const initialSocStats: SocStats = {
  totalAttacksDetected: 14892,
  criticalIncidents: 4,
  highRiskIncidents: 9,
  mediumRiskIncidents: 18,
  lowRiskIncidents: 42,
  activeThreats: 13,
  resolvedIncidents: 387,
  blockedAttacks: 14470,
  suspiciousActivities: 86,
  riskyUsersCount: 7,
  monitoredDevicesCount: 342,
  activeServersCount: 68,
  monitoredWebsitesCount: 14,
  currentNetworkTrafficMbps: 842.6,
  aiPredictionsCount: 6,
  securityScore: 84,
  systemHealthPercent: 99.8,
};

export const initialAlerts: Alert[] = [
  {
    id: 'ALT-9821',
    incidentId: 'INC-8402',
    timestamp: '2 mins ago',
    sourceIp: '198.51.100.23',
    destinationIp: '10.0.4.12',
    sourceDevice: 'External-Host [AS13335]',
    destinationServer: 'Auth-Cluster-Alpha [auth.portal.org]',
    username: 'alex.vance@enterprise.com',
    attackType: 'Suspicious Authentication Activity',
    protocol: 'HTTPS',
    port: 443,
    severity: 'HIGH',
    confidenceScore: 94,
    detectionReason: 'Multiple failed authentication attempts followed by abnormal successful login from foreign proxy ASN.',
    affectedAsset: 'Auth-Cluster-Alpha & User: alex.vance',
    currentStatus: 'INVESTIGATING',
    recommendedAction: 'Terminate active user session, revoke OAuth refresh tokens, and enforce step-up MFA challenge.',
    mitreTechnique: 'Brute Force: Password Spraying',
    mitreTactic: 'Credential Access',
    mitreId: 'T1110.003'
  },
  {
    id: 'ALT-9820',
    incidentId: 'INC-8401',
    timestamp: '7 mins ago',
    sourceIp: '185.220.101.5',
    destinationIp: '10.0.2.80',
    sourceDevice: 'TOR-Exit-Relay [AS208323]',
    destinationServer: 'Web-Gateway-02 [api.enterprise.com]',
    username: 'SYSTEM / Anonymous',
    attackType: 'L7 HTTP Request Flooding (DDoS)',
    protocol: 'HTTPS',
    port: 443,
    severity: 'CRITICAL',
    confidenceScore: 98,
    detectionReason: 'Incoming RPS spike of 14,200 req/sec with randomized user-agent hashes targeting payment checkout API.',
    affectedAsset: 'Web-Gateway-02 & Payment Service',
    currentStatus: 'CONFIRMED',
    recommendedAction: 'Apply rate-limiting rule (50 req/min per IP) and trigger automated Cloudflare CAPTCHA challenge.',
    mitreTechnique: 'Network Denial of Service: Direct Network Flood',
    mitreTactic: 'Impact',
    mitreId: 'T1498.001'
  },
  {
    id: 'ALT-9819',
    incidentId: 'INC-8403',
    timestamp: '14 mins ago',
    sourceIp: '10.0.12.44',
    destinationIp: '10.0.8.10',
    sourceDevice: 'Workstation-Fin-08',
    destinationServer: 'DB-Primary-Cluster [Customer Records]',
    username: 'sarah.connor@enterprise.com',
    attackType: 'Potential Lateral Movement & Port Scan',
    protocol: 'TCP / SMB',
    port: 445,
    severity: 'CRITICAL',
    confidenceScore: 91,
    detectionReason: 'Workstation initiated internal port sweeps on ports 445, 139, and 3389 across subnet 10.0.8.0/24.',
    affectedAsset: 'Workstation-Fin-08 & DB-Primary-Cluster',
    currentStatus: 'INVESTIGATING',
    recommendedAction: 'Quarantine Workstation-Fin-08 from VLAN-20 Corp and inspect memory dump for Cobalt Strike beacons.',
    mitreTechnique: 'Network Service Discovery',
    mitreTactic: 'Discovery',
    mitreId: 'T1046'
  },
  {
    id: 'ALT-9818',
    incidentId: 'INC-8399',
    timestamp: '28 mins ago',
    sourceIp: '45.33.32.156',
    destinationIp: '10.0.3.15',
    sourceDevice: 'Known Scanner [Linode]',
    destinationServer: 'App-Server-Prod-01',
    username: 'N/A',
    attackType: 'SQL Injection Probe',
    protocol: 'HTTP',
    port: 80,
    severity: 'MEDIUM',
    confidenceScore: 89,
    detectionReason: 'Payload contained UNION SELECT query fragments in HTTP query parameters.',
    affectedAsset: 'App-Server-Prod-01',
    currentStatus: 'CONTAINED',
    recommendedAction: 'WAF rule #4023 automatically blocked query payload; review WAF audit logs.',
    mitreTechnique: 'Exploit Public-Facing Application',
    mitreTactic: 'Initial Access',
    mitreId: 'T1190'
  },
  {
    id: 'ALT-9817',
    incidentId: 'INC-8395',
    timestamp: '42 mins ago',
    sourceIp: '192.168.10.89',
    destinationIp: '192.168.10.1',
    sourceDevice: 'Unknown-Rogue-MacBook',
    destinationServer: 'Core-Switch-Gateway',
    username: 'unauthenticated',
    attackType: 'Unauthorized Rogue Device Connected',
    protocol: 'DHCP / ARP',
    port: 67,
    severity: 'HIGH',
    confidenceScore: 95,
    detectionReason: 'Unregistered MAC 3C:06:30:4A:8B:2F joined Corporate Wi-Fi without 802.1X enterprise certificate.',
    affectedAsset: 'VLAN-Corp-WiFi',
    currentStatus: 'CONTAINED',
    recommendedAction: 'Port shut down on AP-West-03; MAC address blacklisted from RADIUS.',
    mitreTechnique: 'Rogue Device Insertion',
    mitreTactic: 'Initial Access',
    mitreId: 'T1200'
  },
  {
    id: 'ALT-9816',
    incidentId: 'INC-8390',
    timestamp: '1 hour ago',
    sourceIp: '203.0.113.88',
    destinationIp: '10.0.1.5',
    sourceDevice: 'External IP [Tokyo, JP]',
    destinationServer: 'Mail-Relay-Exchange',
    username: 'm.scott@enterprise.com',
    attackType: 'Suspicious Cookie Theft Indicator',
    protocol: 'HTTPS',
    port: 443,
    severity: 'MEDIUM',
    confidenceScore: 86,
    detectionReason: 'Valid session cookie replayed from an anomalous IP with disparate browser fingerprint within 3 minutes of NY login.',
    affectedAsset: 'User Account: m.scott',
    currentStatus: 'RESOLVED',
    recommendedAction: 'Session invalidated; user forced to complete FIDO2 hardware token verification.',
    mitreTechnique: 'Steal Web Session Cookie',
    mitreTactic: 'Credential Access',
    mitreId: 'T1539'
  },
  {
    id: 'ALT-9815',
    timestamp: '1 hour ago',
    sourceIp: '198.18.0.5',
    destinationIp: '10.0.4.50',
    sourceDevice: 'Benchmark-Tester',
    destinationServer: 'DNS-Internal-01',
    username: 'sysadmin',
    attackType: 'DNS Query Volume Anomaly',
    protocol: 'DNS',
    port: 53,
    severity: 'LOW',
    confidenceScore: 72,
    detectionReason: 'DNS request volume increased by 35% above hourly baseline during scheduled replication.',
    affectedAsset: 'DNS-Internal-01',
    currentStatus: 'RESOLVED',
    recommendedAction: 'Verified with DevOps team as scheduled backup replication task.',
    mitreTechnique: 'Protocol Tunneling: DNS',
    mitreTactic: 'Command and Control',
    mitreId: 'T1572'
  },
  {
    id: 'ALT-9814',
    timestamp: '2 hours ago',
    sourceIp: '10.0.1.200',
    destinationIp: '10.0.1.254',
    sourceDevice: 'Dev-Node-Linux-4',
    destinationServer: 'Syslog-Collector',
    username: 'jenkins-ci',
    attackType: 'Certificate Expiration Warning',
    protocol: 'TLS',
    port: 6514,
    severity: 'INFO',
    confidenceScore: 99,
    detectionReason: 'mTLS Client Certificate for Dev-Node expires in 7 days.',
    affectedAsset: 'Dev-Node-Linux-4',
    currentStatus: 'RESOLVED',
    recommendedAction: 'Automated cert-manager renewal triggered.',
    mitreTechnique: 'Valid Accounts',
    mitreTactic: 'Defense Evasion',
    mitreId: 'T1078'
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'INC-8402',
    title: 'Anomalous Credential Access & Potential Session Hijacking',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    assignedAnalyst: 'Marcus Brody (Tier 2 SOC)',
    createdAt: '2026-10-05 22:45:12 UTC',
    updatedAt: '2026-10-05 23:01:40 UTC',
    attackType: 'Credential Access / Password Spray',
    sourceIp: '198.51.100.23',
    targetAsset: 'Auth-Cluster-Alpha & alex.vance@enterprise.com',
    detectionReason: 'Multiple failed authentication attempts across 14 employee accounts from single foreign ASN, followed by successful authentication for alex.vance.',
    aiConfidence: 94,
    aiAnalysis: {
      whatHappened: 'An external threat source located in AS13335 conducted a multi-target password spray against the corporate OAuth2 endpoint. After 42 failed attempts across several accounts, a successful login was recorded for user alex.vance.',
      whySuspicious: "The login originated from a commercial VPN/proxy IP address with no prior history for this user. Furthermore, the device user-agent header differed completely from the user's registered managed MacBook, yet succeeded using valid credentials.",
      affectedAssets: [
        { category: 'SERVER', name: 'Auth-Cluster-Alpha', identifier: '10.0.4.12', status: 'MONITORED', riskScore: 78 },
        { category: 'USER', name: 'alex.vance@enterprise.com', identifier: 'USR-8902', status: 'COMPROMISED', riskScore: 88 },
        { category: 'APPLICATION', name: 'OAuth2 Single Sign-On Gateway', identifier: 'auth.portal.org', status: 'MONITORED', riskScore: 65 },
        { category: 'NETWORK', name: 'DMZ Authentication Subnet', identifier: 'VLAN-10-DMZ', status: 'SECURED', riskScore: 30 }
      ],
      attackClassification: {
        tactic: 'Credential Access',
        technique: 'Password Spraying',
        techniqueId: 'T1110.003',
        subTechnique: 'Automated Spray',
        category: 'Identity-based Attack'
      },
      confidence: {
        overallPercentage: 94,
        factors: [
          { factor: 'Disparate IP Geolocation vs User Baseline', score: 98 },
          { factor: 'Consecutive Failed Login Heuristics', score: 92 },
          { factor: 'Unrecognized Device Hardware Fingerprint', score: 95 },
          { factor: 'Time-of-Day Anomaly (04:12 local time)', score: 91 }
        ]
      },
      riskAssessment: {
        currentRisk: 84,
        potentialImpact: 'HIGH',
        possibleNextAttackStage: 'Privilege Escalation via internal cloud services or Lateral Movement to customer database.',
        assetsAtRisk: ['DB-Primary-Cluster', 'Internal Employee Directory', 'Financial Services API'],
        potentialFinancialOrDataLoss: 'Unauthorized access to customer PII or confidential company financial projections.'
      }
    },
    evidence: [
      {
        id: 'EV-101',
        timestamp: '22:42:01 UTC',
        type: 'AUTH',
        source: 'Auth-Cluster-Alpha /var/log/auth.log',
        raw: 'Oct 05 22:42:01 auth-01 sshd[19021]: Failed password for invalid user r.smith from 198.51.100.23 port 54122'
      },
      {
        id: 'EV-102',
        timestamp: '22:43:18 UTC',
        type: 'LOG',
        source: 'WAF Ingress Gateway',
        raw: 'POST /oauth/token HTTP/1.1 401 Unauthorized - ClientIP: 198.51.100.23 - User: d.clark'
      },
      {
        id: 'EV-103',
        timestamp: '22:44:50 UTC',
        type: 'AUTH',
        source: 'Okta / Azure AD Sync',
        raw: 'POST /oauth/token HTTP/1.1 200 OK - ClientIP: 198.51.100.23 - User: alex.vance - Device: Unknown_Linux_x86'
      }
    ],
    responseActions: [
      {
        id: 'ACT-01',
        actionNumber: 1,
        title: 'Revoke Active User Session & OAuth Tokens',
        description: 'Terminate all active JWT tokens and invalidate current cookie session for alex.vance across all internal applications.',
        targetAsset: 'alex.vance@enterprise.com',
        justification: 'Prevents the adversary from using the compromised credentials to access internal systems.',
        requiresApproval: false,
        isDestructive: false,
        approvalStatus: 'APPROVED',
        executionStatus: 'EXECUTED',
        verificationResult: 'VERIFIED_CONTAINED',
        simulatedReduction: 60
      },
      {
        id: 'ACT-02',
        actionNumber: 2,
        title: 'Block Malicious Source IP on Perimeter WAF',
        description: 'Add 198.51.100.23 to edge firewall banlist (IPTables / AWS WAF IPSet) for 72 hours.',
        targetAsset: 'Perimeter WAF Gateway',
        justification: 'Halts continued brute force and API enumeration attempts from this host.',
        requiresApproval: true,
        isDestructive: false,
        approvalStatus: 'PENDING',
        executionStatus: 'NOT_STARTED',
        simulatedReduction: 25
      },
      {
        id: 'ACT-03',
        actionNumber: 3,
        title: 'Force Enterprise Password Reset & FIDO2 Enrollment',
        description: 'Expire user password and mandate in-person or hardware key verification before unlocking account.',
        targetAsset: 'alex.vance@enterprise.com',
        justification: 'Ensures credentials cannot be re-used even if adversary maintains local persistence.',
        requiresApproval: true,
        isDestructive: false,
        approvalStatus: 'PENDING',
        executionStatus: 'NOT_STARTED',
        simulatedReduction: 15
      }
    ],
    notes: [
      {
        id: 'NOTE-1',
        author: 'Marcus Brody',
        timestamp: '22:52:10 UTC',
        text: 'Contacted user Alex Vance via encrypted phone channel to confirm physical location. User is currently in Seattle, WA and confirmed they did NOT attempt to login.'
      }
    ]
  },
  {
    id: 'INC-8401',
    title: 'Layer-7 DDoS Flooding on Production Payment API',
    severity: 'CRITICAL',
    status: 'CONFIRMED',
    assignedAnalyst: 'Elena Rostova (Lead Incident Commander)',
    createdAt: '2026-10-05 22:30:00 UTC',
    updatedAt: '2026-10-05 22:58:12 UTC',
    attackType: 'Distributed Denial of Service (L7 Flood)',
    sourceIp: '185.220.101.5 & Botnet Swarm',
    targetAsset: 'Web-Gateway-02 [api.enterprise.com]',
    detectionReason: 'Incoming RPS reached 14,200 req/sec exceeding 3x 99th percentile threshold.',
    aiConfidence: 98,
    aiAnalysis: {
      whatHappened: 'A distributed botnet swarm originated an HTTP POST flood directed at the /v2/checkout/process endpoint, generating synthetic TLS handshakes designed to exhaust web application memory pools.',
      whySuspicious: 'Request rates surged 450% within 45 seconds with absent session headers and invalid Referer headers.',
      affectedAssets: [
        { category: 'SERVER', name: 'Web-Gateway-02', identifier: '10.0.2.80', status: 'COMPROMISED', riskScore: 95 },
        { category: 'APPLICATION', name: 'Payment API Service', identifier: 'api.enterprise.com', status: 'COMPROMISED', riskScore: 92 },
        { category: 'DATABASE', name: 'Redis Cache Cluster', identifier: '10.0.6.14', status: 'AT_RISK', riskScore: 70 }
      ],
      attackClassification: {
        tactic: 'Impact',
        technique: 'Endpoint Denial of Service',
        techniqueId: 'T1499.003',
        subTechnique: 'HTTP POST Flood',
        category: 'Availability Disruption'
      },
      confidence: {
        overallPercentage: 98,
        factors: [
          { factor: 'RPS Volumetric Deviation (>350%)', score: 99 },
          { factor: 'Anomalous User-Agent Jitter', score: 98 },
          { factor: 'Zero Human Interaction Telemetry', score: 97 }
        ]
      },
      riskAssessment: {
        currentRisk: 96,
        potentialImpact: 'CRITICAL',
        possibleNextAttackStage: 'Application exhaustion leading to cascading failover of primary relational database.',
        assetsAtRisk: ['Checkout Gateway', 'Customer Invoicing API', 'Core Redis Broker'],
        potentialFinancialOrDataLoss: 'Estimated $45,000/hr revenue loss during active service outage.'
      }
    },
    evidence: [
      {
        id: 'EV-201',
        timestamp: '22:30:15 UTC',
        type: 'LOG',
        source: 'Nginx Ingress Load Balancer',
        raw: '2026-10-05T22:30:15Z [error] 14201#14201: *894121 limiting requests, excess: 52.810 by zone "checkout_limit", client: 185.220.101.5'
      }
    ],
    responseActions: [
      {
        id: 'ACT-11',
        actionNumber: 1,
        title: 'Activate Layer-7 Managed DDoS Scrubbing',
        description: 'Route all incoming ingress traffic through Cloudflare Advanced Shield with JS Challenge enabled.',
        targetAsset: 'api.enterprise.com',
        justification: 'Filters automated bot requests while permitting validated human traffic.',
        requiresApproval: false,
        isDestructive: false,
        approvalStatus: 'APPROVED',
        executionStatus: 'EXECUTED',
        verificationResult: 'TRAFFIC_NORMALIZED',
        simulatedReduction: 85
      }
    ],
    notes: []
  },
  {
    id: 'INC-8403',
    title: 'Potential Lateral Movement & Internal SMB Probe',
    severity: 'CRITICAL',
    status: 'INVESTIGATING',
    assignedAnalyst: 'Sarah Jenkins (Forensic Specialist)',
    createdAt: '2026-10-05 22:15:00 UTC',
    updatedAt: '2026-10-05 22:50:30 UTC',
    attackType: 'Internal Lateral Movement',
    sourceIp: '10.0.12.44',
    targetAsset: 'DB-Primary-Cluster [10.0.8.10]',
    detectionReason: 'Finance workstation initiated unauthorized SMB probe across database segment.',
    aiConfidence: 91,
    aiAnalysis: {
      whatHappened: 'Workstation-Fin-08 exhibited abnormal process injection (powershell.exe executing encoded command) followed by SYN scans on ports 445 and 3389.',
      whySuspicious: 'Finance department machines are strictly prohibited from establishing direct socket connections with Database subnet 10.0.8.0/24.',
      affectedAssets: [
        { category: 'DEVICE', name: 'Workstation-Fin-08', identifier: '10.0.12.44', status: 'COMPROMISED', riskScore: 92 },
        { category: 'SERVER', name: 'DB-Primary-Cluster', identifier: '10.0.8.10', status: 'AT_RISK', riskScore: 84 }
      ],
      attackClassification: {
        tactic: 'Lateral Movement',
        technique: 'Remote Services: SMB/Windows Admin Shares',
        techniqueId: 'T1021.002',
        category: 'Internal Pivot'
      },
      confidence: {
        overallPercentage: 91,
        factors: [
          { factor: 'Out-of-VLAN Direct Probe', score: 96 },
          { factor: 'Encoded CLI Argument Flag', score: 90 }
        ]
      },
      riskAssessment: {
        currentRisk: 89,
        potentialImpact: 'CRITICAL',
        possibleNextAttackStage: 'Privilege escalation to Domain Admin and data staging for exfiltration.',
        assetsAtRisk: ['Active Directory Domain Controller', 'Customer Database'],
        potentialFinancialOrDataLoss: 'High risk of ransomware deployment or corporate secrets theft.'
      }
    },
    evidence: [],
    responseActions: [
      {
        id: 'ACT-21',
        actionNumber: 1,
        title: 'Isolate Host from Internal Network',
        description: 'Send EDR agent quarantine instruction to sever all network adapters except SOC control tunnel.',
        targetAsset: 'Workstation-Fin-08',
        justification: 'Halts adversary lateral spread instantly.',
        requiresApproval: true,
        isDestructive: true,
        approvalStatus: 'PENDING',
        executionStatus: 'NOT_STARTED',
        simulatedReduction: 90
      }
    ],
    notes: []
  }
];

export const initialAttackPathNodes: AttackPathNode[] = [
  {
    id: 'node-1',
    label: 'External Adversary',
    type: 'ATTACKER',
    stage: 'INITIAL_ACCESS',
    status: 'ACTIVE_THREAT',
    ipOrIdentifier: '198.51.100.23 [AS13335]',
    description: 'Threat actor utilizing bulletproof proxy infrastructure.',
    evidenceSnippet: 'Originating SYN packets with spoofed headers'
  },
  {
    id: 'node-2',
    label: 'Public Edge Gateway',
    type: 'GATEWAY',
    stage: 'INITIAL_ACCESS',
    status: 'MONITORED',
    ipOrIdentifier: 'WAF-Cluster-East [198.51.100.1]',
    description: 'Edge security perimeter and TLS termination.',
    evidenceSnippet: '14,200 incoming connections logged'
  },
  {
    id: 'node-3',
    label: 'Web Application API',
    type: 'WEB_APP',
    stage: 'DISCOVERY',
    status: 'MONITORED',
    ipOrIdentifier: 'api.enterprise.com',
    description: 'Reverse proxy dispatching authentication requests.',
    evidenceSnippet: 'HTTP 401 response volume spike'
  },
  {
    id: 'node-4',
    label: 'Auth Endpoint',
    type: 'AUTH',
    stage: 'CREDENTIAL_ACCESS',
    status: 'COMPROMISED',
    ipOrIdentifier: '/oauth/token [Auth-Cluster-Alpha]',
    description: 'OAuth2 server processing password grant tokens.',
    evidenceSnippet: 'Successful authentication token issued after 42 failures'
  },
  {
    id: 'node-5',
    label: 'User Account',
    type: 'USER_ACCOUNT',
    stage: 'PRIVILEGE_ESCALATION',
    status: 'COMPROMISED',
    ipOrIdentifier: 'alex.vance@enterprise.com',
    description: 'Senior DevOps Engineer with production database read permissions.',
    evidenceSnippet: 'Valid session cookie replayed from anomalous IP'
  },
  {
    id: 'node-6',
    label: 'Internal Microservice',
    type: 'INTERNAL_SERVER',
    stage: 'LATERAL_MOVEMENT',
    status: 'AT_RISK',
    ipOrIdentifier: 'Core-Billing-Svc [10.0.5.22]',
    description: 'Internal gRPC service with service-account tokens.',
    evidenceSnippet: 'Unauthorized token presentation attempt detected'
  },
  {
    id: 'node-7',
    label: 'Primary Database Cluster',
    type: 'DATABASE',
    stage: 'DATA_ACCESS',
    status: 'SECURE',
    ipOrIdentifier: 'DB-Primary-Cluster [10.0.8.10]',
    description: 'Encrypted PostgreSQL cluster hosting 2.4M customer records.',
    evidenceSnippet: 'Zero unauthorized queries executed to date'
  },
  {
    id: 'node-8',
    label: 'Potential Data Exfiltration',
    type: 'EXFILTRATION',
    stage: 'EXFILTRATION',
    status: 'SECURE',
    ipOrIdentifier: 'S3 / External Drop Bucket',
    description: 'Adversary goal: Exfiltrate customer PII and credentials.',
    evidenceSnippet: 'Blocked by egress firewall rule #902'
  }
];

export const initialAttackPathLinks: AttackPathLink[] = [
  { source: 'node-1', target: 'node-2', label: 'Probing & TLS Probe', protocol: 'HTTPS:443', isThreatFlow: true, status: 'ACTIVE' },
  { source: 'node-2', target: 'node-3', label: 'WAF Ingress Pass', protocol: 'HTTP:8080', isThreatFlow: true, status: 'ACTIVE' },
  { source: 'node-3', target: 'node-4', label: 'Credential Spray', protocol: 'HTTPS:443', isThreatFlow: true, status: 'ACTIVE' },
  { source: 'node-4', target: 'node-5', label: 'Token Issuance (Compromise)', protocol: 'JWT Bearer', isThreatFlow: true, status: 'ACTIVE' },
  { source: 'node-5', target: 'node-6', label: 'Lateral Probe Attempt', protocol: 'gRPC:9000', isThreatFlow: true, status: 'SUSPECTED' },
  { source: 'node-6', target: 'node-7', label: 'Potential DB Query', protocol: 'Postgres:5432', isThreatFlow: false, status: 'BLOCKED' },
  { source: 'node-7', target: 'node-8', label: 'Data Exfiltration Path', protocol: 'HTTPS Egress', isThreatFlow: false, status: 'BLOCKED' }
];

export const initialPredictions: Prediction[] = [
  {
    id: 'PRED-101',
    predictedThreat: 'Targeted Credential Access against Engineering Leads',
    probability: 88,
    risk: 'HIGH',
    timeHorizon: 'Next 2-4 hours',
    targetAsset: 'Okta SSO / Engineering Department',
    supportingIndicators: [
      'Repeated password spray targeting DevOps usernames in alphanumeric sequence.',
      'Unusual login origin ASN matching known bulletproof hosting infrastructure.',
      'Abnormal timing pattern matching automated brute-force scripts with jitter.',
      'Recent credential dump matching 3 corporate email domains discovered on darknet forum.'
    ],
    recommendedPrevention: [
      'Enforce hardware FIDO2 MFA challenge for all users in "DevOps & Engineering" security group.',
      'Temporarily rate-limit /oauth/token endpoint to 5 attempts/min per IP.',
      'Enable strict geo-fencing on AWS/Cloudflare edge rules for non-operational regions.',
      'Audit AWS IAM access keys created within last 24 hours.'
    ],
    mitreNextTechnique: 'T1078.004 - Cloud Accounts: Valid Accounts Misuse',
    isConfirmed: false,
    status: 'PREDICTED'
  },
  {
    id: 'PRED-102',
    predictedThreat: 'Lateral Movement toward Internal Database Subnet',
    probability: 76,
    risk: 'CRITICAL',
    timeHorizon: 'Next 6 hours',
    targetAsset: 'DB-Primary-Cluster [10.0.8.10]',
    supportingIndicators: [
      'Reconnaissance probes detected from Workstation-Fin-08 scanning port 445.',
      'Unusual Kerberos service ticket requests (SPN enumeration) detected by Active Directory.',
      'Execution of signed PowerShell binaries from temporary user directory.'
    ],
    recommendedPrevention: [
      'Isolate Workstation-Fin-08 immediately via EDR host quarantine.',
      'Revoke Kerberos TGT tickets issued to compromised workstation accounts.',
      'Enable micro-segmentation rules blocking inter-VLAN SMB traffic.'
    ],
    mitreNextTechnique: 'T1021.002 - SMB/Windows Admin Shares',
    isConfirmed: false,
    status: 'MONITORING'
  },
  {
    id: 'PRED-103',
    predictedThreat: 'Secondary Distributed DDoS Surge upon WAF Cache Expiry',
    probability: 64,
    risk: 'MEDIUM',
    timeHorizon: 'Next 12 hours',
    targetAsset: 'api.enterprise.com',
    supportingIndicators: [
      'Historical botnet behavior indicates second wave 4 hours after initial probe.',
      'Distributed command and control heartbeat pings detected on external threat feeds.',
      'Low-volume SYN pulses testing WAF rate-limiting response latency.'
    ],
    recommendedPrevention: [
      'Pre-warm upstream CDN edge caching rules for API metadata responses.',
      'Tighten SYN flood thresholds on perimeter Juniper edge routers.',
      'Alert on-call network engineering team.'
    ],
    mitreNextTechnique: 'T1498 - Network Denial of Service',
    isConfirmed: false,
    status: 'PREDICTED'
  }
];

export const initialSimulation: ResponseSimulation = {
  id: 'SIM-901',
  incidentId: 'INC-8402',
  attackType: 'Credential Attack & Unauthorized Session Hijack',
  steps: [
    {
      stepNumber: 1,
      title: 'Identify & Fingerprint Suspicious Source',
      description: 'Correlate incoming IP 198.51.100.23 with threat intel feeds and identify ASN 13335 proxy rotation.',
      target: '198.51.100.23',
      status: 'SIMULATED',
      isDisruptive: false,
      actionType: 'RATE_LIMIT'
    },
    {
      stepNumber: 2,
      title: 'Elevate Telemetry & Continuous Audit',
      description: 'Increase debug logging on Auth-Cluster-Alpha to capture full headers and payload hashes.',
      target: 'Auth-Cluster-Alpha',
      status: 'SIMULATED',
      isDisruptive: false,
      actionType: 'RATE_LIMIT'
    },
    {
      stepNumber: 3,
      title: 'Terminate Active Suspicious Session',
      description: 'Invalidate all current active OAuth tokens for alex.vance@enterprise.com across all gateways.',
      target: 'alex.vance@enterprise.com',
      status: 'SIMULATED',
      isDisruptive: true,
      actionType: 'REVOKE_SESSION'
    },
    {
      stepNumber: 4,
      title: 'Block Malicious Source IP on Perimeter Edge',
      description: 'Deploy temporary edge firewall rule dropping all TCP packets from 198.51.100.23.',
      target: 'Perimeter WAF Gateway',
      status: 'SIMULATED',
      isDisruptive: false,
      actionType: 'BLOCK_IP'
    },
    {
      stepNumber: 5,
      title: 'Reset Credentials & Enforce Hardware MFA Challenge',
      description: 'Expire existing LDAP/SSO password and mandate FIDO2 hardware token verification on next login.',
      target: 'alex.vance@enterprise.com',
      status: 'SIMULATED',
      isDisruptive: true,
      actionType: 'RESET_CREDS'
    },
    {
      stepNumber: 6,
      title: 'Verify Server & Database Integrity Post-Mitigation',
      description: 'Run automated integrity scans on PostgreSQL audit tables to confirm zero unauthorized queries.',
      target: 'DB-Primary-Cluster',
      status: 'SIMULATED',
      isDisruptive: false,
      actionType: 'PATCH'
    }
  ],
  expectedResult: 'Complete containment of compromised user session with zero persistence and blocked attacker source.',
  riskReductionPercentage: 86,
  affectedAssets: ['alex.vance@enterprise.com', 'Auth-Cluster-Alpha', 'Perimeter WAF Gateway'],
  possibleSideEffects: [
    'Legitimate user Alex Vance will experience a single session termination and be prompted for hardware MFA re-auth.',
    'Edge firewall rule will add 0.01ms packet inspection overhead to ingress queue.'
  ],
  simulationState: 'COMPLETED',
  telemetryBefore: {
    rps: 3420,
    connections: 1850,
    riskScore: 84,
    errorRate: 14.8
  },
  telemetryAfter: {
    rps: 210,
    connections: 320,
    riskScore: 12,
    errorRate: 0.2
  }
};

export const initialRiskyUsers: RiskyUser[] = [
  {
    id: 'USR-8902',
    username: 'alex.vance',
    displayName: 'Alex Vance',
    department: 'DevOps & Infrastructure',
    role: 'Staff Site Reliability Engineer',
    riskScore: 88,
    loginFrequencyDaily: 14,
    failedLoginAttempts: 6,
    unusualLoginTime: '04:12 UTC (Off-hours)',
    unusualLocation: 'Frankfurt, Germany (Expected: Seattle, USA)',
    deviceChangesCount: 3,
    suspiciousActivities: [
      'Successful login preceded by 6 failed attempts within 90 seconds.',
      'Unrecognized Linux user agent connecting through commercial VPN.',
      'Attempted download of Terraform production secrets repository.'
    ],
    accessedResources: ['AWS IAM Console', 'Vault Secrets: prod/db-creds', 'Kubernetes Prod Cluster'],
    riskTrend: 'INCREASING',
    status: 'RESTRICTED',
    confidenceNote: 'Behavioral anomaly detected; score reflects risk profile, not proof of malicious intent.'
  },
  {
    id: 'USR-8419',
    username: 'sarah.connor',
    displayName: 'Sarah Connor',
    department: 'Corporate Finance',
    role: 'Senior Financial Analyst',
    riskScore: 79,
    loginFrequencyDaily: 8,
    failedLoginAttempts: 3,
    unusualLoginTime: '23:45 UTC',
    unusualLocation: 'London, UK (Expected: New York, USA)',
    deviceChangesCount: 1,
    suspiciousActivities: [
      'Workstation initiated internal port sweeps on database ports.',
      'Execution of encoded command lines from user AppData path.'
    ],
    accessedResources: ['SAP ERP Financials', 'Internal File Share: /finance/2026/'],
    riskTrend: 'INCREASING',
    status: 'MONITORED',
    confidenceNote: 'Possibility of endpoint compromise rather than insider threat.'
  },
  {
    id: 'USR-7301',
    username: 'm.scott',
    displayName: 'Michael Scott',
    department: 'Sales & Business Dev',
    role: 'Regional Sales Director',
    riskScore: 62,
    loginFrequencyDaily: 22,
    failedLoginAttempts: 4,
    unusualLoginTime: '02:30 UTC',
    unusualLocation: 'Tokyo, Japan (Travel notice active)',
    deviceChangesCount: 2,
    suspiciousActivities: [
      'Session cookie replay from mismatched IP address.',
      'Accessing CRM export endpoint at unusual cadence.'
    ],
    accessedResources: ['Salesforce Enterprise CRM', 'Corporate Gmail'],
    riskTrend: 'DECREASING',
    status: 'NORMAL',
    confidenceNote: 'User confirmed traveling internationally; cookie anomaly resolved via MFA token re-challenge.'
  },
  {
    id: 'USR-6012',
    username: 'j.kovacs',
    displayName: 'Jozsef Kovacs',
    department: 'Software Engineering',
    role: 'Backend Developer',
    riskScore: 45,
    loginFrequencyDaily: 11,
    failedLoginAttempts: 1,
    unusualLoginTime: 'Normal (09:00 - 18:00)',
    unusualLocation: 'Prague, CZ',
    deviceChangesCount: 0,
    suspiciousActivities: [
      'High volume git clones of deprecated repositories.'
    ],
    accessedResources: ['GitHub Enterprise', 'Jira Service Desk'],
    riskTrend: 'STABLE',
    status: 'NORMAL',
    confidenceNote: 'Standard batch repository migration task.'
  }
];

export const initialMonitoredDevices: MonitoredDevice[] = [
  {
    id: 'DEV-001',
    name: 'Workstation-Fin-08',
    ip: '10.0.12.44',
    mac: '00:1A:2B:3C:4D:5E',
    os: 'Windows 11 Enterprise (23H2)',
    connectionStatus: 'QUARANTINED',
    user: 'sarah.connor@enterprise.com',
    networkSegment: 'VLAN-20 Corp Workstations',
    lastActivity: '2 mins ago',
    riskScore: 92,
    securityStatus: 'CRITICAL_RISK',
    aiAssessment: 'Host displays symptoms of Cobalt Strike beaconing; initiated unauthorized port scan toward DB subnet.',
    openPorts: [135, 139, 445, 5357]
  },
  {
    id: 'DEV-002',
    name: 'MacBook-Pro-Eng-104',
    ip: '10.0.14.88',
    mac: 'F0:18:98:2C:11:AB',
    os: 'macOS Sonoma 14.5',
    connectionStatus: 'ONLINE',
    user: 'alex.vance@enterprise.com',
    networkSegment: 'VLAN-30 Engineering',
    lastActivity: 'Just now',
    riskScore: 76,
    securityStatus: 'SUSPICIOUS',
    aiAssessment: 'Valid user credentials replayed from external IP while this physical laptop remained idle.',
    openPorts: [22, 5900]
  },
  {
    id: 'DEV-003',
    name: 'Unknown-Rogue-MacBook',
    ip: '192.168.10.89',
    mac: '3C:06:30:4A:8B:2F',
    os: 'Unknown Unix / Darwin Kernel',
    connectionStatus: 'UNDER_ANALYSIS',
    user: 'Unregistered / Guest',
    networkSegment: 'VLAN-Corp-WiFi',
    lastActivity: '42 mins ago',
    riskScore: 88,
    securityStatus: 'CRITICAL_RISK',
    aiAssessment: 'Device bypassed 802.1X certificate enforcement via captive portal exploit attempt.',
    openPorts: [80, 443, 8080]
  },
  {
    id: 'DEV-004',
    name: 'Prod-K8s-Node-Master-01',
    ip: '10.0.2.10',
    mac: '52:54:00:12:34:56',
    os: 'Ubuntu 24.04 LTS (Kernel 6.8)',
    connectionStatus: 'ONLINE',
    user: 'system/k8s-admin',
    networkSegment: 'VLAN-100 Core Infrastructure',
    lastActivity: 'Active',
    riskScore: 14,
    securityStatus: 'NORMAL',
    aiAssessment: 'System integrity verified. CIS benchmark score 96/100.',
    openPorts: [6443, 2379, 10250]
  },
  {
    id: 'DEV-005',
    name: 'DB-Primary-Node-A',
    ip: '10.0.8.10',
    mac: '52:54:00:88:99:AA',
    os: 'Red Hat Enterprise Linux 9.4',
    connectionStatus: 'ONLINE',
    user: 'postgres/system',
    networkSegment: 'VLAN-200 Database Tier',
    lastActivity: 'Active',
    riskScore: 18,
    securityStatus: 'NORMAL',
    aiAssessment: 'Database engine running normally; TLS 1.3 enforced on all client sockets.',
    openPorts: [5432]
  }
];

export const initialMonitoredWebsites: MonitoredWebsite[] = [
  {
    id: 'WEB-01',
    domain: 'api.enterprise.com',
    environment: 'PRODUCTION',
    requests24h: 18450200,
    visitors24h: 342100,
    uniqueSourceIps: 128900,
    responseCodes: [
      { code: '200 OK', count: 16800000, percent: 91.1 },
      { code: '304 Not Modified', count: 850000, percent: 4.6 },
      { code: '401/403 Unauthorized', count: 420000, percent: 2.3 },
      { code: '429 Rate Limited', count: 260000, percent: 1.4 },
      { code: '500/502 Server Error', count: 120200, percent: 0.6 }
    ],
    authActivityCount: 420000,
    apiRequestsCount: 18450200,
    suspiciousRequestsCount: 14200,
    trafficVolumeGB: 842.5,
    errorRatePercent: 2.0,
    securityAlertsCount: 3,
    status: 'UNDER_ATTACK'
  },
  {
    id: 'WEB-02',
    domain: 'auth.portal.org',
    environment: 'PRODUCTION',
    requests24h: 3200150,
    visitors24h: 89400,
    uniqueSourceIps: 64200,
    responseCodes: [
      { code: '200 OK', count: 2890000, percent: 90.3 },
      { code: '302 Found', count: 180000, percent: 5.6 },
      { code: '401 Unauthorized', count: 110000, percent: 3.4 },
      { code: '429 Rate Limited', count: 18000, percent: 0.6 },
      { code: '500 Error', count: 2150, percent: 0.1 }
    ],
    authActivityCount: 3200150,
    apiRequestsCount: 940000,
    suspiciousRequestsCount: 4120,
    trafficVolumeGB: 112.4,
    errorRatePercent: 3.5,
    securityAlertsCount: 2,
    status: 'DEGRADED'
  },
  {
    id: 'WEB-03',
    domain: 'app.payment-gateway.io',
    environment: 'PRODUCTION',
    requests24h: 8900400,
    visitors24h: 210000,
    uniqueSourceIps: 184000,
    responseCodes: [
      { code: '200 OK', count: 8650000, percent: 97.2 },
      { code: '400 Bad Request', count: 140000, percent: 1.6 },
      { code: '403 Forbidden', count: 90000, percent: 1.0 },
      { code: '500 Error', count: 20400, percent: 0.2 }
    ],
    authActivityCount: 180000,
    apiRequestsCount: 8900400,
    suspiciousRequestsCount: 890,
    trafficVolumeGB: 412.0,
    errorRatePercent: 1.2,
    securityAlertsCount: 0,
    status: 'HEALTHY'
  },
  {
    id: 'WEB-04',
    domain: 'corp-portal.net',
    environment: 'INTERNAL',
    requests24h: 420000,
    visitors24h: 3400,
    uniqueSourceIps: 2100,
    responseCodes: [
      { code: '200 OK', count: 405000, percent: 96.4 },
      { code: '304 Not Modified', count: 12000, percent: 2.9 },
      { code: '403 Forbidden', count: 3000, percent: 0.7 }
    ],
    authActivityCount: 14500,
    apiRequestsCount: 190000,
    suspiciousRequestsCount: 42,
    trafficVolumeGB: 34.2,
    errorRatePercent: 0.1,
    securityAlertsCount: 0,
    status: 'HEALTHY'
  }
];

export const initialThreatIntelMap: Record<string, ThreatIntelligence> = {
  '198.51.100.23': {
    ip: '198.51.100.23',
    asn: 'AS13335 (Cloudflare Commercial Hosting)',
    organization: 'FastProxy / Bulletproof Exit Node',
    approxLocation: {
      country: 'Germany',
      city: 'Frankfurt am Main',
      latitude: 50.1109,
      longitude: 8.6821,
      attributionConfidence: 'MEDIUM',
      disclaimer: 'Approximate IP geolocation based on BGP routing table and WHOIS registry; does NOT establish physical identity of human operator.'
    },
    reputationScore: 92,
    threatCategories: ['Password Spraying', 'Anonymous Proxy', 'Credential Stuffing Botnet'],
    knownThreatReports: [
      'AlienVault OTX: Active pulse on 2026-10-04 targeting OAuth2 endpoints.',
      'AbuseIPDB: 184 reports in last 7 days for brute force attacks (Confidence 100%).',
      'CISA Alert AA24-110: Associated with automated credential abuse campaign.'
    ],
    relatedDomains: ['fast-auth-tunnel.xyz', 'relay-node-88.top'],
    relatedInfrastructure: ['Subnet 198.51.100.0/24 hosting 42 known scanning nodes.'],
    historicalObservations: [
      'First observed scanning our perimeter on 2026-09-28.',
      'Average 42 authentication attempts per burst.',
      'Rotates HTTP User-Agents every 12 requests.'
    ],
    confidenceLevel: 'HIGH',
    observedData: [
      'Observed TCP SYN on port 443 with TLS JA3 fingerprint 771,4865-4866-4867...',
      'Source ASN: AS13335',
      'Target endpoint: /oauth/token'
    ],
    aiInference: [
      'Adversary is likely leveraging commercial VPN/hosting to mask true country of origin.',
      'Attack script appears to use Hydra or custom Golang worker pool.',
      'Probability of human operator actively waiting behind terminal: 72%.'
    ]
  },
  '185.220.101.5': {
    ip: '185.220.101.5',
    asn: 'AS208323 (Zwiebelfreunde e.V.)',
    organization: 'Tor Project Exit Node',
    approxLocation: {
      country: 'Netherlands',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041,
      attributionConfidence: 'LOW',
      disclaimer: 'TOR Exit Relay. IP address represents egress relay, NOT origin of the attacking entity.'
    },
    reputationScore: 98,
    threatCategories: ['TOR Exit Node', 'DDoS Participant', 'Automated Crawler'],
    knownThreatReports: [
      'Tor Project Directory: Verified exit node running version 0.4.8.10.',
      'Spamhaus DROP list inclusion.'
    ],
    relatedDomains: ['tor-exit-amsterdam.nl'],
    relatedInfrastructure: ['TOR Onion network relay mesh'],
    historicalObservations: ['Observed participating in 3 separate Layer-7 volumetric floods.'],
    confidenceLevel: 'HIGH',
    observedData: ['14,200 requests/sec with absent Referer headers'],
    aiInference: ['Automated botnet master distributing requests across multiple exit nodes.']
  },
  '45.33.32.156': {
    ip: '45.33.32.156',
    asn: 'AS63949 (Linode, LLC)',
    organization: 'Akamai Connected Cloud',
    approxLocation: {
      country: 'United States',
      city: 'Fremont, CA',
      latitude: 37.5483,
      longitude: -121.9886,
      attributionConfidence: 'MEDIUM',
      disclaimer: 'Cloud VPS provider instance. Legitimate hosting frequently abused for security research or malicious scanning.'
    },
    reputationScore: 84,
    threatCategories: ['Web Vulnerability Scanner', 'SQLi Injection Probe'],
    knownThreatReports: ['Rapid7 Project Sonar research scanner or compromised VPS.'],
    relatedDomains: ['scan-worker-04.io'],
    relatedInfrastructure: ['Linode datacenter IP block'],
    historicalObservations: ['Scans port 80 and 443 searching for SQL injection and CVE-2024-3400.'],
    confidenceLevel: 'MEDIUM',
    observedData: ['UNION SELECT fragments in URI query string'],
    aiInference: ['Likely automated sqlmap or Nikto scan suite executing on rented VPS.']
  }
};

export const initialGlobalThreats: GlobalThreatPoint[] = [
  {
    id: 'TH-01',
    sourceCountry: 'Singapore',
    sourceCity: 'Singapore',
    sourceCoords: [1.3521, 103.8198],
    targetRegion: 'Web Server (example.com)',
    targetCoords: [38.9072, -77.0369], // US East
    attackCategory: 'Credential Theft',
    severity: 'CRITICAL',
    sourceIp: '103.77.12.5',
    targetAsset: 'Web Server (example.com)',
    attributionConfidence: 'HIGH',
    timestamp: '2m ago',
    approxLocation: 'Singapore (Approx.)',
    asn: 'Amazon Technologies Inc.',
    isp: 'Amazon Data Services',
    reputation: 87,
    protocol: 'HTTPS',
    port: 443,
    firstSeen: '2026-10-07 14:23:17',
    lastSeen: '2026-10-07 15:12:43',
    eventsCount: 428,
    aiExplanation: 'This source shows abnormal login behavior with multiple failed attempts followed by successful access. It may indicate credential theft or automated attack tools.',
    aiConfidence: 94,
    potentialNextStep: 'Credential compromise / lateral movement',
    recommendedActions: [
      'Investigate source IP and related infrastructure',
      'Check for compromised accounts',
      'Block source (with approval)',
      'Monitor for lateral movement'
    ],
    // Legacy compatibility fields
    latitude: 1.3521,
    longitude: 103.8198,
    city: 'Singapore',
    country: 'Singapore',
    attackType: 'Credential Theft',
    ip: '103.77.12.5'
  },
  {
    id: 'TH-02',
    sourceCountry: 'United States',
    sourceCity: 'Virginia',
    sourceCoords: [37.4316, -78.6569],
    targetRegion: 'Frankfurt Datacenter',
    targetCoords: [50.1109, 8.6821],
    attackCategory: 'Brute Force Attack',
    severity: 'HIGH',
    sourceIp: '203.0.113.18',
    targetAsset: 'Auth Gateway (auth.example.com)',
    attributionConfidence: 'HIGH',
    timestamp: '6m ago',
    approxLocation: 'USA (Approx.)',
    asn: 'Cloudflare Commercial Hosting',
    isp: 'Level 3 Communications',
    reputation: 76,
    protocol: 'HTTPS',
    port: 443,
    firstSeen: '2026-10-07 13:10:02',
    lastSeen: '2026-10-07 15:08:19',
    eventsCount: 1842,
    aiExplanation: 'Distributed high-frequency authentication spray targeting 18 corporate accounts simultaneously with anomalous user-agent rotation.',
    aiConfidence: 92,
    potentialNextStep: 'Privilege escalation via administrative tokens',
    recommendedActions: [
      'Rate-limit /oauth/token endpoint',
      'Enforce hardware FIDO2 challenge for targeted users',
      'Add source IP to perimeter drop list',
      'Review Active Directory Kerberos audit logs'
    ],
    latitude: 37.4316,
    longitude: -78.6569,
    city: 'Virginia',
    country: 'United States',
    attackType: 'Brute Force Attack',
    ip: '203.0.113.18'
  },
  {
    id: 'TH-03',
    sourceCountry: 'Germany',
    sourceCity: 'Frankfurt',
    sourceCoords: [50.1109, 8.6821],
    targetRegion: 'US East (Virginia DC)',
    targetCoords: [38.9072, -77.0369],
    attackCategory: 'Port Scan',
    severity: 'MEDIUM',
    sourceIp: '198.51.100.42',
    targetAsset: 'Ingress Router Gateway',
    attributionConfidence: 'MEDIUM',
    timestamp: '14m ago',
    approxLocation: 'Germany (Approx.)',
    asn: 'Hetzner Online GmbH',
    isp: 'Deutsche Telekom',
    reputation: 62,
    protocol: 'TCP / SYN',
    port: 80,
    firstSeen: '2026-10-07 12:45:00',
    lastSeen: '2026-10-07 14:55:10',
    eventsCount: 612,
    aiExplanation: 'Reconnaissance sweep detecting open TCP sockets across ports 80, 443, 8080, and 22 looking for unpatched CVE-2024-3400 vulnerabilities.',
    aiConfidence: 88,
    potentialNextStep: 'Targeted service exploitation if vulnerable port detected',
    recommendedActions: [
      'Verify perimeter firewall dropping unscheduled probe packets',
      'Validate edge services running latest security patches',
      'Monitor for subsequent exploit payloads'
    ],
    latitude: 50.1109,
    longitude: 8.6821,
    city: 'Frankfurt',
    country: 'Germany',
    attackType: 'Port Scan',
    ip: '198.51.100.42'
  },
  {
    id: 'TH-04',
    sourceCountry: 'Brazil',
    sourceCity: 'São Paulo',
    sourceCoords: [-23.5505, -46.6333],
    targetRegion: 'US East (Virginia DC)',
    targetCoords: [38.9072, -77.0369],
    attackCategory: 'Web Exploit',
    severity: 'MEDIUM',
    sourceIp: '181.214.56.7',
    targetAsset: 'API Gateway Cluster',
    attributionConfidence: 'MEDIUM',
    timestamp: '28m ago',
    approxLocation: 'Brazil (Approx.)',
    asn: 'Embratel Telecomunicacoes',
    isp: 'Claro Brasil',
    reputation: 58,
    protocol: 'HTTP',
    port: 8080,
    firstSeen: '2026-10-07 11:20:15',
    lastSeen: '2026-10-07 14:40:22',
    eventsCount: 340,
    aiExplanation: 'Automated SQL injection probe payload containing UNION SELECT fragments directed at /v1/search parameter.',
    aiConfidence: 89,
    potentialNextStep: 'Blind SQL injection database extraction attempt',
    recommendedActions: [
      'WAF Rule #4023 auto-mitigation verified',
      'Review SQL query parameterized bindings',
      'Verify database access audit trail'
    ],
    latitude: -23.5505,
    longitude: -46.6333,
    city: 'São Paulo',
    country: 'Brazil',
    attackType: 'Web Exploit',
    ip: '181.214.56.7'
  },
  {
    id: 'TH-05',
    sourceCountry: 'Australia',
    sourceCity: 'Sydney',
    sourceCoords: [-33.8688, 151.2093],
    targetRegion: 'US West (Oregon DC)',
    targetCoords: [45.5152, -122.6784],
    attackCategory: 'Suspicious Login',
    severity: 'LOW',
    sourceIp: '45.77.32.101',
    targetAsset: 'SSO Portal (sso.example.com)',
    attributionConfidence: 'LOW',
    timestamp: '45m ago',
    approxLocation: 'Australia (Approx.)',
    asn: 'Telstra Global Network',
    isp: 'Vultr Holdings LLC',
    reputation: 32,
    protocol: 'HTTPS',
    port: 443,
    firstSeen: '2026-10-07 10:05:40',
    lastSeen: '2026-10-07 14:15:30',
    eventsCount: 89,
    aiExplanation: 'User authentication initiated from anomalous cloud hosting IP during off-business hours. Low severity due to successful hardware MFA verification.',
    aiConfidence: 78,
    potentialNextStep: 'Routine session verification',
    recommendedActions: [
      'Verify traveling status of employee',
      'Session validated via FIDO2 token',
      'No immediate containment required'
    ],
    latitude: -33.8688,
    longitude: 151.2093,
    city: 'Sydney',
    country: 'Australia',
    attackType: 'Suspicious Login',
    ip: '45.77.32.101'
  }
];

export const initialMitreMatrix: MitreTechniqueMapping[] = [
  {
    tactic: 'Initial Access',
    techniqueId: 'T1190',
    techniqueName: 'Exploit Public-Facing Application',
    observedEvidence: 'SQL injection fragments targeting /v1/search parameter on Web-Gateway.',
    potentialNextTechnique: 'T1059 - Command and Scripting Interpreter execution.',
    recommendedDefense: 'Apply WAF virtual patch and sanitize database input parameter binding.',
    severity: 'MEDIUM',
    detectedCount: 42
  },
  {
    tactic: 'Credential Access',
    techniqueId: 'T1110.003',
    techniqueName: 'Brute Force: Password Spraying',
    observedEvidence: '42 consecutive failed logins across multiple user accounts followed by single success.',
    potentialNextTechnique: 'T1078.004 - Cloud Accounts valid session abuse.',
    recommendedDefense: 'Implement smart account lockout with IP throttling and mandatory MFA.',
    severity: 'HIGH',
    detectedCount: 18
  },
  {
    tactic: 'Discovery',
    techniqueId: 'T1046',
    techniqueName: 'Network Service Discovery',
    observedEvidence: 'Finance host Workstation-Fin-08 sending SYN packets to ports 445 and 3389 across subnet.',
    potentialNextTechnique: 'T1021.002 - SMB/Windows Admin Shares lateral movement.',
    recommendedDefense: 'Isolate host via EDR agent and audit active domain credentials.',
    severity: 'CRITICAL',
    detectedCount: 6
  },
  {
    tactic: 'Lateral Movement',
    techniqueId: 'T1021.002',
    techniqueName: 'Remote Services: SMB/Windows Admin Shares',
    observedEvidence: 'Anomalous RPC connection attempt to database cluster from non-admin endpoint.',
    potentialNextTechnique: 'T1003 - OS Credential Dumping (LSASS memory dump).',
    recommendedDefense: 'Block port 445 between workstation VLANs and server DMZ at core switch.',
    severity: 'CRITICAL',
    detectedCount: 3
  },
  {
    tactic: 'Impact',
    techniqueId: 'T1498.001',
    techniqueName: 'Network Denial of Service: Direct Network Flood',
    observedEvidence: '14,200 req/sec POST flood targeted at payment checkout API.',
    potentialNextTechnique: 'T1489 - Service Stop (Process crash).',
    recommendedDefense: 'Enable edge scrubbing network challenge and rate-limiting proxy rules.',
    severity: 'CRITICAL',
    detectedCount: 8
  },
  {
    tactic: 'Defense Evasion',
    techniqueId: 'T1562.001',
    techniqueName: 'Impair Defenses: Disable or Modify Tools',
    observedEvidence: 'Attempted stoppage of Syslog daemon process on Dev-Node-Linux-4.',
    potentialNextTechnique: 'T1070 - Indicator Removal on Host.',
    recommendedDefense: 'Enforce immutable systemd service protection and file integrity monitoring.',
    severity: 'HIGH',
    detectedCount: 2
  }
];

export const initialActivityFeed: ActivityFeedItem[] = [
  {
    id: 'ACT-901',
    timestamp: 'Just now',
    type: 'ALERT',
    severity: 'HIGH',
    message: 'New suspicious login detected for user alex.vance from anomalous foreign ASN (198.51.100.23).',
    asset: 'Auth-Cluster-Alpha',
    sourceIp: '198.51.100.23'
  },
  {
    id: 'ACT-900',
    timestamp: '2 mins ago',
    type: 'TRAFFIC',
    severity: 'CRITICAL',
    message: 'Unusual server traffic spike (14,200 RPS) detected on payment checkout gateway.',
    asset: 'Web-Gateway-02',
    sourceIp: '185.220.101.5'
  },
  {
    id: 'ACT-899',
    timestamp: '6 mins ago',
    type: 'PREDICTION',
    severity: 'HIGH',
    message: 'AI attack prediction generated: 88% probability of targeted credential access against DevOps leads.',
    asset: 'Okta SSO / Engineering'
  },
  {
    id: 'ACT-898',
    timestamp: '14 mins ago',
    type: 'DEVICE',
    severity: 'CRITICAL',
    message: 'Workstation-Fin-08 initiated internal port scan against DB subnet 10.0.8.0/24.',
    asset: 'Workstation-Fin-08'
  },
  {
    id: 'ACT-897',
    timestamp: '28 mins ago',
    type: 'CONTAINMENT',
    severity: 'MEDIUM',
    message: 'SQL Injection probe payload blocked automatically by Perimeter WAF rule #4023.',
    asset: 'App-Server-Prod-01',
    sourceIp: '45.33.32.156'
  },
  {
    id: 'ACT-896',
    timestamp: '42 mins ago',
    type: 'DEVICE',
    severity: 'HIGH',
    message: 'New rogue device (Unknown-Rogue-MacBook) connected without 802.1X certificate.',
    asset: 'VLAN-Corp-WiFi'
  },
  {
    id: 'ACT-895',
    timestamp: '1 hour ago',
    type: 'USER',
    severity: 'MEDIUM',
    message: 'Possible cookie theft indicator: session cookie replayed from divergent IP for user m.scott.',
    asset: 'User: m.scott'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'NOTIF-01',
    timestamp: '2 mins ago',
    title: 'Suspicious Credential Burst on User alex.vance',
    message: 'Multiple failed logins followed by abnormal success from commercial VPN ASN (198.51.100.23).',
    severity: 'CRITICAL',
    category: 'USER_SYSTEM',
    targetUser: 'alex.vance@enterprise.com',
    sourceIp: '198.51.100.23',
    read: false,
    incidentId: 'INC-8402',
    alertId: 'ALT-9821',
    actionRequired: true
  },
  {
    id: 'NOTIF-02',
    timestamp: '14 mins ago',
    title: 'Lateral SMB Probe via Workstation-Fin-08',
    message: 'Finance workstation user sarah.connor initiated internal subnet scan targeting DB cluster.',
    severity: 'CRITICAL',
    category: 'USER_SYSTEM',
    targetUser: 'sarah.connor@enterprise.com',
    sourceIp: '10.0.12.44',
    read: false,
    incidentId: 'INC-8403',
    alertId: 'ALT-9819',
    actionRequired: true
  },
  {
    id: 'NOTIF-03',
    timestamp: '25 mins ago',
    title: 'Layer-7 DDoS Surge on Ingress Gateway',
    message: '14,200 requests/sec HTTP POST flood against /v2/checkout endpoint. Rate limiting triggered.',
    severity: 'HIGH',
    category: 'NETWORK',
    sourceIp: '185.220.101.5',
    read: false,
    incidentId: 'INC-8401',
    alertId: 'ALT-9820',
    actionRequired: false
  },
  {
    id: 'NOTIF-04',
    timestamp: '1 hour ago',
    title: 'Anomalous Cookie Replay for User m.scott',
    message: 'Session token presented from Tokyo IP while active token recorded in New York 3 mins prior.',
    severity: 'MEDIUM',
    category: 'USER_SYSTEM',
    targetUser: 'm.scott@enterprise.com',
    sourceIp: '203.0.113.88',
    read: true,
    incidentId: 'INC-8390',
    alertId: 'ALT-9816',
    actionRequired: false
  },
  {
    id: 'NOTIF-05',
    timestamp: '2 hours ago',
    title: 'Rogue Wi-Fi Hardware Insertion',
    message: 'Unregistered MAC address joined Corporate Wi-Fi without 802.1X enterprise certificate.',
    severity: 'HIGH',
    category: 'ENDPOINT',
    sourceIp: '192.168.10.89',
    read: true,
    incidentId: 'INC-8395',
    alertId: 'ALT-9817',
    actionRequired: false
  }
];
