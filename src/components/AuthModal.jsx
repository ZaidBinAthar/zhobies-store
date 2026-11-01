import { useState, useEffect } from 'react'
import { X, Lock, Mail, User, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { login, signup } from '../utils/authService'

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(defaultMode) // 'login' or 'signup'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setMode(defaultMode)
    setError('')
    setSuccess('')
  }, [defaultMode, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signup') {
        const res = await signup({ username, email, password, fullName })
        setSuccess('Account registered successfully in Neon database! Logging you in...')
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user)
          onClose()
        }, 1200)
      } else {
        const res = await login({ usernameOrEmail: username || email, password })
        setSuccess('Logged in successfully!')
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user)
          onClose()
        }, 800)
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0b09] border border-[#b8860b]/30 p-8 shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-full transition-colors"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto border border-[#b8860b]/50 flex items-center justify-center mb-3">
            <Lock size={20} className="text-[#d4a017]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            {mode === 'signup' ? 'Create an Account' : 'Welcome Back'}
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            {mode === 'signup'
              ? 'Sign up to manage your orders & profile on Zhobies Wear'
              : 'Sign in with your Neon database credentials'}
          </p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-500/15 border border-green-500/30 text-green-400 text-xs flex items-center gap-2">
            <CheckCircle size={15} className="shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full bg-[#171410] border border-[#b8860b]/25 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
              Username <span className="text-[#d4a017]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={mode === 'signup' ? 'Choose username' : 'Enter username or email'}
                className="w-full bg-[#171410] border border-[#b8860b]/25 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
              />
              <User size={14} className="absolute right-3 top-3 text-neutral-500" />
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                Email Address <span className="text-[#d4a017]">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#171410] border border-[#b8860b]/25 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                />
                <Mail size={14} className="absolute right-3 top-3 text-neutral-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
              Password <span className="text-[#d4a017]">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#171410] border border-[#b8860b]/25 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
              />
              <Lock size={14} className="absolute right-3 top-3 text-neutral-500" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#b8860b]/20"
          >
            {loading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Processing...
              </>
            ) : mode === 'signup' ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Mode Switcher */}
        <div className="mt-6 pt-4 border-t border-[#b8860b]/15 text-center text-xs text-neutral-400">
          {mode === 'signup' ? (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
                className="text-[#d4a017] hover:underline font-medium"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup')
                  setError('')
                }}
                className="text-[#d4a017] hover:underline font-medium"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

