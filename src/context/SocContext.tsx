import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Alert, 
  Incident, 
  IncidentStatus, 
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
  Severity,
  SystemNotification
} from '../types/soc';
import { 
  initialSocStats, 
  initialAlerts, 
  initialIncidents, 
  initialPredictions, 
  initialSimulation, 
  initialRiskyUsers, 
  initialMonitoredDevices, 
  initialMonitoredWebsites, 
  initialThreatIntelMap, 
  initialGlobalThreats, 
  initialMitreMatrix, 
  initialActivityFeed,
  initialAttackPathNodes,
  initialAttackPathLinks,
  initialNotifications
} from '../data/mockData';
import { soundAlert } from '../utils/soundAlert';

export type ActiveTab = 
  | 'dashboard'
  | 'overview' 
  | 'livemap'
  | 'alerts' 
  | 'incidents' 
  | 'network' 
  | 'traffic' 
  | 'web' 
  | 'devices' 
  | 'users' 
  | 'analysis' 
  | 'prediction' 
  | 'attackpath' 
  | 'threatintel' 
  | 'threatmap' 
  | 'googlemap'
  | 'defense' 
  | 'simulation' 
  | 'mitre' 
  | 'analytics' 
  | 'reports' 
  | 'copilot' 
  | 'settings';

interface SocContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: SocStats;
  alerts: Alert[];
  incidents: Incident[];
  predictions: Prediction[];
  simulation: ResponseSimulation;
  riskyUsers: RiskyUser[];
  devices: MonitoredDevice[];
  websites: MonitoredWebsite[];
  threatIntelMap: Record<string, ThreatIntelligence>;
  globalThreats: GlobalThreatPoint[];
  mitreMatrix: MitreTechniqueMapping[];
  activityFeed: ActivityFeedItem[];
  attackPathNodes: AttackPathNode[];
  attackPathLinks: AttackPathLink[];
  selectedIncident: Incident | null;
  setSelectedIncident: (inc: Incident | null) => void;
  selectedAlert: Alert | null;
  setSelectedAlert: (alt: Alert | null) => void;
  investigatedIp: string | null;
  setInvestigatedIp: (ip: string | null) => void;
  isLiveFeedActive: boolean;
  setIsLiveFeedActive: (active: boolean) => void;
  isCopilotOpen: boolean;
  setIsCopilotOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;

  // Alert Notifications System
  notifications: SystemNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => void;
  notifyUserSystem: (targetUser: string, title: string, message: string, severity?: Severity) => void;
  notificationSoundEnabled: boolean;
  setNotificationSoundEnabled: (enabled: boolean) => void;
  desktopNotificationsEnabled: boolean;
  requestDesktopNotifications: () => Promise<boolean>;
  activeToasts: SystemNotification[];
  dismissToast: (id: string) => void;
  isNotificationDropdownOpen: boolean;
  setIsNotificationDropdownOpen: (open: boolean) => void;

  // Actions
  triggerAttackScenario: (scenarioType: 'CREDENTIAL_SPRAY' | 'DDOS_FLOOD' | 'LATERAL_SMB' | 'ROGUE_DEVICE') => void;
  runSimulationStep: () => void;
  approveSimulationResponse: () => void;
  updateIncidentStatus: (incidentId: string, newStatus: IncidentStatus) => void;
  approveDefenseAction: (incidentId: string, actionId: string) => void;
  executeDefenseAction: (incidentId: string, actionId: string) => void;
  isolateDevice: (deviceId: string) => void;
  restrictUser: (userId: string) => void;
  addIncidentNote: (incidentId: string, text: string) => void;
  queryCopilot: (prompt: string) => Promise<string>;
}

const SocContext = createContext<SocContextType | undefined>(undefined);

