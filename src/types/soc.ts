export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';

export type IncidentStatus = 
  | 'NEW' 
  | 'INVESTIGATING' 
  | 'CONFIRMED' 
  | 'CONTAINED' 
  | 'RESOLVED' 
  | 'FALSE_POSITIVE';

export type AssetCategory = 
  | 'SERVER' 
  | 'USER' 
  | 'DEVICE' 
  | 'WEBSITE' 
  | 'NETWORK' 
  | 'APPLICATION' 
  | 'DATABASE';

export interface Alert {
  id: string;
  incidentId?: string;
  timestamp: string;
  sourceIp: string;
  destinationIp: string;
  sourceDevice: string;
  destinationServer: string;
  username: string;
  attackType: string;
  protocol: string;
  port: number;
  severity: Severity;
  confidenceScore: number;
  detectionReason: string;
  affectedAsset: string;
  currentStatus: IncidentStatus;
  recommendedAction: string;
  mitreTechnique?: string;
  mitreTactic?: string;
  mitreId?: string;
}

export interface AffectedAssetDetail {
  category: AssetCategory;
  name: string;
  identifier: string;
  status: 'COMPROMISED' | 'AT_RISK' | 'MONITORED' | 'SECURED';
  riskScore: number;
}

export interface AIIncidentAnalysis {
  whatHappened: string;
  whySuspicious: string;
  affectedAssets: AffectedAssetDetail[];
  attackClassification: {
    tactic: string;
    technique: string;
    techniqueId: string;
    subTechnique?: string;
    category: string;
  };
  confidence: {
    overallPercentage: number;
    factors: { factor: string; score: number }[];
  };
  riskAssessment: {
    currentRisk: number; // 0-100
    potentialImpact: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    possibleNextAttackStage: string;
    assetsAtRisk: string[];
    potentialFinancialOrDataLoss: string;
  };
}

export interface Incident {
  id: string;
  title: string;
  severity: Severity;
  status: IncidentStatus;
  assignedAnalyst: string;
  createdAt: string;
  updatedAt: string;
  attackType: string;
  sourceIp: string;
  targetAsset: string;
  detectionReason: string;
  aiConfidence: number;
  aiAnalysis: AIIncidentAnalysis;
  evidence: {
    id: string;
    timestamp: string;
    type: 'LOG' | 'PACKET' | 'AUTH' | 'PROCESS' | 'BEHAVIOR';
    raw: string;
    source: string;
  }[];
  responseActions: ResponseAction[];
  notes: {
    id: string;
    author: string;
    timestamp: string;
    text: string;
  }[];
}

export interface AttackPathNode {
  id: string;
  label: string;
  type: 'ATTACKER' | 'SOURCE_IP' | 'GATEWAY' | 'WEB_APP' | 'AUTH' | 'USER_ACCOUNT' | 'INTERNAL_SERVER' | 'DATABASE' | 'EXFILTRATION';
  stage: 'INITIAL_ACCESS' | 'DISCOVERY' | 'CREDENTIAL_ACCESS' | 'PRIVILEGE_ESCALATION' | 'LATERAL_MOVEMENT' | 'DATA_ACCESS' | 'EXFILTRATION';
  status: 'ACTIVE_THREAT' | 'COMPROMISED' | 'AT_RISK' | 'MONITORED' | 'SECURE';
  ipOrIdentifier: string;
  description: string;
  evidenceSnippet?: string;
  timestamp?: string;
}

export interface AttackPathLink {
  source: string;
  target: string;
  label: string;
  protocol?: string;
  isThreatFlow: boolean;
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPECTED';
}

export interface Prediction {
  id: string;
  predictedThreat: string;
  probability: number; // e.g. 78%
  risk: Severity;
  timeHorizon: string; // e.g. "Next 4 hours"
  targetAsset: string;
  supportingIndicators: string[];
  recommendedPrevention: string[];
  mitreNextTechnique: string;
  isConfirmed: false; // Explicit distinction from confirmed attack
  status: 'PREDICTED' | 'MONITORING' | 'PREVENTED';
}

export interface ResponseStep {
  stepNumber: number;
  title: string;
  description: string;
  target: string;
  status: 'PENDING' | 'SIMULATED' | 'APPROVED' | 'EXECUTED' | 'VERIFIED';
  isDisruptive: boolean;
  actionType: 'ISOLATE' | 'BLOCK_IP' | 'REVOKE_SESSION' | 'RATE_LIMIT' | 'PATCH' | 'RESET_CREDS' | 'ENFORCE_MFA';
}

export interface ResponseAction {
  id: string;
  actionNumber: number;
  title: string;
  description: string;
  targetAsset: string;
  justification: string;
  requiresApproval: boolean;
  isDestructive: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  executionStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'EXECUTED' | 'FAILED';
  verificationResult?: 'VERIFIED_CONTAINED' | 'TRAFFIC_NORMALIZED' | 'UNVERIFIED';
  simulatedReduction: number;
}

