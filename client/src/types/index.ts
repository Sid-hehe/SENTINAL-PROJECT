export type Role = 'USER' | 'ANALYST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string | null;
  isActive?: boolean;
  lastLoginAt?: string | null;
  createdAt?: string;
}

export type FraudType =
  | 'IDENTITY_THEFT'
  | 'ONBOARDING_FRAUD'
  | 'ACCOUNT_TAKEOVER'
  | 'SOCIAL_ENGINEERING'
  | 'DEVICE_FRAUD'
  | 'TRANSACTION_FRAUD';

export type RiskTier = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScamStatus = 'ACTIVE' | 'HISTORICAL' | 'UNDER_REVIEW';

export interface ScamPattern {
  id: string;
  title: string;
  slug: string;
  description: string;
  detailedDescription: string;
  fraudType: FraudType;
  riskTier: RiskTier;
  status: ScamStatus;
  behavioralRedFlags: string[];
  firstIdentified: string;
  lastSeen: string;
  protectionTips: string[];
  exampleRiskScore: number;
  createdAt: string;
}

export type ReportStatus = 'NEW' | 'UNDER_REVIEW' | 'CONFIRMED' | 'DISMISSED';

export interface SuspiciousReport {
  id: string;
  reporterName: string;
  reporterEmail: string;
  fraudType: FraudType;
  description: string;
  suspectedPattern?: string | null;
  evidence?: string | null;
  status: ReportStatus;
  createdAt: string;
}

export type SessionStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'CONFIRMED_FRAUD'
  | 'CONFIRMED_LEGITIMATE'
  | 'NEEDS_MORE_INFO';

export type SignalType =
  | 'DEVICE_SWITCH'
  | 'FAST_COMPLETION'
  | 'FIELD_CORRECTIONS'
  | 'NAVIGATION_ANOMALY'
  | 'TYPING_CADENCE'
  | 'LOGIN_TIMING'
  | 'TRANSACTION_VELOCITY'
  | 'SESSION_DURATION'
  | 'PROFILE_CHANGE';

export interface BehavioralSignal {
  id: string;
  sessionId: string;
  signalType: SignalType;
  description: string;
  scoreContribution: number;
  severity: RiskTier;
  metadata?: Record<string, any> | null;
  createdAt: string;
}

export interface CaseNote {
  id: string;
  sessionId: string;
  authorId: string;
  content: string;
  createdAt: string;
  author?: {
    id: string;
    name: string;
    role: Role;
    avatar?: string | null;
  };
}

export interface Session {
  id: string;
  sessionId: string;
  customerReference: string;
  riskScore: number;
  riskTier: RiskTier;
  identityStatus: string;
  behavioralStatus: string;
  transactionStatus: string;
  topSignal: string;
  recommendation: string;
  status: SessionStatus;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  signals?: BehavioralSignal[];
  notes?: CaseNote[];
  _count?: {
    notes: number;
  };
}

export interface AuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, any> | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  } | null;
}

export interface ModelComponentStatus {
  name: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  accuracy: string;
  lastTrained: string;
}

export interface ModelHealthData {
  overallStatus: 'HEALTHY' | 'DEGRADED';
  components: ModelComponentStatus[];
  anomalyModelEnabled: boolean;
  fallbackMessage: string | null;
}

export interface DashboardStats {
  fraudCaughtPreTransaction: {
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
  };
  falsePositiveRate: {
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
  };
  medianTimeToDecision: {
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
  };
  onboardingCompletionRate: {
    value: string;
    change: string;
    trend: 'up' | 'down';
    description: string;
  };
  summaryCounts: {
    totalSessions: number;
    confirmedFraud: number;
    criticalSessions: number;
    highSessions: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
