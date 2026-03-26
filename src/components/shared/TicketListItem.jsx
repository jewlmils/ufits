import { AlertTriangle, Zap, ChevronDown, Bot, User } from 'lucide-react'
import { SLATimerInline } from './SLATimer'

const PRIORITY_ICON = {
  CRITICAL: <AlertTriangle size={13} className="text-red-600" />,
  HIGH:     <Zap size={13} className="text-orange-500" />,
  MEDIUM:   <ChevronDown size={13} className="text-yellow-500" />,
  LOW:      <ChevronDown size={13} className="text-gray-400 rotate-180" />,
}

const PRIORITY_LABEL_COLOR = {
  CRITICAL: 'text-red-600',
  HIGH:     'text-orange-500',
  MEDIUM:   'text-yellow-600',
  LOW:      'text-gray-500',
}

export default function TicketListItem({ ticket, selected, onClick }) {
  const isCritical = ticket.priority === 'CRITICAL'
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 transition-colors rounded-lg shadow-sm border
        ${selected
          ? 'border-blue-200 bg-blue-50 border-l-4 border-l-blue-500'
          : isCritical
            ? 'border-red-100 bg-white hover:bg-red-50 border-l-4 border-l-red-400'
            : 'border-gray-100 bg-white hover:bg-gray-50 border-l-4 border-l-transparent'}`}
    >
      {/* Priority row */}
      <div className="flex items-center justify-between mb-1">
        <span className={`flex items-center gap-1 text-xs font-bold uppercase ${PRIORITY_LABEL_COLOR[ticket.priority]}`}>
          {PRIORITY_ICON[ticket.priority]}
          {ticket.priority}
        </span>
        <span className="text-xs text-gray-400 font-mono">{ticket.id}</span>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-gray-800 mb-1 leading-snug line-clamp-1">
        {ticket.title}
      </p>

      {/* Preview */}
      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{ticket.preview}</p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {/* Assignee avatars */}
          {ticket.assignees ? (
            <div className="flex -space-x-1">
              {ticket.assignees.slice(0, 2).map((init, i) => (
                <div key={i} className="w-6 h-6 rounded-full bg-[#0d1f3c] text-white text-[9px] font-bold flex items-center justify-center border border-white">
                  {init}
                </div>
              ))}
              {ticket.assignees.length > 2 && (
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-600 text-[9px] font-bold flex items-center justify-center border border-white">
                  +{ticket.assignees.length - 2}
                </div>
              )}
            </div>
          ) : ticket.assigneeInitials ? (
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-full bg-slate-600 text-white text-[9px] font-bold flex items-center justify-center">
                {ticket.assigneeInitials}
              </div>
              <span className="text-xs text-gray-500">{ticket.assignee}</span>
            </div>
          ) : null}
          {/* Tag icon */}
          {ticket.tag === 'system' ? (
            <Bot size={12} className="text-blue-400 ml-1" />
          ) : (
            <User size={12} className="text-gray-400 ml-1" />
          )}
        </div>

        {/* Time indicator */}
        {ticket.slaSeconds !== undefined ? (
          <SLATimerInline seconds={ticket.slaSeconds} />
        ) : (
          <span className="text-xs text-gray-400">{ticket.timeAgo}</span>
        )}
      </div>
    </button>
  )
}
