import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'

function formatTime(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// Inline list timer (e.g. "14m 22s" in ticket list)
export function SLATimerInline({ seconds, paused = false }) {
  const [secs, setSecs] = useState(seconds)
  useEffect(() => {
    setSecs(seconds)
    if (paused) return
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [seconds, paused])

  const m = Math.floor(secs / 60)
  const s = secs % 60
  const critical = secs < 300
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${paused ? 'text-purple-500' : critical ? 'text-red-500 animate-pulse-sla' : 'text-orange-500'}`}>
      <Clock size={11} />
      {paused ? 'PAUSED' : `${m}m ${String(s).padStart(2, '0')}s`}
    </span>
  )
}

// Full SLA breach countdown shown in ticket detail header
export default function SLATimer({ seconds, paused = false }) {
  const [secs, setSecs] = useState(seconds)
  useEffect(() => {
    setSecs(seconds)
    if (paused) return
    const t = setInterval(() => setSecs(s => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [seconds, paused])

  const critical = secs < 300
  if (paused) {
    return (
      <div className="rounded-lg border px-4 py-3 text-right bg-purple-50 border-purple-200">
        <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-purple-600">SLA Paused</p>
        <p className="text-3xl font-extrabold tabular-nums tracking-tight text-purple-600">{formatTime(secs)}</p>
      </div>
    )
  }
  return (
    <div className={`rounded-lg border px-4 py-3 text-right ${critical ? 'bg-red-50 border-red-300' : 'bg-orange-50 border-orange-200'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${critical ? 'text-red-600' : 'text-orange-600'}`}>
        SLA Breach In
      </p>
      <p className={`text-3xl font-extrabold tabular-nums tracking-tight ${critical ? 'text-red-600 animate-pulse-sla' : 'text-orange-600'}`}>
        {formatTime(secs)}
      </p>
    </div>
  )
}
