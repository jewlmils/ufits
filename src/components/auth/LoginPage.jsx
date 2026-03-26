import { useState } from 'react'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const DEMO_CREDS = [
  { role: 'Admin',            email: 'admin@tesda.gov.ph',         pass: 'Admin@2024' },
  { role: 'Tier 1 Supervisor', email: 'marcus.chen@tesda.gov.ph',  pass: 'Tier1@2024' },
  { role: 'Tier 2 Supervisor', email: 'anna.reyes@tesda.gov.ph',   pass: 'Tier2@2024' },
]

export default function LoginPage() {
  const { login, loginError, setLoginError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    // slight delay for UX
    await new Promise(r => setTimeout(r, 400))
    login(email, password)
    setLoading(false)
  }

  function fillCreds(cred) {
    setEmail(cred.email)
    setPassword(cred.pass)
    setLoginError('')
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1a6b4a] rounded-2xl mb-4">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-white text-2xl font-extrabold tracking-wide">TESDA UFITS</h1>
          <p className="text-blue-300 text-sm mt-1">Unified Field Information & Ticketing System</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-gray-900 text-xl font-bold mb-1">Staff Portal Login</h2>
          <p className="text-gray-500 text-sm mb-6">Sign in with your government credentials</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@tesda.gov.ph"
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {loginError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {loginError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0a1628] hover:bg-[#0d1f3c] disabled:opacity-60 text-white font-semibold py-3 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In to Portal'}
            </button>
          </form>
        </div>

        {/* Demo credentials table */}
        <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-wide mb-3">
            Demo Credentials — click to fill
          </p>
          <div className="space-y-1.5">
            {DEMO_CREDS.map(c => (
              <button
                key={c.role}
                onClick={() => fillCreds(c)}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-white text-xs font-semibold">{c.role}</span>
                  <span className="text-blue-300 text-[10px] group-hover:text-blue-200">{c.pass}</span>
                </div>
                <p className="text-blue-400 text-[10px] mt-0.5">{c.email}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
