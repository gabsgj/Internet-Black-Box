import type { Incident, EventNode, IncidentGraph, DashboardMetrics } from './types';

// Let's establish today as 2026-06-23T15:00:00Z for our timestamps to align with the current date/time
const baseTime = new Date('2026-06-23T15:47:00Z');

const adjustTime = (minutesOffset: number): string => {
  const d = new Date(baseTime);
  d.setMinutes(d.getMinutes() + minutesOffset);
  return d.toISOString();
};

export const mockMetrics: DashboardMetrics = {
  openIncidentsCount: 1,
  mttrMinutes: 23,
  mttrTrend: -12.5,
  totalEventsCount: 1240,
  eventsTrend: 8.3,
  anomalyScore: 84,
  systemStatuses: {
    github: 'online',
    slack: 'online',
    sentry: 'degraded',
  },
};

export const mockIncidents: Incident[] = [
  {
    id: 'inc-payment-500',
    title: 'P1 Outage: Payment API returning 500 errors on /checkout',
    type: 'OUTAGE',
    triggeredAt: adjustTime(0), // 3:47 PM
    triggeredBy: 'Sentry Webhook',
    status: 'OPEN',
    severity: 'P1',
    aiSummary: '', // will be populated after reconstruction simulation
    rootCause: '',
  },
  {
    id: 'inc-auth-authz',
    title: 'P2 Latency Spike: Auth service token verification delays',
    type: 'OUTAGE',
    triggeredAt: adjustTime(-180), // 3 hours ago
    triggeredBy: 'Datadog Monitor',
    status: 'RESOLVED',
    severity: 'P2',
    aiSummary: 'A sudden burst of authentication requests from an legacy API client led to thread-pool exhaustion on the auth service. The client was throttled and the latency returned to normal (avg 42ms).',
    rootCause: 'Thread-pool exhaustion due to un-throttled legacy client integrations.',
  },
  {
    id: 'inc-leak-sec',
    title: 'P3 Compliance: Unencrypted API key committed in staging build configs',
    type: 'SECURITY_BREACH',
    triggeredAt: adjustTime(-1440), // 24 hours ago
    triggeredBy: 'GitHub Secret Scanning',
    status: 'RESOLVED',
    severity: 'P3',
    aiSummary: 'A developer inadvertently pushed a config file containing a test SendGrid API key to the staging repository branch. The key was identified by GitHub Secret Scanning, auto-revoked, and the commit was scrubbed.',
    rootCause: 'SendGrid staging key hardcoded in config file.',
  },
];

