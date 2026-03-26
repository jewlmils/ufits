import { useState } from 'react'
import { Bell, HelpCircle, Search, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTickets } from '../../context/TicketContext'

export default function TopBar() {
  const { auth } = useAuth()
  const { notifications, markAllRead } = useTickets()
  const [showNotifs, setShowNotifs] = useState(false)
  const initials = auth.user?.initials ?? '?'
  const unread = notifications.filter(n => !n.read).length

  function toggle() {
    setShowNotifs(v => !v)
    if (!showNotifs) markAllRead()
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0 z-10 relative">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets, assets, or users..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={toggle}
            className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bell size={18} className="text-gray-600" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-bold text-gray-800">Notifications</p>
                <button onClick={() => setShowNotifs(false)}>
                  <X size={15} className="text-gray-400 hover:text-gray-600" />
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-gray-400 text-center py-6">No notifications</p>
                ) : (
                  notifications.slice(0, 20).map(n => (
                    <div key={n.id} className="px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50">
                      <p className="text-xs text-gray-700 leading-snug">{n.msg}</p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {new Date(n.ts).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <HelpCircle size={18} className="text-gray-600" />
        </button>
        <button className="px-4 py-1.5 text-sm font-semibold text-[#0a1628] border-2 border-[#0a1628] rounded-lg hover:bg-[#0a1628] hover:text-white transition-colors">
          SUPPORT
        </button>
        <button className="w-9 h-9 rounded-full bg-[#0a1628] text-white text-xs font-bold flex items-center justify-center hover:opacity-80 transition-opacity">
          {initials}
        </button>
      </div>
    </header>
  )
}
