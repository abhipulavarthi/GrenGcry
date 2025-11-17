import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Billing() {
  const { orderId } = useParams()
  const [searchParams] = useSearchParams()
  const [order, setOrder] = useState(null)
  const [method, setMethod] = useState('upi')
  const [upiId, setUpiId] = useState('')
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' })
  const [addresses, setAddresses] = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState('')
  const [codAddress, setCodAddress] = useState({ name:'', line1:'', line2:'', city:'', state:'', pincode:'', phone:'' })
  const [processing, setProcessing] = useState(false)
  const [animateOut, setAnimateOut] = useState(false)
  const [showOutAnim, setShowOutAnim] = useState(false)
  const [DotLottieCmp, setDotLottieCmp] = useState(null)
  const printRef = useRef(null)
  const { role, user } = useSelector(s => s.auth)
  const isAdmin = role === 'admin'
  const viewOnly = (searchParams.get('view') || '').toLowerCase() === 'invoice'

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getOrder(orderId)
        setOrder(res.data)
      } catch (e) {
        // Fallback: use lastOrder snapshot from localStorage when backend blocks fetch
        try {
          const cached = JSON.parse(localStorage.getItem('lastOrder') || 'null')
          if (cached && String(cached.id) === String(orderId)) {
            setOrder(cached)
            toast.info('Showing cached order')
            return
          }
        } catch {}
        toast.error(e?.response?.data?.message || 'Failed to load order')
      }
    })()
  }, [orderId])

  // localStorage helpers for addresses fallback
  const storageKey = user?.id ? `addresses:${user.id}` : 'addresses:anon'
  const loadLocal = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  }

  // fetch saved addresses for COD
  useEffect(() => {
    (async () => {
      try {
        const res = await api.getAddresses()
        const list = Array.isArray(res.data) ? res.data : []
        setAddresses(list)
        if (list[0]?.id) setSelectedAddressId(String(list[0].id))
      } catch {
        const cached = loadLocal()
        const list = Array.isArray(cached) ? cached : []
        setAddresses(list)
        if (list[0]?.id) setSelectedAddressId(String(list[0].id))
      }
    })()
  }, [])

  // lazy-load DotLottie player
  useEffect(() => {
    let mounted = true
    import('@lottiefiles/dotlottie-react').then(m => {
      if (mounted) setDotLottieCmp(() => m.DotLottieReact)
    }).catch(() => {})
    return () => { mounted = false }
  }, [])

  const handlePrint = () => {
    window.print()
  }

  const payNow = async () => {
    if (!order) return
    setProcessing(true)
    try {
      let payload
      if (method === 'upi') {
        payload = { upiId }
      } else if (method === 'card') {
        payload = { card }
      } else {
        // COD requires an address: either selected saved address or new address fields
        let addressPayload = null
        if (selectedAddressId) {
          const selected = addresses.find(a => String(a.id) === String(selectedAddressId))
          if (selected && selected._local) {
            addressPayload = { address: {
              name: selected.name, line1: selected.line1, line2: selected.line2,
              city: selected.city, state: selected.state, pincode: selected.pincode, phone: selected.phone
            }}
          } else {
            addressPayload = { addressId: selectedAddressId }
          }
        } else {
          const a = codAddress
          if (!a.name || !a.line1 || !a.city || !a.state || !a.pincode) {
            toast.error('Please provide a delivery address')
            setProcessing(false)
            return
          }
          addressPayload = { address: a }
        }
        payload = { cod: true, ...addressPayload }
      }
      await api.payOrder(orderId, { method, ...payload })
      toast.success('Payment successful')
      setOrder({ ...order, status: 'paid' })
      // trigger fade-out animation on the payment panel, then show out animation
      setAnimateOut(true)
      setTimeout(() => setShowOutAnim(true), 700)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Payment failed')
    } finally { setProcessing(false) }
  }

  if (!order) return <div>Loading...</div>

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n||0))
  const items = Array.isArray(order.items) ? order.items : []
  const computedTotal = items.reduce((s, it) => s + Number(it.price||0) * Number(it.quantity||0), 0)
  const billToName = order.user?.name || order.customer?.name || 'Customer'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Invoice #{order.id}</h1>
        <button onClick={handlePrint} className="px-3 py-2 bg-[#0014A8] text-white rounded-full">Print / Download</button>
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={(isAdmin || viewOnly) ? "lg:col-span-3" : "lg:col-span-2"}>
      <div ref={printRef} id="print-area" className="border rounded p-4 dark:border-gray-800 bg-white text-gray-9 00 print:bg-white print:text-black">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="font-semibold">GroceryMS</div>
            <div className="text-sm text-gray-500">invoice@groceryms.local</div>
          </div>
          <div className="text-sm">Date: {new Date(order.createdAt || Date.now()).toLocaleString()}</div>
        </div>
        <div className="mb-4">
          <div className="font-medium">Bill To:</div>
          <div>{billToName}</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, idx) => {
              const name = i.name || i.product?.name || `Item ${idx+1}`
              const qty = Number(i.qty ?? i.quantity ?? 0)
              const price = Number(i.price || 0)
              const lineTotal = price * qty
              return (
                <tr key={idx} className="border-b">
                  <td className="py-2">{name}</td>
                  <td>{qty}</td>
                  <td>{fmtINR(price)}</td>
                  <td>{fmtINR(lineTotal)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="text-right font-semibold mt-3">Grand Total: {fmtINR(order.total ?? computedTotal)}</div>
      </div>
        </div>
        {!isAdmin && !showOutAnim && !viewOnly && (
        <aside className={`rounded p-4 h-fit transition-all duration-700 ${animateOut ? 'opacity-0 translate-y-2' : ''}`}>
          <h2 className="font-semibold mb-3">Payment</h2>
          <div className="space-y-2 mb-4">
            <label className="flex items-center gap-2">
              <input type="radio" name="paymethod" checked={method==='upi'} onChange={()=>setMethod('upi')} />
              <span>UPI</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="paymethod" checked={method==='card'} onChange={()=>setMethod('card')} />
              <span>Credit / Debit Card</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="paymethod" checked={method==='cod'} onChange={()=>setMethod('cod')} />
              <span>Cash on Delivery</span>
            </label>
          </div>

          {method==='upi' && (
            <div className="mb-4">
              <label className="block text-sm mb-1">UPI ID</label>
              <input value={upiId} onChange={(e)=>setUpiId(e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent" placeholder="name@bank" />
            </div>
          )}
          {method==='card' && (
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm mb-1">Card Number</label>
                <input value={card.number} onChange={(e)=>setCard({...card, number:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm mb-1">Name on Card</label>
                  <input value={card.name} onChange={(e)=>setCard({...card, name:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" placeholder="Full Name" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Expiry</label>
                    <input value={card.expiry} onChange={(e)=>setCard({...card, expiry:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">CVV</label>
                    <input value={card.cvv} onChange={(e)=>setCard({...card, cvv:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" placeholder="123" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {method==='cod' && (
            <div className="mb-4 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Pay in cash when your order is delivered. Additional COD fee may apply.</p>
              {addresses.length > 0 && (
                <div>
                  <label className="block text-sm mb-1">Choose Saved Address</label>
                  <select value={selectedAddressId} onChange={e=>setSelectedAddressId(e.target.value)} className="w-full border rounded px-3 py-2 bg-transparent">
                    <option value="">-- Enter New Address --</option>
                    {addresses.map(a => (
                      <option key={a.id} value={String(a.id)}>{(a.name || 'Address') + ' - ' + a.city + ', ' + a.pincode}</option>
                    ))}
                  </select>
                </div>
              )}
              {!selectedAddressId && (
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm mb-1">Full Name</label>
                    <input value={codAddress.name} onChange={e=>setCodAddress({...codAddress, name:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Address Line 1</label>
                    <input value={codAddress.line1} onChange={e=>setCodAddress({...codAddress, line1:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Address Line 2</label>
                    <input value={codAddress.line2} onChange={e=>setCodAddress({...codAddress, line2:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">City</label>
                      <input value={codAddress.city} onChange={e=>setCodAddress({...codAddress, city:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">State</label>
                      <input value={codAddress.state} onChange={e=>setCodAddress({...codAddress, state:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Pincode</label>
                      <input value={codAddress.pincode} onChange={e=>setCodAddress({...codAddress, pincode:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Phone</label>
                      <input value={codAddress.phone} onChange={e=>setCodAddress({...codAddress, phone:e.target.value})} className="w-full border rounded px-3 py-2 bg-transparent" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <button disabled={processing} onClick={payNow} className="w-full py-2 rounded-full bg-[#0014A8] text-white disabled:opacity-50">{processing ? 'Processing...' : 'Pay Now'}</button>
          {order.status === 'paid' && <div className="mt-2 text-brand-aqua text-sm">Order placed</div>}
        </aside>
        )}
        {!isAdmin && showOutAnim && (
          <div className="rounded p-4 h-fit flex items-center justify-center">
            {DotLottieCmp ? (
              <DotLottieCmp src="/animations/out.lottie" loop autoplay speed={2} style={{ width: 320, height: 320 }} />
            ) : (
              <div className="text-sm text-gray-500">Order placed</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
