import { createContext, useContext, useState } from 'react'
import { TICKETS as INITIAL_TICKETS } from '../data/mockData'

// SLA thresholds per priority (seconds)
export const SLA_SECONDS = {
  CRITICAL: 14400,    // 4 hours
  HIGH: 172800,       // 2 days
  MEDIUM: 432000,     // 5 days
  LOW: 864000,        // 10 days
}

const TicketContext = createContext(null)

let _counter = INITIAL_TICKETS.length + 1

function nextId() {
  return `UFITS-TDP-2026-${String(_counter++).padStart(4, '0')}`
}

function escalatePriority(p) {
  const order = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
  return order[Math.min(order.indexOf(p) + 1, 3)]
}

export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [notifications, setNotifications] = useState([
    { id: 1, msg: 'System initialized. SLA monitoring active.', ts: new Date().toISOString(), read: true },
  ])

  function notify(msg) {
    setNotifications(prev => [{ id: Date.now(), msg, ts: new Date().toISOString(), read: false }, ...prev])
  }

  function markAllRead() {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  // ── Create new ticket ──────────────────────────────────────────────────────
  function createTicket(data) {
    const id = nextId()
    const slaSeconds = SLA_SECONDS[data.priority] ?? SLA_SECONDS.MEDIUM
    const ticket = {
      id,
      type: data.type,
      priority: data.priority,
      title: data.title,
      description: data.description,
      preview: data.description.slice(0, 90) + '…',
      errorLog: null,
      status: 'OPEN',
      assignedAgent: null,
      assignees: null,
      assignee: null,
      assigneeInitials: null,
      slaSeconds,
      slaPaused: false,
      slaSecondsAtPause: null,
      requester: data.requester,
      notes: [],
      fixDescription: '',
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      closedAt: null,
      rating: null,
      tag: 'human',
      timeAgo: 'just now',
      source: {
        url: window.location.href,
        browser: navigator.userAgent.split(')')[0].split('(').pop(),
        timestamp: new Date().toISOString(),
      },
    }
    setTickets(prev => [ticket, ...prev])
    notify(`Ticket ${id} created. Auto-acknowledgement sent to ${data.requester.email}.`)
    return ticket
  }

  // ── Assign ticket (Tier 1) ─────────────────────────────────────────────────
  function assignTicket(ticketId, agent) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? {
          ...t,
          status: 'ASSIGNED',
          assignedAgent: agent,
          assignee: agent.name,
          assigneeInitials: agent.initials,
          assignees: [agent.initials],
        }
      : t
    ))
    notify(`Ticket ${ticketId} assigned to ${agent.name}. SLA clock started.`)
  }

  // ── Status update (Tier 2 freeform) ───────────────────────────────────────
  function updateStatus(ticketId, status) {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t))
  }

  // ── Add progress note ──────────────────────────────────────────────────────
  function addNote(ticketId, { author, text }) {
    const note = { id: Date.now(), author, text, ts: new Date().toISOString() }
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, notes: [...(t.notes ?? []), note] }
      : t
    ))
  }

  // ── Request more info (Tier 2) → PENDING_REPORTER, pause SLA ──────────────
  function requestInfo(ticketId) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, status: 'PENDING_REPORTER', slaPaused: true, slaSecondsAtPause: t.slaSeconds }
      : t
    ))
    notify(`More information requested from reporter on ${ticketId}. SLA clock paused.`)
  }

  // ── Resume investigation (after reporter responds) ─────────────────────────
  function resumeInvestigation(ticketId) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? {
          ...t,
          status: 'IN_PROGRESS',
          slaPaused: false,
          slaSeconds: t.slaSecondsAtPause ?? t.slaSeconds,
        }
      : t
    ))
    notify(`Reporter responded on ${ticketId}. Investigation resumed. SLA clock restarted.`)
  }

  // ── Resolve ticket (Tier 2) ────────────────────────────────────────────────
  function resolveTicket(ticketId, fixDescription) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, status: 'RESOLVED', fixDescription, resolvedAt: new Date().toISOString(), slaPaused: true }
      : t
    ))
    notify(`Ticket ${ticketId} marked Resolved. Reporter notified of resolution.`)
  }

  // ── Reporter confirms resolution → CLOSED ──────────────────────────────────
  function confirmResolution(ticketId) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, status: 'CLOSED', closedAt: new Date().toISOString() }
      : t
    ))
    notify(`Ticket ${ticketId} closed. Feedback rating request sent to reporter.`)
  }

  // ── Reporter disputes resolution → REOPENED ────────────────────────────────
  function disputeResolution(ticketId) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? {
          ...t,
          status: 'REOPENED',
          priority: escalatePriority(t.priority),
          slaPaused: false,
          slaSeconds: SLA_SECONDS[escalatePriority(t.priority)],
          resolvedAt: null,
        }
      : t
    ))
    notify(`Ticket ${ticketId} disputed by reporter. Re-routed to queue with elevated priority.`)
  }

  // ── Auto-close after no reporter response (5 days) ─────────────────────────
  function autoClose(ticketId) {
    setTickets(prev => prev.map(t => t.id === ticketId
      ? { ...t, status: 'CLOSED', closedAt: new Date().toISOString() }
      : t
    ))
    notify(`Ticket ${ticketId} auto-closed after no reporter response (5 days).`)
  }

  // ── Submit feedback rating ──────────────────────────────────────────────────
  function rateTicket(ticketId, rating) {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, rating } : t))
    notify(`Feedback rating (${rating}/5) submitted for ticket ${ticketId}.`)
  }

  return (
    <TicketContext.Provider value={{
      tickets,
      notifications,
      markAllRead,
      createTicket,
      assignTicket,
      updateStatus,
      addNote,
      requestInfo,
      resumeInvestigation,
      resolveTicket,
      confirmResolution,
      disputeResolution,
      autoClose,
      rateTicket,
    }}>
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  return useContext(TicketContext)
}
