import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { user, role } = useSelector(s => s.auth)

  const fetchOrders = async () => {
    setLoading(true)
    try {
      if (role === 'admin') {
        const res = await api.getOrders()
        setOrders(res.data?.items || res.data || [])
      } else if (user) {
        const res = await api.getOrders({ userId: user._id || user.id })
        setOrders(res.data?.orders || res.data || [])
      }
    } catch { toast.error('Failed to load orders') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchOrders() }, [])

  const acceptOrder = async (id) => {
    try {
      await api.updateOrder(id, { status: 'PLACED' })
      toast.success('Order accepted')
      fetchOrders()
    } catch {
      toast.error('Failed to accept order')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Orders</h1>
      </div>
      {loading ? 'Loading...' : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b dark:border-gray-800">
                <th className="p-2">ID</th>
                {role === 'admin' && <th className="p-2">Customer</th>}
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b dark:border-gray-800">
                  <td className="p-2">{o.id}</td>
                  {role === 'admin' && <td className="p-2">{o.customer?.name || o.user?.name || '-'}</td>}
                  <td className="p-2">₹{Number(o.total ?? 0).toFixed(2)}</td>
                  <td className="p-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${String(o.status).toUpperCase() === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        ['PLACED', 'PROCESSING'].includes(String(o.status).toUpperCase()) ? 'bg-blue-100 text-blue-700' :
                          'bg-yellow-100 text-yellow-700'
                      }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-2 flex gap-2">
                    {role === 'admin' && String(o.status).toUpperCase() === 'PENDING' && (
                      <button onClick={() => acceptOrder(o.id)} className="px-2 py-1 text-xs border rounded-full hover:bg-green-500 hover:text-white transition-colors">Accept</button>
                    )}
                    {role === 'admin' && ['PLACED', 'PROCESSING'].includes(String(o.status).toUpperCase()) && (
                      <button
                        onClick={async () => {
                          try {
                            await api.updateOrder(o.id, { status: 'DELIVERED' })
                            toast.success('Order marked as delivered')
                            fetchOrders()
                          } catch {
                            toast.error('Failed to update order status')
                          }
                        }}
                        className="px-2 py-1 text-xs border border-green-200 text-green-600 rounded-full hover:bg-green-50 transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                    <Link to={`/billing/${o.id}?view=invoice`} className="px-2 py-1 text-xs bg-[#FF0038] text-white rounded-full hover:bg-opacity-90 transition-all">Invoice</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
