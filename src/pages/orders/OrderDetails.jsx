import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/orders/${id}`)
        setOrder(res.data)
      } catch { toast.error('Failed to load order') }
    })()
  }, [id])

  if (!order) return <div>Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Order #{order.id}</h1>
        <Link to={`/billing/${order.id}`} className="px-3 py-2 bg-[#FF0038] text-white rounded-full">Invoice</Link>
      </div>
      <div className="space-y-2">
        {order.items?.map((i, idx) => (
          <div key={idx} className="flex justify-between border-b dark:border-gray-800 py-2">
            <span>{i.name} x {i.qty}{i.unitLabel ? ` (${i.unitLabel})` : ''}</span>
            <span>{new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(i.price*i.qty)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 font-semibold">Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(order.total)}</div>
      <div className="mt-1 text-sm text-gray-500">Status: {order.status}</div>
    </div>
  )
}
