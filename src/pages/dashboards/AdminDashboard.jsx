import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'

export default function AdminDashboard() {
  const [recentReviews, setRecentReviews] = useState([])

  useEffect(() => {
    (async () => {
      try {
        // Load products and fetch their feedbacks, then pick latest 5
        const prods = await api.getProducts()
        const products = prods.data || []
        const lists = await Promise.all(products.map(async (p) => {
          try {
            const r = await api.getProductFeedbacks(p.id, { page: 1, limit: 20 })
            const items = r.data?.items || r.data || []
            return items.map(f => ({ ...f, productName: f.product?.name || p.name, createdAt: f.createdAt }))
          } catch { return [] }
        }))
        const all = lists.flat()
        const sorted = all.sort((a,b) => new Date(b.createdAt||0) - new Date(a.createdAt||0))
        setRecentReviews(sorted.slice(0, 5))
      } catch {}
    })()
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Product</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Link to="/products/new" className="px-3 py-2 bg-[#FF0038] text-white rounded-full hover:bg-[#0014A8]">Add Product</Link>
            <Link to="/products" className="px-3 py-2 border rounded-full hover:bg-[#FF0038] hover:text-white">All Products</Link>
          </div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Reports</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Link to="/reports" className="px-3 py-2 border rounded-full hover:bg-[#FF0038] hover:text-white">View Analytics</Link>
            <Link to="/admin/users" className="px-3 py-2 border rounded-full hover:bg-[#FF0038] hover:text-white">Users</Link>
          </div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Orders</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Link to="/orders" className="px-3 py-2 border rounded-full hover:bg-[#FF0038] hover:text-white">Manage Orders</Link>
          </div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800">
          <div className="text-sm text-gray-500">Offers</div>
          <div className="mt-2 flex gap-2 flex-wrap">
            <Link to="/offers?action=add-sale" className="px-3 py-2 bg-[#FF0038] text-white rounded-full hover:bg-[#0014A8]">Add Sale Product</Link>
            <Link to="/offers?action=add-discount" className="px-3 py-2 border rounded-full hover:bg-[#FF0038] hover:text-white">Add Discount</Link>
          </div>
        </div>
        <div className="p-4 border rounded dark:border-gray-800 md:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-500">Recent Reviews</div>
            <Link to="/reviews" className="px-3 py-1.5 border rounded-full hover:bg-[#FF0038] hover:text-white">All Reviews</Link>
          </div>
          {recentReviews.length === 0 ? (
            <div className="text-sm text-gray-600">No reviews yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recentReviews.map((r, i) => (
                <div key={i} className="border rounded p-3 dark:border-gray-800 bg-white">
                  <div className="font-medium truncate">{r.productName || r.productId}</div>
                  <div className="text-sm" style={{ color: '#DAA520' }}>{'★'.repeat(r.rating)}{'☆'.repeat(Math.max(0, 5 - r.rating))}</div>
                  <div className="text-sm mt-1 line-clamp-2">{r.comment}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
