import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

// Icon components
const Icons = {
  Orders: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
  Payments: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  Addresses: () => <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
}

export default function Account() {
  const { user } = useSelector(s => s.auth)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState([])
  const [addresses, setAddresses] = useState([])
  const [addr, setAddr] = useState({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
  const [creatingAddr, setCreatingAddr] = useState(false)
  const [loadingOrders, setLoadingOrders] = useState(false)

  // Fetch Logic
  useEffect(() => {
    if (!user) return
    if (activeTab === 'orders') {
      setLoadingOrders(true)
      api.getOrders({ userId: user._id || user.id })
        .then(res => setOrders(res.data.orders || res.data || []))
        .catch(() => { })
        .finally(() => setLoadingOrders(false))
    }
    if (activeTab === 'addresses') {
      api.getAddresses({ userId: user._id || user.id })
        .then(res => setAddresses(res.data || []))
        .catch(() => { })
    }
  }, [activeTab, user])

  // Address Handlers
  const addAddress = async () => {
    if (!addr.name || !addr.line1 || !addr.city || !addr.state || !addr.pincode) return toast.error('Fill required fields')
    setCreatingAddr(true)
    try {
      const res = await api.createAddress(addr)
      setAddresses([res.data, ...addresses])
      setAddr({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
      toast.success('Address added')
    } catch { toast.error('Failed to add address') }
    finally { setCreatingAddr(false) }
  }
  const deleteAddress = async (id) => {
    try {
      await api.deleteAddress(id)
      setAddresses(addresses.filter(a => a.id !== id))
      toast.success('Address removed')
    } catch { toast.error('Failed to remove') }
  }

  // Format Helper
  const fmtDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

  if (!user) {
    return <div className="p-8 text-center"><h1 className="text-2xl mb-4">Please login</h1><Link to="/login" className="text-blue-600">Login</Link></div>
  }

  const displayName = (user.name && user.name.toLowerCase().includes('mock')) ? 'User' : (user.name || 'User')

  return (
    <div className="w-full py-12 px-4 flex justify-center">
      <div className="w-full max-w-[800px] flex flex-col">
        {/* User Info Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-4">
              <h1 className="text-3xl font-bold text-gray-800 capitalize">{displayName}</h1>
              <span className="text-gray-600 font-medium">{user.email}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1">{user.phone}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-8 border-b border-gray-200 mb-8">
          {[
            { id: 'orders', label: 'Orders' },
            { id: 'payments', label: 'Payments' },
            { id: 'addresses', label: 'Addresses' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`pb-4 px-4 font-bold text-sm uppercase tracking-wide transition-colors border-b-2 ${activeTab === item.id
                ? 'border-[#FF0038] text-[#FF0038]'
                : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="w-full">
          {activeTab === 'orders' && (
            <div className="w-full">
              {loadingOrders ? (
                <div className="py-12 text-center text-gray-400">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="bg-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 shadow-sm border border-gray-100">
                    <Icons.Orders />
                  </div>
                  <h3 className="text-gray-800 font-bold mb-2 text-lg">No orders found</h3>
                  <p className="text-gray-500 text-sm mb-6">You haven't placed any orders yet.</p>
                  <Link to="/products" className="px-8 py-3 bg-[#FF0038] text-white font-bold uppercase text-sm rounded shadow hover:bg-[#d0002d] transition">Start Ordering</Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition">
                      <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase mb-1">Order #{order.id.slice(0, 8)}</p>
                          <h3 className="font-bold text-gray-800 text-lg">{fmtINR(order.totalPrice)}</h3>
                          <p className="text-xs text-gray-500 mt-1">{fmtDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase mb-2">Delivered</span>
                          <div className="text-xs text-gray-400">FreshGrocery Store</div>
                        </div>
                      </div>
                      <div className="py-4 border-t border-gray-100 text-sm text-gray-600">
                        {order.orderItems?.map(i => `${i.name} x ${i.qty}`).join(', ') || 'Various items'}
                      </div>
                      <div className="pt-4 flex gap-3 justify-end">
                        <button className="px-4 py-2 border border-gray-200 text-gray-600 font-bold text-xs uppercase rounded hover:bg-gray-50 transition">Help</button>
                        <button className="px-4 py-2 border border-[#FF0038] text-[#FF0038] font-bold text-xs uppercase rounded hover:bg-red-50 transition">Reorder</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="w-full">
              <div className="grid md:grid-cols-2 gap-6">
                {addresses.map(a => (
                  <div key={a.id} className="border border-gray-200 rounded-lg p-6 relative group bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-4 text-gray-800 font-bold border-b border-gray-100 pb-3">
                      <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400"><Icons.Addresses /></span>
                      <span className="capitalize">{a.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed mb-6">
                      {a.line1}<br />{a.city}, {a.state} - {a.pincode}<br />
                      <span className="text-gray-800 font-medium mt-1 block">{a.phone}</span>
                    </p>
                    <div className="flex gap-4 text-xs font-bold text-[#FF0038] uppercase tracking-wide">
                      <button className="hover:underline">Edit</button>
                      <button className="hover:underline" onClick={() => deleteAddress(a.id)}>Delete</button>
                    </div>
                  </div>
                ))}

                <button onClick={() => document.getElementById('addr-form').scrollIntoView({ behavior: 'smooth' })} className="border-2 border-dashed border-gray-200 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-[#FF0038] hover:text-[#FF0038] hover:bg-red-50 transition h-full min-h-[200px]">
                  <span className="text-4xl mb-2 font-light">+</span>
                  <span className="font-bold uppercase text-xs tracking-wide">Add New Address</span>
                </button>
              </div>

              <div id="addr-form" className="mt-10 bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 text-lg">Add New Address</h3>
                <div className="grid grid-cols-2 gap-5">
                  <input placeholder="Name (e.g. Home)" className="p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.name} onChange={e => setAddr({ ...addr, name: e.target.value })} />
                  <input placeholder="Phone" className="p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.phone} onChange={e => setAddr({ ...addr, phone: e.target.value })} />
                  <input placeholder="Address Line 1" className="col-span-2 p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.line1} onChange={e => setAddr({ ...addr, line1: e.target.value })} />
                  <input placeholder="City" className="p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.city} onChange={e => setAddr({ ...addr, city: e.target.value })} />
                  <input placeholder="State" className="p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.state} onChange={e => setAddr({ ...addr, state: e.target.value })} />
                  <input placeholder="Pincode" className="p-3 border border-gray-200 rounded text-sm w-full outline-none focus:border-[#FF0038] focus:ring-1 focus:ring-[#FF0038] transition" value={addr.pincode} onChange={e => setAddr({ ...addr, pincode: e.target.value })} />

                  <div className="col-span-2 mt-4">
                    <button onClick={addAddress} disabled={creatingAddr} className="w-full sm:w-auto px-8 py-3 bg-[#FF0038] text-white font-bold uppercase text-sm rounded shadow hover:bg-[#d0002d] transition disabled:opacity-50">
                      {creatingAddr ? 'Saving...' : 'Save Address'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLACEHOLDER TABS */}
          {['payments'].includes(activeTab) && (
            <div className="py-20 text-center bg-white rounded-lg border border-gray-100 shadow-sm">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <Icons.Payments />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">Payments</h2>
              <p className="text-gray-500">Saved cards and wallet history will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
