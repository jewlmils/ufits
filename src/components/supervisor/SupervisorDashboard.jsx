import { useState, useEffect } from 'react'
import {
  AlertTriangle, Bot, User, ChevronDown, CheckCircle, BarChart2,
  Star, MessageSquare, RefreshCw, X, Plus, Send,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTickets } from '../../context/TicketContext'
import TopBar from '../shared/TopBar'
import Sidebar from '../shared/Sidebar'
import StatCard from '../shared/StatCard'
import StatusBadge from '../shared/StatusBadge'
import TicketListItem from '../shared/TicketListItem'
import SLATimer from '../shared/SLATimer'
import { AGENTS, TICKET_FEED } from '../../data/mockData'

// ─── New Ticket Modal ─────────────────────────────────────────────────────────
function NewTicketModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    type: 'INCIDENT',
    priority: 'MEDIUM',
    title: '',
    description: '',
    requesterName: '',
    requesterEmail: '',
    requesterPhone: '',
    requesterTitle: '',
  })
  const [errors, setErrors] = useState({})

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function validate() {
    const e = {}
    if (!form.title.trim()) e.title = 'Required'
    if (!form.description.trim()) e.description = 'Required'
    if (!form.requesterName.trim()) e.requesterName = 'Required'
    if (!form.requesterEmail.trim()) e.requesterEmail = 'Required'
    return e
  }

  function submit(e) {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length) { setErrors(e2); return }
    const initials = form.requesterName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    onCreate({
      type: form.type,
      priority: form.priority,
      title: form.title.trim(),
      description: form.description.trim(),
      requester: {
        name: form.requesterName.trim(),
        title: form.requesterTitle.trim() || 'TESDA Staff',
        email: form.requesterEmail.trim(),
        phone: form.requesterPhone.trim() || '—',
        initials,
      },
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#0a1628]">
          <div>
            <p className="text-white font-bold text-base">New Support Ticket</p>
            <p className="text-blue-300 text-xs mt-0.5">TESDA UFITS — Ticket Submission</p>
          </div>
          <button onClick={onClose} className="text-blue-300 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Type + Priority row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Type</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INCIDENT">Incident</option>
                <option value="REQUEST">Service Request</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">Priority</label>
              <select
                value={form.priority}
                onChange={e => set('priority', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
              Issue Title <span className="text-red-500">*</span>
            </label>
            <input
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Brief description of the issue"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1 block">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={3}
              placeholder="Detailed description of the issue, steps to reproduce, impact..."
              className={`w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-300' : 'border-gray-200'}`}
            />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>

          {/* Reporter info */}
          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Reporter Information</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={form.requesterName}
                  onChange={e => set('requesterName', e.target.value)}
                  placeholder="Juan dela Cruz"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.requesterName ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Job Title</label>
                <input
                  value={form.requesterTitle}
                  onChange={e => set('requesterTitle', e.target.value)}
                  placeholder="Regional Coordinator"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.requesterEmail}
                  onChange={e => set('requesterEmail', e.target.value)}
                  placeholder="user@tesda.gov.ph"
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.requesterEmail ? 'border-red-300' : 'border-gray-200'}`}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">Phone</label>
                <input
                  value={form.requesterPhone}
                  onChange={e => set('requesterPhone', e.target.value)}
                  placeholder="+63 (2) 888-0000"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Captured context (read-only display) */}
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-xs text-gray-500 space-y-1">
            <p className="font-semibold text-gray-600 uppercase tracking-wide text-[10px] mb-1">Auto-Captured Context</p>
            <p><span className="font-medium">URL:</span> {window.location.href}</p>
            <p><span className="font-medium">Timestamp:</span> {new Date().toLocaleString()}</p>
            <p><span className="font-medium">Browser:</span> {navigator.userAgent.split(')')[0].split('(').pop()?.slice(0, 60)}</p>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Send size={14} />
              Submit Ticket
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Ticket Detail Panel ──────────────────────────────────────────────────────
function TicketDetail({ ticket, role }) {
  const {
    assignTicket, updateStatus, addNote,
    requestInfo, resumeInvestigation, resolveTicket,
    confirmResolution, disputeResolution, autoClose, rateTicket,
  } = useTickets()
  const { auth } = useAuth()

  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [noteText, setNoteText] = useState('')
  const [fixText, setFixText] = useState('')
  const [showResolveForm, setShowResolveForm] = useState(false)
  const [autoCloseCountdown, setAutoCloseCountdown] = useState(null)
  const [hoveredStar, setHoveredStar] = useState(0)

  // Reset local state when ticket changes
  useEffect(() => {
    setSelectedAgentId('')
    setNoteText('')
    setFixText('')
    setShowResolveForm(false)
    setAutoCloseCountdown(null)
    setHoveredStar(0)
  }, [ticket?.id])

  if (!ticket) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <p className="text-4xl mb-3">🎫</p>
          <p className="text-sm font-medium">Select a ticket to view details</p>
        </div>
      </div>
    )
  }

  const status = ticket.status
  const isResolved = status === 'RESOLVED'
  const isClosed = status === 'CLOSED'
  const isPendingReporter = status === 'PENDING_REPORTER'

  // Show SLA timer unless resolved, closed, or no slaSeconds
  const showSLA = ticket.slaSeconds !== undefined && !isResolved && !isClosed

  function handleAssign() {
    const agent = AGENTS.find(a => a.id === Number(selectedAgentId))
    if (!agent) return
    assignTicket(ticket.id, agent)
  }

  function handleAddNote() {
    if (!noteText.trim()) return
    addNote(ticket.id, { author: auth.user?.name ?? 'Staff', text: noteText.trim() })
    setNoteText('')
  }

  function handleResolve() {
    if (!fixText.trim()) return
    resolveTicket(ticket.id, fixText.trim())
    setShowResolveForm(false)
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

  // ── Right panel: changes based on status ────────────────────────────────
  function renderRightPanel() {
    // CLOSED: feedback rating
    if (isClosed) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
            {ticket.rating ? 'Feedback Received' : 'Request Feedback Rating'}
          </p>
          {ticket.rating ? (
            <div className="text-center">
              <div className="flex justify-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={20} className={s <= ticket.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                ))}
              </div>
              <p className="text-xs text-gray-500">{ticket.rating}/5 — Thank you!</p>
            </div>
          ) : (
            <>
              <p className="text-xs text-gray-600 mb-3 leading-snug">Rate the resolution quality for this ticket.</p>
              <div className="flex justify-center gap-1.5 mb-3">
                {[1, 2, 3, 4, 5].map(s => (
                  <button
                    key={s}
                    onMouseEnter={() => setHoveredStar(s)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => rateTicket(ticket.id, s)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star size={22} className={s <= (hoveredStar || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 text-center">Click to submit rating</p>
            </>
          )}
        </div>
      )
    }

    // RESOLVED: reporter confirmation
    if (isResolved) {
      return (
        <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Reporter Confirmation
          </p>
          <p className="text-xs text-gray-600 leading-snug">
            Awaiting reporter to confirm or dispute the resolution.
          </p>
          <button
            onClick={() => confirmResolution(ticket.id)}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-lg transition-colors"
          >
            <CheckCircle size={13} />
            Reporter Confirmed
          </button>
          <button
            onClick={() => disputeResolution(ticket.id)}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-2.5 rounded-lg transition-colors"
          >
            <RefreshCw size={13} />
            Reporter Disputed
          </button>
          <div className="border-t border-gray-100 pt-3">
            <p className="text-[10px] text-gray-400 mb-2 text-center">Simulate: no response after 5 days</p>
            {autoCloseCountdown !== null ? (
              <div className="text-center">
                <p className="text-sm font-bold text-orange-500">Auto-closing in {autoCloseCountdown}s…</p>
              </div>
            ) : (
              <button
                onClick={simulateNoResponse}
                className="w-full text-xs font-semibold text-gray-500 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                No Response (5 days)
              </button>
            )}
          </div>
        </div>
      )
    }

    // PENDING_REPORTER: resume investigation
    if (isPendingReporter) {
      return (
        <div className="bg-[#0d1f3c] rounded-xl p-4 space-y-3">
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
            Resolution Controls
          </p>
          <div className="bg-purple-900/40 border border-purple-600/30 rounded-lg px-3 py-2.5 text-center">
            <p className="text-purple-300 text-xs font-semibold">SLA Clock Paused</p>
            <p className="text-purple-200 text-[10px] mt-0.5">Waiting on reporter info</p>
          </div>
          <button
            onClick={() => resumeInvestigation(ticket.id)}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
          >
            <RefreshCw size={14} />
            Resume Investigation
          </button>
        </div>
      )
    }

    // Tier 2 default controls
    if (role === 'tier2') {
      return (
        <div className="bg-[#0d1f3c] rounded-xl p-4 space-y-3">
          <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
            Resolution Controls
          </p>

          {/* Status dropdown */}
          <div className="relative">
            <select
              value={status}
              onChange={e => updateStatus(ticket.id, e.target.value)}
              className="w-full appearance-none bg-[#1e3a5f] text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="OPEN">Open</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ESCALATED">Escalated</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
          </div>

          {/* Request More Info */}
          <button
            onClick={() => requestInfo(ticket.id)}
            className="w-full flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs py-2.5 rounded-lg transition-colors"
          >
            <MessageSquare size={13} />
            Request More Info
          </button>

          {/* Resolve */}
          {!showResolveForm ? (
            <button
              onClick={() => setShowResolveForm(true)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
            >
              <CheckCircle size={15} />
              Resolve Ticket
            </button>
          ) : (
            <div className="space-y-2">
              <textarea
                value={fixText}
                onChange={e => setFixText(e.target.value)}
                rows={3}
                placeholder="Document the fix / resolution details…"
                className="w-full bg-[#1e3a5f] text-white text-xs px-3 py-2 rounded-lg resize-none placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowResolveForm(false)}
                  className="flex-1 text-xs text-blue-300 border border-[#1e3a5f] py-2 rounded-lg hover:bg-[#1e3a5f] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolve}
                  disabled={!fixText.trim()}
                  className="flex-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 py-2 rounded-lg transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Tier 1 default controls
    return (
      <div className="bg-[#0d1f3c] rounded-xl p-4 space-y-3">
        <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest">
          Assign Ticket
        </p>
        <div className="relative">
          <select
            value={selectedAgentId}
            onChange={e => setSelectedAgentId(e.target.value)}
            className="w-full appearance-none bg-[#1e3a5f] text-white text-sm font-semibold px-4 py-2.5 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Assign to…</option>
            {AGENTS.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
        </div>
        <button
          onClick={handleAssign}
          disabled={!selectedAgentId}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-sm py-2.5 rounded-lg uppercase tracking-wide transition-colors"
        >
          Assign Ticket
        </button>
        {ticket.assignedAgent && (
          <div className="text-center">
            <p className="text-[10px] text-blue-300">Currently assigned to</p>
            <p className="text-white text-xs font-semibold">{ticket.assignedAgent.name}</p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white">
      {/* Header: breadcrumb + SLA + status */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium mb-2">
            <span className="uppercase tracking-wide">Tickets</span>
            <span>›</span>
            <span className="uppercase tracking-wide">{ticket.type}</span>
            <span>›</span>
            <span className="text-blue-600 font-semibold uppercase">{ticket.id}</span>
            <span>›</span>
            <StatusBadge status={status} size="xs" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">{ticket.title}</h1>
        </div>
        {showSLA && (
          <div className="shrink-0">
            <SLATimer seconds={ticket.slaSeconds} paused={ticket.slaPaused} />
          </div>
        )}
        {isResolved && (
          <div className="shrink-0 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-right">
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-0.5">Status</p>
            <p className="text-lg font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle size={18} /> Resolved
            </p>
          </div>
        )}
        {isClosed && (
          <div className="shrink-0 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-right">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Status</p>
            <p className="text-lg font-bold text-gray-700">Closed</p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-5 p-6">
          {/* Left: description + notes */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Issue Description */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                Issue Description
              </h3>
              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                {ticket.description.split('\n\n').map((para, i) => (
                  <p key={i} dangerouslySetInnerHTML={{
                    __html: para.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>'),
                  }} />
                ))}
              </div>
            </div>

            {/* Error Log */}
            {ticket.errorLog && (
              <div>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-xs font-mono text-gray-600 whitespace-pre-wrap">
                  {ticket.errorLog}
                </pre>
              </div>
            )}

            {/* Fix documentation (shown when resolved) */}
            {ticket.fixDescription && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Resolution / Fix Applied</p>
                <p className="text-sm text-emerald-800 leading-relaxed">{ticket.fixDescription}</p>
              </div>
            )}

            {/* Progress Notes */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">
                Progress Notes ({(ticket.notes ?? []).length})
              </h3>

              {(ticket.notes ?? []).length > 0 ? (
                <div className="space-y-2 mb-3">
                  {ticket.notes.map(n => (
                    <div key={n.id} className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-gray-700">{n.author}</p>
                        <p className="text-[10px] text-gray-400">{new Date(n.ts).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{n.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 mb-3">No notes yet.</p>
              )}

              {role === 'tier2' && !isClosed && (
                <div className="flex gap-2">
                  <textarea
                    value={noteText}
                    onChange={e => setNoteText(e.target.value)}
                    rows={2}
                    placeholder="Add a progress note…"
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <button
                    onClick={handleAddNote}
                    disabled={!noteText.trim()}
                    className="px-3 bg-[#0a1628] hover:bg-[#0d1f3c] disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <Plus size={13} />
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: controls + requester */}
          <div className="w-52 shrink-0 space-y-3">
            {renderRightPanel()}

            {/* Requester */}
            {ticket.requester && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                  Requester
                </p>
                <div className="flex flex-col items-center text-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0d1f3c] text-white text-sm font-bold flex items-center justify-center mb-2">
                    {ticket.requester.initials}
                  </div>
                  <p className="text-sm font-bold text-gray-900">{ticket.requester.name}</p>
                  <p className="text-xs text-gray-500 leading-snug">{ticket.requester.title}</p>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <span>✉</span>
                    <span className="text-blue-600 truncate">{ticket.requester.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span>📞</span>
                    <span>{ticket.requester.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tickets View ─────────────────────────────────────────────────────────────
function TicketsView({ role }) {
  const { tickets } = useTickets()
  const [filter, setFilter] = useState('ALL')
  const [selectedId, setSelectedId] = useState(null)

  const filteredTickets = tickets.filter(t => {
    if (filter === 'URGENT') return t.priority === 'CRITICAL' || t.priority === 'HIGH'
    if (filter === 'ASSIGNED') return t.status === 'ASSIGNED' || t.status === 'IN_PROGRESS'
    if (filter === 'REOPENED') return t.status === 'REOPENED'
    return true
  })

  const selected = tickets.find(t => t.id === selectedId) ?? filteredTickets[0] ?? null

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: ticket list */}
      <div className="w-80 flex flex-col border-r border-gray-200 bg-gray-50 shrink-0">
        <div className="px-4 pt-4 pb-3 bg-white border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-gray-900 text-base">Active Tickets</h2>
            <span className="bg-[#0a1628] text-white text-xs font-bold px-2 py-0.5 rounded-md">
              {filteredTickets.length}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['ALL', 'URGENT', 'ASSIGNED', 'REOPENED'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 text-xs font-semibold rounded-full border transition-colors
                  ${filter === f
                    ? 'bg-[#0a1628] text-white border-[#0a1628]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredTickets.map(t => (
            <TicketListItem
              key={t.id}
              ticket={t}
              selected={t.id === (selectedId ?? filteredTickets[0]?.id)}
              onClick={() => setSelectedId(t.id)}
            />
          ))}
          {filteredTickets.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No tickets match this filter.</p>
          )}
        </div>
      </div>

      {/* Right: ticket detail */}
      <TicketDetail ticket={selected} role={role} />
    </div>
  )
}

// ─── Dashboard Overview View ──────────────────────────────────────────────────
function DashboardView({ role }) {
  const { tickets } = useTickets()

  const open = tickets.filter(t => t.status === 'OPEN').length
  const pending = tickets.filter(t => t.status === 'PENDING_REPORTER').length
  const resolved = tickets.filter(t => t.status === 'RESOLVED').length
  const total = tickets.length
  const resolvedPct = total > 0 ? Math.round((resolved / total) * 100) : 0

  return (
    <div className="flex-1 p-6 overflow-y-auto space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Tickets" value={total} trend={`+${tickets.filter(t => t.createdAt > new Date(Date.now() - 86400000).toISOString()).length} today`} up />
        <StatCard label="Pending Response" value={pending} trend={pending > 0 ? 'Awaiting reporter' : 'None pending'} up={false} />
        <StatCard label="Resolution Rate" value={`${resolvedPct}%`} trend={`${resolved} resolved`} up />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Status Distribution</h2>
          <div className="space-y-3">
            {[
              { label: 'Open', value: open, color: 'bg-blue-500' },
              { label: 'In Progress', value: tickets.filter(t => t.status === 'IN_PROGRESS' || t.status === 'ASSIGNED').length, color: 'bg-sky-500' },
              { label: 'Pending Reporter', value: pending, color: 'bg-purple-500' },
              { label: 'Resolved', value: resolved, color: 'bg-emerald-500' },
              { label: 'Reopened', value: tickets.filter(t => t.status === 'REOPENED').length, color: 'bg-orange-500' },
              { label: 'Closed', value: tickets.filter(t => t.status === 'CLOSED').length, color: 'bg-gray-400' },
            ].map(({ label, value, color }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{label}</span>
                  <span className="font-bold text-gray-900">{value}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: total > 0 ? `${(value / total) * 100}%` : '0%' }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-50 flex justify-between text-xs text-gray-500">
            <span>Total: <strong className="text-gray-900">{total}</strong></span>
            <span>Closed: <strong className="text-gray-900">{tickets.filter(t => t.status === 'CLOSED').length}</strong></span>
          </div>
        </div>

        {/* Team Workload */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">Team Workload</h2>
          <div className="space-y-2">
            {AGENTS.map(agent => (
              <div key={agent.id} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0d1f3c] text-white text-xs font-bold flex items-center justify-center">
                    {agent.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{agent.name}</p>
                    <p className="text-[10px] text-gray-400">
                      {tickets.filter(t => t.assignedAgent?.id === agent.id && t.status !== 'CLOSED').length} active tickets
                    </p>
                  </div>
                </div>
                <StatusBadge status={agent.status} size="xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* New Tickets Feed */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-4">New Tickets Feed</h2>
          <div className="space-y-2">
            {TICKET_FEED.map(item => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${item.tag === 'system' ? 'bg-blue-50' : 'bg-gray-100'}`}>
                  {item.tag === 'system'
                    ? <Bot size={13} className="text-blue-500" />
                    : <User size={13} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.time}</p>
                </div>
                <StatusBadge status={item.priority} size="xs" />
              </div>
            ))}
          </div>
        </div>

        {/* SLA Breach Warning (live) */}
        {(() => {
          const slaWarnings = tickets.filter(t =>
            t.slaSeconds !== undefined && t.slaSeconds < 3600 && !t.slaPaused &&
            t.status !== 'RESOLVED' && t.status !== 'CLOSED'
          )
          return (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-red-800">SLA Breach Warning</h2>
                  <p className="text-xs text-red-600 mt-0.5">
                    {slaWarnings.length > 0
                      ? `${slaWarnings.length} ticket${slaWarnings.length > 1 ? 's' : ''} approaching SLA deadline`
                      : 'No tickets approaching SLA deadline'}
                  </p>
                </div>
              </div>
              {slaWarnings.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {slaWarnings.slice(0, 3).map(t => (
                    <div key={t.id} className="flex items-center justify-between bg-white border border-red-100 rounded-lg px-3 py-2">
                      <div>
                        <p className="text-xs font-semibold text-gray-800 truncate max-w-[120px]">{t.title}</p>
                        <p className="text-[10px] font-mono text-red-500">{t.id}</p>
                      </div>
                      <span className="text-xs font-bold text-red-600">{Math.floor(t.slaSeconds / 60)}m</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-red-400 text-center py-4">All SLAs within threshold.</p>
              )}
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-semibold text-red-700 border border-red-300 bg-white py-2 rounded-lg hover:bg-red-50 transition-colors">
                  View Details
                </button>
                <button className="flex-1 text-xs font-bold text-white bg-[#0a1628] py-2 rounded-lg hover:bg-[#0d1f3c] transition-colors">
                  Escalate Now
                </button>
              </div>
            </div>
          )
        })()}
      </div>
    </div>
  )
}

