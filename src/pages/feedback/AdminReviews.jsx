import { useEffect, useState } from 'react'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function AdminReviews() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAll = async () => {
    setLoading(true)
    try {
      // Load all products first
      const prodsRes = await api.getProducts()
      const products = prodsRes.data || []
      // Fetch feedbacks for each product (first page, larger limit)
      const lists = await Promise.all(products.map(async (p) => {
        try {
          const r = await api.getProductFeedbacks(p.id, { page: 1, limit: 100 })
          const items = r.data?.items || r.data || []
          return items.map(f => ({ ...f, productName: f.product?.name || p.name, productId: p.id }))
        } catch {
          return []
        }
      }))
      const all = lists.flat()
      setReviews(all)
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load reviews')
    } finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">All User Reviews</h1>
        <button onClick={fetchAll} className="px-3 py-2 border rounded">Refresh</button>
      </div>
      {loading ? 'Loading...' : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-800">
                <th className="p-2">#</th>
                <th className="p-2">Product</th>
                <th className="p-2">User</th>
                <th className="p-2">Rating</th>
                <th className="p-2">Comment</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r, i) => (
                <tr key={i} className="border-b dark:border-gray-800 align-top">
                  <td className="p-2">{i + 1}</td>
                  <td className="p-2 whitespace-nowrap">{r.productName || r.productId}</td>
                  <td className="p-2 whitespace-nowrap">{r.user?.name || r.user?.email || '-'}</td>
                  <td className="p-2 text-brand-sand whitespace-nowrap">{'★'.repeat(r.rating)}{'☆'.repeat(Math.max(0, 5 - r.rating))}</td>
                  <td className="p-2">{r.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
