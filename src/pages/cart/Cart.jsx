import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, clearCart, addToCart, decrementItem } from '../../store/slices/cartSlice'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const items = useSelector(s => s.cart.items)
  const total = items.reduce((s,i)=>s+i.price*i.qty,0)

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(n)

  const checkout = async () => {
    try {
      if (items.length === 0) return
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to checkout')
        navigate('/login', { state: { from: { pathname: '/cart' } } })
        return
      }
      // Validate stock against backend before placing the order
      const wants = items.map(i => ({ 
        productId: Number(i.productId ?? i.id), 
        quantity: Math.max(1, parseInt(i.qty, 10) || 1),
        name: i.name
      }))
      const byId = new Map()
      for (const w of wants) {
        byId.set(w.productId, (byId.get(w.productId) || 0) + w.quantity)
      }
      // fetch each distinct product and compare stock
      for (const pid of byId.keys()) {
        try {
          const resP = await api.getProduct(pid)
          const stock = Number(resP.data?.stock ?? 0)
          const need = byId.get(pid)
          if (stock < need) {
            toast.error(`Not enough stock for product #${pid} (need ${need}, available ${stock})`)
            return
          }
        } catch {
          toast.error(`Product #${pid} is unavailable`)
          return
        }
      }
      const products = wants.map(({ productId, quantity }) => ({ productId, quantity }))
      const res = await api.createOrder({ products })
      const orderId = res.data?.id
      if (!orderId) {
        toast.error('Checkout succeeded but no order ID was returned')
        return
      }
      try { localStorage.setItem('lastOrder', JSON.stringify(res.data || {})) } catch {}
      try { localStorage.setItem('lastOrderId', String(orderId)) } catch {}
      try {
        const prev = JSON.parse(localStorage.getItem('myOrders') || '[]')
        const next = [res.data, ...Array.isArray(prev) ? prev : []].slice(0, 20)
        localStorage.setItem('myOrders', JSON.stringify(next))
      } catch {}
      dispatch(clearCart())
      navigate(`/billing/${orderId}`)
    } catch (e) {
      const status = e?.response?.status
      const data = e?.response?.data
      const firstFieldError = Array.isArray(data?.errors) && data.errors.length ? (data.errors[0]?.message || data.errors[0]) : null
      const msg = firstFieldError || data?.message || e?.message || 'Checkout failed'
      toast.error(status ? `${status}: ${msg}` : msg)
      if (status === 401) {
        navigate('/login', { state: { from: { pathname: '/cart' } } })
      }
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Cart</h1>
      {items.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link to="/products" className="text-brand-steel">Browse products</Link>
        </div>
      ) : (
        <div>
          <div className="space-y-3">
            {items.map(i => (
              <div key={i.id} className="flex gap-4 items-center border-b dark:border-gray-800 py-3">
                {(() => {
                  const raw = String(i.image || '').trim()
                  const src = (/^https?:\/\//i.test(raw) || raw.startsWith('/')) ? raw : 'https://via.placeholder.com/80x80'
                  return (
                    <img 
                      src={src}
                      alt={i.name}
                      className="w-20 h-20 object-cover rounded border border-gray-200"
                    />
                  )
                })()}
                <div className="flex-1">
                  <div className="font-medium text-lg">{i.name}</div>
                  <div className="text-sm text-gray-500">{i.unitLabel || ''}</div>
                  <div className="text-sm text-gray-600">Unit Price: {fmtINR(i.price)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <button 
                      onClick={()=>dispatch(decrementItem({ id: i.id, qty: 1 }))} 
                      className="px-3 py-1.5 border border-brand-steel/60 rounded-full bg-white hover:bg-[#FF0038]/10"
                    >
                      -
                    </button>
                    <span className="mx-1 px-4 py-1.5 border border-brand-steel/60 rounded-full bg-white min-w-[50px] text-center">
                      {i.qty}
                    </span>
                    <button 
                      onClick={()=>dispatch(addToCart({ ...i, qty: 1 }))} 
                      className="px-3 py-1.5 border border-brand-steel/60 rounded-full bg-white hover:bg-[#FF0038]/10"
                    >
                      +
                    </button>
                  </div>
                  <span className="font-semibold text-lg min-w-[80px] text-right">{fmtINR(i.price*i.qty)}</span>
                  <button onClick={()=>dispatch(removeFromCart(i.id))} className="px-3 py-1.5 text-sm bg-[#0014A8] text-white rounded-full hover:bg-[#0014A8]/90">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="font-bold text-3xl text-right">Total: {fmtINR(total)}</div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button onClick={()=>dispatch(clearCart())} className="px-4 py-2 border-2 border-[#FF0038] text-[#FF0038] rounded-full">Clear</button>
              <button onClick={checkout} className="px-4 py-2 bg-[#0014A8] text-white rounded-full hover:bg-[#0014A8]/90">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