export interface ResponseSimulation {
  id: string;
  incidentId: string;
  attackType: string;
  steps: ResponseStep[];
  expectedResult: string;
  riskReductionPercentage: number;
  affectedAssets: string[];
  possibleSideEffects: string[];
  simulationState: 'IDLE' | 'SIMULATING' | 'COMPLETED' | 'APPROVED' | 'DEPLOYED';
  telemetryBefore: {
    rps: number;
    connections: number;
    riskScore: number;
    errorRate: number;
  };
  telemetryAfter: {
    rps: number;
    connections: number;
    riskScore: number;
    errorRate: number;
  };
}

export interface ServerTrafficMetric {
  timestamp: string;
  incomingMBps: number;
  outgoingMBps: number;
  requestsPerSec: number;
  activeConnections: number;
  bandwidthUsagePercent: number;
  errorRatePercent: number;
  isSpike: boolean;
}

export interface RiskyUser {
  id: string;
  username: string;
  displayName: string;
  department: string;
  role: string;
  riskScore: number; // 0-100
  loginFrequencyDaily: number;
  failedLoginAttempts: number;
  unusualLoginTime: string;
  unusualLocation: string;
  deviceChangesCount: number;
  suspiciousActivities: string[];
  accessedResources: string[];
  riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  status: 'NORMAL' | 'MONITORED' | 'RESTRICTED';
  confidenceNote: string; // Explains this is behavioral anomaly, not proof of guilt
}

export interface MonitoredDevice {
  id: string;
  name: string;
  ip: string;
  mac: string;
  os: string;
  connectionStatus: 'ONLINE' | 'OFFLINE' | 'QUARANTINED' | 'UNDER_ANALYSIS';
  user: string;
  networkSegment: string;
  lastActivity: string;
  riskScore: number;
  securityStatus: 'NORMAL' | 'SUSPICIOUS' | 'CRITICAL_RISK';
  aiAssessment: string;
  openPorts: number[];
}

export interface MonitoredWebsite {
  id: string;
  domain: string;
  environment: 'PRODUCTION' | 'STAGING' | 'INTERNAL';
  requests24h: number;
  visitors24h: number;
  uniqueSourceIps: number;
  responseCodes: { code: string; count: number; percent: number }[];
  authActivityCount: number;
  apiRequestsCount: number;
  suspiciousRequestsCount: number;
  trafficVolumeGB: number;
  errorRatePercent: number;
  securityAlertsCount: number;
  status: 'HEALTHY' | 'DEGRADED' | 'UNDER_ATTACK';
}

export interface ThreatIntelligence {
  ip: string;
  asn: string;
  organization: string;
  approxLocation: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
    attributionConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
    disclaimer: string;
  };
  reputationScore: number; // 0-100 (100 = malicious)
  threatCategories: string[];
  knownThreatReports: string[];
  relatedDomains: string[];
  relatedInfrastructure: string[];
  historicalObservations: string[];
  confidenceLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  observedData: string[];
  aiInference: string[];
}

export interface GlobalThreatPoint {
  id: string;
  sourceCountry: string;
  sourceCity: string;
  sourceCoords: [number, number]; // [lat, lng]
  targetRegion: string;
  targetCoords: [number, number];
  attackCategory: string;
  severity: Severity;
  sourceIp: string;
  targetAsset: string;
  attributionConfidence: 'LOW' | 'MEDIUM' | 'HIGH';
  timestamp: string;
  // Detail Panel Fields
  approxLocation?: string;
  asn?: string;
  isp?: string;
  reputation?: number; // 0-100
  protocol?: string;
  port?: number;
  firstSeen?: string;
  lastSeen?: string;
  eventsCount?: number;
  aiExplanation?: string;
  aiConfidence?: number;
  potentialNextStep?: string;
  recommendedActions?: string[];
  // Legacy aliases for compatibility
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  attackType?: string;
  ip?: string;
}

export interface MitreTechniqueMapping {
  tactic: string;
  techniqueId: string;
  techniqueName: string;
  observedEvidence: string;
  potentialNextTechnique: string;
  recommendedDefense: string;
  severity: Severity;
  detectedCount: number;
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  type: 'ALERT' | 'PREDICTION' | 'CONTAINMENT' | 'DEVICE' | 'USER' | 'TRAFFIC';
  severity: Severity;
  message: string;
  asset: string;
  sourceIp?: string;
}

export interface SystemNotification {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: Severity;
  category: 'USER_SYSTEM' | 'ENDPOINT' | 'NETWORK' | 'WEB_APP' | 'THREAT_INTEL';
  targetUser?: string;
  sourceIp?: string;
  read: boolean;
  incidentId?: string;
  alertId?: string;
  actionRequired?: boolean;
}

export interface SocStats {
  totalAttacksDetected: number;
  criticalIncidents: number;
  highRiskIncidents: number;
  mediumRiskIncidents: number;
  lowRiskIncidents: number;
  activeThreats: number;
  resolvedIncidents: number;
  blockedAttacks: number;
  suspiciousActivities: number;
  riskyUsersCount: number;
  monitoredDevicesCount: number;
  activeServersCount: number;
  monitoredWebsitesCount: number;
  currentNetworkTrafficMbps: number;
  aiPredictionsCount: number;
  securityScore: number; // e.g. 84
  systemHealthPercent: number; // e.g. 99.8
}