// ─── Monitoring Placeholder (Tier 2 only) ────────────────────────────────────
function MonitoringView() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">System Monitoring</h1>
          <p className="text-sm text-gray-500">Real-time infrastructure health</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Network Latency', value: '12ms', status: 'ACTIVE', color: 'bg-emerald-50 border-emerald-100' },
          { label: 'ERP Uptime', value: '99.8%', status: 'ACTIVE', color: 'bg-emerald-50 border-emerald-100' },
          { label: 'VPN Gateway', value: 'DEGRADED', status: 'BUSY', color: 'bg-orange-50 border-orange-100' },
        ].map(item => (
          <div key={item.label} className={`rounded-xl border p-5 ${item.color}`}>
            <p className="text-xs text-gray-500 font-medium mb-1">{item.label}</p>
            <p className="text-2xl font-bold text-gray-900 mb-2">{item.value}</p>
            <StatusBadge status={item.status} size="xs" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3">Recent System Events</h2>
        <div className="space-y-2">
          {[
            { time: '08:17', msg: 'VPN Gateway SSL handshake failure detected – NCR', level: 'error' },
            { time: '07:55', msg: 'ERP login service response time elevated (>2s avg)', level: 'warn' },
            { time: '07:30', msg: 'Active Directory sync completed successfully', level: 'info' },
            { time: '07:00', msg: 'Scheduled backup job initiated – DR Site', level: 'info' },
          ].map((ev, i) => (
            <div key={i} className="flex items-start gap-3 text-xs py-2 border-b border-gray-50 last:border-0">
              <span className="text-gray-400 font-mono w-10 shrink-0">{ev.time}</span>
              <span className={`shrink-0 w-2 h-2 rounded-full mt-0.5 ${ev.level === 'error' ? 'bg-red-500' : ev.level === 'warn' ? 'bg-yellow-500' : 'bg-emerald-500'}`} />
              <span className="text-gray-700">{ev.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Settings Placeholder ────────────────────────────────────────────────────
function SettingsView() {
  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-900 mb-6">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-lg">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Notification Preferences</h2>
        <div className="space-y-3">
          {['Email alerts for SLA breaches', 'Push notifications for CRITICAL tickets', 'Daily summary report', 'System maintenance alerts'].map(label => (
            <label key={label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 cursor-pointer">
              <span className="text-sm text-gray-700">{label}</span>
              <div className="w-10 h-5 bg-[#1a6b4a] rounded-full relative cursor-pointer">
                <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Root Supervisor Layout ───────────────────────────────────────────────────
export default function SupervisorDashboard() {
  const { auth } = useAuth()
  const { createTicket } = useTickets()
  const role = auth.user?.role // 'tier1' | 'tier2'
  const [activeNav, setActiveNav] = useState('dashboard')
  const [showNewTicket, setShowNewTicket] = useState(false)

  function renderView() {
    switch (activeNav) {
      case 'tickets':    return <TicketsView role={role} />
      case 'monitoring': return <MonitoringView />
      case 'settings':   return <SettingsView />
      default:           return <DashboardView role={role} />
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        showNewTicket
        onNewTicket={() => setShowNewTicket(true)}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex flex-1 overflow-hidden">
          {renderView()}
        </main>
      </div>

      {showNewTicket && (
        <NewTicketModal
          onClose={() => setShowNewTicket(false)}
          onCreate={data => {
            createTicket(data)
            setActiveNav('tickets')
          }}
        />
      )}
    </div>
  )
}
