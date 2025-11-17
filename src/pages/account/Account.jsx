import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { toast } from 'react-toastify'

export default function Account() {
  const { user, role } = useSelector(s => s.auth)
  const isAdmin = role === 'admin'
  const [addresses, setAddresses] = useState([])
  const [creating, setCreating] = useState(false)
  const [addr, setAddr] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  })

  const storageKey = user?.id ? `addresses:${user.id}` : 'addresses:anon'
  const loadLocal = () => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '[]') } catch { return [] }
  }
  const saveLocal = (list) => {
    try { localStorage.setItem(storageKey, JSON.stringify(list)) } catch {}
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await api.getAddresses()
        setAddresses(Array.isArray(res.data) ? res.data : [])
      } catch {
        const cached = loadLocal()
        setAddresses(Array.isArray(cached) ? cached : [])
      }
    })()
  }, [])

  const addAddress = async () => {
    if (!addr.name || !addr.line1 || !addr.city || !addr.state || !addr.pincode) {
      toast.error('Please fill required address fields')
      return
    }
    setCreating(true)
    try {
      const res = await api.createAddress(addr)
      setAddresses([res.data, ...addresses])
      setAddr({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
      toast.success('Address added')
    } catch (e) {
      // Fallback: persist locally
      const newItem = { ...addr, id: Date.now().toString(), _local: true }
      const list = [newItem, ...addresses]
      setAddresses(list)
      saveLocal(list)
      setAddr({ name: '', line1: '', line2: '', city: '', state: '', pincode: '', phone: '' })
      toast.success('Address saved locally')
    } finally { setCreating(false) }
  }

  const deleteAddress = async (id) => {
    try {
      await api.deleteAddress(id)
      setAddresses(addresses.filter(a => String(a.id) !== String(id)))
      toast.success('Address deleted')
    } catch (e) {
      // Fallback: delete from local
      const list = addresses.filter(a => String(a.id) !== String(id))
      setAddresses(list)
      saveLocal(list)
      toast.success('Address removed locally')
    }
  }

  if (!user) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-semibold mb-4">My Account</h1>
        <p className="mb-4">You are not signed in.</p>
        <Link to="/login" className="px-4 py-2 rounded bg-brand-steel text-white">Login</Link>
      </div>
    )
  }

  const displayName = (user.name && user.name.toLowerCase().includes('mock')) ? 'User' : (user.name || 'User')

  return (
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <aside className="border rounded bg-[#FAFAFA]">
        <div className="p-4 text-xs font-semibold text-gray-500">PERSONAL DETAILS</div>
        <nav className="px-2 pb-3 space-y-1 text-sm">
          <Link to="/account" className="block px-3 py-2 rounded hover:bg-white/60">Edit Profile</Link>
          <button className="w-full text-left px-3 py-2 rounded hover:bg-white/60">Delivery Addresses</button>
        </nav>
        {!isAdmin && (
          <>
            <div className="p-4 text-xs font-semibold text-gray-500">SHOP FROM</div>
            <nav className="px-2 pb-3 space-y-1 text-sm">
              <Link to="/cart" className="block px-3 py-2 rounded hover:bg-white/60">Smart Basket</Link>
              <Link to="/orders" className="block px-3 py-2 rounded hover:bg-white/60">Past Orders</Link>
            </nav>
            <div className="p-4 text-xs font-semibold text-gray-500">MY ACCOUNT</div>
            <nav className="px-2 pb-4 space-y-1 text-sm">
              <Link to="/orders" className="block px-3 py-2 rounded hover:bg-white/60">My Orders</Link>
              <Link to="/feedback" className="block px-3 py-2 rounded hover:bg-white/60">Customer Service</Link>
            </nav>
          </>
        )}
      </aside>

      <main>
        <div className="border rounded bg-[#FAFAFA]">
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-semibold">Profile Details <span className="text-sm text-gray-500">(Edit)</span></h1>
          </div>
          <div className="p-4">
            <div className="text-lg font-medium mb-1 capitalize">{displayName}</div>
            <div className="text-sm text-gray-700 flex items-center gap-2">
              <span>✉</span><span>{user.email || '-'}</span>
            </div>
            {user.phone && (
              <div className="text-sm text-gray-700 mt-1">{user.phone}</div>
            )}
          </div>
        </div>

        <div className="mt-6 border rounded bg-[#FAFAFA]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">Delivery Addresses</h2>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {addresses.length === 0 && (
                  <div className="text-sm text-gray-600">No addresses saved.</div>
                )}
                {addresses.map(a => (
                  <div key={a.id} className="border rounded p-3 bg-white">
                    <div className="font-medium">{a.name || 'Address'}</div>
                    <div className="text-sm text-gray-700">
                      <div>{a.line1}</div>
                      {a.line2 && <div>{a.line2}</div>}
                      <div>{a.city}, {a.state} {a.pincode}</div>
                      {a.phone && <div>Ph: {a.phone}</div>}
                    </div>
                    <div className="mt-2 text-right">
                      <button onClick={() => deleteAddress(a.id)} className="text-red-600 text-sm hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Full Name</label>
                  <input value={addr.name} onChange={e=>setAddr({...addr, name:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Address Line 1</label>
                  <input value={addr.line1} onChange={e=>setAddr({...addr, line1:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1">Address Line 2</label>
                  <input value={addr.line2} onChange={e=>setAddr({...addr, line2:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">City</label>
                  <input value={addr.city} onChange={e=>setAddr({...addr, city:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">State</label>
                  <input value={addr.state} onChange={e=>setAddr({...addr, state:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Pincode</label>
                  <input value={addr.pincode} onChange={e=>setAddr({...addr, pincode:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input value={addr.phone} onChange={e=>setAddr({...addr, phone:e.target.value})} className="w-full border rounded px-3 py-2 bg-white" />
                </div>
              </div>
              <button disabled={creating} onClick={addAddress} className="mt-3 px-4 py-2 rounded bg-[#0014A8] text-white disabled:opacity-50">{creating ? 'Saving...' : 'Add Address'}</button>
            </div>
          </div>
        </div>

        <div className="mt-6 border rounded bg-[#FAFAFA]">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-semibold">My Orders</h2>
          </div>
          <div className="p-4 text-sm space-y-2">
            <Link to="/orders" className="block hover:underline">View Active Order</Link>
            <Link to="/orders" className="block hover:underline">View Past Orders</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