// Raw timeline events in the 4 hours preceding/succeeding the payment outage
export const mockEvents: EventNode[] = [
  {
    id: 'evt-git-pr-92',
    type: 'PR_MERGE',
    timestamp: adjustTime(-76), // 2:31 PM
    source: 'github',
    content: 'PR #92 Merged: "Refactor auth token validation and standardise JWT structure" by Sarah Jenkins',
    severity: 'INFO',
    metadata: JSON.stringify({ prNumber: 92, repository: 'payment-service', author: 'Sarah Jenkins', additions: 184, deletions: 92 }),
  },
  {
    id: 'evt-git-commit-92f',
    type: 'COMMIT',
    timestamp: adjustTime(-75), // 2:32 PM
    source: 'github',
    content: 'Commit [92f7a1c]: Standardised JWT expiry verification & claims validation',
    severity: 'INFO',
    metadata: JSON.stringify({ sha: '92f7a1c', fileModified: ['src/middleware/auth.ts', 'package.json'] }),
  },
  {
    id: 'evt-git-deploy-prod',
    type: 'DEPLOYMENT',
    timestamp: adjustTime(-45), // 3:02 PM
    source: 'github',
    content: 'Deployment [Run #412]: service "payment-service" deployed to environment "production" (SUCCESS)',
    severity: 'INFO',
    metadata: JSON.stringify({ environment: 'production', workflowId: 'run-412', status: 'SUCCESS' }),
  },
  {
    id: 'evt-slack-latency-raj',
    type: 'SLACK_MESSAGE',
    timestamp: adjustTime(-35), // 3:12 PM
    source: 'slack',
    content: 'Raj Patel: "hey anyone seeing increased latency on /checkout? Seeing occasional timeouts in local tests."',
    severity: 'WARNING',
    metadata: JSON.stringify({ channel: '#on-call-devs', sender: 'Raj Patel' }),
  },
  {
    id: 'evt-slack-reply-sarah',
    type: 'SLACK_MESSAGE',
    timestamp: adjustTime(-30), // 3:17 PM
    source: 'slack',
    content: 'Sarah Jenkins: "Should be fine, the JWT validation PR merged recently should actually speed things up. Let me check the metrics."',
    severity: 'INFO',
    metadata: JSON.stringify({ channel: '#on-call-devs', sender: 'Sarah Jenkins', threadParent: 'evt-slack-latency-raj' }),
  },
  {
    id: 'evt-sentry-first-500',
    type: 'ERROR_LOG',
    timestamp: adjustTime(-15), // 3:32 PM
    source: 'sentry',
    content: 'Sentry Error: JsonWebTokenError - "invalid signature" on payment-service: /api/pay',
    severity: 'WARNING',
    metadata: JSON.stringify({ errorClass: 'JsonWebTokenError', service: 'payment-service', route: '/api/pay' }),
  },
  {
    id: 'evt-sentry-spike',
    type: 'ALERT',
    timestamp: adjustTime(0), // 3:47 PM
    source: 'sentry',
    content: 'Sentry Alert: Critical Spike! 500 error rate on /api/pay spiked to 89% (Threshold: 5%)',
    severity: 'CRITICAL',
    metadata: JSON.stringify({ alertName: 'High Error Rate', service: 'payment-service', rate: '89%' }),
  },
  {
    id: 'evt-slack-panic',
    type: 'SLACK_MESSAGE',
    timestamp: adjustTime(3), // 3:50 PM
    source: 'slack',
    content: 'Rahul Sharma: "🚨 checkout seems to be completely down, checking logs now. Sentry is firing P1 alerts."',
    severity: 'CRITICAL',
    metadata: JSON.stringify({ channel: '#incident-war-room', sender: 'Rahul Sharma' }),
  },
  {
    id: 'evt-slack-investigate',
    type: 'SLACK_MESSAGE',
    timestamp: adjustTime(5), // 3:52 PM
    source: 'slack',
    content: 'Raj Patel: "Getting JWT verification errors. Did the middleware deploy today break backward compatibility for older active sessions?"',
    severity: 'WARNING',
    metadata: JSON.stringify({ channel: '#incident-war-room', sender: 'Raj Patel' }),
  },
  {
    id: 'evt-git-rollback',
    type: 'DEPLOYMENT',
    timestamp: adjustTime(18), // 4:05 PM
    source: 'github',
    content: 'Deployment [Run #413]: Rolling back payment-service to commit [e9112ab] (SUCCESS)',
    severity: 'INFO',
    metadata: JSON.stringify({ environment: 'production', status: 'SUCCESS', rollback: true }),
  },
  {
    id: 'evt-sentry-resolve',
    type: 'ALERT',
    timestamp: adjustTime(23), // 4:10 PM
    source: 'sentry',
    content: 'Sentry Resolution: 500 error rate on /api/pay returned to 0% (Resolved)',
    severity: 'INFO',
    metadata: JSON.stringify({ status: 'RESOLVED' }),
  },
];

