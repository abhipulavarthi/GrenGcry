import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../services/api'
import ProductCard from '../../components/ProductCard'
import { useDispatch } from 'react-redux'
import { addToCart } from '../../store/slices/cartSlice'
import { toast } from 'react-toastify'

const CATEGORY_MAP = {
  vegetables: { title: 'Vegetables', category: 'Vegetables' },
  fruits: { title: 'Fruits', category: 'Fruits' },
  'snacks-branded-foods': { title: 'Snacks & Branded Foods', category: 'Snacks & Branded Foods' },
  'herbs-seasonings': { title: 'Herbs & Seasonings', category: 'Foodgrains, Oil & Masala' },
  seasonal: { title: 'Seasonal Fruits & Vegetables', categories: ['Fruits','Vegetables'] },
  icecreams: { title: 'Ice Creams', category: 'Bakery, Cakes & Dairy', nameIncludes: 'Ice Cream' },
  chocolates: { title: 'Chocolates', category: 'Snacks & Branded Foods', nameIncludes: 'Chocolate' },
  beverages: { title: 'Beverages', category: 'Beverages' },
  'cleaning-household': { title: 'Cleaning & Household', category: 'Cleaning & Household' },
}

export default function CategoryProducts() {
  const { slug } = useParams()
  const cfg = useMemo(() => CATEGORY_MAP[slug] || { title: 'Products', category: '' }, [slug])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      if (cfg.categories && Array.isArray(cfg.categories)) {
        const res = await api.getProducts()
        const list = (res.data||[]).filter(p => cfg.categories.includes(p.category))
        setProducts(list)
      } else if (cfg.nameIncludes) {
        const res = await api.getProducts()
        const list = (res.data||[]).filter(p => (!cfg.category || p.category === cfg.category) && (p.name||'').toLowerCase().includes(cfg.nameIncludes.toLowerCase()))
        setProducts(list)
      } else {
        const res = await api.getProducts({ category: cfg.category })
        setProducts(res.data || [])
      }
    } catch (e) {
      toast.error('Failed to load products')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchProducts() }, [slug])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{cfg.title}</h1>
        <Link to="/products" className="px-3 py-2 border rounded">All Products</Link>
      </div>
      {loading ? <div>Loading...</div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map(p => (
            <ProductCard key={p.id} product={p} onAdd={(item)=>dispatch(addToCart(item))} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full text-sm text-gray-600">No items found in this category.</div>
          )}
        </div>
      )}
    </div>
  )
}
