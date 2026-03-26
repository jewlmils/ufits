// Color-coded status pill used across all views
const BADGE_STYLES = {
  CRITICAL:         'bg-red-100 text-red-700 border border-red-200',
  OPEN:             'bg-blue-100 text-blue-700 border border-blue-200',
  PENDING:          'bg-purple-100 text-purple-700 border border-purple-200',
  PENDING_REPORTER: 'bg-purple-100 text-purple-700 border border-purple-200',
  IN_PROGRESS:      'bg-sky-100 text-sky-700 border border-sky-200',
  ASSIGNED:         'bg-yellow-100 text-yellow-700 border border-yellow-200',
  RESOLVED:         'bg-green-100 text-green-700 border border-green-200',
  REOPENED:         'bg-orange-100 text-orange-700 border border-orange-200',
  CLOSED:           'bg-gray-100 text-gray-600 border border-gray-200',
  ESCALATED:        'bg-red-100 text-red-700 border border-red-200',
  ACTIVE:           'bg-emerald-100 text-emerald-700 border border-emerald-200',
  BUSY:             'bg-orange-100 text-orange-700 border border-orange-200',
  IDLE:             'bg-gray-100 text-gray-500 border border-gray-200',
  HIGH:             'bg-orange-100 text-orange-700 border border-orange-200',
  MEDIUM:           'bg-yellow-100 text-yellow-700 border border-yellow-200',
  LOW:              'bg-gray-100 text-gray-600 border border-gray-200',
}

// Human-readable labels for compound status keys
const BADGE_LABELS = {
  PENDING_REPORTER: 'PENDING REPORTER',
  IN_PROGRESS:      'IN PROGRESS',
}

export default function StatusBadge({ status, size = 'sm' }) {
  const key = status?.toUpperCase()
  const style = BADGE_STYLES[key] ?? 'bg-gray-100 text-gray-500'
  const label = BADGE_LABELS[key] ?? key
  const textSize = size === 'xs' ? 'text-[10px]' : 'text-xs'
  const padding = size === 'xs' ? 'px-1.5 py-0.5' : 'px-2 py-0.5'
  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full ${textSize} ${padding} ${style} whitespace-nowrap`}>
      {label}
    </span>
  )
}
