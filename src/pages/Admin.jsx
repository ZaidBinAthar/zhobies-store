import { useState, useEffect, useRef } from 'react'
import { API_CONFIG } from '../config/api'
import {
  Mail, Phone, User, MessageSquare, Calendar,
  ChevronDown, ChevronUp, Eye, Archive,
  RefreshCw, Loader2, Inbox, Lock, LogOut,
  ShoppingBag, Package, CheckCircle, Clock,
  Shirt, ArrowLeft, Star, MapPin, Plus, Edit3, Trash2, X, Check, Image as ImageIcon, Upload,
  Settings, Building, Save
} from 'lucide-react'
import {
  fetchProducts,
  getLocalProducts,
  addProduct,
  updateProduct,
  deleteProduct
} from '../utils/productsStore'
import { fetchCompany, getLocalCompany, updateCompany, DEFAULT_COMPANY_ID } from '../utils/companyStore'

const USERS = {
  admin: {
    username: 'zaid',
    password: 'zaidipro',
    role: 'admin', // full access
    displayName: 'Admin'
  },
  owner: {
    username: 'owner',
    password: 'owner321?',
    role: 'owner', // cannot access or change settings
    displayName: 'Store Owner'
  }
}

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
  const company = getLocalCompany()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanUser = username.trim().toLowerCase()

    // 1. Check Owner
    if (cleanUser === USERS.owner.username && password === USERS.owner.password) {
      sessionStorage.setItem('admin_auth', 'true')
      sessionStorage.setItem('admin_user', 'owner')
      sessionStorage.setItem('admin_role', 'owner')
      onLogin('owner')
      return
    }

    // 2. Check Admin (or legacy password support)
    if (
      (cleanUser === USERS.admin.username && password === USERS.admin.password) ||
      (!cleanUser && password === 'Zaidipro')
    ) {
      sessionStorage.setItem('admin_auth', 'true')
      sessionStorage.setItem('admin_user', 'admin')
      sessionStorage.setItem('admin_role', 'admin')
      onLogin('admin')
      return
    }

    setError('Invalid username or password')
    setPassword('')
    setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  const logoUrl = company?.logoUrl
  const companyName = company?.name || 'Zhobies Wear'
  const logoLetter = companyName.charAt(0).toUpperCase() || 'Z'

  return (
    <div className="min-h-screen bg-[#0d0b09] flex items-center justify-center px-6">
      {/* Background accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#b8860b]/5 rounded-full blur-[120px]" />
      </div>

      <div className={`relative glass border border-[#b8860b]/20 p-8 w-full max-w-sm ${shaking ? 'animate-[shake_0.3s_ease-in-out]' : ''}`}>
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={companyName}
              className="w-16 h-16 object-contain rounded border border-[#b8860b]/50 mb-4 p-1 bg-[#171410]"
            />
          ) : (
            <div className="w-14 h-14 border border-[#b8860b]/50 flex items-center justify-center mb-4">
              <span className="text-[#d4a017] font-serif font-bold text-2xl">{logoLetter}</span>
            </div>
          )}
          <h1 className="font-serif text-xl font-bold text-white tracking-wide text-center">{companyName}</h1>
          <p className="text-[#b8860b] text-[10px] tracking-[0.3em] uppercase mt-0.5">Admin Management Portal</p>
          <div className="flex flex-col items-center gap-1 mt-4 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5">
              <Lock size={11} />
              <span>Admin: <strong className="text-[#d4a017]">admin</strong> / <strong className="text-[#d4a017]">imadmin</strong></span>
            </div>
            <div>
              <span>Owner: <strong className="text-[#d4a017]">owner</strong> / <strong className="text-[#d4a017]">owner321?</strong></span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 border border-red-500/20 bg-red-500/10 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError('') }}
              autoFocus
              className="w-full px-4 py-3 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm placeholder-neutral-600 focus:outline-none transition-all rounded-none"
              placeholder="admin"
              id="admin-username"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              className="w-full px-4 py-3 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm placeholder-neutral-600 focus:outline-none transition-all rounded-none"
              placeholder="••••••••"
              id="admin-password"
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full !py-3 mt-2"
            id="admin-login-btn"
          >
            <Lock size={15} />
            Access Dashboard
          </button>
        </form>

        <a
          href="/"
          className="flex items-center justify-center gap-2 mt-6 text-xs text-neutral-600 hover:text-[#b8860b] transition-colors"
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

// ─── Product Modal (Add / Edit) ──────────────────────────────────────────────
function ProductModal({ product, isOpen, onClose, onSave }) {
  const isEditing = Boolean(product && product.id)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Formal',
    price: 'PKR ',
    badge: '',
    image: '/collection-formal.jpg',
    colors: '#1a237e, #37474f, #212121',
    description: '',
    rating: 5,
    reviews: 0,
    inStock: true,
  })
  const [saving, setSaving] = useState(false)
  const [imageError, setImageError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setImageError('')
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Formal',
        price: product.price || 'PKR ',
        badge: product.badge || '',
        image: product.image || '/collection-formal.jpg',
        colors: Array.isArray(product.colors) ? product.colors.join(', ') : (product.colors || ''),
        description: product.description || '',
        rating: product.rating || 5,
        reviews: product.reviews || 0,
        inStock: product.inStock !== false,
      })
    } else {
      setFormData({
        name: '',
        category: 'Formal',
        price: 'PKR ',
        badge: 'New',
        image: '/collection-formal.jpg',
        colors: '#1a237e, #37474f, #212121',
        description: '',
        rating: 5,
        reviews: 12,
        inStock: true,
      })
    }
  }, [product, isOpen])

  // Handle uploading photos from device gallery or camera
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageError('')

    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WEBP, etc.)')
      return
    }

    // Read the file as data URL and compress if too large so it persists smoothly
    const reader = new FileReader()
    reader.onload = (event) => {
      const img = new Image()
      img.onload = () => {
        // Create canvas to resize to reasonable max dimension (e.g. max 1200px)
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 1200
        const MAX_HEIGHT = 1200
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width
            width = MAX_WIDTH
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height
            height = MAX_HEIGHT
          }
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        // Convert to webp/jpeg with high quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
        setFormData((prev) => ({ ...prev, image: dataUrl }))
      }
      img.onerror = () => {
        setImageError('Failed to process image')
      }
      img.src = event.target.result
    }
    reader.onerror = () => {
      setImageError('Failed to read file from device')
    }
    reader.readAsDataURL(file)
  }

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const colorsArray = formData.colors
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean)

    const payload = {
      ...formData,
      colors: colorsArray,
      rating: Number(formData.rating) || 5,
      reviews: Number(formData.reviews) || 0,
    }

    await onSave(payload, product?.id)
    setSaving(false)
    onClose()
  }

  const sampleImages = [
    { label: 'Formal Suits', url: '/collection-formal.jpg' },
    { label: 'Casual Wear', url: '/collection-casual.jpg' },
    { label: 'Traditional Wear', url: '/collection-traditional.jpg' },
    { label: 'Hero Editorial', url: '/hero-fashion.jpg' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-hidden">
      <div className="relative glass border border-[#b8860b]/30 w-full max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-[#120f0c] shadow-2xl flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">

        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#b8860b]/20 bg-[#120f0c] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#b8860b]/60 flex items-center justify-center text-[#d4a017]">
              {isEditing ? <Edit3 size={15} /> : <Plus size={16} />}
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              <p className="text-[10px] text-neutral-400 tracking-wider uppercase">
                {isEditing ? `Modifying ID #${product.id}` : 'Create a new catalog item'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form with scrollable body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="p-6 overflow-y-auto space-y-4 flex-1 overscroll-contain">
            {/* Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Embroidered Sherwani"
                className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
              />
            </div>

            {/* Category & Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
                >
                  <option value="Formal">Formal</option>
                  <option value="Casual">Casual</option>
                  <option value="Traditional">Traditional</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Bespoke">Bespoke Stitching</option>
                </select>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="PKR 6,500"
                  className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
                />
              </div>
            </div>

            {/* Badge & Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Badge / Tag
                </label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  placeholder="Bestseller, New, Premium..."
                  className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                  Availability
                </label>
                <select
                  value={formData.inStock ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
                >
                  <option value="true">In Stock (Available)</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Image Upload & Selection */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Product Image (Device Gallery / Photo or URL) *
              </label>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Upload Button + Preview Row */}
              <div className="flex flex-col sm:flex-row gap-3 mb-3">
                {/* Device Photo / Gallery Upload trigger */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#b8860b]/40 hover:border-[#b8860b] bg-[#171410]/60 hover:bg-[#b8860b]/10 transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#b8860b]/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload size={18} className="text-[#d4a017]" />
                  </div>
                  <span className="text-xs font-semibold text-white group-hover:text-[#d4a017] transition-colors">
                    Upload from Device / Gallery
                  </span>
                  <span className="text-[10px] text-neutral-400 mt-0.5">
                    Click to choose photos from phone or computer
                  </span>
                </button>

                {/* Current Image Preview */}
                {formData.image && (
                  <div className="w-full sm:w-28 h-28 border border-[#b8860b]/30 bg-[#171410] relative shrink-0 overflow-hidden group">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.src = '/collection-formal.jpg' }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-[#d4a017] uppercase tracking-wider font-semibold">
                      Preview
                    </div>
                  </div>
                )}
              </div>

              {imageError && (
                <p className="text-xs text-red-400 mb-2">{imageError}</p>
              )}

              {/* Or manual URL / local path */}
              <div className="mb-2">
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/collection-formal.jpg or https://... or base64"
                  className="w-full px-3.5 py-2 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-xs focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
                <span className="text-neutral-500">Preset collections:</span>
                {sampleImages.map((img) => (
                  <button
                    type="button"
                    key={img.url}
                    onClick={() => setFormData({ ...formData, image: img.url })}
                    className="px-2 py-0.5 border border-[#b8860b]/20 hover:border-[#b8860b]/60 text-[#d4a017] transition-colors text-[10px]"
                  >
                    {img.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Color palette hexes */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Color Swatches (comma separated hex codes)
              </label>
              <input
                type="text"
                value={formData.colors}
                onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                placeholder="#1a237e, #37474f, #212121"
                className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Description / Fabric Details
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Crafted with pure Egyptian cotton and hand-embroidered details..."
                className="w-full px-3.5 py-2.5 bg-[#171410] border border-[#b8860b]/20 focus:border-[#b8860b]/60 text-white text-sm focus:outline-none"
              />
            </div>

          </div>

          {/* Modal Actions - Fixed Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#b8860b]/20 bg-[#120f0c] shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary !py-2.5 !px-6 text-xs flex items-center gap-2"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {isEditing ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Admin Component ───────────────────────────────────────────────────
export default function Admin() {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem('admin_auth') === 'true'
  )
  const [currentUser, setCurrentUser] = useState(
    () => sessionStorage.getItem('admin_user') || 'admin'
  )
  const [activeTab, setActiveTab] = useState('products') // 'products', 'orders', or 'settings'

  const isOwner = currentUser === 'owner'
  const canAccessSettings = !isOwner // Owner cannot change settings or access settings nav

  // Company Settings State
  const [selectedCompanyId, setSelectedCompanyId] = useState(DEFAULT_COMPANY_ID)
  const [companySettings, setCompanySettings] = useState(() => getLocalCompany())
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsError, setSettingsError] = useState('')
  const [logoPreview, setLogoPreview] = useState(companySettings?.logoUrl || '')

  // Submissions State
  const [submissions, setSubmissions] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState('')
  const [expandedId, setExpandedId] = useState(null)
  const [filter, setFilter] = useState('')

  // Products State
  const [productsList, setProductsList] = useState(() => getLocalProducts())
  const [productsLoading, setProductsLoading] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [productCategoryFilter, setProductCategoryFilter] = useState('All')

  // Load company settings by companyId
  const loadCompanyData = async (companyId = selectedCompanyId) => {
    if (!canAccessSettings) return
    setSettingsLoading(true)
    setSettingsError('')
    try {
      const data = await fetchCompany(companyId)
      if (data) {
        setCompanySettings(data)
        setLogoPreview(data.logoUrl || '')
      }
    } catch (err) {
      setSettingsError(err.message || 'Failed to load company data')
    } finally {
      setSettingsLoading(false)
    }
  }

  // Handle saving company settings
  const handleSaveSettings = async (e) => {
    e.preventDefault()
    if (!canAccessSettings) {
      setSettingsError('Permission denied: Store Owner is not authorized to modify settings.')
      return
    }
    setSettingsLoading(true)
    setSettingsSaved(false)
    setSettingsError('')
    try {
      const res = await updateCompany(selectedCompanyId, companySettings)
      if (res?.data) {
        setCompanySettings(res.data)
        setLogoPreview(res.data.logoUrl || '')
      }
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (err) {
      setSettingsError(err.message || 'Failed to update company settings')
    } finally {
      setSettingsLoading(false)
    }
  }

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result
        setLogoPreview(base64)
        setCompanySettings((prev) => ({ ...prev, logoUrl: base64 }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Load orders
  const fetchSubmissions = async () => {
    setOrdersLoading(true)
    setOrdersError('')
    try {
      const url = filter
        ? `${API_CONFIG.submissions}?status=${filter}`
        : API_CONFIG.submissions
      const res = await fetch(url)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubmissions(data.data)
    } catch (err) {
      setOrdersError(err.message || 'Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  // Load products
  const reloadProducts = async () => {
    setProductsLoading(true)
    const prods = await fetchProducts()
    if (prods && prods.length > 0) {
      setProductsList(prods)
    } else {
      setProductsList(getLocalProducts())
    }
    setProductsLoading(false)
  }

  useEffect(() => {
    if (authenticated) {
      fetchSubmissions()
      reloadProducts()
      if (canAccessSettings) {
        loadCompanyData(selectedCompanyId)
      } else if (activeTab === 'settings') {
        setActiveTab('products')
      }
    }
  }, [filter, authenticated, selectedCompanyId, canAccessSettings])

  const logout = () => {
    sessionStorage.removeItem('admin_auth')
    sessionStorage.removeItem('admin_user')
    sessionStorage.removeItem('admin_role')
    setAuthenticated(false)
    setCurrentUser('admin')
    setActiveTab('products')
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

  // Handle Product Save (Add or Update)
  const handleSaveProduct = async (formData, id) => {
    if (id) {
      const updated = await updateProduct(id, formData)
      setProductsList(updated)
    } else {
      const newProd = await addProduct(formData)
      setProductsList((prev) => [newProd, ...prev])
    }
    reloadProducts()
  }

  // Handle Product Delete
  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      const updated = await deleteProduct(id)
      setProductsList(updated)
    }
  }

  if (!authenticated) {
    return (
      <LoginGate
        onLogin={(user) => {
          setAuthenticated(true)
          setCurrentUser(user || 'admin')
        }}
      />
    )
  }

  // Filtered products
  const displayProducts = productCategoryFilter === 'All'
    ? productsList
    : productsList.filter(p => p.category?.toLowerCase() === productCategoryFilter.toLowerCase())

  // Derived stats
  const totalOrders = submissions.length
  const newOrders = submissions.filter((s) => s.status === 'new').length
  const inProgress = submissions.filter((s) => s.status === 'read').length
  const fulfilled = submissions.filter((s) => s.status === 'archived').length

  const filterTabs = [
    { key: '', label: 'All Orders', count: totalOrders },
    { key: 'new', label: 'New', count: newOrders },
    { key: 'read', label: 'In Progress', count: inProgress },
    { key: 'archived', label: 'Fulfilled', count: fulfilled },
  ]

  return (
    <div className="min-h-screen bg-[#0d0b09] text-neutral-200 antialiased">
      {/* Background Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-[#b8860b]/4 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            {companySettings?.logoUrl ? (
              <img
                src={companySettings.logoUrl}
                alt={companySettings.name}
                className="w-12 h-12 object-contain rounded border border-[#b8860b]/50 p-1 bg-[#171410]"
              />
            ) : (
              <div className="w-12 h-12 border border-[#b8860b]/50 flex items-center justify-center">
                <span className="text-[#d4a017] font-serif font-bold text-2xl">
                  {companySettings?.name ? companySettings.name.charAt(0).toUpperCase() : 'Z'}
                </span>
              </div>
            )}
            <div>
              <h1 className="font-serif text-2xl font-bold text-white tracking-wide">
                {companySettings?.name || 'Zhobies Wear'} {isOwner ? 'Owner Dashboard' : 'Admin Hub'}
              </h1>
              <p className="text-neutral-500 text-xs tracking-wide mt-0.5">
                Logged in as <span className="text-[#d4a017] font-semibold">{currentUser}</span> ({isOwner ? 'Store Owner' : 'Administrator'}) · Company ID #{selectedCompanyId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab === 'orders') fetchSubmissions()
                else if (activeTab === 'products') reloadProducts()
                else loadCompanyData(selectedCompanyId)
              }}
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40 transition-all flex items-center gap-2 text-xs"
              title="Refresh"
              id="admin-refresh"
            >
              <RefreshCw size={15} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <a
              href="/"
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/40 transition-all flex items-center gap-2 text-xs"
              title="View Store"
            >
              <Shirt size={15} />
              <span className="hidden sm:inline">View Store</span>
            </a>
            <button
              onClick={logout}
              className="p-2.5 glass border border-[#b8860b]/15 text-neutral-400 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center gap-2 text-xs"
              title="Logout"
              id="admin-logout"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Navigation Tabs: Products vs Orders vs Settings */}
        <div className="flex flex-wrap items-center gap-3 border-b border-[#b8860b]/20 pb-4 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-2.5 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${activeTab === 'products'
                ? 'bg-[#b8860b] text-white shadow-lg shadow-[#b8860b]/20'
                : 'glass border border-[#b8860b]/20 text-neutral-400 hover:text-[#d4a017]'
              }`}
            id="tab-products"
          >
            <Package size={15} />
            Products Management ({productsList.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2.5 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${activeTab === 'orders'
                ? 'bg-[#b8860b] text-white shadow-lg shadow-[#b8860b]/20'
                : 'glass border border-[#b8860b]/20 text-neutral-400 hover:text-[#d4a017]'
              }`}
            id="tab-orders"
          >
            <ShoppingBag size={15} />
            Order Enquiries ({totalOrders})
            {newOrders > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#d4a017] animate-pulse" />
            )}
          </button>
          {canAccessSettings && (
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2.5 px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all ${activeTab === 'settings'
                  ? 'bg-[#b8860b] text-white shadow-lg shadow-[#b8860b]/20'
                  : 'glass border border-[#b8860b]/20 text-neutral-400 hover:text-[#d4a017]'
                }`}
              id="tab-settings"
            >
              <Settings size={15} />
              Website Settings
            </button>
          )}
        </div>

        {/* ════════════════════ PRODUCTS MANAGEMENT TAB ════════════════════ */}
        {activeTab === 'products' && (
          <div>
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Formal', 'Casual', 'Traditional'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setProductCategoryFilter(cat)}
                    className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all ${productCategoryFilter === cat
                        ? 'bg-[#b8860b]/30 text-[#d4a017] border border-[#b8860b]'
                        : 'bg-[#171410] text-neutral-400 border border-[#b8860b]/15 hover:border-[#b8860b]/40'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Add Product Button */}
              <button
                onClick={() => {
                  setSelectedProduct(null)
                  setIsModalOpen(true)
                }}
                className="btn-primary !py-2.5 !px-5 text-xs flex items-center gap-2"
                id="add-product-btn"
              >
                <Plus size={15} />
                Add New Product
              </button>
            </div>

            {/* Products Table / Cards */}
            {productsLoading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 size={24} className="animate-spin text-[#b8860b]" />
                <span className="ml-3 text-neutral-400 text-sm">Loading products...</span>
              </div>
            ) : displayProducts.length === 0 ? (
              <div className="text-center py-20 glass border border-[#b8860b]/20 p-8">
                <Package size={40} className="mx-auto text-neutral-600 mb-3" />
                <p className="font-serif text-lg text-white">No products found</p>
                <p className="text-xs text-neutral-500 mt-1 mb-4">Click below to add your first product to the catalog.</p>
                <button
                  onClick={() => {
                    setSelectedProduct(null)
                    setIsModalOpen(true)
                  }}
                  className="btn-primary !py-2 !px-4 text-xs"
                >
                  <Plus size={13} />
                  Add Product
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayProducts.map((p) => (
                  <div
                    key={p.id}
                    className="glass border border-[#b8860b]/20 overflow-hidden flex flex-col justify-between group hover:border-[#b8860b]/50 transition-all"
                  >
                    <div>
                      {/* Image Preview & Badges */}
                      <div className="relative h-48 bg-[#171410] overflow-hidden">
                        <img
                          src={p.image || '/collection-formal.jpg'}
                          alt={p.name}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => { e.currentTarget.src = '/collection-formal.jpg' }}
                        />
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                          {p.badge && (
                            <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold bg-[#b8860b] text-white">
                              {p.badge}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold ${p.inStock !== false ? 'bg-green-950/80 text-green-300 border border-green-700/50' : 'bg-red-950/80 text-red-300 border border-red-700/50'
                            }`}>
                            {p.inStock !== false ? 'In Stock' : 'Sold Out'}
                          </span>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm text-[10px] text-[#d4a017] border border-[#b8860b]/30">
                          {p.category}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h4 className="font-serif font-bold text-base text-white group-hover:text-[#d4a017] transition-colors line-clamp-1">
                          {p.name}
                        </h4>
                        <div className="text-[#d4a017] font-semibold text-sm mt-1">
                          {p.price}
                        </div>

                        {/* Colors */}
                        {Array.isArray(p.colors) && p.colors.length > 0 && (
                          <div className="flex items-center gap-1.5 mt-2.5">
                            {p.colors.map((c, i) => (
                              <div
                                key={i}
                                className="w-3.5 h-3.5 rounded-full border border-white/20"
                                style={{ backgroundColor: c }}
                                title={c}
                              />
                            ))}
                          </div>
                        )}

                        {p.description && (
                          <p className="text-neutral-400 text-xs mt-2.5 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 pt-0 border-t border-[#b8860b]/10 mt-2 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-500 uppercase tracking-wider">
                        ID: #{p.id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(p)
                            setIsModalOpen(true)
                          }}
                          className="p-1.5 border border-[#b8860b]/20 text-[#d4a017] hover:bg-[#b8860b]/10 transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id, p.name)}
                          className="p-1.5 border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════ ORDER ENQUIRIES TAB ════════════════════ */}
        {activeTab === 'orders' && (
          <div>
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

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filterTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 text-xs tracking-wider uppercase font-medium transition-all flex items-center gap-2 ${filter === tab.key
                      ? 'bg-[#b8860b] text-white'
                      : 'glass border border-[#b8860b]/15 text-neutral-400 hover:text-[#d4a017] hover:border-[#b8860b]/30'
                    }`}
                  id={`filter-${tab.key || 'all'}`}
                >
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-sm ${filter === tab.key ? 'bg-white/20' : 'bg-[#b8860b]/15 text-[#b8860b]'
                    }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Orders States */}
            {ordersLoading && (
              <div className="flex items-center justify-center py-24">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin text-[#b8860b]" />
                  <p className="text-neutral-500 text-sm">Loading orders...</p>
                </div>
              </div>
            )}

            {ordersError && (
              <div className="p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-sm mb-6">
                ⚠️ {ordersError}
              </div>
            )}

            {!ordersLoading && submissions.length === 0 && (
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
                    className={`glass border transition-all duration-200 overflow-hidden ${isExpanded
                        ? 'border-[#b8860b]/40 shadow-lg shadow-black/40'
                        : 'border-[#b8860b]/10 hover:border-[#b8860b]/25'
                      }`}
                  >
                    {/* Header Row */}
                    <button
                      onClick={() => toggleExpand(sub.id)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Status Dot */}
                        <div className="flex flex-col items-center shrink-0">
                          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot} mb-1`} />
                          {sub.status === 'new' && (
                            <span className="text-[9px] text-[#d4a017] uppercase tracking-wider font-semibold">
                              New
                            </span>
                          )}
                        </div>

                        {/* Customer Info */}
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-serif font-bold text-white text-base group-hover:text-[#d4a017] transition-colors">
                              {sub.name}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] tracking-wider uppercase border font-medium ${cfg.classes}`}>
                              {cfg.label}
                            </span>
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

                        {/* Customer Message */}
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

                          {/* Quick Contact Links */}
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
          </div>
        )}

        {/* ════════════════════ WEBSITE SETTINGS TAB ════════════════════ */}
        {activeTab === 'settings' && canAccessSettings && (
          <div className="space-y-8 animate-fade-in">
            {/* Header / Company ID Selector */}
            <div className="glass border border-[#b8860b]/20 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-white flex items-center gap-2.5">
                  <Building size={20} className="text-[#d4a017]" />
                  Website & Company Configuration
                </h2>
                <p className="text-neutral-400 text-xs mt-1">
                  Manage website branding, company table records, and logo synchronized directly with Neon PostgreSQL.
                </p>
              </div>

              {/* Company ID selector for multi-company support */}
              <div className="flex items-center gap-3">
                <label className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Active Company ID:
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3].map((cid) => (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => {
                        setSelectedCompanyId(cid)
                        loadCompanyData(cid)
                      }}
                      className={`px-3 py-1 text-xs font-mono font-bold transition-all border ${selectedCompanyId === cid
                          ? 'bg-[#b8860b] text-white border-[#b8860b]'
                          : 'glass text-neutral-400 border-[#b8860b]/20 hover:border-[#b8860b]/50 hover:text-white'
                        }`}
                    >
                      #{cid}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Notification Badges */}
            {settingsSaved && (
              <div className="p-4 bg-green-500/15 border border-green-500/30 text-green-400 text-sm flex items-center gap-3">
                <CheckCircle size={18} />
                <span>Company information for <strong>ID #{selectedCompanyId}</strong> saved and updated across website!</span>
              </div>
            )}
            {settingsError && (
              <div className="p-4 bg-red-500/15 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                <X size={18} />
                <span>{settingsError}</span>
              </div>
            )}

            {/* Settings Form */}
            <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Logo & Branding Preview */}
              <div className="glass border border-[#b8860b]/20 p-6 space-y-6">
                <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2 border-b border-[#b8860b]/15 pb-3">
                  <ImageIcon size={16} className="text-[#d4a017]" />
                  Website Logo
                </h3>

                {/* Logo Preview Display */}
                <div className="flex flex-col items-center justify-center p-6 border border-dashed border-[#b8860b]/30 bg-[#171410]/50 rounded text-center">
                  {logoPreview ? (
                    <div className="relative group">
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="w-28 h-28 object-contain rounded border border-[#b8860b]/40 bg-[#0d0b09] p-2 mb-3"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview('')
                          setCompanySettings((prev) => ({ ...prev, logoUrl: '' }))
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-500 transition-colors shadow"
                        title="Remove Logo"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-24 border border-[#b8860b]/50 flex items-center justify-center text-[#d4a017] font-serif font-bold text-3xl mb-3 bg-[#0d0b09]">
                      {companySettings?.name ? companySettings.name.charAt(0).toUpperCase() : 'Z'}
                    </div>
                  )}
                  <p className="text-neutral-400 text-xs">
                    {logoPreview ? 'Custom logo uploaded' : 'Default monogram will be rendered'}
                  </p>
                </div>

                {/* File Upload Input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Upload Logo Image
                  </label>
                  <label className="flex items-center justify-center gap-2 px-4 py-2.5 glass border border-[#b8860b]/30 text-neutral-300 hover:text-[#d4a017] hover:border-[#b8860b] cursor-pointer transition-all text-xs">
                    <Upload size={14} />
                    <span>Choose File (PNG, JPG, SVG, WebP)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Direct Image URL input */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                    Or Enter Image / Logo URL
                  </label>
                  <input
                    type="url"
                    value={companySettings?.logoUrl || ''}
                    onChange={(e) => {
                      const val = e.target.value
                      setCompanySettings((prev) => ({ ...prev, logoUrl: val }))
                      setLogoPreview(val)
                    }}
                    placeholder="https://example.com/logo.png"
                    className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                  />
                </div>

                {/* Live Brand Preview Card */}
                <div className="border-t border-[#b8860b]/15 pt-4">
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-2 font-medium">
                    Navbar Preview (Company ID #{selectedCompanyId})
                  </label>
                  <div className="p-3 bg-[#0d0b09] border border-[#b8860b]/25 flex items-center gap-3">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Brand preview"
                        className="w-8 h-8 object-contain rounded border border-[#b8860b]/40 p-0.5"
                      />
                    ) : (
                      <div className="w-8 h-8 border border-[#b8860b]/60 flex items-center justify-center text-[#d4a017] font-bold text-sm font-serif">
                        {companySettings?.name ? companySettings.name.charAt(0).toUpperCase() : 'Z'}
                      </div>
                    )}
                    <div className="flex flex-col leading-tight">
                      <span className="font-serif font-bold text-sm text-white tracking-wide">
                        {companySettings?.name || 'Zhobies Wear'}
                      </span>
                      <span className="text-[#b8860b] text-[8px] tracking-[0.2em] uppercase font-medium">
                        {companySettings?.tagline || 'Official Store'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Company Information Fields */}
              <div className="lg:col-span-2 glass border border-[#b8860b]/20 p-6 space-y-6">
                <h3 className="font-serif text-base font-semibold text-white flex items-center gap-2 border-b border-[#b8860b]/15 pb-3">
                  <Building size={16} className="text-[#d4a017]" />
                  Company Table Details (ID #{selectedCompanyId})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Website / Company Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                      Website Name <span className="text-[#d4a017]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={companySettings?.name || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="e.g. Zhobies Wear"
                      className="w-full bg-[#171410] border border-[#b8860b]/30 px-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all font-serif"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Current website name: <strong>Zhobies Wear</strong>. Changing this will immediately reflect across the Navbar, Footer, and Admin panel.
                    </p>
                  </div>

                  {/* Tagline / Subtitle */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                      Brand Tagline / Subtitle
                    </label>
                    <input
                      type="text"
                      value={companySettings?.tagline || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, tagline: e.target.value }))
                      }
                      placeholder="e.g. Premium Clothing & Tailoring"
                      className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                    />
                  </div>

                  {/* Contact Email */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      value={companySettings?.email || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, email: e.target.value }))
                      }
                      placeholder="contact@zhobieswear.com"
                      className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                    />
                  </div>

                  {/* Contact Phone / WhatsApp */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                      Phone Number / WhatsApp
                    </label>
                    <input
                      type="text"
                      value={companySettings?.phone || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      placeholder="+92 300 1234567"
                      className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                    />
                  </div>

                  {/* Physical Address */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                      Physical Store Address
                    </label>
                    <input
                      type="text"
                      value={companySettings?.address || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, address: e.target.value }))
                      }
                      placeholder="Commercial Market, Lahore, Pakistan"
                      className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all"
                    />
                  </div>

                  {/* Brand Description / About snippet */}
                  <div className="md:col-span-2">
                    <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5">
                      Store Description (Shown in Footer)
                    </label>
                    <textarea
                      rows={3}
                      value={companySettings?.description || ''}
                      onChange={(e) =>
                        setCompanySettings((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="Write brief description of your clothing store..."
                      className="w-full bg-[#171410] border border-[#b8860b]/20 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#d4a017] transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-[#b8860b]/15 flex items-center justify-between">
                  <div className="text-[11px] text-neutral-500">
                    Target database table: <code className="text-[#d4a017]">company</code> (record id = {selectedCompanyId})
                  </div>
                  <button
                    type="submit"
                    disabled={settingsLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#b8860b] hover:bg-[#d4a017] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50"
                  >
                    {settingsLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Saving to Database...
                      </>
                    ) : (
                      <>
                        <Save size={14} />
                        Save Settings
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Product Add/Edit Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedProduct(null)
        }}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
