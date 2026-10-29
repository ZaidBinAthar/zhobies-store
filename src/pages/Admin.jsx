import { useState, useEffect } from 'react'
import { API_CONFIG } from '../config/api'
import {
  Mail, Phone, User, MessageSquare, Calendar,
  ChevronDown, ChevronUp, Eye, Archive,
  RefreshCw, Loader2, Inbox, Lock, LogOut,
  ShoppingBag, Package, CheckCircle, Clock,
  Shirt, ArrowLeft, Star, MapPin
} from 'lucide-react'

const ADMIN_PASSWORD = 'Zaidipro'

const statusConfig = {
  new: {
    label: 'New Order',
    classes: 'bg-[#b8860b]/20 text-[#d4a017] border-[#b8860b]/40',
    dot: 'bg-[#d4a017]',
  },
  read: {
    label: 'In Progress',
    classes: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    dot: 'bg-blue-400',
  },
  archived: {
    label: 'Fulfilled',
    classes: 'bg-green-500/20 text-green-400 border-green-500/30',
    dot: 'bg-green-400',
  },
}

const orderTypeIcons = {
  'Formal Suit / Blazer': '👔',
  'Traditional Shalwar Kameez': '👘',
  'Casual Hoodie / Streetwear': '🧥',
  'Embroidered Kurta': '✨',
  'Custom Stitching Order': '🪡',
  'Bulk / Wholesale Order': '📦',
  'Other': '🛍️',
}