// Completed reconstruction data for the synthetic incident
export const mockReconstructionReport = {
  aiSummary: `At 3:47 PM on June 23, 2026, the payment service experienced a critical P1 outage where error rates on the /api/pay endpoint spiked to 89%, rendering the checkout checkout page unusable for 23 minutes.

The incident was initiated by a refactoring of the Auth Token validation class merged by **Sarah Jenkins** in PR #92. The deployment of this change went live at 3:02 PM. Shortly after, at 3:12 PM, **Raj Patel** noticed minor latency delays in Slack.

At 3:32 PM, Sentry logged the first signature mismatches. The core issue was that the refactored JWT validation library changed the key encoding decoding scheme, breaking backward compatibility with existing active JWT tokens generated prior to the 3:02 PM deployment. The system started throwing HTTP 500/JsonWebTokenError on all existing user sessions.

At 4:05 PM, **Rahul Sharma** triggered a rollback to the previous version, resolving the incident by 4:10 PM.`,
  rootCause: 'JWT signature key decoding change broke backward compatibility with all active user tokens generated before the deployment.',
  confidence: 94,
  people: [
    { name: 'Sarah Jenkins', action: 'Authored PR #92 refactoring Auth Validation', role: 'Introduced Bug' },
    { name: 'Raj Patel', action: 'Identified checkout timeouts and raised issue in Slack', role: 'First Responder' },
    { name: 'Rahul Sharma', action: 'Created incident war room and executed deployment rollback', role: 'Incident Commander' },
  ],
  prevention: [
    'Implement unit tests validating backward compatibility of JWT signatures across key encoding changes.',
    'Introduce Canary Deployments so that token verification errors can be caught on 1% of traffic instead of an immediate 100% blast radius.',
    'Improve graceful fallback in auth middleware to redirect users to re-authenticate (HTTP 401) rather than returning unhandled server failures (HTTP 500).',
  ],
};

