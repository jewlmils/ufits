import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts'
import {
  Ticket, Activity, Clock, Star, LogOut, ChevronDown,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../shared/StatCard'
import StatusBadge from '../shared/StatusBadge'
import {
  ADMIN_STATS, SLA_TRENDS, OPERATIONAL_LOAD, REGIONAL_RESOLUTION, CRITICAL_ESCALATIONS,
} from '../../data/mockData'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const now = new Date()

export default function AdminDashboard() {
  const { auth, logout } = useAuth()
  const [month, setMonth] = useState(now.getMonth())
  const [year] = useState(now.getFullYear())

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-[#0a1628] h-16 flex items-center px-6 gap-4 shrink-0">
        <div>
          <p className="text-white font-extrabold text-lg tracking-wide leading-none">TESDA UFITS</p>
          <p className="text-blue-300 text-xs">Staff Portal</p>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          {/* Date range picker */}
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
            <select
              value={month}
              onChange={e => setMonth(+e.target.value)}
              className="bg-transparent text-white text-xs font-medium focus:outline-none"
            >
              {MONTHS.map((m, i) => <option key={m} value={i} className="text-gray-900">{m}</option>)}
            </select>
            <span className="text-blue-300 text-xs">{year}</span>
            <ChevronDown size={13} className="text-blue-300" />
          </div>
          <button className="px-3 py-1.5 text-xs font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10">
            SUPPORT
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
            {auth.user?.initials}
          </div>
          <button onClick={logout} className="flex items-center gap-1.5 text-blue-300 hover:text-white text-xs transition-colors">
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 max-w-screen-2xl mx-auto w-full">
        {/* Page title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Executive Overview</h1>
            <p className="text-gray-500 text-sm mt-0.5">{MONTHS[month]} {year} · System-wide analytics</p>
          </div>
          <span className="text-xs font-semibold bg-[#0a1628] text-white px-3 py-1.5 rounded-full">
            ADMIN
          </span>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Total Ticket Volume" value={ADMIN_STATS.totalTicketVolume.value} trend={ADMIN_STATS.totalTicketVolume.trend} up icon={Ticket} accent="bg-blue-50" />
          <StatCard label="System Uptime" value={ADMIN_STATS.systemUptime.value} trend={ADMIN_STATS.systemUptime.trend} up icon={Activity} accent="bg-emerald-50" />
          <StatCard label="Avg Resolution Time" value={ADMIN_STATS.avgResolutionTime.value} trend={ADMIN_STATS.avgResolutionTime.trend} up icon={Clock} accent="bg-purple-50" />
          <StatCard label="Citizen Satisfaction" value={ADMIN_STATS.citizenSatisfaction.value} trend={ADMIN_STATS.citizenSatisfaction.trend} up icon={Star} accent="bg-yellow-50" />
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-3 gap-4">
          {/* SLA Performance Trends */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">SLA Performance Trends</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={SLA_TRENDS} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11 }} unit="%" />
                <Tooltip formatter={v => `${v}%`} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="actual" stroke="#1a6b4a" strokeWidth={2} dot={false} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="5 5" dot={false} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Operational Load */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-3">Operational Load</h2>
            <div className="flex justify-center">
              <PieChart width={160} height={160}>
                <Pie data={OPERATIONAL_LOAD} cx={75} cy={75} innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={2}>
                  {OPERATIONAL_LOAD.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [`${v}%`, name]} />
              </PieChart>
            </div>
            <div className="space-y-2 mt-2">
              {OPERATIONAL_LOAD.map(item => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Resolution + Escalations row */}
        <div className="grid grid-cols-3 gap-4">
          {/* Regional Resolution */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Regional Resolution Rates</h2>
            <div className="space-y-3">
              {REGIONAL_RESOLUTION.map(r => (
                <div key={r.region}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{r.region}</span>
                    <span className="font-bold text-gray-900">{r.rate}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${r.rate}%`,
                        background: r.rate >= 90 ? '#1a6b4a' : r.rate >= 80 ? '#2563eb' : r.rate >= 70 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{r.count} tickets</p>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Escalations */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-700 mb-4">Critical Escalations</h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-semibold text-gray-500 pb-2 pr-3">Issue ID</th>
                  <th className="text-left font-semibold text-gray-500 pb-2 pr-3">Subject</th>
                  <th className="text-left font-semibold text-gray-500 pb-2 pr-3">Assigned Team</th>
                  <th className="text-left font-semibold text-gray-500 pb-2 pr-3">Status</th>
                  <th className="text-right font-semibold text-gray-500 pb-2">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {CRITICAL_ESCALATIONS.map(esc => (
                  <tr key={esc.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-3 font-mono text-blue-600">{esc.id}</td>
                    <td className="py-2.5 pr-3 text-gray-700 font-medium max-w-xs truncate">{esc.subject}</td>
                    <td className="py-2.5 pr-3 text-gray-500">{esc.team}</td>
                    <td className="py-2.5 pr-3">
                      <StatusBadge status={esc.status} size="xs" />
                    </td>
                    <td className="py-2.5 text-right text-gray-500 font-mono">{esc.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
