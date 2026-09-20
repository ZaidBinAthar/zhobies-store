import { useState, useEffect } from 'react'
import { API_CONFIG } from '../config/api'
import {
  Mail, Phone, User, MessageSquare, Calendar,
  ChevronDown, ChevronUp, Eye, EyeOff, Archive,
  RefreshCw, Loader2, Inbox, Lock, LogOut
} from 'lucide-react'

const ADMIN_PASSWORD = 'Zaidipro'

const statusColors = {
  new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  read: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  archived: 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30',
}

function LoginGate({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      onLogin()
    } else {
      setError('Incorrect password')
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-8 w-full max-w-sm border border-white/[0.04]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <Lock size={24} className="text-primary" />
          </div>
          <h1 className="text-xl font-bold text-white">Admin Access</h1>
          <p className="text-neutral-500 text-sm mt-1">Enter password to continue</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            autoFocus
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-600 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all mb-4"
            placeholder="Password"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(() => sessionStorage.getItem('admin_auth') === 'true')
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('')

  const fetchSubmissions = async () => {
    setLoading(true)
    setError('')
    try {
      const url = filter
        ? `${API_CONFIG.submissions}?status=${filter}`
        : API_CONFIG.submissions
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmissions(data.data)
    } catch (err) {
      setError(err.message || 'Failed to load submissions')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authenticated) fetchSubmissions()
  }, [filter, authenticated])

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    setAuthenticated(false)
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(API_CONFIG.updateStatus, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update')
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      )
    } catch (err) {
      console.error(err)
    }
  }

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id)
    const sub = submissions.find((s) => s.id === id)
    if (sub && sub.status === 'new') {
      updateStatus(id, 'read')
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (!authenticated) {
    return <LoginGate onLogin={() => setAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 antialiased">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Submissions</h1>
            <p className="text-neutral-500 text-sm">Contact form responses from your portfolio</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSubmissions}
              className="p-3 glass rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <RefreshCw size={18} />
            </button>
            <button
              onClick={logout}
              className="p-3 glass rounded-xl text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {['', 'new', 'read', 'archived'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'glass text-neutral-400 hover:text-white'
              }`}
            >
              {f === '' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-neutral-500">
            <Inbox size={48} className="mb-4 opacity-50" />
            <p>No submissions yet</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="glass rounded-xl border border-white/[0.04] overflow-hidden transition-all hover:border-primary/20"
            >
              <button
                onClick={() => toggleExpand(sub.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User size={18} className="text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{sub.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs border ${statusColors[sub.status]}`}>
                        {sub.status}
                      </span>
                    </div>
                    <p className="text-neutral-500 text-xs truncate">{sub.projectType} — {formatDate(sub.createdAt)}</p>
                  </div>
                </div>
                {expandedId === sub.id ? <ChevronUp size={18} className="text-neutral-500 shrink-0" /> : <ChevronDown size={18} className="text-neutral-500 shrink-0" />}
              </button>

              {expandedId === sub.id && (
                <div className="px-6 pb-5 border-t border-white/[0.04] pt-4">
                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={14} className="text-neutral-500 shrink-0" />
                      <a
                        href={`mailto:${sub.email}?subject=Re:%20${encodeURIComponent(sub.projectType)}`}
                        className="text-primary hover:underline break-all"
                      >
                        {sub.email}
                      </a>
                    </div>
                    {sub.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone size={14} className="text-neutral-500" />
                        <a href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{sub.phone}</a>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-sm mb-4">
                    <MessageSquare size={14} className="text-neutral-500 mt-0.5 shrink-0" />
                    <p className="text-neutral-300 whitespace-pre-wrap">{sub.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-500" />
                    <span className="text-neutral-500 text-xs">{formatDate(sub.createdAt)}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {sub.status !== 'read' && (
                      <button onClick={() => updateStatus(sub.id, 'read')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-400 text-xs hover:bg-yellow-500/20 transition-all">
                        <Eye size={12} /> Mark Read
                      </button>
                    )}
                    {sub.status !== 'archived' && (
                      <button onClick={() => updateStatus(sub.id, 'archived')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-500/10 text-neutral-400 text-xs hover:bg-neutral-500/20 transition-all">
                        <Archive size={12} /> Archive
                      </button>
                    )}
                    {sub.status !== 'new' && (
                      <button onClick={() => updateStatus(sub.id, 'new')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-all">
                        <EyeOff size={12} /> Mark New
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
