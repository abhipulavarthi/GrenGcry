import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useEffect, useMemo, useState } from 'react'

export default function Offers() {
  const { role } = useSelector(s => s.auth)
  const isAdmin = useMemo(() => role === 'admin', [role])

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const defaultSale = useMemo(() => ([
    { name: 'Basmati Rice 5kg', img: 'https://source.unsplash.com/300x300/?rice', price: 18.99, mrp: 24.99 },
    { name: 'Olive Oil 1L', img: 'https://source.unsplash.com/300x300/?olive,oil', price: 9.49, mrp: 12.99 },
    { name: 'Corn Flakes 1kg', img: 'https://source.unsplash.com/300x300/?cereal', price: 3.99, mrp: 5.49 },
    { name: 'Paneer 200g', img: 'https://source.unsplash.com/300x300/?paneer', price: 2.19, mrp: 2.99 },
    { name: 'Ground Coffee 250g', img: 'https://source.unsplash.com/300x300/?coffee', price: 4.79, mrp: 6.49 },
    { name: 'Mixed Biscuits Pack', img: 'https://source.unsplash.com/300x300/?biscuits', price: 1.69, mrp: 2.49 },
    { name: 'Green Tea 100ct', img: 'https://source.unsplash.com/300x300/?tea', price: 3.49, mrp: 4.99 },
    { name: 'Detergent Liquid 1L', img: 'https://source.unsplash.com/300x300/?detergent', price: 2.89, mrp: 3.79 },
    { name: 'Tomato Ketchup 1kg', img: 'https://source.unsplash.com/300x300/?ketchup', price: 2.19, mrp: 2.99 },
    { name: 'Sunflower Oil 1L', img: 'https://source.unsplash.com/300x300/?sunflower,oil', price: 3.99, mrp: 5.49 },
    { name: 'Chana Dal 1kg', img: 'https://source.unsplash.com/300x300/?lentils', price: 2.39, mrp: 3.19 },
    { name: 'Pasta 500g', img: 'https://source.unsplash.com/300x300/?pasta', price: 1.29, mrp: 1.99 },
  ]), [])

  const [saleItems, setSaleItems] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('saleItems') || 'null')
      return Array.isArray(saved) ? saved : defaultSale
    } catch { return defaultSale }
  })
  const [saleOpen, setSaleOpen] = useState(false)
  const [discountOpen, setDiscountOpen] = useState(false)

  // Open modals by query param (?action=add-sale|add-discount)
  useEffect(() => {
    const action = searchParams.get('action')
    if (!isAdmin) return
    if (action === 'add-sale') setSaleOpen(true)
    if (action === 'add-discount') setDiscountOpen(true)
  }, [searchParams, isAdmin])

  const [saleForm, setSaleForm] = useState({ name: '', img: '', price: '', mrp: '' })
  const [discountForm, setDiscountForm] = useState({ title: '', percent: '' })

  const closeAll = () => {
    setSaleOpen(false)
    setDiscountOpen(false)
    // remove query param
    const sp = new URLSearchParams(searchParams)
    sp.delete('action')
    navigate({ search: sp.toString() }, { replace: true })
  }

  const onAddSale = (e) => {
    e.preventDefault()
    const price = parseFloat(saleForm.price)
    const mrp = parseFloat(saleForm.mrp)
    if (!saleForm.name || isNaN(price) || isNaN(mrp)) return
    setSaleItems(prev => {
      const next = [{ name: saleForm.name, img: saleForm.img || 'https://source.unsplash.com/300x300/?grocery', price, mrp }, ...prev]
      localStorage.setItem('saleItems', JSON.stringify(next))
      // also persist overrides map for quick lookup by Products page
      try {
        const map = Object.fromEntries(next.map(it => [it.name, it.price]))
        localStorage.setItem('saleOverrides', JSON.stringify(map))
      } catch {}
      return next
    })
    setSaleForm({ name: '', img: '', price: '', mrp: '' })
    closeAll()
  }

  const onAddDiscount = (e) => {
    e.preventDefault()
    // Placeholder action: in a real app, call API to save discount rule
    console.log('New discount rule', discountForm)
    setDiscountForm({ title: '', percent: '' })
    closeAll()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Offers</h1>

      {isAdmin && (
        <div className="mb-4 rounded" style={{ backgroundColor: '#FAFAFA' }}>
          <div className="p-3 flex flex-wrap gap-2">
            <button onClick={() => setSaleOpen(true)} className="px-3 py-2 rounded-full bg-[#FF0038] text-white hover:bg-[#0014A8]">Add Sale Product</button>
            <button onClick={() => setDiscountOpen(true)} className="px-3 py-2 rounded-full border-2 border-[#FF0038] text-[#FF0038] hover:bg-[#FF0038] hover:text-white transition">Add Discount</button>
          </div>
        </div>
      )}

      <section className="mt-8">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {saleItems.map((p, i) => (
            <div key={i} className="relative">
              {isAdmin && (
                <button
                  onClick={() => {
                    setSaleItems(prev => {
                      const next = prev.filter((_, idx) => idx !== i)
                      localStorage.setItem('saleItems', JSON.stringify(next))
                      try {
                        const map = Object.fromEntries(next.map(it => [it.name, it.price]))
                        localStorage.setItem('saleOverrides', JSON.stringify(map))
                      } catch {}
                      return next
                    })
                  }}
                  title="Remove from sale"
                  className="absolute top-2 right-2 z-10 px-2 py-1 text-xs bg-red-600 text-white rounded-full"
                >Remove</button>
              )}
              <Link to={`/products?q=${encodeURIComponent(p.name.split(' ')[0])}`} className="block border rounded-lg overflow-hidden bg-white hover:shadow-sm">
                <img className="w-full aspect-square object-cover" src={p.img} alt={p.name} />
                <div className="px-3 py-2 text-sm">
                  <div className="font-medium truncate" title={p.name}>{p.name}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#FF0038] font-semibold">${p.price.toFixed(2)}</span>
                    <span className="text-xs line-through text-gray-500">${p.mrp.toFixed(2)}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Admin modals */}
      {isAdmin && saleOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded shadow-lg" style={{ backgroundColor: '#FAFAFA' }}>
            <div className="p-4 border-b font-semibold" style={{ backgroundColor: '#FAFAFA' }}>Add Sale Product</div>
            <form onSubmit={onAddSale} className="p-4 space-y-3">
              <input value={saleForm.name} onChange={e=>setSaleForm(v=>({...v, name:e.target.value}))} placeholder="Name" className="w-full border rounded px-3 py-2" />
              <input value={saleForm.img} onChange={e=>setSaleForm(v=>({...v, img:e.target.value}))} placeholder="Image URL (optional)" className="w-full border rounded px-3 py-2" />
              <div className="grid grid-cols-2 gap-2">
                <input value={saleForm.price} onChange={e=>setSaleForm(v=>({...v, price:e.target.value}))} placeholder="Price" type="number" step="0.01" className="w-full border rounded px-3 py-2" />
                <input value={saleForm.mrp} onChange={e=>setSaleForm(v=>({...v, mrp:e.target.value}))} placeholder="MRP" type="number" step="0.01" className="w-full border rounded px-3 py-2" />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeAll} className="px-3 py-2 border rounded-full">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded-full bg-[#FF0038] text-white">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAdmin && discountOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded shadow-lg" style={{ backgroundColor: '#FAFAFA' }}>
            <div className="p-4 border-b font-semibold" style={{ backgroundColor: '#FAFAFA' }}>Add Discount</div>
            <form onSubmit={onAddDiscount} className="p-4 space-y-3">
              <input value={discountForm.title} onChange={e=>setDiscountForm(v=>({...v, title:e.target.value}))} placeholder="Discount Title (e.g., Festive Sale)" className="w-full border rounded px-3 py-2" />
              <input value={discountForm.percent} onChange={e=>setDiscountForm(v=>({...v, percent:e.target.value}))} placeholder="Percent (%)" type="number" step="1" className="w-full border rounded px-3 py-2" />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeAll} className="px-3 py-2 border rounded-full">Cancel</button>
                <button type="submit" className="px-3 py-2 rounded-full bg-[#FF0038] text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
