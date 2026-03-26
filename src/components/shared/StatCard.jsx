import { TrendingUp, TrendingDown } from 'lucide-react'

export default function StatCard({ label, value, trend, up, icon: Icon, accent }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500 font-medium leading-tight">{label}</p>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${accent ?? 'bg-blue-50'}`}>
            <Icon size={18} className="text-blue-600" />
          </div>
        )}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {trend && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-600' : 'text-red-500'}`}>
            {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
            {trend}
          </span>
        )}
      </div>
    </div>
  )
}
