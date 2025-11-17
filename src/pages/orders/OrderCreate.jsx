import { useEffect, useState } from 'react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export default function OrderCreate() {
  const [products, setProducts] = useState([])
  const [items, setItems] = useState([])
  const [customer, setCustomer] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/products')
        setProducts(res.data || [])
      } catch { toast.error('Failed to load products') }
    })()
  }, [])

  const addItem = (p) => {
    setItems(prev => {
      const ex = prev.find(i => i.id === p.id)
      if (ex) return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }]
    })
  }

  const total = items.reduce((s,i)=>s+i.price*i.qty,0)

  const createOrder = async () => {
    try {
      const res = await api.post('/orders', { customer, items })
      toast.success('Order created')
      navigate(`/billing/${res.data?.id || ''}`)
    } catch { toast.error('Create failed') }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h2 className="font-semibold mb-2">Products</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {products.map(p => (
            <button key={p.id} onClick={()=>addItem(p)} className="text-left p-3 border rounded dark:border-gray-800">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">${p.price}</div>
            </button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-semibold mb-2">Order</h2>
        <input value={customer} onChange={e=>setCustomer(e.target.value)} placeholder="Customer name" className="border rounded px-3 py-2 bg-transparent w-full mb-3" />
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.id} className="flex justify-between">
              <span>{i.name} x {i.qty}</span>
              <span>${(i.price*i.qty).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 font-semibold">Total: ${total.toFixed(2)}</div>
        <button onClick={createOrder} className="mt-4 px-4 py-2 bg-[#FF0038] text-white rounded">Create Order</button>
      </div>
    </div>
  )
}
