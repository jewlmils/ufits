// ─── Users / Auth ────────────────────────────────────────────────────────────
export const USERS = [
  {
    id: 1,
    email: 'admin@tesda.gov.ph',
    password: 'Admin@2024',
    name: 'Admin User',
    role: 'admin',
    avatar: null,
    initials: 'AU',
  },
  {
    id: 2,
    email: 'marcus.chen@tesda.gov.ph',
    password: 'Tier1@2024',
    name: 'Marcus Chen',
    role: 'tier1',
    roleLabel: 'TIER 1 SUPERVISOR',
    avatar: null,
    initials: 'MC',
  },
  {
    id: 3,
    email: 'anna.reyes@tesda.gov.ph',
    password: 'Tier2@2024',
    name: 'Anna Reyes',
    role: 'tier2',
    roleLabel: 'TIER 2 SUPERVISOR',
    avatar: null,
    initials: 'AR',
  },
]

// ─── Tickets ─────────────────────────────────────────────────────────────────
export const TICKETS = [
  {
    id: '#INC-9021',
    type: 'INCIDENT',
    priority: 'CRITICAL',
    title: 'VPN Gateway Auth Failure: Remote Branch',
    preview:
      'All users in the North Regional Office report 403 Forbidden errors when attempting to connect to...',
    description: `Multiple users from the **North Regional Office** have reported total loss of connectivity to the internal ERP and File Shares starting at 08:15 AM local time.\n\nInitial diagnostic shows the gateway is responding to ICMP pings, but terminating SSL handshakes prematurely. Error logs from the edge router indicate a potential certificate expiration or CRL sync failure.`,
    errorLog: `ERR_SSL_VERSION_OR_CIPHER_MISMATCH:\n[Remote-IP: 10.12.4.1] |\nhandshake_failure`,
    assignees: ['MC', 'AR'],
    assignedAgent: { id: 3, name: 'Anna Reyes', initials: 'AR' },
    slaSeconds: 874,
    slaPaused: false,
    slaSecondsAtPause: null,
    status: 'IN_PROGRESS',
    notes: [
      { id: 1, author: 'Anna Reyes', text: 'Checked edge router logs. Certificate CN mismatch confirmed. Contacting PKI team.', ts: '2026-03-26T08:30:00.000Z' },
    ],
    fixDescription: '',
    createdAt: '2026-03-26T08:17:00.000Z',
    resolvedAt: null,
    closedAt: null,
    rating: null,
    requester: {
      name: 'Alicia Torres',
      title: 'Regional Manager (North)',
      email: 'a.torres@gov.ph',
      phone: '+1 (555) 012-9844',
      initials: 'AT',
    },
    tag: 'system',
  },
  {
    id: '#REQ-4412',
    type: 'REQUEST',
    priority: 'MEDIUM',
    title: 'Database Access Provisioning',
    preview:
      'New hire in Finance requires Read-Only access to the Oracle production instance for quarterly...',
    description: `New hire in Finance requires Read-Only access to the Oracle production instance for quarterly reporting. The employee has completed mandatory data governance training and has manager approval on file.`,
    errorLog: null,
    assignee: 'Sarah Jenkins',
    assigneeInitials: 'SJ',
    assignedAgent: { id: 1, name: 'Sarah Jenkins', initials: 'SJ' },
    timeAgo: '2h ago',
    slaSeconds: undefined,
    slaPaused: false,
    slaSecondsAtPause: null,
    status: 'ASSIGNED',
    notes: [],
    fixDescription: '',
    createdAt: '2026-03-26T06:15:00.000Z',
    resolvedAt: null,
    closedAt: null,
    rating: null,
    requester: {
      name: 'Sarah Jenkins',
      title: 'Finance Analyst',
      email: 's.jenkins@tesda.gov.ph',
      phone: '+63 (2) 888-4567',
      initials: 'SJ',
    },
    tag: 'human',
  },
  {
    id: '#INC-9105',
    type: 'INCIDENT',
    priority: 'LOW',
    title: 'Printer Toner Low – 4th Floor',
    preview:
      'Office manager reports printer P-402 is displaying a maintenance warning but still functional.',
    description: `Office manager reports printer P-402 is displaying a maintenance warning but still functional. Toner cartridge replacement required before end of week to avoid downtime during audit preparation.`,
    errorLog: null,
    assignee: null,
    assigneeInitials: null,
    assignedAgent: null,
    timeAgo: '5h ago',
    slaSeconds: undefined,
    slaPaused: false,
    slaSecondsAtPause: null,
    status: 'OPEN',
    notes: [],
    fixDescription: '',
    createdAt: '2026-03-26T02:45:00.000Z',
    resolvedAt: null,
    closedAt: null,
    rating: null,
    requester: {
      name: 'James Miller',
      title: 'Office Manager',
      email: 'j.miller@tesda.gov.ph',
      phone: '+63 (2) 888-7890',
      initials: 'JM',
    },
    tag: 'human',
  },
  {
    id: '#REQ-4398',
    type: 'REQUEST',
    priority: 'MEDIUM',
    title: 'Email Account Setup – New Employee',
    preview: 'HR requests email provisioning for new regional coordinator joining Monday...',
    description: `HR requests email provisioning for new regional coordinator joining Monday. Standard onboarding package includes email, VPN credentials, and SharePoint access.`,
    errorLog: null,
    assignee: null,
    assigneeInitials: null,
    assignedAgent: null,
    timeAgo: '1d ago',
    slaSeconds: undefined,
    slaPaused: false,
    slaSecondsAtPause: null,
    status: 'OPEN',
    notes: [],
    fixDescription: '',
    createdAt: '2026-03-25T08:00:00.000Z',
    resolvedAt: null,
    closedAt: null,
    rating: null,
    requester: {
      name: 'HR Department',
      title: 'Human Resources',
      email: 'hr@tesda.gov.ph',
      phone: '+63 (2) 888-0001',
      initials: 'HR',
    },
    tag: 'system',
  },
]

