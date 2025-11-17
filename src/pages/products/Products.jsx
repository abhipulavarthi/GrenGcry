import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import ProductCard from '../../components/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decrementItem } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'

export default function Products() {
  const [products, setProducts] = useState([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [params] = useSearchParams()
  const dispatch = useDispatch()
  const { user } = useSelector(s => s.auth)

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.getProducts({ q, category: cat, page: 1, limit: 1000 })
      let items = res.data?.items || res.data || []
      // hide inactive products (support both camelCase and snake_case)
      items = items.filter(p => p.isActive !== false && p.is_active !== false)
      // apply sale overrides from localStorage by product name
      let overrides = {}
      try { overrides = JSON.parse(localStorage.getItem('saleOverrides') || '{}') || {} } catch {}
      const mapped = items.map(p => {
        const salePrice = overrides[p.name]
        if (salePrice != null && !isNaN(+salePrice)) {
          return { ...p, originalPrice: p.price, price: +salePrice }
        }
        return p
      })
      setProducts(mapped)
    } catch (e) {
      toast.error('Failed to load products')
    } finally { setLoading(false) }
  }

  useEffect(() => {
    const qp = params.get('q') || ''
    const cp = params.get('category') || ''
    if (qp !== q) setQ(qp)
    if (cp !== cat) setCat(cp)
  }, [params])

  useEffect(() => { fetchProducts() }, [q, cat])

  const onDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    setDeletingId(id)
    try {
      await api.deleteProduct(id)
      toast.success('Deleted')
      // Optimistically remove from list
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.error || e?.message || 'Delete failed'
      // Try soft delete when hard delete fails (likely due to FK constraints)
      try {
        await api.updateProduct(id, { isActive: false })
        toast.success('Product archived (soft-deleted)')
        setProducts(prev => prev.filter(p => p.id !== id))
      } catch {
        toast.error(msg)
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Products</h1>
        {user?.role === 'admin' && (
          <Link to="/products/new" className="px-4 py-2 bg-[#FF0038] text-white rounded-full hover:bg-[#0014A8]">Add Product</Link>
        )}
      </div>
      {/* Search/filter controls removed; use Navbar search */}
      {loading ? <div>Loading...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="relative">
              <ProductCard product={p} onAdd={(item)=>dispatch(addToCart(item))} onDec={(idOrObj)=>dispatch(decrementItem(idOrObj))} />
              {user?.role === 'admin' && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Link to={`/products/${p.id}`} className="px-2 py-1 text-xs bg-[#FF0038] text-white rounded-full">Edit</Link>
                  <button disabled={deletingId===p.id} onClick={()=>onDelete(p.id)} className="px-2 py-1 text-xs bg-[#FF0038] text-white rounded-full disabled:opacity-60">{deletingId===p.id ? '...' : 'Del'}</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
