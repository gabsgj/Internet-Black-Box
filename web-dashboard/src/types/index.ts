export type EventType =
  | 'COMMIT'
  | 'PR_MERGE'
  | 'DEPLOYMENT'
  | 'SLACK_MESSAGE'
  | 'EMAIL'
  | 'MEETING'
  | 'TICKET_UPDATE'
  | 'ERROR_LOG'
  | 'ALERT'
  | 'FILE_EDIT';

export type Severity = 'INFO' | 'WARNING' | 'CRITICAL';

export type IncidentSeverity = 'P1' | 'P2' | 'P3';

export type IncidentStatus = 'OPEN' | 'RECONSTRUCTING' | 'RESOLVED';

export type IncidentType =
  | 'OUTAGE'
  | 'SECURITY_BREACH'
  | 'PROJECT_FAILURE'
  | 'COMPLIANCE'
  | 'UNKNOWN';

export type SystemType =
  | 'SERVICE'
  | 'REPOSITORY'
  | 'DATABASE'
  | 'API'
  | 'PIPELINE';

export interface Person {
  id: string;
  name: string;
  email: string;
  role: string;
  teams: string[];
}

export interface EventNode {
  id: string;
  type: EventType;
  timestamp: string;
  source: string;
  content: string;
  severity: Severity;
  metadata?: string; // JSON string from backend
}

export interface SystemNode {
  id: string;
  name: string;
  type: SystemType;
  environment: 'production' | 'staging' | 'dev';
}

export interface FileNode {
  id: string;
  path: string;
  repository: string;
  language: string;
}

export interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  triggeredAt: string;
  triggeredBy: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  aiSummary?: string;
  rootCause?: string;
}

// Structures for Sigma.js / Graphology mapping
export interface GraphNode {
  id: string;
  label: string;
  type: 'Person' | 'Event' | 'System' | 'File' | 'Incident';
  properties: Record<string, unknown>;
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  type: string; // RELATIONSHIP TYPE, e.g. AUTHORED, CAUSED_BY, TRIGGERED, AFFECTED, DEPLOYED_TO, MODIFIED, PART_OF, RESPONDED_TO, EXPERIENCED
  properties?: Record<string, unknown>;
}

export interface IncidentGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface DashboardMetrics {
  openIncidentsCount: number;
  mttrMinutes: number;
  mttrTrend: number; // percentage change
  totalEventsCount: number;
  eventsTrend: number; // percentage change
  anomalyScore: number;
  systemStatuses: {
    github: 'online' | 'offline' | 'degraded';
    slack: 'online' | 'offline' | 'degraded';
    sentry: 'online' | 'offline' | 'degraded';
  };
}