export const SocProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<SocStats>(initialSocStats);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [predictions, setPredictions] = useState<Prediction[]>(initialPredictions);
  const [simulation, setSimulation] = useState<ResponseSimulation>(initialSimulation);
  const [riskyUsers, setRiskyUsers] = useState<RiskyUser[]>(initialRiskyUsers);
  const [devices, setDevices] = useState<MonitoredDevice[]>(initialMonitoredDevices);
  const [websites, setWebsites] = useState<MonitoredWebsite[]>(initialMonitoredWebsites);
  const [threatIntelMap, setThreatIntelMap] = useState<Record<string, ThreatIntelligence>>(initialThreatIntelMap);
  const [globalThreats, setGlobalThreats] = useState<GlobalThreatPoint[]>(initialGlobalThreats);
  const [mitreMatrix, setMitreMatrix] = useState<MitreTechniqueMapping[]>(initialMitreMatrix);
  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(initialActivityFeed);
  const [attackPathNodes, setAttackPathNodes] = useState<AttackPathNode[]>(initialAttackPathNodes);
  const [attackPathLinks, setAttackPathLinks] = useState<AttackPathLink[]>(initialAttackPathLinks);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(initialIncidents[0]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [investigatedIp, setInvestigatedIp] = useState<string | null>(null);
  const [isLiveFeedActive, setIsLiveFeedActive] = useState<boolean>(true);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);

  // Notification states
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);
  const [activeToasts, setActiveToasts] = useState<SystemNotification[]>([]);
  const [notificationSoundEnabled, setNotificationSoundEnabled] = useState<boolean>(true);
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState<boolean>(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState<boolean>(false);

  // Initialize desktop notification status
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setDesktopNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    setActiveToasts([]);
  };

  const dismissToast = (id: string) => {
    setActiveToasts(prev => prev.filter(t => t.id !== id));
  };

  const requestDesktopNotifications = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) return false;
    try {
      const perm = await Notification.requestPermission();
      const granted = perm === 'granted';
      setDesktopNotificationsEnabled(granted);
      return granted;
    } catch {
      return false;
    }
  };

  const addNotification = (notifData: Omit<SystemNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: SystemNotification = {
      ...notifData,
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: 'Just now',
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToasts(prev => [newNotif, ...prev.slice(0, 3)]); // Keep max 4 toasts

    // Play synthesized cyber alert sound
    if (notificationSoundEnabled) {
      soundAlert.playAlertChime(newNotif.severity);
    }

    // Native browser notification if enabled
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: '/favicon.ico'
        });
      } catch {
        // Desktop notification error gracefully ignored
      }
    }

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== newNotif.id));
    }, 6000);
  };

  const notifyUserSystem = (targetUser: string, title: string, message: string, severity: Severity = 'HIGH') => {
    addNotification({
      title,
      message,
      severity,
      category: 'USER_SYSTEM',
      targetUser,
      actionRequired: severity === 'CRITICAL' || severity === 'HIGH'
    });

    setActivityFeed(prev => [{
      id: `ACT-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
      timestamp: 'Just now',
      type: 'USER',
      severity,
      message: `User Alert: ${title} (${targetUser})`,
      asset: `User: ${targetUser}`
    }, ...prev]);
  };

  // Periodic background activity simulation
  useEffect(() => {
    if (!isLiveFeedActive) return;
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        currentNetworkTrafficMbps: Number((820 + Math.random() * 60).toFixed(1)),
        totalAttacksDetected: prev.totalAttacksDetected + 1,
        blockedAttacks: prev.blockedAttacks + 1
      }));
    }, 4500);
    return () => clearInterval(interval);
  }, [isLiveFeedActive]);

  const triggerAttackScenario = (scenarioType: 'CREDENTIAL_SPRAY' | 'DDOS_FLOOD' | 'LATERAL_SMB' | 'ROGUE_DEVICE') => {
    const timeStr = 'Just now';

    if (scenarioType === 'CREDENTIAL_SPRAY') {
      const newAlert: Alert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        sourceIp: '198.51.100.99',
        destinationIp: '10.0.4.12',
        sourceDevice: 'External-Host [Botnet Node]',
        destinationServer: 'Auth-Cluster-Alpha',
        username: 'devops-lead@enterprise.com',
        attackType: 'High-Frequency Password Spray Surge',
        protocol: 'HTTPS',
        port: 443,
        severity: 'CRITICAL',
        confidenceScore: 97,
        detectionReason: '120 failed login attempts detected in 10 seconds against /oauth/token endpoint.',
        affectedAsset: 'Auth-Cluster-Alpha',
        currentStatus: 'NEW',
        recommendedAction: 'Trigger rate limiting rule and revoke active session tokens.',
        mitreTechnique: 'Password Spraying',
        mitreTactic: 'Credential Access',
        mitreId: 'T1110.003'
      };

      setAlerts(prev => [newAlert, ...prev]);
      setActivityFeed(prev => [{
        id: `ACT-${Date.now()}`,
        timestamp: timeStr,
        type: 'ALERT',
        severity: 'CRITICAL',
        message: 'High-Frequency Password Spray Surge detected on Auth-Cluster-Alpha from 198.51.100.99.',
        asset: 'Auth-Cluster-Alpha',
        sourceIp: '198.51.100.99'
      }, ...prev]);

      addNotification({
        title: '🚨 Critical User System Alert: Password Spray Surge',
        message: 'High-frequency brute-force surge (120 failed auths in 10s) targeting devops-lead@enterprise.com from foreign proxy ASN.',
        severity: 'CRITICAL',
        category: 'USER_SYSTEM',
        targetUser: 'devops-lead@enterprise.com',
        sourceIp: '198.51.100.99',
        alertId: newAlert.id,
        actionRequired: true
      });

      setStats(prev => ({
        ...prev,
        totalAttacksDetected: prev.totalAttacksDetected + 1,
        criticalIncidents: prev.criticalIncidents + 1,
        activeThreats: prev.activeThreats + 1,
        securityScore: Math.max(65, prev.securityScore - 3)
      }));
    } else if (scenarioType === 'DDOS_FLOOD') {
      const newAlert: Alert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        sourceIp: '203.0.113.44',
        destinationIp: '10.0.2.80',
        sourceDevice: 'Mirai Variant Botnet',
        destinationServer: 'Web-Gateway-02 [api.enterprise.com]',
        username: 'N/A',
        attackType: 'L7 SYN Flood & HTTP Flood Spike',
        protocol: 'TCP / HTTPS',
        port: 443,
        severity: 'CRITICAL',
        confidenceScore: 99,
        detectionReason: 'Traffic surged to 28,400 requests/sec with TCP handshake exhaustion.',
        affectedAsset: 'Web-Gateway-02 & Payment Service',
        currentStatus: 'NEW',
        recommendedAction: 'Activate Edge Scrubbing and apply Layer-7 Cloudflare Rate Limiting.',
        mitreTechnique: 'Endpoint Denial of Service',
        mitreTactic: 'Impact',
        mitreId: 'T1499'
      };

      setAlerts(prev => [newAlert, ...prev]);
      setActivityFeed(prev => [{
        id: `ACT-${Date.now()}`,
        timestamp: timeStr,
        type: 'TRAFFIC',
        severity: 'CRITICAL',
        message: 'Severe HTTP Flood Spike (28,400 RPS) detected on Web-Gateway-02.',
        asset: 'Web-Gateway-02',
        sourceIp: '203.0.113.44'
      }, ...prev]);

      addNotification({
        title: '🚨 Critical Perimeter Alert: Volumetric HTTP Flood',
        message: 'L7 SYN flood & HTTP request spike (28,400 RPS) targeting Web-Gateway-02. Edge scrubbing recommended.',
        severity: 'CRITICAL',
        category: 'NETWORK',
        sourceIp: '203.0.113.44',
        alertId: newAlert.id,
        actionRequired: true
      });

      setStats(prev => ({
        ...prev,
        totalAttacksDetected: prev.totalAttacksDetected + 1,
        criticalIncidents: prev.criticalIncidents + 1,
        activeThreats: prev.activeThreats + 1,
        currentNetworkTrafficMbps: 1420.5,
        securityScore: Math.max(60, prev.securityScore - 5)
      }));
    } else if (scenarioType === 'LATERAL_SMB') {
      const newAlert: Alert = {
        id: `ALT-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: timeStr,
        sourceIp: '10.0.12.88',
        destinationIp: '10.0.8.15',
        sourceDevice: 'Workstation-Dev-14',
        destinationServer: 'DB-Secondary-Replica',
        username: 't.anderson@enterprise.com',
        attackType: 'SMB Lateral Sweep & NTLM Relay Probe',
        protocol: 'SMB:445',
        port: 445,
        severity: 'HIGH',
        confidenceScore: 92,
        detectionReason: 'Non-privileged developer endpoint attempting NTLM auth relay against DB replica.',
        affectedAsset: 'Workstation-Dev-14 & DB-Secondary-Replica',
        currentStatus: 'NEW',
        recommendedAction: 'Isolate Workstation-Dev-14 and terminate active Kerberos sessions.',
        mitreTechnique: 'Exploitation of Remote Services',
        mitreTactic: 'Lateral Movement',
        mitreId: 'T1210'
      };

      setAlerts(prev => [newAlert, ...prev]);
      setActivityFeed(prev => [{
        id: `ACT-${Date.now()}`,
        timestamp: timeStr,
        type: 'ALERT',
        severity: 'HIGH',
        message: 'SMB Lateral Sweep detected: Workstation-Dev-14 probing DB replica.',
        asset: 'Workstation-Dev-14',
        sourceIp: '10.0.12.88'
      }, ...prev]);

      addNotification({
        title: '⚠️ User System Anomaly: SMB Lateral Pivot Attempt',
        message: 'Developer account t.anderson@enterprise.com attempted unauthorized SMB/RPC handshake to DB-Secondary-Replica.',
        severity: 'HIGH',
        category: 'USER_SYSTEM',
        targetUser: 't.anderson@enterprise.com',
        sourceIp: '10.0.12.88',
        alertId: newAlert.id,
        actionRequired: true
      });

      setStats(prev => ({
        ...prev,
        totalAttacksDetected: prev.totalAttacksDetected + 1,
        highRiskIncidents: prev.highRiskIncidents + 1,
        activeThreats: prev.activeThreats + 1
      }));
    } else if (scenarioType === 'ROGUE_DEVICE') {
      const newDevice: MonitoredDevice = {
        id: `DEV-${Math.floor(100 + Math.random() * 900)}`,
        name: 'RaspberryPi-Dropbox-01',
        ip: '192.168.10.155',
        mac: 'B8:27:EB:AA:51:72',
        os: 'Linux (Raspbian GNU/Linux 12)',
        connectionStatus: 'UNDER_ANALYSIS',
        user: 'Physical Plug-in [Conference Room A]',
        networkSegment: 'VLAN-Corp-WiFi',
        lastActivity: 'Just now',
        riskScore: 95,
        securityStatus: 'CRITICAL_RISK',
        aiAssessment: 'Unauthorized hardware dongle detected performing ARP cache poisoning and passive packet sniffing.',
        openPorts: [22, 5353, 8080]
      };

      setDevices(prev => [newDevice, ...prev]);
      setActivityFeed(prev => [{
        id: `ACT-${Date.now()}`,
        timestamp: timeStr,
        type: 'DEVICE',
        severity: 'CRITICAL',
        message: 'Rogue physical device (RaspberryPi-Dropbox-01) connected in Conference Room A.',
        asset: 'VLAN-Corp-WiFi',
        sourceIp: '192.168.10.155'
      }, ...prev]);

      addNotification({
        title: '🚨 Critical Hardware Alert: Rogue Wi-Fi Device',
        message: 'Rogue RaspberryPi hardware dongle detected executing ARP spoofing on corporate Wi-Fi VLAN.',
        severity: 'CRITICAL',
        category: 'ENDPOINT',
        sourceIp: '192.168.10.155',
        actionRequired: true
      });

      setStats(prev => ({
        ...prev,
        suspiciousActivities: prev.suspiciousActivities + 1,
        monitoredDevicesCount: prev.monitoredDevicesCount + 1,
        activeThreats: prev.activeThreats + 1
      }));
    }
  };

  const runSimulationStep = () => {
    setSimulation(prev => ({
      ...prev,
      simulationState: 'SIMULATING',
    }));

    setTimeout(() => {
      setSimulation(prev => ({
        ...prev,
        simulationState: 'COMPLETED',
        steps: prev.steps.map(s => ({ ...s, status: 'SIMULATED' })),
        telemetryAfter: {
          rps: 195,
          connections: 280,
          riskScore: 10,
          errorRate: 0.1
        }
      }));
    }, 800);
  };

  const approveSimulationResponse = () => {
    setSimulation(prev => ({
      ...prev,
      simulationState: 'DEPLOYED',
      steps: prev.steps.map(s => ({ ...s, status: 'VERIFIED' }))
    }));

    // Update incident state to Contained/Resolved
    if (selectedIncident) {
      updateIncidentStatus(selectedIncident.id, 'CONTAINED');
    }

    setStats(prev => ({
      ...prev,
      activeThreats: Math.max(0, prev.activeThreats - 1),
      resolvedIncidents: prev.resolvedIncidents + 1,
      securityScore: Math.min(96, prev.securityScore + 6)
    }));

    setActivityFeed(prev => [{
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      type: 'CONTAINMENT',
      severity: 'INFO',
      message: 'Defense simulation approved & verified: Threat contained and traffic baseline restored.',
      asset: selectedIncident ? selectedIncident.targetAsset : 'Corporate Perimeter'
    }, ...prev]);

    addNotification({
      title: '✅ Defense Playbook Deployed & Verified',
      message: `Threat mitigated for ${selectedIncident ? selectedIncident.id : 'INC-8402'}. Risk reduced by ${simulation.riskReductionPercentage}%.`,
      severity: 'INFO',
      category: 'USER_SYSTEM',
      actionRequired: false
    });
  };

  const updateIncidentStatus = (incidentId: string, newStatus: IncidentStatus) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: newStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const approveDefenseAction = (incidentId: string, actionId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          responseActions: inc.responseActions.map(act => {
            if (act.id === actionId) {
              return { ...act, approvalStatus: 'APPROVED' };
            }
            return act;
          })
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => {
        if (!prev) return null;
        return {
          ...prev,
          responseActions: prev.responseActions.map(act => 
            act.id === actionId ? { ...act, approvalStatus: 'APPROVED' } : act
          )
        };
      });
    }
  };

  const executeDefenseAction = (incidentId: string, actionId: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          responseActions: inc.responseActions.map(act => {
            if (act.id === actionId) {
              return { 
                ...act, 
                executionStatus: 'EXECUTED',
                verificationResult: 'VERIFIED_CONTAINED'
              };
            }
            return act;
          })
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => {
        if (!prev) return null;
        return {
          ...prev,
          responseActions: prev.responseActions.map(act => 
            act.id === actionId ? { 
              ...act, 
              executionStatus: 'EXECUTED',
              verificationResult: 'VERIFIED_CONTAINED'
            } : act
          )
        };
      });
    }

    setActivityFeed(prev => [{
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      type: 'CONTAINMENT',
      severity: 'INFO',
      message: `Defense action ${actionId} successfully executed with positive verification.`,
      asset: `Incident ${incidentId}`
    }, ...prev]);
  };

  const isolateDevice = (deviceId: string) => {
    setDevices(prev => prev.map(dev => {
      if (dev.id === deviceId) {
        return {
          ...dev,
          connectionStatus: 'QUARANTINED',
          securityStatus: 'CRITICAL_RISK',
          aiAssessment: 'Device quarantined by SOC Analyst instruction. Network traffic severed.'
        };
      }
      return dev;
    }));

    setActivityFeed(prev => [{
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      type: 'DEVICE',
      severity: 'HIGH',
      message: `Device ${deviceId} was quarantined from the network via EDR control.`,
      asset: deviceId
    }, ...prev]);

    addNotification({
      title: `Endpoint Quarantined: ${deviceId}`,
      message: `EDR host isolation executed. All network adapters severed except SOC control tunnel.`,
      severity: 'HIGH',
      category: 'ENDPOINT',
      actionRequired: false
    });
  };

  const restrictUser = (userId: string) => {
    setRiskyUsers(prev => prev.map(u => {
      if (u.id === userId || u.username === userId) {
        return {
          ...u,
          status: 'RESTRICTED',
          suspiciousActivities: [...u.suspiciousActivities, 'Active sessions terminated; hardware MFA required.']
        };
      }
      return u;
    }));

    setActivityFeed(prev => [{
      id: `ACT-${Date.now()}`,
      timestamp: 'Just now',
      type: 'USER',
      severity: 'HIGH',
      message: `User ${userId} was temporarily restricted and sessions terminated.`,
      asset: userId
    }, ...prev]);

    addNotification({
      title: `🔒 User System Alert: Account Restricted (${userId})`,
      message: `Active session tokens and OAuth refresh cookies invalidated. Step-up FIDO2 hardware challenge enforced.`,
      severity: 'HIGH',
      category: 'USER_SYSTEM',
      targetUser: userId,
      actionRequired: false
    });
  };

  const addIncidentNote = (incidentId: string, text: string) => {
    const newNote = {
      id: `NOTE-${Date.now()}`,
      author: 'Lead SOC Analyst',
      timestamp: new Date().toISOString().replace('T', ' ').substring(11, 19) + ' UTC',
      text
    };

    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          notes: [...inc.notes, newNote]
        };
      }
      return inc;
    }));

    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident(prev => prev ? { ...prev, notes: [...prev.notes, newNote] } : null);
    }
  };

  const queryCopilot = async (prompt: string): Promise<string> => {
    try {
      const response = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          activeIncident: selectedIncident,
          currentStats: stats
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.answer) return data.answer;
      }
    } catch {
      // Graceful fallback to client-side cybersecurity reasoning engine
    }

    const lower = prompt.toLowerCase();
    if (lower.includes('what happened') || lower.includes('happened')) {
      return `### AI Incident Summary: ${selectedIncident?.id || 'Active Threats'}\n\n**Summary:** An external adversary IP \`${selectedIncident?.sourceIp || '198.51.100.23'}\` conducted a targeted ${selectedIncident?.attackType || 'credential brute-force attack'} against \`${selectedIncident?.targetAsset || 'Auth-Cluster-Alpha'}\`.\n\n- **Observed Indicator:** 42 failed authentication attempts followed by an anomalous successful login using an unknown Linux user agent from a foreign commercial VPN (AS13335).\n- **Targeted User:** User \`alex.vance@enterprise.com\` was compromised; user was confirmed by SOC out-of-band to be physically located elsewhere.\n- **Current Status:** Session tokens have been invalidated; containment simulation shows 86% risk reduction upon full IP perimeter block.`;
    }
    if (lower.includes('why was this alert generated') || lower.includes('why is it suspicious') || lower.includes('suspicious')) {
      return `### Detection Rationale & Heuristics\n\n1. **Volumetric Threshold Exceeded:** 42 failed authentication requests within 90 seconds (standard baseline is <2 per hour per user).\n2. **Geographical & ASN Inconsistency:** Request originated from Frankfurt, Germany (AS13335) whereas the employee's baseline origin is Seattle, USA (AS7922).\n3. **JA3 TLS & User-Agent Mismatch:** Client TLS fingerprint corresponds to Python/Go script wrappers, differing from standard macOS Safari/Chrome enterprise profiles.\n4. **Confidence Level:** 94% attribution confidence with low false-positive probability.`;
    }
    if (lower.includes('attack path') || lower.includes('path')) {
      return `### Visual Attack Chain Sequence:\n\n1. **Initial Access:** Adversary (198.51.100.23) probes perimeter WAF via HTTPS.\n2. **Credential Access:** Automated password spray against \`/oauth/token\` endpoint.\n3. **Compromise:** Single success on \`alex.vance@enterprise.com\` generates valid JWT.\n4. **Attempted Lateral Pivot:** Adversary probed internal gRPC service \`10.0.5.22\`.\n5. **Mitigation Chokepoint:** Blocked at internal network boundary before database exfiltration could occur.`;
    }
    if (lower.includes('contain') || lower.includes('defense') || lower.includes('how can i contain')) {
      return `### Recommended Containment Playbook (NIST 800-61r2):\n\n1. **Immediate Session Termination (P0):** Revoke all OAuth refresh tokens and active JWTs for \`alex.vance@enterprise.com\`.\n2. **Perimeter Source Ban (P1):** Deploy temporary edge drop rule for \`198.51.100.23\` on Cloudflare/WAF.\n3. **Identity Remediation (P1):** Force immediate LDAP/Okta password rotation and mandate FIDO2 hardware token re-enrollment.\n4. **Forensic Inspection (P2):** Dump and inspect EDR telemetry on endpoint \`MacBook-Pro-Eng-104\` to verify no local token stealer malware exists.`;
    }
    if (lower.includes('false positive') || lower.includes('is this likely')) {
      return `### False Positive Assessment:\n\n- **False Positive Probability:** < 4% (Extremely Low).\n- **Corroborating Evidence:** Physical human analyst verification confirmed the real employee was asleep in Seattle and did not initiate logins from Frankfurt.\n- **Recommendation:** Do not dismiss as false positive. Proceed with credential invalidation.`;
    }

    return `### AI Security Copilot Analysis\n\nRegarding your query: "${prompt}"\n\n- **Active Incident Context:** ${selectedIncident ? `${selectedIncident.id} (${selectedIncident.severity}) - ${selectedIncident.title}` : 'Global SOC Command Center State'}\n- **Current Posture:** Security Score: ${stats.securityScore}/100 | Active Threats: ${stats.activeThreats} | System Health: ${stats.systemHealthPercent}%\n- **Guidance:** Maintain active monitoring across the DMZ and verify that all elevated actions are formally approved before execution to avoid production impact.`;
  };

  return (
    <SocContext.Provider
      value={{
        activeTab,
        setActiveTab,
        stats,
        alerts,
        incidents,
        predictions,
        simulation,
        riskyUsers,
        devices,
        websites,
        threatIntelMap,
        globalThreats,
        mitreMatrix,
        activityFeed,
        attackPathNodes,
        attackPathLinks,
        selectedIncident,
        setSelectedIncident,
        selectedAlert,
        setSelectedAlert,
        investigatedIp,
        setInvestigatedIp,
        isLiveFeedActive,
        setIsLiveFeedActive,
        isCopilotOpen,
        setIsCopilotOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        addNotification,
        notifyUserSystem,
        notificationSoundEnabled,
        setNotificationSoundEnabled,
        desktopNotificationsEnabled,
        requestDesktopNotifications,
        activeToasts,
        dismissToast,
        isNotificationDropdownOpen,
        setIsNotificationDropdownOpen,
        triggerAttackScenario,
        runSimulationStep,
        approveSimulationResponse,
        updateIncidentStatus,
        approveDefenseAction,
        executeDefenseAction,
        isolateDevice,
        restrictUser,
        addIncidentNote,
        queryCopilot
      }}
    >
      {children}
    </SocContext.Provider>
  );
};

export const useSoc = () => {
  const context = useContext(SocContext);
  if (!context) {
    throw new Error('useSoc must be used within a SocProvider');
  }
  return context;
};
