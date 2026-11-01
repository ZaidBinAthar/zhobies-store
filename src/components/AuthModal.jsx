import { useState, useEffect, useRef } from 'react'
import {
  X,
  Lock,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react'
import { login, signup, sendOtp } from '../utils/authService'

export default function AuthModal({ isOpen, onClose, defaultMode = 'login', onAuthSuccess }) {
  const [mode, setMode] = useState(defaultMode) // 'login' or 'signup'
  const [step, setStep] = useState('form') // 'form' or 'otp'
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [cooldown, setCooldown] = useState(0)

  const otpInputsRef = useRef([])

  useEffect(() => {
    setMode(defaultMode)
    setStep('form')
    setError('')
    setSuccess('')
    setOtp(['', '', '', '', '', ''])
  }, [defaultMode, isOpen])

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  if (!isOpen) return null

  // Handle individual OTP input changes
  const handleOtpChange = (index, value) => {
    // Only accept numeric digits
    const cleaned = value.replace(/\D/g, '')
    const newOtp = [...otp]

    if (cleaned.length > 1) {
      // User pasted multiple characters
      const digits = cleaned.slice(0, 6).split('')
      for (let i = 0; i < 6; i++) {
        newOtp[i] = digits[i] || ''
      }
      setOtp(newOtp)
      const nextFocus = Math.min(digits.length, 5)
      otpInputsRef.current[nextFocus]?.focus()
      return
    }

    newOtp[index] = cleaned
    setOtp(newOtp)

    // Auto-advance cursor
    if (cleaned && index < 5) {
      otpInputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pastedData) return

    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || ''
    }
    setOtp(newOtp)
    const nextFocus = Math.min(pastedData.length, 5)
    otpInputsRef.current[nextFocus]?.focus()
  }

  // Request / Resend OTP
  const handleRequestOtp = async (isResend = false) => {
    if (!email) {
      setError('Please provide a valid email address.')
      return
    }

    if (isResend) {
      setResending(true)
    } else {
      setLoading(true)
    }
    setError('')
    setSuccess('')

    try {
      await sendOtp({ email })
      setCooldown(60) // 60s cooldown
      setSuccess(`Verification code sent to ${email}`)
      setStep('otp')
      setTimeout(() => {
        otpInputsRef.current[0]?.focus()
      }, 100)
    } catch (err) {
      setError(err.message || 'Could not send verification code.')
    } finally {
      setLoading(false)
      setResending(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup' && step === 'form') {
      // Validate inputs before requesting OTP
      if (!username || username.trim().length < 3) {
        setError('Username must be at least 3 characters long.')
        return
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setError('Please enter a valid email address.')
        return
      }
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }

      await handleRequestOtp(false)
      return
    }

    setLoading(true)

    try {
      if (mode === 'signup' && step === 'otp') {
        const fullOtp = otp.join('')
        if (fullOtp.length !== 6) {
          setError('Please enter all 6 digits of your verification code.')
          setLoading(false)
          return
        }

        const res = await signup({
          username,
          email,
          password,
          fullName,
          otp: fullOtp,
        })

        setSuccess('Email verified & account registered successfully! Logging you in...')
        setTimeout(() => {
          if (onAuthSuccess) onAuthSuccess(res.user)
          onClose()
        }, 1200)
      } else {
        // Login flow
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
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto border border-[#b8860b]/50 flex items-center justify-center mb-3">
            {step === 'otp' ? (
              <KeyRound size={20} className="text-[#d4a017]" />
            ) : (
              <Lock size={20} className="text-[#d4a017]" />
            )}
          </div>
          <h2 className="font-serif text-2xl font-bold text-white tracking-wide">
            {mode === 'signup'
              ? step === 'otp'
                ? 'Verify Your Email'
                : 'Create an Account'
              : 'Welcome Back'}
          </h2>
          <p className="text-neutral-400 text-xs mt-1">
            {mode === 'signup'
              ? step === 'otp'
                ? `Enter the 6-digit verification code sent to ${email}`
                : 'Sign up to manage your orders & profile on Zhobies Wear'
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
          {mode === 'signup' && step === 'otp' ? (
            /* ──────────────── STEP 2: OTP Verification Screen ──────────────── */
            <div className="space-y-5">
              <div>
                <label className="block text-center text-[11px] uppercase tracking-wider text-neutral-400 mb-3">
                  6-Digit Verification Code
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpInputsRef.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      className="w-12 h-13 text-center text-xl font-bold font-mono bg-[#171410] border border-[#b8860b]/35 text-white focus:outline-none focus:border-[#d4a017] focus:ring-1 focus:ring-[#d4a017] transition-all"
                    />
                  ))}
                </div>
                <p className="text-neutral-500 text-[11px] text-center mt-2">
                  Code expires in <span className="text-[#d4a017]">5 minutes</span>
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep('form')
                    setError('')
                  }}
                  className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Edit
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || resending}
                  onClick={() => handleRequestOtp(true)}
                  className="text-xs text-[#d4a017] hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {resending ? (
                    <>
                      <Loader2 size={13} className="animate-spin" /> Sending...
                    </>
                  ) : cooldown > 0 ? (
                    `Resend code in ${cooldown}s`
                  ) : (
                    <>
                      <RefreshCw size={13} /> Resend Code
                    </>
                  )}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').length !== 6}
                className="w-full py-3 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg shadow-[#b8860b]/20"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Create Account
                    <CheckCircle size={15} />
                  </>
                )}
              </button>
            </div>
          ) : (
            /* ──────────────── STEP 1: Registration / Login Form ──────────────── */
            <>
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
                  <>
                    Continue with Email Verification
                    <ArrowRight size={14} />
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </>
          )}
        </form>

        {/* Mode Switcher */}
        {step === 'form' && (
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
                  className="text-[#d4a017] hover:underline font-medium cursor-pointer"
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
                  className="text-[#d4a017] hover:underline font-medium cursor-pointer"
                >
                  Create one
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
