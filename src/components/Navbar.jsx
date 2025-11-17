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
    try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)) } catch {}
  }
  const clearRecent = () => { setRecent([]); try { localStorage.removeItem(RECENT_KEY) } catch {} }

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
      } catch {}
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
      .filter(p => p.name.toLowerCase().includes(query) || (p.category||'').toLowerCase().includes(query))
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
    <header className={`sticky top-0 z-20 ${isAdminRoute ? 'bg-[#0014A8]' : 'bg-[#FF0038]'} text-brand-teal border-b border-brand-steel/30 shadow-md`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
        {location.pathname.startsWith('/admin/users') ? (
          <Link to="/" className="font-semibold text-2xl text-[#252525] hover:text-[#FAFAFA] transition">FreshGrocery</Link>
        ) : location.pathname.startsWith('/admin') ? (
          <span className="font-semibold text-2xl text-[#FAFAFA] select-none cursor-default">FreshGrocery</span>
        ) : (
          <Link to="/" className="font-semibold text-2xl text-[#252525] hover:text-[#FAFAFA] transition">FreshGrocery</Link>
        )}

        {/* Search Bar */}
        <form onSubmit={(e)=>{e.preventDefault(); doSearch()}} className="hidden md:block flex-1 relative" onFocus={()=>setShowSearch(true)}>
          <input
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            placeholder="Search for Products..."
            className="w-full px-4 py-2 pr-10 border border-brand-steel/30 rounded-full bg-white/40 focus:ring-2 focus:ring-brand-aqua outline-none placeholder:text-gray-600/70"
            onBlur={()=>setTimeout(()=>setShowSearch(false), 120)}
            onClick={()=>setShowSearch(true)}
          />
          <button type="button" onClick={doSearch} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 px-2 text-xl">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"></path></svg>
          </button>
          {showSearch && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-brand-steel/40 rounded-md shadow-lg p-4 z-30">
              {/* Product Suggestions with Images */}
              {q && filteredProducts.length > 0 && (
                <div className="mb-3">
                  <div className="text-sm font-semibold mb-2">Products</div>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <button
                        key={product.id}
                        type="button"
                        className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition text-left"
                        onMouseDown={() => {
                          saveRecent(product.name)
                          navigate(`/products?q=${encodeURIComponent(product.name)}`)
                          setShowSearch(false)
                          setQ('')
                        }}
                      >
                        <img
                          src={product.image || 'https://via.placeholder.com/48x48'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500">{product.category}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#FF0038]">
                          {fmtINR(product.price)}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {q && filteredProducts.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No products found for "{q}"
                </div>
              )}

              {/* Recent Searches */}
              {!q && recent.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-semibold">Recent Searches</div>
                    <button type="button" className="text-xs text-gray-500 hover:text-[#FF0038]" onMouseDown={clearRecent}>Clear</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r, i)=> (
                      <button key={i} type="button" className="px-3 py-1 rounded-full border text-sm" onMouseDown={()=>{saveRecent(r); setQ(r); navigate(`/products?q=${encodeURIComponent(r)}`); setShowSearch(false); setQ('')}}>{r}</button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Discover/Random Suggestions */}
              {!q && suggestions.length > 0 && (
                <div className="mt-3">
                  <div className="text-sm font-semibold mb-2">Discover</div>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s, i)=> (
                      <button key={i} type="button" className="px-3 py-1 rounded-full border text-sm" onMouseDown={()=>{saveRecent(s); setQ(s); navigate(`/products?q=${encodeURIComponent(s)}`); setShowSearch(false); setQ('')}}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>

        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {role !== 'admin' && (
            <button 
              onClick={() => setCartOpen(true)} 
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-[#FAFAFA] transition group"
            >
              <div className="relative">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#252525]">
                  <path d="M7 18a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4zM3 3h2l3.6 7.59-1.35 2.45A2 2 0 009 16h9a1 1 0 100-2H9.42a.25.25 0 01-.22-.37L10 12h6a2 2 0 001.79-1.1l3.58-6.49A1 1 0 0020.5 3H6.21l-.94-2H1 a1 1 0 100 2h2z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-[10px] bg-[#FF0038] text-white rounded-full px-1 min-w-[16px] text-center leading-4 font-semibold">{cartCount}</span>
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs text-gray-600">Cart</span>
                <span className="text-sm font-bold text-[#252525]">{fmtINR(cartTotal)}</span>
              </div>
            </button>
          )}
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setOpen(v=>!v)} className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-semibold">{user.name?.[0]?.toUpperCase() || 'U'}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-60 bg-[#FAFAFA] rounded-md shadow-lg border border-brand-steel/40 overflow-hidden">
                  <Link to="/account" onClick={() => setOpen(false)} className="block px-4 py-2 text-sm font-semibold border-b border-brand-steel/20 hover:bg-[#FF0038]/10">My Account</Link>
                  <Link to="/cart" className="flex items-center justify-between px-4 py-2 text-sm hover:bg-[#FF0038]/10">
                    <span>My Basket</span>
                    {cartCount > 0 && <span className="text-xs bg-brand-steel text-white rounded-full px-2">{cartCount} items</span>}
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm hover:bg-[#FF0038]/10">My Orders</Link>
                  <Link to="/feedback" className="block px-4 py-2 text-sm text-[#FF0038] hover:bg-[#FF0038]/10">Review</Link>
                  <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm hover:bg-[#FF0038]/10">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-3 py-1 rounded-full border border-brand-steel text-[#252525] bg-white hover:bg-brand-sand/50">Login</Link>
              <Link to="/signup" className="px-3 py-1 rounded-full border border-brand-steel text-[#252525] bg-white hover:bg-brand-sand/50">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}