// Causal Graph nodes and edges representing the incident subgraph
export const mockGraphs: Record<string, IncidentGraph> = {
  'inc-payment-500': {
    nodes: [
      {
        id: 'node-inc',
        label: 'Incident: Payment API Spiking 500s',
        type: 'Incident',
        properties: { title: 'Payment API returned 500', severity: 'P1', triggeredAt: adjustTime(0) },
        x: 0,
        y: 0,
        size: 24,
        color: '#f97316', // Orange
      },
      {
        id: 'node-system',
        label: 'System: payment-service (prod)',
        type: 'System',
        properties: { name: 'payment-service', environment: 'production', type: 'SERVICE' },
        x: 0,
        y: -150,
        size: 20,
        color: '#ef4444', // Red
      },
      {
        id: 'node-sarah',
        label: 'Person: Sarah Jenkins (Dev)',
        type: 'Person',
        properties: { name: 'Sarah Jenkins', email: 'sarah@company.com', role: 'Tech Lead' },
        x: -300,
        y: 100,
        size: 16,
        color: '#06b6d4', // Cyan
      },
      {
        id: 'node-pr',
        label: 'Event: Merged PR #92 (Auth Refactor)',
        type: 'Event',
        properties: { type: 'PR_MERGE', timestamp: adjustTime(-76), source: 'github', content: 'PR #92: Refactor auth validation' },
        x: -200,
        y: 50,
        size: 14,
        color: '#f59e0b', // Amber/Yellow
      },
      {
        id: 'node-deploy',
        label: 'Event: Deployment #412 (Success)',
        type: 'Event',
        properties: { type: 'DEPLOYMENT', timestamp: adjustTime(-45), source: 'github', content: 'Deploys payment-service' },
        x: -100,
        y: -50,
        size: 14,
        color: '#f59e0b',
      },
      {
        id: 'node-raj',
        label: 'Person: Raj Patel (On-Call)',
        type: 'Person',
        properties: { name: 'Raj Patel', email: 'raj@company.com', role: 'Frontend Engineer' },
        x: 100,
        y: 150,
        size: 16,
        color: '#06b6d4',
      },
      {
        id: 'node-slack',
        label: 'Event: Slack message - Raj Patel',
        type: 'Event',
        properties: { type: 'SLACK_MESSAGE', timestamp: adjustTime(-35), source: 'slack', content: 'hey anyone seeing increased latency on /checkout?' },
        x: 50,
        y: 80,
        size: 12,
        color: '#f59e0b',
      },
      {
        id: 'node-sentry-err',
        label: 'Event: Sentry Error (JsonWebTokenError)',
        type: 'Event',
        properties: { type: 'ERROR_LOG', timestamp: adjustTime(-15), source: 'sentry', content: 'JsonWebTokenError: invalid signature' },
        x: -50,
        y: -90,
        size: 12,
        color: '#f59e0b',
      },
      {
        id: 'node-sentry-alert',
        label: 'Event: Sentry Alert (High Error Rate)',
        type: 'Event',
        properties: { type: 'ALERT', timestamp: adjustTime(0), source: 'sentry', content: '500 error rate spiked to 89%' },
        x: -100,
        y: -150,
        size: 15,
        color: '#ec4899', // Pink (Critical alert)
      },
      {
        id: 'node-rahul',
        label: 'Person: Rahul Sharma (Ops)',
        type: 'Person',
        properties: { name: 'Rahul Sharma', email: 'rahul@company.com', role: 'SRE' },
        x: 250,
        y: -50,
        size: 16,
        color: '#06b6d4',
      },
      {
        id: 'node-slack-panic',
        label: 'Event: Slack message - Rahul Sharma',
        type: 'Event',
        properties: { type: 'SLACK_MESSAGE', timestamp: adjustTime(3), source: 'slack', content: 'checkout seems to be completely down' },
        x: 200,
        y: 20,
        size: 12,
        color: '#f59e0b',
      },
      {
        id: 'node-rollback',
        label: 'Event: Rollback deployment #413',
        type: 'Event',
        properties: { type: 'DEPLOYMENT', timestamp: adjustTime(18), source: 'github', content: 'Rollback to e9112ab' },
        x: 150,
        y: -120,
        size: 14,
        color: '#f59e0b',
      },
    ],
    edges: [
      { id: 'e-auth-pr', source: 'node-sarah', target: 'node-pr', type: 'AUTHORED' },
      { id: 'e-pr-deploy', source: 'node-pr', target: 'node-deploy', type: 'TRIGGERED' },
      { id: 'e-deploy-system', source: 'node-deploy', target: 'node-system', type: 'DEPLOYED_TO' },
      { id: 'e-deploy-jwt-err', source: 'node-deploy', target: 'node-sentry-err', type: 'TRIGGERED' },
      { id: 'e-jwt-err-alert', source: 'node-sentry-err', target: 'node-sentry-alert', type: 'TRIGGERED' },
      { id: 'e-sentry-alert-inc', source: 'node-sentry-alert', target: 'node-inc', type: 'CAUSED_BY' },
      { id: 'e-system-inc', source: 'node-system', target: 'node-inc', type: 'EXPERIENCED' },
      { id: 'e-auth-slack', source: 'node-raj', target: 'node-slack', type: 'AUTHORED' },
      { id: 'e-deploy-slack', source: 'node-deploy', target: 'node-slack', type: 'PRECEDED' },
      { id: 'e-auth-slack-panic', source: 'node-rahul', target: 'node-slack-panic', type: 'AUTHORED' },
      { id: 'e-inc-slack-panic', source: 'node-inc', target: 'node-slack-panic', type: 'TRIGGERED' },
      { id: 'e-auth-rollback', source: 'node-rahul', target: 'node-rollback', type: 'AUTHORED' },
      { id: 'e-rollback-system', source: 'node-rollback', target: 'node-system', type: 'DEPLOYED_TO' },
    ],
  },
};
export const getMockGraph = (id: string): IncidentGraph => {
  return mockGraphs[id] || { nodes: [], edges: [] };
};
export const getMockTimeline = (id: string): EventNode[] => {
  if (id === 'inc-payment-500') {
    return mockEvents;
  }
  return [];
};
