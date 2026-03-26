import { LayoutDashboard, Ticket, BarChart2, Settings, LogOut, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ],
  tier1: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tickets',   label: 'Tickets',   icon: Ticket },
    { id: 'settings',  label: 'Settings',  icon: Settings },
  ],
  tier2: [
    { id: 'dashboard',   label: 'Dashboard',  icon: LayoutDashboard },
    { id: 'tickets',     label: 'Tickets',    icon: Ticket },
    { id: 'monitoring',  label: 'Monitoring', icon: BarChart2 },
    { id: 'settings',    label: 'Settings',   icon: Settings },
  ],
}

export default function Sidebar({ activeNav, onNavChange, showNewTicket, onNewTicket }) {
  const { auth, logout } = useAuth()
  const role = auth.user?.role ?? 'tier1'
  const navItems = NAV_ITEMS[role] ?? NAV_ITEMS.tier1

  return (
    <aside className="w-56 bg-[#0a1628] flex flex-col shrink-0 h-full">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 border-b border-[#1e3a5f]">
        <p className="text-white font-extrabold text-lg tracking-wide leading-none">TESDA UFITS</p>
        <p className="text-blue-300 text-xs mt-0.5">Staff Portal</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => {
          const active = activeNav === id
          return (
            <button
              key={id}
              onClick={() => onNavChange(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${active
                  ? 'bg-white/10 text-white border-l-2 border-blue-400 pl-[10px]'
                  : 'text-blue-200 hover:text-white hover:bg-white/5'}`}
            >
              <Icon size={17} />
              {label}
            </button>
          )
        })}
      </nav>

      {/* New Ticket Button (supervisor only) */}
      {showNewTicket && (
        <div className="px-3 pb-3">
          <button
            onClick={onNewTicket}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors"
          >
            <Plus size={15} />
            New Ticket
          </button>
        </div>
      )}

      {/* User footer */}
      <div className="border-t border-[#1e3a5f] px-3 py-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
            {auth.user?.initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{auth.user?.name}</p>
            <p className="text-blue-300 text-[10px] font-medium uppercase tracking-wide">
              {auth.user?.roleLabel ?? auth.user?.role?.toUpperCase()}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 text-blue-300 hover:text-white text-xs py-1.5 px-1 rounded transition-colors"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