// ─── Login Gate ──────────────────────────────────────────────────────────────
function LoginGate({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      onLogin()
    } else {
      setError('Incorrect password')
      setPassword('')
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
    }
  }

  return (
    <div className="min-h-screen bg-[#0d0b09] flex items-center justify-center px-6">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#b8860b]/5 rounded-full blur-[120px]" />
      </div>

      <div className={`relative glass border border-[#b8860b]/20 p-8 w-full max-w-sm ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 border border-[#b8860b]/50 flex items-center justify-center mb-4">
            <span className="text-[#d4a017] font-serif font-bold text-2xl">Z</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-white tracking-wide">Zohaibies Wear</h1>
          <p className="text-[#b8860b] text-[10px] tracking-[0.3em] uppercase mt-0.5">Admin Portal</p>
          <div className="flex items-center gap-2 mt-4">
            <Lock size={12} className="text-neutral-500" />
            <p className="text-neutral-500 text-xs">Enter password to access orders</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 border border-red-500/20 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            autoFocus
            className="w-full px-4 py-3 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm placeholder-neutral-600 focus:outline-none transition-all mb-4 rounded-none"
            placeholder="Admin password"
            id="admin-password"
          />
          <button
            type="submit"
            className="btn-primary w-full !py-3"
            id="admin-login-btn"
          >
            <Lock size={15} />
            Access Dashboard
          </button>
        </form>

        <a
          href="/"
          className="flex items-center justify-center gap-2 mt-5 text-xs text-neutral-600 hover:text-[#b8860b] transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Store
        </a>
      </div>
    </div>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, sub, color }) {
  return (
    <div className={`glass border p-5 flex items-start gap-4 ${color}`}>
      <div className="w-10 h-10 border border-inherit flex items-center justify-center shrink-0 opacity-70">
        <Icon size={18} />
      </div>
      <div>
        <div className="text-2xl font-serif font-bold text-white">{value}</div>
        <div className="text-xs tracking-wider mt-0.5 text-neutral-400">{label}</div>
        {sub && <div className="text-[10px] text-neutral-600 mt-1">{sub}</div>}
      </div>
    </div>
  )
}

// ─── Main Admin ───────────────────────────────────────────────────────────────
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  )
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
      setError(err.message || 'Failed to load orders')
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
    return d.toLocaleDateString('en-PK', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  // Derived stats
  const totalOrders = submissions.length
  const newOrders = submissions.filter((s) => s.status === 'new').length
  const inProgress = submissions.filter((s) => s.status === 'read').length
  const fulfilled = submissions.filter((s) => s.status === 'archived').length

  if (!authenticated) {
    return <LoginGate onLogin={() => setAuthenticated(true)} />
  }

  const filterTabs = [
    { key: '', label: 'All Orders', count: totalOrders },
    { key: 'new', label: 'New', count: newOrders },
    { key: 'read', label: 'In Progress', count: inProgress },
    { key: 'archived', label: 'Fulfilled', count: fulfilled },
  ]

  return (
    <div className="min-h-screen bg-[#0d0b09] text-neutral-200 antialiased">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#b8860b]/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#b8860b]/50 flex items-center justify-center">
              <span className="text-[#d4a017] font-serif font-bold text-lg">Z</span>
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
                Order Dashboard
              </h1>
              <p className="text-neutral-500 text-xs tracking-wide mt-0.5">
                Zohaibies Wear — Order Enquiries
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchSubmissions}
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40 transition-all"
              title="Refresh"
              id="admin-refresh"
            >
              <RefreshCw size={16} />
            </button>
            <a
              href="/"
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40 transition-all"
              title="View Store"
            >
              <Shirt size={16} />
            </a>
            <button
              onClick={logout}
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all"
              title="Logout"
              id="admin-logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={ShoppingBag}
            label="Total Orders"
            value={totalOrders}
            sub="All time"
            color="border-[#b8860b]/20"
          />
          <StatCard
            icon={Star}
            label="New Orders"
            value={newOrders}
            sub="Awaiting response"
            color="border-[#b8860b]/30"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={inProgress}
            sub="Being processed"
            color="border-blue-500/20"
          />
          <StatCard
            icon={CheckCircle}
            label="Fulfilled"
            value={fulfilled}
            sub="Completed orders"
            color="border-green-500/20"
          />
        </div>

        {/* Gold divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#b8860b]/30 to-transparent mb-6" />

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-all flex items-center gap-2 ${
                filter === tab.key
                  ? 'bg-[#b8860b] text-white'
                  : 'glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/30'
              }`}
              id={`filter-${tab.key || 'all'}`}
            >
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                filter === tab.key ? 'bg-white/20' : 'bg-[#b8860b]/15 text-[#b8860b]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={24} className="animate-spin text-[#b8860b]" />
              <p className="text-neutral-500 text-sm">Loading orders...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        {!loading && submissions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-neutral-600">
            <Inbox size={48} className="mb-4 opacity-40" />
            <p className="font-serif text-lg text-neutral-500">No orders yet</p>
            <p className="text-xs text-neutral-600 mt-1">
              Orders submitted via the website will appear here
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="flex flex-col gap-3">
          {submissions.map((sub) => {
            const cfg = statusConfig[sub.status] || statusConfig.new
            const icon = orderTypeIcons[sub.projectType] || '🛍️'
            const isExpanded = expandedId === sub.id

            return (
              <div
                key={sub.id}
                className={`glass border overflow-hidden transition-all duration-300 ${
                  isExpanded
                    ? 'border-[#b8860b]/35'
                    : 'border-[#b8860b]/10 hover:border-[#b8860b]/25'
                }`}
              >
                {/* Row Header */}
                <button
                  onClick={() => toggleExpand(sub.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left group"
                  id={`order-${sub.id}`}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {/* Order icon */}
                    <div className="w-11 h-11 border border-[#b8860b]/20 flex items-center justify-center shrink-0 text-xl group-hover:border-[#b8860b]/40 transition-colors">
                      {icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-0.5">
                        <span className="text-white font-semibold tracking-wide truncate">
                          {sub.name}
                        </span>
                        {/* Status badge */}
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] tracking-[0.15em] uppercase border font-medium ${cfg.classes}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          {cfg.label}
                        </span>
                        {sub.status === 'new' && (
                          <span className="text-[10px] bg-[#b8860b]/20 text-[#d4a017] px-2 py-0.5 animate-pulse">
                            Needs Attention
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                        <span>{icon} {sub.projectType}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={10} />
                          {formatDate(sub.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isExpanded
                    ? <ChevronUp size={16} className="text-[#b8860b] shrink-0" />
                    : <ChevronDown size={16} className="text-neutral-500 shrink-0 group-hover:text-[#b8860b] transition-colors" />
                  }
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="border-t border-[#b8860b]/15 px-6 pb-6 pt-5">
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">

                      {/* Email */}
                      <div className="flex items-center gap-3 p-3 bg-[#171410] border border-[#b8860b]/10">
                        <Mail size={14} className="text-[#b8860b] shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Email</div>
                          <a
                            href={`mailto:${sub.email}?subject=Re:%20Your%20Order%20at%20Zohaibies%20Wear`}
                            className="text-sm text-[#d4a017] hover:underline break-all"
                          >
                            {sub.email}
                          </a>
                        </div>
                      </div>

                      {/* WhatsApp */}
                      {sub.phone && (
                        <div className="flex items-center gap-3 p-3 bg-[#171410] border border-[#b8860b]/10">
                          <Phone size={14} className="text-green-400 shrink-0" />
                          <div>
                            <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">WhatsApp</div>
                            <a
                              href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(sub.name)}!%20Regarding%20your%20order%20at%20Zohaibies%20Wear...`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-green-400 hover:underline"
                            >
                              {sub.phone}
                            </a>
                          </div>
                        </div>
                      )}

                      {/* Order Type */}
                      <div className="flex items-center gap-3 p-3 bg-[#171410] border border-[#b8860b]/10">
                        <Package size={14} className="text-[#b8860b] shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Order Type</div>
                          <span className="text-sm text-neutral-300">{icon} {sub.projectType}</span>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex items-center gap-3 p-3 bg-[#171410] border border-[#b8860b]/10">
                        <Calendar size={14} className="text-[#b8860b] shrink-0" />
                        <div>
                          <div className="text-[10px] text-neutral-600 uppercase tracking-wider mb-0.5">Submitted</div>
                          <span className="text-sm text-neutral-300">{formatDate(sub.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Message */}
                    <div className="p-4 bg-[#171410] border border-[#b8860b]/10 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare size={13} className="text-[#b8860b]" />
                        <span className="text-[10px] text-neutral-600 uppercase tracking-wider">
                          Customer Message
                        </span>
                      </div>
                      <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                        {sub.message}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] text-neutral-600 uppercase tracking-wider mr-2">
                        Update Status:
                      </span>

                      {sub.status !== 'new' && (
                        <button
                          onClick={() => updateStatus(sub.id, 'new')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#b8860b]/30 text-[#b8860b] hover:bg-[#b8860b]/10 transition-all"
                        >
                          <Star size={11} />
                          Mark New
                        </button>
                      )}
                      {sub.status !== 'read' && (
                        <button
                          onClick={() => updateStatus(sub.id, 'read')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 transition-all"
                        >
                          <Eye size={11} />
                          In Progress
                        </button>
                      )}
                      {sub.status !== 'archived' && (
                        <button
                          onClick={() => updateStatus(sub.id, 'archived')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/30 text-green-400 hover:bg-green-500/10 transition-all"
                        >
                          <CheckCircle size={11} />
                          Mark Fulfilled
                        </button>
                      )}

                      {/* Quick contact divider */}
                      <div className="ml-auto flex gap-2">
                        <a
                          href={`mailto:${sub.email}?subject=Your%20Order%20at%20Zohaibies%20Wear`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[#b8860b]/20 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40 transition-all"
                        >
                          <Mail size={11} />
                          Email
                        </a>
                        {sub.phone && (
                          <a
                            href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(sub.name)}!%20This%20is%20Zohaibies%20Wear%20regarding%20your%20order%20enquiry.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-green-500/20 text-neutral-400 hover:text-green-400 hover:border-green-500/30 transition-all"
                          >
                            <Phone size={11} />
                            WhatsApp
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        {!loading && submissions.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-neutral-700 text-xs">
              Showing {submissions.length} order{submissions.length !== 1 ? 's' : ''}
              {filter ? ` · filtered by "${filterTabs.find(t => t.key === filter)?.label}"` : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
