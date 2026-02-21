import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import api from '../services/api'
import { logout } from '../store/slices/authSlice'
import CartSidebar from './CartSidebar'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, role } = useSelector(s => s.auth)
  const cartItems = useSelector(s => s.cart.items)
  const cartCount = cartItems.reduce((sum, i) => sum + (i.qty || 0), 0)
  const cartTotal = cartItems.reduce((sum, i) => sum + (i.price * i.qty), 0)
  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const menuRef = useRef(null)
  const [q, setQ] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [recent, setRecent] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [allNames, setAllNames] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])

  // recent searches helpers
  const RECENT_KEY = 'recent_searches'
  useEffect(() => {
    try { setRecent(JSON.parse(localStorage.getItem(RECENT_KEY)) || []) } catch { setRecent([]) }
  }, [])
  const saveRecent = (term) => {
    if (!term) return
    const exists = new Set([term.toLowerCase()])
    const next = [term, ...recent.filter(x => !exists.has(String(x).toLowerCase()))].slice(0, 8)
    setRecent(next)
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch { }
  }
  const clearRecent = () => { setRecent([]); try { localStorage.removeItem(RECENT_KEY) } catch { } }

  // fetch and shuffle suggestions when dropdown opens and query is empty; keep reshuffling on a timer
  useEffect(() => {
    let intervalId
    const shuffleFromAll = (src) => {
      if (!src || src.length === 0) return
      const names = src.slice()
      for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = names[i]; names[i] = names[j]; names[j] = t
      }
      setSuggestions(names.slice(0, 10))
    }
    const load = async () => {
      try {
        const res = await api.getProducts()
        const products = res.data || []
        setAllProducts(products)
        const unique = Array.from(new Set(products.map(p => p.name))).slice(0, 400)
        setAllNames(unique)
        shuffleFromAll(unique)
      } catch { }
    }
    if (showSearch && !q) {
      if (!allNames.length) load(); else shuffleFromAll(allNames)
      intervalId = setInterval(() => shuffleFromAll(allNames.length ? allNames : suggestions), 4000)
    }
    return () => { if (intervalId) clearInterval(intervalId) }
  }, [showSearch, q, allNames])

  // Filter products based on search query
  useEffect(() => {
    if (!q || q.trim().length === 0) {
      setFilteredProducts([])
      return
    }
    const query = q.toLowerCase().trim()
    const filtered = allProducts
      .filter(p => p.name.toLowerCase().includes(query) || (p.category || '').toLowerCase().includes(query))
      .slice(0, 8)
    setFilteredProducts(filtered)
  }, [q, allProducts])

  const doSearch = () => {
    const term = q.trim()
    const dest = term ? `/products?q=${encodeURIComponent(term)}` : '/products'
    navigate(dest)
    setShowSearch(false)
    if (term) saveRecent(term)
    setQ('')
  }

  const onLogout = () => {
    dispatch(logout())
    setOpen(false)
    navigate('/')
  }

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [open])

  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <header className={`sticky top-0 z-50 ${isAdminRoute ? 'bg-[#0014A8] text-white' : 'bg-white text-gray-800'} border-b border-gray-100 shadow-[0_1px_15px_rgba(0,0,0,0.04)] h-[80px] flex items-center`}>
      <div className="max-w-[1600px] w-full mx-auto px-4 lg:px-6 flex items-center justify-between gap-6">

        {/* Left Section: Logo & Location */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center group">
              <div className="flex flex-col">
                <span className={`text-2xl font-bold tracking-tight leading-none ${isAdminRoute ? 'text-white' : 'text-[#282C3F]'}`}>Fresh<span className="text-[#FF0038]">Grocery</span></span>
                {isAdminRoute && <span className="text-[10px] font-mono text-blue-200">ADMIN</span>}
              </div>
            </div>
          </Link>




        </div>

        {/* Middle Section: Search Bar */}
        <form onSubmit={(e) => { e.preventDefault(); doSearch() }} className="hidden md:block flex-1 max-w-2xl relative z-30" onFocus={() => setShowSearch(true)}>
          <div className="relative group">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search for &quot;Grapes&quot;..."
              className={`w-full h-[50px] px-5 py-2 pr-12 text-sm font-medium border border-transparent rounded-[12px] placeholder:text-gray-400 focus:shadow-[0_4px_12px_rgba(0,0,0,0.05)] outline-none transition-all duration-200 ${isAdminRoute
                ? 'bg-blue-900/40 text-white placeholder:text-blue-200 focus:bg-blue-900/60'
                : 'bg-[#F4F6FB] text-gray-700 focus:bg-white focus:border-gray-200'
                }`}
              onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              onClick={() => setShowSearch(true)}
            />
            <button type="button" onClick={doSearch} className={`absolute right-0 top-0 h-full w-14 flex items-center justify-center transition-colors ${isAdminRoute ? 'text-blue-200 hover:text-white' : 'text-gray-400 hover:text-[#FF0038]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
          </div>

          {/* Dropdown Results */}
          {showSearch && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden py-2" onMouseDown={(e) => e.preventDefault()}>
              {q && filteredProducts.length > 0 && (
                <div className="px-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">Products</div>
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      type="button"
                      className="w-full flex items-center gap-4 p-3 hover:bg-[#F4F6FB] rounded-lg transition text-left group"
                      onClick={() => {
                        saveRecent(product.name)
                        navigate(`/products?q=${encodeURIComponent(product.name)}`)
                        setShowSearch(false)
                        setQ('')
                      }}
                    >
                      <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 p-1 flex items-center justify-center">
                        <img src={product.image || 'https://via.placeholder.com/48x48'} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-800 group-hover:text-[#FF0038] transition-colors">{product.name}</div>
                        <div className="text-xs text-gray-400">{product.category}</div>
                      </div>
                      <div className="text-sm font-bold text-gray-700">
                        {fmtINR(product.price)}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {q && filteredProducts.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-300 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  </div>
                  <p className="text-gray-500 text-sm">No products found for "{q}"</p>
                </div>
              )}

              {!q && (
                <div className="p-4 space-y-4">
                  {recent.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent Searches</div>
                        <button type="button" className="text-xs text-[#FF0038] font-medium hover:underline" onClick={clearRecent}>Clear</button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((r, i) => (
                          <button key={i} type="button" className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 text-gray-600 rounded-full text-sm hover:bg-white hover:border-[#FF0038] hover:text-[#FF0038] transition" onClick={() => { saveRecent(r); setQ(r); navigate(`/products?q=${encodeURIComponent(r)}`); setShowSearch(false); setQ('') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Trending Nearby</div>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.map((s, i) => (
                          <button key={i} type="button" className="flex items-center gap-2 px-3 py-1.5 bg-white border border-dashed border-gray-300 text-gray-600 rounded-full text-sm hover:border-[#FF0038] hover:text-[#FF0038] transition" onClick={() => { saveRecent(s); setQ(s); navigate(`/products?q=${encodeURIComponent(s)}`); setShowSearch(false); setQ('') }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </form>

        {/* Right Section: Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          {/* Sign In / User Profile */}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen(v => !v)} className={`flex items-center gap-2 transition group ${isAdminRoute ? 'text-white' : 'text-[#3D4152] hover:text-[#FF0038]'}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition border ${isAdminRoute ? 'bg-blue-800 border-blue-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-700 group-hover:border-[#FF0038] group-hover:bg-[#FFF0F0] group-hover:text-[#FF0038]'}`}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <span className="font-medium hidden lg:block max-w-[100px] truncate">{user.name}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden py-1 z-50 text-gray-800">
                  <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F3F9FF] hover:text-[#FF0038]">My Account</Link>
                  <Link to="/orders" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F3F9FF] hover:text-[#FF0038]">Orders</Link>
                  <Link to="/feedback" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-[#F3F9FF] hover:text-[#FF0038]">Feedback</Link>
                  <div className="h-px bg-gray-100 my-1"></div>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className={`flex items-center gap-2 transition font-medium ${isAdminRoute ? 'text-white hover:text-blue-200' : 'text-[#3D4152] hover:text-[#FF0038]'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              <span>Sign in</span>
            </Link>
          )}

          {/* Cart Button */}
          {role !== 'admin' && (
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-3 bg-[#F2F4F8] hover:bg-[#E8EBF1] text-[#282C3F] h-[52px] px-6 rounded-xl font-bold transition active:scale-95 group"
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#282C3F] group-hover:scale-105 transition-transform"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FF0038] text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">My Cart</span>
              {cartCount > 0 && <span className="text-sm font-normal text-gray-500 ml-1">{fmtINR(cartTotal)}</span>}
            </button>
          )}
        </div>
      </div>

      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