// ─── Team Agents ──────────────────────────────────────────────────────────────
export const AGENTS = [
  { id: 1, name: 'Sarah Jenkins', initials: 'SJ', status: 'ACTIVE', tickets: 4 },
  { id: 2, name: 'James Miller', initials: 'JM', status: 'BUSY', tickets: 7 },
  { id: 3, name: 'Diana Cruz', initials: 'DC', status: 'ACTIVE', tickets: 3 },
  { id: 4, name: 'Kevin Tan', initials: 'KT', status: 'IDLE', tickets: 0 },
  { id: 5, name: 'Maria Reyes', initials: 'MR', status: 'ACTIVE', tickets: 5 },
]

// ─── New Tickets Feed ─────────────────────────────────────────────────────────
export const TICKET_FEED = [
  {
    id: 1,
    tag: 'system',
    title: 'VPN Gateway Auth Failure: Remote Branch',
    time: '08:17 AM',
    priority: 'CRITICAL',
  },
  {
    id: 2,
    tag: 'human',
    title: 'Database Access Provisioning – Finance',
    time: '08:03 AM',
    priority: 'MEDIUM',
  },
  {
    id: 3,
    tag: 'system',
    title: 'ERP Login Service Timeout – NCR',
    time: '07:55 AM',
    priority: 'HIGH',
  },
  {
    id: 4,
    tag: 'human',
    title: 'Printer Toner Low – 4th Floor',
    time: '07:40 AM',
    priority: 'LOW',
  },
  {
    id: 5,
    tag: 'system',
    title: 'Active Directory Sync Lag Detected',
    time: '07:22 AM',
    priority: 'MEDIUM',
  },
]

// ─── Supervisor Stats ─────────────────────────────────────────────────────────
export const SUPERVISOR_STATS = {
  incomingVolume: { value: 47, trend: '+12%', up: true },
  pendingResponse: { value: 8, trend: '-3', up: false },
  resolutionRate: { value: '84%', trend: '+5%', up: true },
}

export const STATUS_DISTRIBUTION = {
  open: 22,
  pending: 8,
  resolved: 17,
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────
export const ADMIN_STATS = {
  totalTicketVolume: { value: '1,284', trend: '+8.3%', up: true, label: 'Total Ticket Volume' },
  systemUptime: { value: '99.7%', trend: '+0.2%', up: true, label: 'System Uptime' },
  avgResolutionTime: { value: '3.4h', trend: '-0.6h', up: true, label: 'Avg Resolution Time' },
  citizenSatisfaction: { value: '4.6/5', trend: '+0.3', up: true, label: 'Citizen Satisfaction' },
}

export const SLA_TRENDS = [
  { month: 'Jan', actual: 88, target: 90 },
  { month: 'Feb', actual: 85, target: 90 },
  { month: 'Mar', actual: 91, target: 90 },
  { month: 'Apr', actual: 87, target: 90 },
  { month: 'May', actual: 93, target: 90 },
  { month: 'Jun', actual: 89, target: 90 },
  { month: 'Jul', actual: 94, target: 90 },
  { month: 'Aug', actual: 92, target: 90 },
  { month: 'Sep', actual: 96, target: 90 },
  { month: 'Oct', actual: 90, target: 90 },
  { month: 'Nov', actual: 88, target: 90 },
  { month: 'Dec', actual: 91, target: 90 },
]

export const OPERATIONAL_LOAD = [
  { name: 'Central Bureau', value: 38, color: '#1a6b4a' },
  { name: 'Regional Offices', value: 49, color: '#2563eb' },
  { name: 'Idle', value: 13, color: '#94a3b8' },
]

export const REGIONAL_RESOLUTION = [
  { region: 'NCR', rate: 94, count: 312 },
  { region: 'CALABARZON', rate: 87, count: 228 },
  { region: 'Central Visayas', rate: 79, count: 184 },
  { region: 'Davao', rate: 72, count: 156 },
  { region: 'BARMM', rate: 61, count: 98 },
]

export const CRITICAL_ESCALATIONS = [
  {
    id: '#INC-9021',
    subject: 'VPN Gateway Auth Failure: Remote Branch',
    team: 'Network Operations',
    status: 'CRITICAL',
    duration: '2h 14m',
  },
  {
    id: '#INC-8847',
    subject: 'ERP Login Service – Intermittent Timeout',
    team: 'Application Support',
    status: 'ASSIGNED',
    duration: '4h 02m',
  },
  {
    id: '#SEC-0234',
    subject: 'Suspicious Login Attempts – Admin Portal',
    team: 'Cybersecurity',
    status: 'CRITICAL',
    duration: '1h 38m',
  },
  {
    id: '#INC-9003',
    subject: 'File Share Unavailable – Visayas Region',
    team: 'Infrastructure',
    status: 'ASSIGNED',
    duration: '5h 50m',
  },
  {
    id: '#INC-8901',
    subject: 'Backup Job Failure – DR Site',
    team: 'Infrastructure',
    status: 'CLOSED',
    duration: '8h 15m',
  },
]
