import { useState } from 'react'
import {
  Plus, LogOut, CheckCircle, RefreshCw, Star, MessageSquare,
  Clock, ChevronRight, FileText, AlertTriangle, Zap, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTickets } from '../../context/TicketContext'
import StatusBadge from '../shared/StatusBadge'

// ─── Ticket Submission Modal (reporter-flavoured) ─────────────────────────────
function SubmitTicketModal({ user, onClose, onCreate }) {
  const [form, setForm] = useState({
    type: 'INCIDENT',
    priority: 'MEDIUM',
    title: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    return e
  }

  function submit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    onCreate({
      type: form.type,
      priority: form.priority,
      title: form.title.trim(),
      description: form.description.trim(),
      requester: {
        name: user.name,
        title: user.roleLabel ?? 'TESDA Staff',
        email: user.email,
        phone: '—',
        initials: user.initials,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#0a1628] px-6 py-4">
          <p className="text-white font-bold text-base">Report an Issue</p>
          <p className="text-blue-300 text-xs mt-0.5">TESDA UFITS — Support Request</p>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {/* Type + Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INCIDENT">Incident / Problem</option>
                <option value="REQUEST">Service Request</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Severity</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CRITICAL">Critical — Service Down</option>
                <option value="HIGH">High — Major Impact</option>
                <option value="MEDIUM">Medium — Some Impact</option>
                <option value="LOW">Low — Minor Issue</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
              Issue Summary <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Brief one-line description of the problem"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
              placeholder="Describe the issue in detail: what happened, when it started, what you've already tried, who else is affected..."
              className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Reporter info — read only */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-xs text-blue-700 space-y-0.5">
            <p className="font-semibold text-blue-800 mb-1">Submitting as</p>
            <p>{user.name} · {user.email}</p>
            <p className="text-[10px] text-blue-500 mt-1">Timestamp and browser context will be captured automatically.</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Status step tracker ──────────────────────────────────────────────────────
const FLOW_STEPS = [
  { key: 'OPEN',             label: 'Submitted'       },
  { key: 'ASSIGNED',         label: 'Assigned'        },
  { key: 'IN_PROGRESS',      label: 'In Progress'     },
  { key: 'RESOLVED',         label: 'Resolved'        },
  { key: 'CLOSED',           label: 'Closed'          },
]

const STEP_ORDER = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'PENDING_REPORTER', 'RESOLVED', 'CLOSED']

function StatusTracker({ status }) {
  const steps = FLOW_STEPS
  const currentIdx = STEP_ORDER.indexOf(status)

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const stepIdx = STEP_ORDER.indexOf(step.key)
        const done = stepIdx < currentIdx
        const active = step.key === status || (status === 'PENDING_REPORTER' && step.key === 'IN_PROGRESS')
        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className={`flex flex-col items-center`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors
                ${done ? 'bg-emerald-500 border-emerald-500 text-white'
                  : active ? 'bg-blue-600 border-blue-600 text-white'
                  : 'bg-white border-gray-300 text-gray-400'}`}>
                {done ? <CheckCircle size={12} /> : i + 1}
              </div>
              <p className={`text-[9px] font-semibold mt-0.5 whitespace-nowrap
                ${done ? 'text-emerald-600' : active ? 'text-blue-600' : 'text-gray-400'}`}>
                {step.label}
              </p>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-6 mb-3 rounded ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Priority icon helper ─────────────────────────────────────────────────────
const PRIORITY_ICON = {
  CRITICAL: <AlertTriangle size={13} className="text-red-600" />,
  HIGH:     <Zap size={13} className="text-orange-500" />,
  MEDIUM:   <ChevronDown size={13} className="text-yellow-500" />,
  LOW:      <ChevronDown size={13} className="text-gray-400 rotate-180" />,
}

const PRIORITY_COLOR = {
  CRITICAL: 'text-red-600',
  HIGH:     'text-orange-500',
  MEDIUM:   'text-yellow-600',
  LOW:      'text-gray-500',
}

// ─── Ticket Detail (reporter view) ───────────────────────────────────────────
function ReporterTicketDetail({ ticket }) {
  const { confirmResolution, disputeResolution, resumeInvestigation, rateTicket } = useTickets()
  const [infoText, setInfoText] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(null)

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <FileText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium">Select a ticket to view details</p>
        </div>
      </div>
    )
  }

  const { autoClose } = useTickets()

  function handleSubmitInfo() {
    if (!infoText.trim()) return
    resumeInvestigation(ticket.id)
    setInfoText('')
  }

  function simulateNoResponse() {
    let count = 3
    setAutoCloseCountdown(count)
    const timer = setInterval(() => {
      count -= 1
      if (count <= 0) {
        clearInterval(timer)
        setAutoCloseCountdown(null)
        autoClose(ticket.id)
      } else {
        setAutoCloseCountdown(count)
      }
    }, 1000)
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`flex items-center gap-1 text-xs font-bold uppercase ${PRIORITY_COLOR[ticket.priority]}`}>
                {PRIORITY_ICON[ticket.priority]}
                {ticket.priority}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
              <span className="text-gray-300">·</span>
              <span className="text-xs text-gray-400">{ticket.type}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug">{ticket.title}</h1>
          </div>
          <StatusBadge status={ticket.status} />
        </div>

        {/* Status tracker */}
        <div className="mt-4">
          <StatusTracker status={ticket.status} />
        </div>

        {ticket.status === 'PENDING_REPORTER' && (
          <div className="mt-3 bg-purple-50 border border-purple-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
            <MessageSquare size={14} className="text-purple-600 shrink-0" />
            <p className="text-xs text-purple-700 font-medium">The support team needs more information from you to continue.</p>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">

        {/* Issue description */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Report</h3>
          <div className="text-sm text-gray-700 leading-relaxed space-y-3">
            {ticket.description.split('\n\n').map((para, i) => (
              <p key={i} dangerouslySetInnerHTML={{
                __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
              }} />
            ))}
          </div>
          {ticket.errorLog && (
            <pre className="mt-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs font-mono text-gray-600 whitespace-pre-wrap">
              {ticket.errorLog}
            </pre>
          )}
        </div>

        {/* Assigned technician */}
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Assigned Technician</p>
          {ticket.assignedAgent ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0d1f3c] text-white text-sm font-bold flex items-center justify-center">
                {ticket.assignedAgent.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{ticket.assignedAgent.name}</p>
                <p className="text-xs text-gray-500">ICTO Tier 2 Technician</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Clock size={15} />
              <p className="text-sm">Pending assignment by ICTO Supervisor</p>
            </div>
          )}
        </div>

        {/* Progress notes from technician */}
        {(ticket.notes ?? []).length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Updates from Support Team</h3>
            <div className="space-y-2">
              {ticket.notes.map(n => (
                <div key={n.id} className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-blue-800">{n.author}</p>
                    <p className="text-[10px] text-blue-400">{new Date(n.ts).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-blue-700 leading-snug">{n.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fix documentation */}
        {ticket.fixDescription && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Resolution Applied</p>
            <p className="text-sm text-emerald-800 leading-relaxed">{ticket.fixDescription}</p>
          </div>
        )}

        {/* ── Context-sensitive action area ── */}

        {/* PENDING_REPORTER: provide additional info */}
        {ticket.status === 'PENDING_REPORTER' && (
          <div className="border border-purple-200 bg-purple-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-purple-800">Provide Additional Information</p>
            <p className="text-xs text-purple-600">The support team has paused work on your ticket and is waiting for your response to continue the investigation.</p>
            <textarea
              value={infoText}
              onChange={e => setInfoText(e.target.value)}
              rows={3}
              placeholder="Provide the requested information here…"
              className="w-full border border-purple-300 bg-white rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <button
              onClick={handleSubmitInfo}
              disabled={!infoText.trim()}
              className="w-full py-2.5 text-sm font-bold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-40 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare size={14} />
              Submit Response
            </button>
          </div>
        )}

        {/* RESOLVED: confirm or dispute */}
        {ticket.status === 'RESOLVED' && (
          <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-emerald-800">Your ticket has been resolved</p>
                <p className="text-xs text-emerald-600 mt-0.5">Please confirm whether the issue has been resolved to your satisfaction, or dispute if the problem persists.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => confirmResolution(ticket.id)}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle size={14} />
                Yes, Resolved
              </button>
              <button
                onClick={() => disputeResolution(ticket.id)}
                className="flex-1 py-2.5 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw size={14} />
                Still an Issue
              </button>
            </div>
            <div className="border-t border-emerald-200 pt-3">
              <p className="text-[10px] text-emerald-500 text-center mb-2">No response in 5 days will auto-close this ticket.</p>
              {autoCloseCountdown !== null ? (
                <p className="text-xs font-bold text-orange-500 text-center">Auto-closing in {autoCloseCountdown}s…</p>
              ) : (
                <button
                  onClick={simulateNoResponse}
                  className="w-full text-xs text-emerald-600 border border-emerald-200 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  Simulate: No Response (5 days)
                </button>
              )}
            </div>
          </div>
        )}

        {/* CLOSED: rating */}
        {ticket.status === 'CLOSED' && (
          <div className="border border-gray-200 bg-gray-50 rounded-xl p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Rate Your Experience</p>
            {ticket.rating ? (
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={22} className={s <= ticket.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">You rated this {ticket.rating}/5. Thank you!</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 mb-3 text-center">How satisfied were you with the support you received?</p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      onMouseEnter={() => setHoveredStar(s)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => rateTicket(ticket.id, s)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star size={26} className={s <= (hoveredStar || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* REOPENED */}
        {ticket.status === 'REOPENED' && (
          <div className="border border-orange-200 bg-orange-50 rounded-xl p-4 flex items-start gap-3">
            <RefreshCw size={16} className="text-orange-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-orange-800">Ticket Reopened</p>
              <p className="text-xs text-orange-600 mt-0.5">Your dispute has been received. The ticket has been re-routed to the support queue with elevated priority. A technician will follow up shortly.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Reporter Portal Root ─────────────────────────────────────────────────────
export default function ReporterPortal() {
  const { auth, logout } = useAuth()
  const { tickets, createTicket } = useTickets()
  const [selectedId, setSelectedId] = useState(null)
  const [showSubmit, setShowSubmit] = useState(false)

  const user = auth.user
  const myTickets = tickets.filter(t => t.requester?.email === user.email)

  const selected = myTickets.find(t => t.id === selectedId) ?? myTickets[0] ?? null

  const STATUS_ORDER = { PENDING_REPORTER: 0, REOPENED: 1, OPEN: 2, ASSIGNED: 3, IN_PROGRESS: 4, RESOLVED: 5, CLOSED: 6 }
  const sorted = [...myTickets].sort((a, b) => (STATUS_ORDER[a.status] ?? 9) - (STATUS_ORDER[b.status] ?? 9))

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 flex-col">
      {/* Top bar */}
      <header className="h-16 bg-[#0a1628] flex items-center px-6 gap-4 shrink-0">
        <div>
          <p className="text-white font-extrabold text-base tracking-wide leading-none">TESDA UFITS</p>
          <p className="text-blue-300 text-xs mt-0.5">Support Portal</p>
        </div>
        <div className="flex-1" />
        <button
          onClick={() => setShowSubmit(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={15} />
          Report an Issue
        </button>
        <div className="flex items-center gap-3 ml-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            {user.initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-white text-xs font-semibold">{user.name}</p>
            <p className="text-blue-300 text-[10px]">{user.roleLabel}</p>
          </div>
          <button
            onClick={logout}
            className="ml-1 flex items-center gap-1.5 text-blue-300 hover:text-white text-xs transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: my tickets */}
        <div className="w-80 flex flex-col border-r border-gray-200 bg-white shrink-0">
          <div className="px-4 pt-4 pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900 text-sm">My Tickets</h2>
              <span className="bg-[#0a1628] text-white text-xs font-bold px-2 py-0.5 rounded-md">
                {myTickets.length}
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {sorted.length === 0 ? (
              <div className="text-center py-10">
                <FileText size={32} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm text-gray-500 font-medium">No tickets yet</p>
                <p className="text-xs text-gray-400 mt-1">Click "Report an Issue" to get started</p>
              </div>
            ) : (
              sorted.map(t => {
                const active = t.id === (selectedId ?? sorted[0]?.id)
                const urgent = t.status === 'PENDING_REPORTER' || t.status === 'REOPENED'
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-colors
                      ${active
                        ? 'border-blue-200 bg-blue-50 border-l-4 border-l-blue-500'
                        : urgent
                          ? 'border-orange-100 bg-orange-50 border-l-4 border-l-orange-400 hover:bg-orange-100'
                          : 'border-gray-100 bg-white hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-xs font-bold text-gray-800 leading-snug line-clamp-2 flex-1">{t.title}</p>
                      <ChevronRight size={13} className="text-gray-400 shrink-0 mt-0.5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <StatusBadge status={t.status} size="xs" />
                      <span className="text-[10px] text-gray-400 font-mono">{t.id}</span>
                    </div>
                    {urgent && (
                      <p className="text-[10px] font-semibold text-orange-600 mt-1.5">
                        {t.status === 'PENDING_REPORTER' ? '⚠ Action required — please respond' : '⚠ Re-opened — being re-investigated'}
                      </p>
                    )}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right: ticket detail */}
        <ReporterTicketDetail ticket={selected} />
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <SubmitTicketModal
          user={user}
          onClose={() => setShowSubmit(false)}
          onCreate={data => {
            const t = createTicket(data)
            setSelectedId(t.id)
          }}
        />
      )}
    </div>
  )
}
